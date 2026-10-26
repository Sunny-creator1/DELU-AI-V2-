import Link from 'next/link';
import { requireAdmin } from '@/lib/site';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

export default async function AdminPaymentsPage() {
  await requireAdmin();
  const verifications = await prisma.paymentVerification.findMany({
    orderBy: { createdAt: 'desc' },
    include: { order: true },
  });

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
          <div className="kicker">PAYMENTS</div>
          <h1>Bank transfer verification</h1>
        </div>
        <div className="panel-box">
          <table className="table">
            <thead><tr><th>Ref</th><th>Customer</th><th>Amount</th><th>Sender</th><th>Status</th></tr></thead>
            <tbody>
              {verifications.map((item) => (
                <tr key={item.id}>
                  <td>{item.order.orderNumber}</td>
                  <td>{item.order.customerName}</td>
                  <td>{formatCurrency(item.order.total)}</td>
                  <td>{item.senderName || 'N/A'}</td>
                  <td><span className="status-pill">{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
