import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token');

    if (!token?.value) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jose.jwtVerify(token.value, secret);
      return NextResponse.next();
    } catch (error) {
      console.log(error)
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login']
}; 