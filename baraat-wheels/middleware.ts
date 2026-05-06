import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

// ─────────────────────────────────────────────
//  CONFIGURATION
// ─────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

/**
 * Routes that do NOT require authentication.
 * Any path starting with these strings is allowed through.
 */
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/', // landing page
  // NOTE: '/' is intentionally NOT here — it's handled as exact match below
  // Putting '/' here would whitelist /customer, /partner, /admin too (startsWith)
];

/**
 * Static/system paths that should always be skipped by middleware.
 * These are handled by the matcher config below, but listed here for clarity.
 */
const SYSTEM_PREFIXES = [
  '/_next',
  '/favicon.ico',
  '/api/health',
];

/**
 * Role-based route protection.
 * Key   = route prefix
 * Value = array of roles allowed to access it
 *
 * Roles in your system: 'admin' | 'partner' | 'customer'
 */
const ROLE_PROTECTED_ROUTES: { prefix: string; allowedRoles: string[] }[] = [
  { prefix: '/admin',    allowedRoles: ['admin'] },
  { prefix: '/partner',  allowedRoles: ['admin', 'partner'] },
  { prefix: '/customer', allowedRoles: ['admin', 'partner', 'customer'] },
  { prefix: '/vehicles', allowedRoles: ['admin', 'partner', 'customer'] },
  { prefix: '/login',    allowedRoles: [] }, // public — handled separately
  { prefix: '/register', allowedRoles: [] }, // public — handled separately
];

/**
 * If a logged-in user visits /login or /register, redirect them here
 * based on their role.
 */
const ROLE_DEFAULT_REDIRECT: Record<string, string> = {
  admin:    '/admin',
  partner:  '/partner',
  customer: '/customer',
};

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

interface TokenPayload extends JWTPayload {
  id?: string;
  _id?: string;           // mongoose uses _id — handle both
  email: string;
  role: 'admin' | 'partner' | 'customer'; // 'customer' = DB name for customer
  isApproved?: boolean;
};

// DB stores role as 'customer', frontend uses 'customer' — normalise here
const DB_TO_FRONTEND_ROLE: Record<string, string> = {
  customer:  'customer',
  partner: 'partner',
  admin:   'admin',
};

/**
 * Verify JWT from cookie and return decoded payload.
 * Returns null if token is missing, invalid, or expired.
 */
async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const p = payload as TokenPayload;
    // Normalise _id → id
    if (!p.id && p._id) p.id = String(p._id);

    // Normalise DB role 'customer' → frontend role 'customer'
    if (p.role) {
      p.role = (DB_TO_FRONTEND_ROLE[p.role] ?? p.role) as TokenPayload['role'];
    }
    return p;
  } catch {
    return null;
  }
}

/**
 * Check if the given pathname is a public route
 * (no auth required).
 */
function isPublicRoute(pathname: string): boolean {
  // Exact match for landing page — do NOT use startsWith('/') as it matches everything
  if (pathname === '/') return true;

  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
}

/**
 * Check if the given pathname is a system path
 * that middleware should skip entirely.
 */
function isSystemPath(pathname: string): boolean {
  return SYSTEM_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Find which role-protection rule applies to the given path.
 * Returns null if no rule matches (path is unprotected by default).
 */
function getRouteProtection(
  pathname: string
): { prefix: string; allowedRoles: string[] } | null {
  return (
    ROLE_PROTECTED_ROUTES.find((rule) => pathname.startsWith(rule.prefix)) ??
    null
  );
}

/**
 * Build a redirect response to /login,
 * preserving the intended destination as ?redirect=...
 */
function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

/**
 * Build a redirect response to /unauthorized
 * (user is logged in but doesn't have the right role).
 */
function redirectToUnauthorized(request: NextRequest): NextResponse {
  const url = new URL('/unauthorized', request.url);
  url.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

// ─────────────────────────────────────────────
//  MAIN MIDDLEWARE
// ─────────────────────────────────────────────

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  // 1. Skip system paths
  if (isSystemPath(pathname)) {
    return NextResponse.next();
  }

  // 2. Get token — check cookie first, then Authorization header as fallback
  //    (fallback needed because router.push after login sometimes races the cookie)
  const cookieToken = request.cookies.get('token')?.value;
  const authHeader   = request.headers.get('authorization');
  const bearerToken  = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;
  const token = cookieToken ?? bearerToken ?? null;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // // 3. Verify token
  const payload = await verifyToken(token);
  // // 4. Logged-in user hits /login or /register → send to their dashboard
  if (payload && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    const dashboardUrl = ROLE_DEFAULT_REDIRECT[payload.role] ?? '/';
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  // 5. Public routes — allow through
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 6. No valid token → go to login
  if (!payload) {
    return redirectToLogin(request);
  }

  // 7. Role-based access check
  const protection = getRouteProtection(pathname);
  if (protection && protection.allowedRoles.length > 0) {
    const hasAccess = protection.allowedRoles.includes(payload.role);
    if (!hasAccess) {
      return redirectToUnauthorized(request);
    }

    // 8. Partner must be approved to access /partner routes
    if (
      pathname.startsWith('/partner') &&
      payload.role === 'partner' &&
      payload.isApproved === false
    ) {
      return NextResponse.redirect(
        new URL('/partner/pending-approval', request.url)
      );
    }
  }

  // 9. All good — forward user info via headers
  
  const response = NextResponse.next();
  response.headers.set('x-user-id',    payload?.id    ?? '');
  response.headers.set('x-user-role',  payload?.role  ?? '');
  response.headers.set('x-user-email', payload?.email ?? '');

  return response;
}

// ─────────────────────────────────────────────
//  MATCHER — which paths trigger this middleware
// ─────────────────────────────────────────────

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|\\.well-known|login|register.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|ico|woff|woff2|ttf)$).*)',
    '/customer/:path*', '/booking/:path*',
  ],
};