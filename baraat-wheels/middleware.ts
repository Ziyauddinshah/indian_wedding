// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

// ─────────────────────────────────────────────
//  CONFIGURATION
// ─────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'barraat-wheels-secret-key';

// ── PUBLIC ROUTES ────────────────────────────
// No authentication required - anyone can access
const PUBLIC_ROUTES = [
  '/',                    // Home/Landing page
  '/login',               // Login page
  '/register',            // Registration page
  '/forgot-password',     // Password reset request
  '/reset-password',      // Password reset confirmation
  '/about',               // About page
  '/contact',             // Contact page
  '/vehicles/public',     // Public vehicle listings (no booking)
  '/api/health',          // Health check
];

// ── PROTECTED ROUTES ─────────────────────────
// Require authentication (any logged-in user)
// Format: { prefix: string, roles?: string[] }
// If roles is undefined/empty → any authenticated user can access
const PROTECTED_ROUTES = [
  // Common protected (any logged-in user)
  { prefix: '/profile', roles: [] },
  { prefix: '/settings', roles: [] },
  { prefix: '/notifications', roles: [] },
  { prefix: '/api/auth/me', roles: [] },
  { prefix: '/api/auth/logout', roles: [] },
  { prefix: '/api/auth/refresh', roles: [] },
  { prefix: '/api/auth/update-profile', roles: [] },
  { prefix: '/api/auth/change-password', roles: [] },
  { prefix: '/api/auth/sessions', roles: [] },
  
  // Vehicles (all roles can view, but booking requires customer)
  { prefix: '/vehicles', roles: ['admin', 'partner', 'customer'] },
  { prefix: '/api/vehicles/search', roles: ['admin', 'partner', 'customer'] },
  { prefix: '/api/vehicles/public', roles: [] }, // public vehicle API
  
  // Booking (customers only)
  { prefix: '/booking', roles: ['customer'] },
  { prefix: '/customer/bookings', roles: ['customer'] },
  { prefix: '/api/bookings', roles: ['customer'] },
  
  // Customer dashboard
  { prefix: '/customer', roles: ['customer', 'admin'] },
  { prefix: '/customer/dashboard', roles: ['customer', 'admin'] },
  { prefix: '/vehicles', roles: ['customer', 'admin'] },
  { prefix: '/customer/dashboard', roles: ['customer', 'admin'] },
  { prefix: '/customer/profile', roles: ['customer', 'admin'] },
  { prefix: '/customer/settings', roles: ['customer', 'admin'] },
  {prefix: '/customer/wishlist', roles: ['customer', 'admin'] },
  
  // Partner routes (partners + admin)
  { prefix: '/partner', roles: ['partner', 'admin'] },
  { prefix: '/partner/dashboard', roles: ['partner', 'admin'] },
  { prefix: '/partner/bookings', roles: ['partner', 'admin'] },
  { prefix: '/partner/earnings', roles: ['partner', 'admin'] },
  { prefix: '/partner/reviews', roles: ['partner', 'admin'] },
  { prefix: '/partner/performance', roles: ['partner', 'admin'] },
  { prefix: '/partner/profile', roles: ['partner', 'admin'] },
  { prefix: '/api/partner', roles: ['partner', 'admin'] },
  
  // Partner vehicle management
  { prefix: '/partner/vehicles', roles: ['partner', 'admin'] },
  { prefix: '/api/vehicles/my-vehicles', roles: ['partner', 'admin'] },
  { prefix: '/api/vehicles/register', roles: ['partner', 'admin'] },
  
  // Admin only routes (PRIVATE)
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
// Always skip middleware (static files, Next.js internals)
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
// Where to send users after login based on role
const ROLE_DEFAULT_REDIRECT: Record<string, string> = {
  admin:    '/admin/dashboard',
  partner:  '/partner/dashboard',
  customer: '/customer/dashboard',
};

// ── PUBLIC ROLE PAGES ────────────────────────
// Pages that show different content based on role but don't require auth
const ROLE_AWARE_PUBLIC = [
  '/vehicles/browse',     // Can view vehicles without login
];

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────

interface TokenPayload extends JWTPayload {
  id?: string;
  _id?: string;
  email: string;
  role: 'admin' | 'partner' | 'customer';
  isApproved?: boolean;
  isActive?: boolean;
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

const USER_ROLE: Record<string, string> = {
  customer: 'customer',
  partner: 'partner',
  admin: 'admin',
};

/**
 * Verify JWT from cookie or header
 */
async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log(payload);
    const p = payload as TokenPayload;
    if (!p.id && p._id) p.id = String(p._id);
    if (p.role) {
      p.role = (USER_ROLE[p.role] ?? p.role) as TokenPayload['role'];
    }
    return p;
  } catch {
    console.error('Failed to verify token');
    return null;
  }
}

/**
 * Check if path is a system path (skip middleware)
 */
function isSystemPath(pathname: string): boolean {
  return SYSTEM_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Check if path is public (no auth needed)
 */
function isPublicRoute(pathname: string): boolean {
  // Exact match
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  
  // Prefix match for public routes with sub-paths
  return PUBLIC_ROUTES.some(
    (route) => route !== '/' && pathname.startsWith(route + '/')
  );
}

/**
 * Check if path is role-aware public (shows different content based on auth)
 */
function isRoleAwarePublic(pathname: string): boolean {
  return ROLE_AWARE_PUBLIC.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
}

/**
 * Find protection rule for a path
 */
function getRouteProtection(pathname: string): { prefix: string; roles: string[] } | null {
  // Sort by specificity (longer prefix first)
  const sorted = [...PROTECTED_ROUTES].sort(
    (a, b) => b.prefix.length - a.prefix.length
  );
  
  return sorted.find((rule) => pathname.startsWith(rule.prefix)) ?? null;
}

/**
 * Redirect to login with return URL
 */
function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  console.log(`Redirecting to login from ${request.nextUrl.pathname}`);
  return NextResponse.redirect(loginUrl);
}

/**
 * Redirect to unauthorized page
 */
function redirectToUnauthorized(request: NextRequest): NextResponse {
  const url = new URL('/unauthorized', request.url);
  url.searchParams.set('from', request.nextUrl.pathname);
  console.log(`Redirecting to unauthorized from ${request.nextUrl.pathname}`);
  return NextResponse.redirect(url);
}

/**
 * Redirect to pending approval page
 */
function redirectToPendingApproval(request: NextRequest): NextResponse {
  console.log(`Redirecting to pending approval from ${request.nextUrl.pathname}`);
  return NextResponse.redirect(new URL('/partner/pending-approval', request.url));
}

/**
 * Redirect to role-appropriate dashboard
 */
function redirectToDashboard(request: NextRequest, role: string): NextResponse {
  const dashboard = ROLE_DEFAULT_REDIRECT[role] || '/';
  console.log(`Redirecting to dashboard from ${request.nextUrl.pathname}`);
  return NextResponse.redirect(new URL(dashboard, request.url));
}

// ─────────────────────────────────────────────
//  MAIN MIDDLEWARE
// ─────────────────────────────────────────────

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // 1. Skip system paths immediately
  if (isSystemPath(pathname)) {
    return NextResponse.next();
  }

  // 2. Extract token from cookie or Authorization header
  const cookieToken = request.cookies.get('token')?.value;
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = cookieToken ?? bearerToken ?? null;

  // 3. Verify token if present
  let payload: TokenPayload | null = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload: verifiedPayload } = await jwtVerify(token, secret, {
        issuer: 'baraat-wheels',
        audience: 'baraat-wheels-users',
        // FIX 3: Add clock tolerance to handle minor clock skew between client/server
        clockTolerance: 60, // 60 seconds grace period
      });
      
      payload = verifiedPayload as TokenPayload;
      
      if (!payload.id && payload._id) payload.id = String(payload._id);
      if (payload.role) {
        payload.role = (USER_ROLE[payload.role] ?? payload.role) as TokenPayload['role'];
      }
    } catch (err) {
      // FIX 4: Log the actual error for debugging — don't swallow it silently
      console.error('Token verification failed:', err);
      payload = null;}
  }

  const isAuthenticated = !!payload;

  // 4. PUBLIC ROUTE HANDLING
  if (isPublicRoute(pathname)) {
    // If user is logged in and hits /login or /register, redirect to dashboard
    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      // Check if account is active
      if (payload?.isActive === false) {
        console.log(`Redirecting to deactivated account page from ${request.nextUrl.pathname}`);
        return NextResponse.redirect(new URL('/account-deactivated', request.url));
      }
      
      // Check partner approval
      if (payload?.role === 'partner' && payload.isApproved === false) {
        console.log(`Redirecting to pending approval from ${request.nextUrl.pathname}`);
        return redirectToPendingApproval(request);
      }
      
      console.log(`Redirecting to dashboard from ${request.nextUrl.pathname}`);
      return redirectToDashboard(request, payload?.role || "admin");
    }
    
    // Allow access to public routes
    return NextResponse.next();
  }

  // 5. ROLE-AWARE PUBLIC (shows different content but doesn't require auth)
  if (isRoleAwarePublic(pathname)) {
    // Add user info headers if authenticated, but don't block
    const response = NextResponse.next();
    if (payload) {
      response.headers.set('x-user-id', payload.id ?? '');
      response.headers.set('x-user-role', payload.role ?? '');
      response.headers.set('x-user-email', payload.email ?? '');
    }
    return response;
  }

  // 6. PROTECTED ROUTE HANDLING
  const protection = getRouteProtection(pathname);

  if (protection) {
    // 6a. Not authenticated → redirect to login
    if (!isAuthenticated) {
      return redirectToLogin(request);
    }

    // 6b. Account deactivated
    if (payload?.isActive === false) {
      return NextResponse.redirect(new URL('/account-deactivated', request.url));
    }

    // 6c. Role check
    if (protection.roles.length > 0) {
      const hasAccess = protection.roles.includes(payload?.role || "");
      
      if (!hasAccess) {
        // Logged in but wrong role → unauthorized
        return redirectToUnauthorized(request);
      }
    }

    // 6d. Partner approval check for partner routes
    if (
      pathname.startsWith('/partner') &&
      payload?.role === 'partner' &&
      payload?.isApproved === false &&
      pathname !== '/partner/pending-approval'
    ) {
      return redirectToPendingApproval(request);
    }

    // 6e. Add user context headers for downstream use
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload?.id ?? '');
    response.headers.set('x-user-role', payload?.role ?? '');
    response.headers.set('x-user-email', payload?.email ?? '');
    response.headers.set('x-user-approved', String(payload?.isApproved ?? true));
    
    return response;
  }

  // 7. Unmatched routes - default to protected (require auth)
  if (!isAuthenticated) {
    return redirectToLogin(request);
  }

  // 8. Default: authenticated user accessing unmatched route
  const response = NextResponse.next();
  response.headers.set('x-user-id', payload?.id ?? '');
    response.headers.set('x-user-role', payload?.role ?? '');
    response.headers.set('x-user-email', payload?.email ?? '');
    response.headers.set('x-user-approved', String(payload?.isApproved ?? true));
  return response;
}


// ─────────────────────────────────────────────
//  MATCHER CONFIGURATION
// ─────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     * - public folder files (images, assets)
     * - API routes that handle their own auth
     */
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)$).*)',
  ],
};