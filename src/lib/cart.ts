import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
  image?: string;
};

const KEY = "kenko-cart-v2";
const EMPTY: CartItem[] = [];

let items: CartItem[] | null = null;
const listeners = new Set<() => void>();

function read(): CartItem[] {
  if (items) return items;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    items = Array.isArray(parsed) ? parsed : [];
  } catch {
    items = [];
  }
  return items;
}

function write(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      items = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

const noopSubscribe = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export const cart = {
  add(item: Omit<CartItem, "qty">, qty = 1) {
    const current = read();
    const found = current.find((i) => i.id === item.id);
    write(
      found
        ? current.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i))
        : [...current, { ...item, qty }],
    );
  },
  setQty(id: string, qty: number) {
    write(read().map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
};

export function cartCount(list: CartItem[]) {
  return list.reduce((sum, i) => sum + i.qty, 0);
}

export function cartTotal(list: CartItem[]) {
  return list.reduce((sum, i) => sum + i.qty * i.price, 0);
}
