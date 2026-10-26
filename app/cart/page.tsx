import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ where: { isPublished: true } });
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product || !product.isPublished) notFound();

  return (
    <main className="page-shell">
      <div className="container two-col">
        <div className="panel-box">
          <div className="card-image" style={{ minHeight: 420 }}>{product.name}</div>
        </div>
        <aside className="panel-box">
          <div className="kicker">{product.category?.name || 'Essentials'}</div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="price-row">
            <span className="price">{formatCurrency(product.price)}</span>
            <span className="status-pill">{product.stock > 0 ? 'In stock' : 'Unavailable'}</span>
          </div>
          <div className="cta-row">
            <form action="/api/cart" method="POST">
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="quantity" value="1" />
              <button className="btn" type="submit">Add to cart</button>
            </form>
            <Link href="/shop" className="btn secondary">Continue shopping</Link>
          </div>
          <div className="notice" style={{ marginTop: 18 }}>Stock is checked again on the server during checkout.</div>
        </aside>
      </div>
    </main>
  );
}
