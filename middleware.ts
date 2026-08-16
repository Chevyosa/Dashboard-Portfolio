import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const pathname = request.nextUrl.pathname;

  // Lindungi rute yang berawalan /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Tidak ada token, tendang ke halaman login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Jika sudah login, cegah masuk ke /login atau /
  if (pathname === '/login' || pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else if (pathname === '/') {
      // Jika belum login dan di root, tendang ke login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};
