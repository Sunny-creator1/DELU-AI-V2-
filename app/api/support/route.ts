import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/site';

const schema = z.object({
  bankName: z.string().min(2),
  accountName: z.string().min(2),
  accountNumber: z.string().min(4),
  paymentInstructions: z.string().min(10),
  supportEmail: z.string().email(),
});

export async function POST(request: Request) {
  await requireAdmin();
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.redirect(new URL('/admin/settings?error=invalid_settings', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  const previous = await prisma.paymentAccount.findFirst({ where: { active: true } });
  if (previous) {
    await prisma.paymentAccount.update({
      where: { id: previous.id },
      data: { active: false },
    });
  }

  const account = await prisma.paymentAccount.create({
    data: {
      bankName: parsed.data.bankName,
      accountName: parsed.data.accountName,
      accountNumber: parsed.data.accountNumber,
      paymentInstructions: parsed.data.paymentInstructions,
      active: true,
    },
  });

  await prisma.setting.upsert({
    where: { key: 'support.email' },
    update: { value: parsed.data.supportEmail },
    create: { key: 'support.email', value: parsed.data.supportEmail },
  });

  return NextResponse.redirect(new URL(`/admin/settings?updated=${account.id}`, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
