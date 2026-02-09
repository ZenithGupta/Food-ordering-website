import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Only protect admin routes (except login)
    if (request.nextUrl.pathname.startsWith('/admin') &&
        !request.nextUrl.pathname.startsWith('/admin/login')) {

        const adminToken = request.cookies.get('admin_token')?.value;
        const expectedToken = process.env.ADMIN_PASSWORD;

        if (!adminToken || adminToken !== expectedToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Protect admin API routes
    if (request.nextUrl.pathname.startsWith('/api/admin') &&
        !request.nextUrl.pathname.startsWith('/api/admin/login')) {

        const adminToken = request.cookies.get('admin_token')?.value;
        const expectedToken = process.env.ADMIN_PASSWORD;

        if (!adminToken || adminToken !== expectedToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
