import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/site';
import { formatCurrency } from '@/lib/format';

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  const cartCookie = cookies().get('delu_cart')?.value || '[]';

  let cartItems: Array<{ productId: string; quantity: number }> = [];
  try {
    cartItems = JSON.parse(cartCookie);
  } catch {
    cartItems = [];
  }

  if (cartItems.length === 0) redirect('/shop');

  const paymentAccount = await prisma.paymentAccount.findFirst({ where: { active: true } });
  const products = await prisma.product.findMany({ where: { id: { in: cartItems.map((item) => item.productId) } } });

  const subtotal = cartItems.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const deliveryFee = subtotal > 0 ? 2500 : 0;
  const total = subtotal + deliveryFee;

  return (
    <main className="page-shell">
      <div className="container two-col">
        <div className="panel-box">
          <div className="page-header">
            <div className="kicker">CHECKOUT</div>
            <h1>Complete your order</h1>
          </div>

          <form action="/api/checkout" method="POST" className="form">
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" defaultValue={user?.name || ''} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" defaultValue={user?.email || ''} required />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" required />
            </div>
            <div className="field">
              <label htmlFor="address">Delivery address</label>
              <textarea id="address" name="address" rows={3} required />
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <input id="city" name="city" defaultValue="Lagos" required />
            </div>
            <div className="field">
              <label htmlFor="state">State</label>
              <input id="state" name="state" defaultValue="Lagos State" required />
            </div>
            <div className="field">
              <label htmlFor="instructions">Delivery instructions</label>
              <textarea id="instructions" name="instructions" rows={2} />
            </div>
            <div className="field">
              <label htmlFor="payment">Payment method</label>
              <select id="payment" name="paymentMethod">
                <option value="bank_transfer">Bank transfer</option>
              </select>
            </div>
            <button className="btn" type="submit">Place order</button>
          </form>
        </div>

        <aside className="summary-block">
          <h3>Order total</h3>
          <div className="line"><span>Cart subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="line"><span>Delivery</span><span>{formatCurrency(deliveryFee)}</span></div>
          <div className="line"><span>Total due</span><strong>{formatCurrency(total)}</strong></div>

          <div style={{ marginTop: 20 }}>
            <h4>Bank transfer details</h4>
            <div>{paymentAccount?.bankName || 'Bank name not set'}</div>
            <div>{paymentAccount?.accountName || 'Account name not set'}</div>
            <div>{paymentAccount?.accountNumber || 'Account number not set'}</div>
            <p>{paymentAccount?.paymentInstructions || 'Payment instructions pending admin configuration.'}</p>
          </div>

          <div className="cta-row">
            <Link href="/cart" className="btn secondary">Back to cart</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
