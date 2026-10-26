import Link from 'next/link';
import { requireAdmin } from '@/lib/site';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });

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
          <div className="kicker">ORDERS</div>
          <h1>Operations queue</h1>
        </div>
        <div className="panel-box">
          <table className="table">
            <thead><tr><th>Reference</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}><td>{order.orderNumber}</td><td>{order.customerName}</td><td>{formatCurrency(order.total)}</td><td>{order.paymentStatus}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
