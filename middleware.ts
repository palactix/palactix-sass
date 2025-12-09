import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes, API routes, and static files
  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Extract org slug from URL: /[org]/... pattern
  const pathSegments = pathname.split('/').filter(Boolean);
  const orgSlug = pathSegments[0];

  // If we're on the root or a path without org slug, this will be handled by the layout
  // Middleware focuses on validating existing org slugs
  if (!orgSlug || pathname === '/') {
    return NextResponse.next();
  }

  // For now, just pass through - org validation will happen in the layout
  // where we have access to user session and organization data
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
