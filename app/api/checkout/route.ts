import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

const schema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(20),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.redirect(new URL('/shop?error=invalid_item', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  const current = cookies().get('delu_cart')?.value || '[]';
  let items: Array<{ productId: string; quantity: number }> = [];

  try {
    items = JSON.parse(current);
  } catch {
    items = [];
  }

  const existing = items.find((item) => item.productId === parsed.data.productId);
  if (existing) {
    existing.quantity += parsed.data.quantity;
  } else {
    items.push({ productId: parsed.data.productId, quantity: parsed.data.quantity });
  }

  cookies().set('delu_cart', JSON.stringify(items), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return NextResponse.redirect(new URL('/cart', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
