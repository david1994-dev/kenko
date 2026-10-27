import type { Product } from "./types";

export function currentPrice(p: Pick<Product, "price" | "salePrice">) {
  return p.salePrice ?? p.price;
}

export function isAvailable(v: { stock: number | null }) {
  return v.stock === null || v.stock > 0;
}
