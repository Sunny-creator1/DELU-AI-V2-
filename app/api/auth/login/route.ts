import Link from 'next/link';
import { requireAdmin } from '@/lib/site';
import { prisma } from '@/lib/db';

export default async function AdminSettingsPage() {
  await requireAdmin();
  const payment = await prisma.paymentAccount.findFirst({ where: { active: true } });
  const supportEmail = (await prisma.setting.findUnique({ where: { key: 'support.email' } }))?.value || 'deluhq.official@gmail.com';

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
          <div className="kicker">SETTINGS</div>
          <h1>Brand and payment settings</h1>
        </div>

        <div className="panel-box">
          <form action="/api/admin/settings" method="POST" className="form-grid">
            <div className="field"><label>Bank name</label><input name="bankName" defaultValue={payment?.bankName || ''} /></div>
            <div className="field"><label>Account name</label><input name="accountName" defaultValue={payment?.accountName || ''} /></div>
            <div className="field"><label>Account number</label><input name="accountNumber" defaultValue={payment?.accountNumber || ''} /></div>
            <div className="field"><label>Payment instructions</label><textarea name="paymentInstructions" rows={4} defaultValue={payment?.paymentInstructions || ''} /></div>
            <div className="field"><label>Official support email</label><input name="supportEmail" defaultValue={supportEmail} /></div>
            <button className="btn" type="submit">Save settings</button>
          </form>
        </div>
      </main>
    </div>
  );
}
