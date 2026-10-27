const vnd = new Intl.NumberFormat("vi-VN");

export function formatPrice(value: number) {
  return `${vnd.format(value)}₫`;
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function discountPercent(price: number, salePrice: number) {
  return Math.round((1 - salePrice / price) * 100);
}
