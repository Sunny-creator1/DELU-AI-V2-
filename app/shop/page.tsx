import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    take: 3,
    include: { category: true },
  });

  return (
    <>
      <header className="hero">
        <div className="container hero-inner">
          <div>
            <div className="kicker">DELU™ — ALWAYS DELIVERS</div>
            <h1>Luxury built for the long run.</h1>
            <p>Premium essentials, thoughtfully composed for everyday movement and enduring value.</p>
            <div className="cta-row">
              <Link href="/shop" className="btn">Shop now</Link>
              <Link href="/about" className="btn secondary">About DELU HQ</Link>
            </div>
          </div>
          <div className="hero-visual" aria-label="DELU hero visual" />
        </div>
      </header>

      <main>
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="kicker">THE DELU INDEX</div>
                <h2>Curated essentials now available</h2>
              </div>
              <Link href="/shop" className="text-link">Browse all products</Link>
            </div>
            <div className="grid-3">
              {products.map((product) => (
                <article key={product.id} className="card">
                  <div className="card-image">{product.name}</div>
                  <div className="card-body">
                    <div className="meta-row">
                      <span className="chip">Featured</span>
                      <span>{product.category?.name || 'Essentials'}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="price-row">
                      <span className="price">{formatCurrency(product.price)}</span>
                      <span>{product.stock > 0 ? 'In stock' : 'Unavailable'}</span>
                    </div>
                    <div className="price-row">
                      <Link href={`/products/${product.slug}`} className="btn">View product</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ background: 'rgba(11,11,12,0.02)' }}>
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="kicker">THE DELU DOSSIER</div>
                <h2>Brand principles</h2>
              </div>
            </div>
            <div className="grid-3">
              <article className="card">
                <div className="card-body">
                  <span className="chip">Dossier</span>
                  <h3>The DELU foundation</h3>
                  <p>Built around dependable quality, disciplined design and a clear promise to deliver with consistency.</p>
                </div>
              </article>
              <article className="card">
                <div className="card-body">
                  <span className="chip">Code</span>
                  <h3>A deliberate design code</h3>
                  <p>Premium presentation, calm contrast and sharp details create lasting brand recognition across product pages and campaigns.</p>
                </div>
              </article>
              <article className="card">
                <div className="card-body">
                  <span className="chip">Index</span>
                  <h3>What is currently available</h3>
                  <p>Every product is intentionally managed so that public listings reflect genuinely approved inventory and live admin settings.</p>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
