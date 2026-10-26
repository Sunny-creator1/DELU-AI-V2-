import Link from 'next/link';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

export default async function CartPage() {
  const cartCookie = cookies().get('delu_cart')?.value || '[]';
  let cartItems: Array<{ productId: string; quantity: number }> = [];

  try {
    cartItems = JSON.parse(cartCookie);
  } catch {
    cartItems = [];
  }

  const ids = cartItems.map((item) => item.productId);
  const products = ids.length
    ? await prisma.product.findMany({ where: { id: { in: ids } } })
    : [];

  const lines = cartItems
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean) as Array<{ productId: string; quantity: number; product: (typeof products)[number] }>;

  const subtotal = lines.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 2500 : 0;
  const total = subtotal + deliveryFee;

  return (
    <main className="page-shell">
      <div className="container two-col">
        <div className="panel-box">
          <div className="page-header">
            <div className="kicker">YOUR CART</div>
            <h1>Bag</h1>
          </div>

          {lines.length === 0 ? (
            <div className="notice">Your cart is empty. Browse the shop to add DELU pieces.</div>
          ) : (
            <div className="list">
              {lines.map((line) => (
                <div key={line.productId} className="list-item">
                  <div>
                    <strong>{line.product.name}</strong>
                    <div>Qty {line.quantity}</div>
                  </div>
                  <div>{formatCurrency(line.product.price * line.quantity)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="summary-block">
          <h3>Order summary</h3>
          <div className="line"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="line"><span>Delivery</span><span>{formatCurrency(deliveryFee)}</span></div>
          <div className="line"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
          <div className="cta-row">
            <Link href={lines.length ? '/checkout' : '/shop'} className="btn">{lines.length ? 'Proceed to checkout' : 'Browse products'}</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
