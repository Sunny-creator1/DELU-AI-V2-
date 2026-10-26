export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);
}

export function orderReference() {
  const stamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  return `DELU-${stamp}-${Math.floor(Math.random() * 900 + 100)}`;
}
