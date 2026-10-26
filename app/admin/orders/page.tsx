import Link from 'next/link';
import { requireAdmin } from '@/lib/site';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">DELU ADMIN</div>
        <nav>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/payments">Payments</Link>
          <Link href="/admin/settings">Settings</Link>
        </nav>
      </aside>
      <main className="admin-content">
        <div className="page-header">
          <div className="kicker">PRODUCTS</div>
          <h1>Catalogue management</h1>
        </div>
        <div className="panel-box">
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Price</th><th>Status</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}><td>{product.name}</td><td>{formatCurrency(product.price)}</td><td>{product.isPublished ? 'Published' : 'Draft'}</td><td>{product.stock}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
