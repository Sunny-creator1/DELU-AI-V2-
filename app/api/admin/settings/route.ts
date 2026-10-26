import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const schema = z.object({
  orderId: z.string().min(1),
  senderName: z.string().optional().default(''),
  transferRef: z.string().optional().default(''),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order) {
    return NextResponse.json({ ok: false, error: 'order_not_found' }, { status: 404 });
  }

  await prisma.paymentVerification.create({
    data: {
      orderId: order.id,
      senderName: parsed.data.senderName || null,
      transferRef: parsed.data.transferRef || null,
      status: 'pending',
      note: 'Customer declared payment via bank transfer.',
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: 'payment_verification_pending' },
  });

  return NextResponse.json({ ok: true, status: 'payment_verification_pending' });
}
