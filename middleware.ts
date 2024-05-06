import { auth } from "@/auth"
import { NextRequest, NextResponse } from 'next/server';

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;


    // Redirect to dashboard if the user is already authenticated
    // and trying to access sign-in, sign-up, or home page
    if (
        isLoggedIn &&
        (nextUrl.pathname.startsWith('/sign-in') ||
            nextUrl.pathname.startsWith('/sign-up') ||
            nextUrl.pathname.startsWith('/verify') ||
            nextUrl.pathname === '/')
    ) {
        return Response.redirect(new URL('/dashboard', nextUrl));
    }

    if (!isLoggedIn && nextUrl.pathname.startsWith('/dashboard')) {
        return Response.redirect(new URL('/sign-in', nextUrl));
    }

    return NextResponse.next();
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
}
