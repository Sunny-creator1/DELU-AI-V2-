import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/site';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('delu_session')?.value;
    if (!session) {
      return NextResponse.redirect(new URL('/account', request.url));
    }

    const user = verifyToken(session);
    if (!user || user.role !== 'admin') {
      return NextResponse.redirect(new URL('/account', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
