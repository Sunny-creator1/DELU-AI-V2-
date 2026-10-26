import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetDemoData() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@delu.example';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'DELU HQ Admin',
      role: 'admin',
      passwordHash: await bcrypt.hash(adminPassword, 10),
      emailVerified: true,
    },
  });

  const categories = [
    { slug: 'essentials', name: 'Essentials', description: 'Everyday refined essentials' },
    { slug: 'outerwear', name: 'Outerwear', description: 'Structured outer layers' },
    { slug: 'accessories', name: 'Accessories', description: 'Distinctive accessories' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const essentials = await prisma.category.findUnique({ where: { slug: 'essentials' } });
  const outerwear = await prisma.category.findUnique({ where: { slug: 'outerwear' } });
  const accessories = await prisma.category.findUnique({ where: { slug: 'accessories' } });

  const catalog = [
    {
      slug: 'delu-atelier-shirt',
      sku: 'DLU-001',
      name: 'DELU Atelier Shirt',
      description: 'A refined everyday shirt with tailored structure and an elevated finish.',
      price: 4200,
      salePrice: 3900,
      stock: 19,
      status: 'active',
      isPublished: true,
      featured: true,
      categoryId: essentials?.id,
    },
    {
      slug: 'delu-heritage-jacket',
      sku: 'DLU-002',
      name: 'DELU Heritage Jacket',
      description: 'Structured jacket with confident lines and dependable premium construction.',
      price: 12800,
      stock: 6,
      status: 'active',
      isPublished: true,
      featured: true,
      categoryId: outerwear?.id,
    },
    {
      slug: 'delu-signal-tote',
      sku: 'DLU-003',
      name: 'DELU Signal Tote',
      description: 'A polished carry-all designed for workdays, travel and everyday movement.',
      price: 6500,
      stock: 14,
      status: 'active',
      isPublished: true,
      featured: false,
      categoryId: accessories?.id,
    },
    {
      slug: 'delu-voile-trouser',
      sku: 'DLU-004',
      name: 'DELU Voile Trouser',
      description: 'A structured trouser with crisp drape and consistent fit across daily wear.',
      price: 7600,
      stock: 11,
      status: 'active',
      isPublished: true,
      featured: false,
      categoryId: essentials?.id,
    },
  ];

  for (const product of catalog) {
    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: {
        ...product,
        images: {
          create: [{ url: '/images/placeholder-product.jpg', type: 'image', alt: product.name, order: 1 }],
        },
      },
    });

    if (!(await prisma.productMedia.findFirst({ where: { productId: saved.id } }))) {
      await prisma.productMedia.create({
        data: {
          productId: saved.id,
          url: '/images/placeholder-product.jpg',
          type: 'image',
          alt: saved.name,
          order: 1,
        },
      });
    }
  }

  const paymentAccount = await prisma.paymentAccount.findFirst({ where: { active: true } });
  if (!paymentAccount) {
    await prisma.paymentAccount.create({
      data: {
        bankName: process.env.PAYMENT_BANK_NAME || 'First Bank Nigeria',
        accountName: process.env.PAYMENT_ACCOUNT_NAME || 'DELU HQ',
        accountNumber: '0000000000',
        paymentInstructions: 'Transfer the full amount to DELU HQ. Include your order reference in the transfer narration.',
        active: true,
      },
    });
  }

  const defaults = [
    { key: 'brand.name', value: 'DELU™' },
    { key: 'brand.tagline', value: 'ALWAYS DELIVERS' },
    { key: 'homepage.heroTitle', value: 'Luxury built for the long run.' },
    { key: 'homepage.heroText', value: 'Refined essentials designed for confident daily movement.' },
    { key: 'support.email', value: process.env.SUPPORT_EMAIL || 'deluhq.official@gmail.com' },
    { key: 'default.email', value: process.env.SUPPORT_EMAIL || 'deluhq.official@gmail.com' },
  ];

  for (const setting of defaults) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  return { admin };
}

const seeded = await resetDemoData();
export default seeded;
export { prisma };
