// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

// ─────────────────────────────────────────────
//  CONFIGURATION
// ─────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// ── PUBLIC ROUTES ────────────────────────────
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/contact',
  '/api/health',
  '/api/auth/login',        // ← ADDED
  '/api/auth/register',     // ← ADDED
  '/api/auth/forgot-password', // ← ADDED
  '/api/auth/reset-password',    // ← ADDED
];

// ── AUTH REDIRECT ROUTES ─────────────────────
// Logged-in users hitting these get redirected to dashboard
const AUTH_REDIRECT_ROUTES = ['/login', '/register'];

// ── PROTECTED ROUTES ─────────────────────────
const PROTECTED_ROUTES = [
  // Any authenticated user
  { prefix: '/profile', roles: [] },
  { prefix: '/settings', roles: [] },
  { prefix: '/notifications', roles: [] },
  { prefix: '/api/auth/me', roles: [] },
  { prefix: '/api/auth/logout', roles: [] },
  { prefix: '/api/auth/refresh', roles: [] },
  { prefix: '/api/auth/update-profile', roles: [] },
  { prefix: '/api/auth/change-password', roles: [] },
  { prefix: '/api/auth/sessions', roles: [] },

  // Vehicles (all authenticated)
  { prefix: '/vehicles', roles: ['admin', 'partner', 'customer'] },

  // Customer only
  { prefix: '/booking', roles: ['customer'] },
  { prefix: '/customer/bookings', roles: ['customer'] },
  { prefix: '/api/bookings', roles: ['customer'] },

  // Customer + Admin
  { prefix: '/customer', roles: ['customer', 'admin'] },
  
  // Partner routes (partners + admin)
  { prefix: '/partner', roles: ['partner', 'admin'] },
  { prefix: '/partner/dashboard', roles: ['partner', 'admin'] },
  { prefix: '/partner/bookings', roles: ['partner', 'admin'] },
  { prefix: '/partner/earnings', roles: ['partner', 'admin'] },
  { prefix: '/partner/reviews', roles: ['partner', 'admin'] },
  { prefix: '/partner/performance', roles: ['partner', 'admin'] },
  { prefix: '/partner/profile', roles: ['partner', 'admin'] },
  { prefix: '/partner/vehicles', roles: ['partner', 'admin'] },
  { prefix: '/api/partner', roles: ['partner', 'admin'] },
  { prefix: '/api/vehicles/my-vehicles', roles: ['partner', 'admin'] },
  { prefix: '/api/vehicles/register', roles: ['partner', 'admin'] },

  // Admin only
  { prefix: '/admin', roles: ['admin'] },
  { prefix: '/admin/dashboard', roles: ['admin'] },
  { prefix: '/admin/finance', roles: ['admin'] },
  { prefix: '/admin/partners', roles: ['admin'] },
  { prefix: '/admin/vehicles', roles: ['admin'] },
  { prefix: '/admin/users', roles: ['admin'] },
  { prefix: '/admin/settings', roles: ['admin'] },
  { prefix: '/admin/reports', roles: ['admin'] },
  { prefix: '/api/admin', roles: ['admin'] },
];

// ── SYSTEM PATHS ─────────────────────────────
const SYSTEM_PREFIXES = [
  '/_next',
  '/static',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
  '/images',
  '/assets',
];

// ── ROLE DEFAULT REDIRECTS ───────────────────
const ROLE_DEFAULT_REDIRECT: Record<string, string> = {
  admin: '/admin/dashboard',
  partner: '/partner/dashboard',
  customer: '/customer/dashboard',
};

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────

interface TokenPayload extends JWTPayload {
  id: string;
  email: string;
  role: 'admin' | 'partner' | 'customer';
  isApproved?: boolean;
  isActive?: boolean;
  iat?: number;
  exp?: number;
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

const USER_ROLE_MAP: Record<string, TokenPayload['role']> = {
  customer: 'customer',
  partner: 'partner',
  admin: 'admin',
};

/**
 * Verify JWT from token string
 */
async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      clockTolerance: 60,
    });

    const p = payload as unknown as TokenPayload;

    // Normalize role
    const rawRole = (p.role as string)?.toLowerCase();
    const normalizedRole = USER_ROLE_MAP[rawRole];

    if (!normalizedRole) {
      console.error('Invalid role in token:', rawRole);
      return null;
    }

    return {
      ...p,
      id: String(p.id || p._id || ''),
      role: normalizedRole,
    };
  } catch (err) {
    console.error('Token verification failed:', err instanceof Error ? err.message : 'Unknown error');
    return null;
  }
}

/**
 * Check if path is a system path
 */
function isSystemPath(pathname: string): boolean {
  return SYSTEM_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Check if path is public
 */
function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  return PUBLIC_ROUTES.some((route) => route !== '/' && pathname.startsWith(route + '/'));
}

/**
 * Check if path should redirect logged-in users
 */
function isAuthRedirectRoute(pathname: string): boolean {
  return AUTH_REDIRECT_ROUTES.includes(pathname);
}

/**
 * Find protection rule for path (most specific match first)
 */
function getRouteProtection(pathname: string): { prefix: string; roles: string[] } | null {
  const sorted = [...PROTECTED_ROUTES].sort((a, b) => b.prefix.length - a.prefix.length);
  return sorted.find((rule) => pathname.startsWith(rule.prefix)) ?? null;
}

/**
 * Build redirect response
 */
function redirect(url: string, request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL(url, request.url));
}

/**
 * Add user headers to response
 */
function addUserHeaders(response: NextResponse, payload: TokenPayload): NextResponse {
  response.headers.set('x-user-id', payload.id);
  response.headers.set('x-user-role', payload.role);
  response.headers.set('x-user-email', payload.email);
  response.headers.set('x-user-approved', String(payload.isApproved ?? true));
  response.headers.set('x-user-active', String(payload.isActive ?? true));
  return response;
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

  // 2. Extract token from cookie or Authorization header
  const cookieToken = request.cookies.get('token')?.value;
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = cookieToken || bearerToken || null;

  // 3. Verify token
  const payload = token ? await verifyToken(token) : null;
  const isAuthenticated = !!payload;

  // 4. Logged-in user hitting login/register → redirect to dashboard
  if (isAuthenticated && isAuthRedirectRoute(pathname)) {
    // Check deactivated
    if (payload.isActive === false) {
      return redirect('/account-deactivated', request);
    }

    // Check pending partner
    if (payload.role === 'partner' && payload.isApproved === false) {
      return redirect('/partner/pending-approval', request);
    }
    return redirect(ROLE_DEFAULT_REDIRECT[payload.role] || '/', request);
  }

  // 5. Public route → allow
  if (isPublicRoute(pathname)) {
    const response = NextResponse.next();
    if (payload) addUserHeaders(response, payload);
    return response;
  }

  // 6. Protected route check
  const protection = getRouteProtection(pathname);

  if (protection) {
    // 6a. Not authenticated
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 6b. Account deactivated
    if (payload.isActive === false) {
      return redirect('/account-deactivated', request);
    }

    // 6c. Role check
    if (protection.roles.length > 0 && !protection.roles.includes(payload.role)) {
      return redirect('/unauthorized', request);
    }

    // 6d. Partner approval check
    if (
      pathname.startsWith('/partner') &&
      payload.role === 'partner' &&
      payload.isApproved === false &&
      pathname !== '/partner/pending-approval'
    ) {
      return redirect('/partner/pending-approval', request);
    }

    // 6e. Add headers and proceed
    const response = NextResponse.next();
    return addUserHeaders(response, payload);
  }

  // 7. Unmatched route → default protected
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 8. Authenticated on unmatched route
  const response = NextResponse.next();
  return addUserHeaders(response, payload);
}

// ─────────────────────────────────────────────
//  MATCHER CONFIGURATION
// ─────────────────────────────────────────────

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)$).*)',
  ],
};