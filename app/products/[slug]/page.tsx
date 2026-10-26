import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="page-shell">
      <div className="container">
        <div className="page-header">
          <div className="kicker">THE DELU INDEX</div>
          <h1>Shop the collection</h1>
        </div>
        <div className="grid-3">
          {products.map((product) => (
            <article key={product.id} className="card">
              <div className="card-image">{product.name}</div>
              <div className="card-body">
                <div className="meta-row">
                  <span className="chip">{product.featured ? 'Featured' : 'Selected'}</span>
                  <span>{product.category?.name || 'Essentials'}</span>
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="price-row">
                  <span className="price">{formatCurrency(product.price)}</span>
                  <span>{product.stock > 0 ? 'In stock' : 'Unavailable'}</span>
                </div>
                <div className="price-row">
                  <Link href={`/products/${product.slug}`} className="btn">View</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
