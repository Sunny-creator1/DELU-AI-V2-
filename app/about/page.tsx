import Link from 'next/link';
import { getCurrentUser } from '@/lib/site';
import { prisma } from '@/lib/db';

export default async function SupportPage() {
  const user = await getCurrentUser();

  const tickets = user
    ? await prisma.supportTicket.findMany({
        where: { customerId: user.id },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <main className="page-shell">
      <div className="container two-col">
        <div className="panel-box">
          <div className="page-header">
            <div className="kicker">CUSTOMER SUPPORT</div>
            <h1>Need help?</h1>
          </div>
          {user ? (
            <form action="/api/support" method="POST" className="form">
              <div className="field">
                <label>Category</label>
                <select name="category">
                  <option value="payment_verification">Payment verification</option>
                  <option value="order_delay">Order delays</option>
                  <option value="delivery_problem">Delivery problems</option>
                  <option value="account_access">Account access</option>
                </select>
              </div>
              <div className="field">
                <label>Subject</label>
                <input name="subject" required />
              </div>
              <div className="field">
                <label>Message</label>
                <textarea name="message" rows={5} required />
              </div>
              <button type="submit" className="btn">Submit ticket</button>
            </form>
          ) : (
            <div className="notice">Please sign in to open a support ticket.</div>
          )}
        </div>

        <div className="panel-box">
          <div className="page-header">
            <div className="kicker">ACTIVE TICKETS</div>
            <h2>Recent support</h2>
          </div>
          {tickets.length === 0 ? (
            <div className="notice">No support tickets yet.</div>
          ) : (
            <div className="list">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="list-item">
                  <span>{ticket.ref}</span>
                  <span>{ticket.status}</span>
                </div>
              ))}
            </div>
          )}
          <div className="cta-row">
            <Link href={user ? '/account' : '/account'} className="btn secondary">Back to account</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
