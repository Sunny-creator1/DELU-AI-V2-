import { prisma } from '@/lib/db';

export async function getCurrentSupportEmail() {
  const setting = await prisma.setting.findUnique({ where: { key: 'support.email' } });
  return setting?.value || process.env.SUPPORT_EMAIL || 'deluhq.official@gmail.com';
}

export async function getActivePaymentAccount() {
  return prisma.paymentAccount.findFirst({ where: { active: true } });
}

export async function getBrandSettings() {
  const entries = await prisma.setting.findMany({
    where: { OR: [{ key: 'brand.name' }, { key: 'brand.tagline' }, { key: 'homepage.heroTitle' }, { key: 'homepage.heroText' }] },
  });

  return Object.fromEntries(entries.map((entry) => [entry.key, entry.value]));
}

export async function appendAuditLog(action: string, entity: string, details: string, actor: string) {
  await prisma.auditLog.create({
    data: {
      action,
      entity,
      details,
      actor,
    },
  });
}
