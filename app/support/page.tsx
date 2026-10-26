import Link from 'next/link';
import { getCurrentUser } from '@/lib/site';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="page-shell">
        <div className="container center">
          <div className="panel-box auth-box">
            <div className="page-header">
              <div className="kicker">ACCOUNT</div>
              <h1>Sign in</h1>
            </div>
            <form action="/api/auth/login" method="POST" className="form">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required />
              </div>
              <button className="btn" type="submit">Sign in</button>
            </form>

            <div style={{ marginTop: 20 }}>
              <div className="kicker">REGISTER</div>
              <form action="/api/auth/register" method="POST" className="form">
                <div className="field">
                  <label htmlFor="name">Full name</label>
                  <input id="name" name="name" required />
                </div>
                <div className="field">
                  <label htmlFor="reg-email">Email</label>
                  <input id="reg-email" name="email" type="email" required />
                </div>
                <div className="field">
                  <label htmlFor="reg-password">Password</label>
                  <input id="reg-password" name="password" type="password" required />
                </div>
                <button className="btn" type="submit">Create account</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { payments: true },
  });

  return (
    <main className="page-shell">
      <div className="container two-col">
        <div className="panel-box">
          <div className="page-header">
            <div className="kicker">MY ACCOUNT</div>
            <h1>{user.name}</h1>
          </div>
          <div className="list">
            <div className="list-item"><span>Email</span><strong>{user.email}</strong></div>
            <div className="list-item"><span>Role</span><strong>{user.role}</strong></div>
          </div>
          <div className="cta-row">
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="btn secondary">Sign out</button>
            </form>
          </div>
        </div>

        <div className="panel-box">
          <div className="page-header">
            <div className="kicker">ORDER HISTORY</div>
            <h2>Recent orders</h2>
          </div>
          <div className="list">
            {orders.length === 0 ? (
              <div className="notice">No orders yet. Visit the shop and place your first DELU order.</div>
            ) : orders.map((order) => (
              <div key={order.id} className="list-item">
                <div>
                  <strong>{order.orderNumber}</strong>
                  <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div>{formatCurrency(order.total)}</div>
                  <div className="status-pill">{order.paymentStatus}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="cta-row">
            <Link href="/support" className="btn secondary">Open support ticket</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
