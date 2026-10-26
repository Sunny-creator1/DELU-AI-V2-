import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createUserAccount, setSessionCookie } from '@/lib/site';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.redirect(new URL('/account?error=invalid_registration', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  const user = await createUserAccount(parsed.data);
  if (!user) {
    return NextResponse.redirect(new URL('/account?error=account_exists', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  await setSessionCookie(user);
  return NextResponse.redirect(new URL('/account', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
