import Link from 'next/link';
import { requireAdmin } from '@/lib/site';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [products, orders, tickets, paymentAccount] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.supportTicket.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.paymentAccount.findFirst({ where: { active: true } }),
  ]);

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
          <div className="kicker">CONTROL CENTRE</div>
          <h1>Admin dashboard</h1>
        </div>

        <div className="grid-3">
          <div className="panel-box">
            <div className="kicker">Products</div>
            <h2>{products.length}</h2>
          </div>
          <div className="panel-box">
            <div className="kicker">Orders</div>
            <h2>{orders.length}</h2>
          </div>
          <div className="panel-box">
            <div className="kicker">Support tickets</div>
            <h2>{tickets.length}</h2>
          </div>
        </div>

        <div className="two-col" style={{ marginTop: 32 }}>
          <div className="panel-box">
            <h3>Recent orders</h3>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Ref</th><th>Customer</th><th>Time</th><th>Total</th></tr></thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.orderNumber}</td>
                      <td>{order.customerName}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{formatCurrency(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel-box">
            <h3>Current payment account</h3>
            <div className="list">
              <div className="list-item"><span>Bank</span><span>{paymentAccount?.bankName || 'Not set'}</span></div>
              <div className="list-item"><span>Account</span><span>{paymentAccount?.accountName || 'Not set'}</span></div>
              <div className="list-item"><span>Number</span><span>{paymentAccount?.accountNumber || 'Not set'}</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
