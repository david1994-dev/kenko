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

export function maskName(name: string) {
  const [first, ...rest] = name.trim().split(/\s+/);
  if (!first) return "Khách hàng";
  return [first, ...rest.map((w) => `${w.charAt(0)}***`)].join(" ");
}

export function formatRating(avg: number) {
  return avg.toFixed(1).replace(".", ",");
}
