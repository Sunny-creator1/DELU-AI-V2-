import { NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/site';
import { orderReference } from '@/lib/format';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(6),
  city: z.string().min(2),
  state: z.string().min(2),
  instructions: z.string().optional().default(''),
  paymentMethod: z.string().default('bank_transfer'),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.redirect(new URL('/checkout?error=invalid_order', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  const cartCookie = cookies().get('delu_cart')?.value || '[]';
  let cartItems: Array<{ productId: string; quantity: number }> = [];
  try {
    cartItems = JSON.parse(cartCookie);
  } catch {
    cartItems = [];
  }

  if (!cartItems.length) {
    return NextResponse.redirect(new URL('/shop?error=empty_cart', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  const user = await getCurrentUser();
  const products = await prisma.product.findMany({ where: { id: { in: cartItems.map((item) => item.productId) } } });

  const itemRecords: Array<{ product: any; quantity: number }> = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) continue;
    if (product.stock < item.quantity) {
      return NextResponse.redirect(new URL('/checkout?error=stock_unavailable', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
    }
    subtotal += product.price * item.quantity;
    itemRecords.push({ product, quantity: item.quantity });
  }

  const deliveryFee = subtotal > 0 ? 2500 : 0;
  const total = subtotal + deliveryFee;
  const paymentAccount = await prisma.paymentAccount.findFirst({ where: { active: true } });
  const orderNumber = orderReference();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      shippingAddress: parsed.data.address,
      city: parsed.data.city,
      state: parsed.data.state,
      deliveryInstructions: parsed.data.instructions,
      subtotal,
      deliveryFee,
      total,
      paymentStatus: 'awaiting_payment',
      fulfilmentStatus: 'awaiting_payment',
      paymentAccountSnapshot: paymentAccount ? JSON.stringify({ bankName: paymentAccount.bankName, accountName: paymentAccount.accountName, accountNumber: paymentAccount.accountNumber, paymentInstructions: paymentAccount.paymentInstructions }) : null,
      userId: user?.id || null,
      items: {
        create: itemRecords.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  });

  await prisma.paymentVerification.create({
    data: {
      orderId: order.id,
      senderName: parsed.data.name,
      transferRef: '',
      status: 'pending',
      note: 'Customer submitted payment declaration.',
    },
  });

  for (const item of itemRecords) {
    await prisma.product.update({
      where: { id: item.product.id },
      data: { stock: item.product.stock - item.quantity },
    });
  }

  cookies().delete('delu_cart');

  return NextResponse.redirect(new URL(`/account?order=${order.orderNumber}`, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
