import { NextResponse } from 'next/server';
import { z } from 'zod';
import { setSessionCookie, signInUser } from '@/lib/site';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.redirect(new URL('/account?error=invalid_login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  const user = await signInUser(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.redirect(new URL('/account?error=invalid_login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  await setSessionCookie(user);

  if (user.role === 'admin') {
    return NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  return NextResponse.redirect(new URL('/account', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
