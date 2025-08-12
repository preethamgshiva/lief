import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ['/care-worker', '/manager'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute) {
    // Check if user has employee session cookie
    const employeeSession = request.cookies.get('employee_session');
    
    if (!employeeSession) {
      // No session, allow access (the page will show login form)
      return NextResponse.next();
    }

    // If it's the manager route, we'll let the page handle role checking
    // The page will redirect to login if user doesn't have manager role
    if (path.startsWith('/manager')) {
      return NextResponse.next();
    }

    // For other protected routes, allow access if session exists
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/employee-auth (employee authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/employee-auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
