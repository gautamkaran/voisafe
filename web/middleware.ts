import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

/**
 * MIDDLEWARE FOR ROUTE PROTECTION
 * 
 * Note: Since we're using localStorage for tokens (client-side),
 * we can't validate auth in middleware (server-side).
 * Auth protection is handled by client-side redirects in pages.
 */

export function middleware() {
    // const { pathname } = request.nextUrl;

    // Allow all routes - auth is handled client-side
    // This is because tokens are in localStorage, not cookies
    return NextResponse.next();
}

// Configure which routes to run middleware on
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
