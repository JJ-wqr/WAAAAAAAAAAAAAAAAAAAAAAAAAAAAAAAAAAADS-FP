import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/register", "/api/sync-user"];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith("/api/"));

  // API routes are handled separately
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Check for authentication token (you might use cookies or headers)
  // For Firebase Auth, we typically check on the client side
  // But we can add basic checks here

  // For now, allow all routes - authentication is handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};