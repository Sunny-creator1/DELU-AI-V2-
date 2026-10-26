import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/site';

export async function POST() {
  await clearSessionCookie();
  return NextResponse.redirect(new URL('/account', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
