"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuantityStepper } from "./quantity-stepper";
import { CheckIcon } from "./icons";
import { cart } from "@/lib/cart";
import { currentPrice, isAvailable } from "@/lib/price";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function BuyBox({ product }: { product: Product }) {
  const router = useRouter();
  const { variants, colors, sizes } = product;

  const [colorName, setColorName] = useState<string | null>(colors[0]?.name ?? null);
  const [size, setSize] = useState<string | null>(sizes[Math.floor(sizes.length / 2)] ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const find = (c: string | null, s: string | null) =>
    variants.find((v) => v.colorName === c && v.size === s && isAvailable(v));

  const variant = find(colorName, size);
  const sizeAvailable = (s: string) => Boolean(find(colorName, s));
  const label = [colorName, size && `Size ${size}`].filter(Boolean).join(" · ");

  function addToCart() {
    if (!variant) return false;
    cart.add(
      {
        id: variant.id,
        slug: product.slug,
        name: product.name,
        variant: label,
        price: currentPrice(product),
        image: product.images[0]?.url,
      },
      qty,
    );
    return true;
  }

  function handleAdd() {
    if (addToCart()) setAdded(true);
  }

  function handleBuyNow() {
    if (addToCart()) router.push("/gio-hang");
  }

  const disabled = !variant;

  return (
    <div>
      {colors.length > 0 && (
        <fieldset className="mb-5">
          <legend className="mb-2 text-sm font-bold">
            Màu: <span className="font-medium text-muted">{colorName}</span>
          </legend>
          <div className="flex gap-3">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                aria-label={c.name}
                aria-pressed={c.name === colorName}
                onClick={() => setColorName(c.name)}
                className={`flex size-11 items-center justify-center rounded-full border-2 bg-white p-[3px] ${
                  c.name === colorName ? "border-navy" : "border-line"
                }`}
              >
                <span className="block size-full rounded-full" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {sizes.length > 0 && (
        <fieldset className="mb-5">
          <legend className="mb-2 flex w-full items-center justify-between text-sm font-bold">
            <span>
              Size: <span className="font-medium text-muted">{size}</span>
            </span>
            <Link href="/huong-dan-chon-size" className="flex min-h-11 items-center font-semibold text-teal underline">
              Hướng dẫn chọn size
            </Link>
          </legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const ok = sizeAvailable(s);
              return (
                <button
                  key={s}
                  type="button"
                  disabled={!ok}
                  aria-pressed={s === size}
                  onClick={() => setSize(s)}
                  className={`h-11 min-w-14 rounded-lg border-2 px-3 font-bold disabled:cursor-not-allowed disabled:text-subtle disabled:line-through disabled:opacity-60 ${
                    s === size ? "border-navy bg-navy text-white" : "border-edge text-ink"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="mb-4">
        <div className="mb-2 text-sm font-bold">Số lượng</div>
        <QuantityStepper value={qty} onChange={setQty} />
      </div>

      {disabled && <p className="mb-3 text-sm font-semibold text-price">Phân loại này tạm hết hàng.</p>}

      {added && (
        <p role="status" className="mb-3 flex items-center gap-2 rounded-lg bg-mist px-3 py-2 text-sm font-semibold text-navy">
          <CheckIcon size={18} />
          Đã thêm vào giỏ.
          <Link href="/gio-hang" className="ml-auto underline">
            Xem giỏ hàng
          </Link>
        </p>
      )}

      <div className="hidden gap-3 md:flex">
        <button
          type="button"
          disabled={disabled}
          onClick={handleAdd}
          className="h-12 flex-1 rounded-lg border-2 border-navy font-bold text-navy hover:bg-mist disabled:opacity-50"
        >
          Thêm vào giỏ
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={handleBuyNow}
          className="h-12 flex-[1.2] rounded-lg bg-cta font-bold text-white hover:bg-cta-dark disabled:opacity-50"
        >
          Mua ngay · {formatPrice(currentPrice(product) * qty)}
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[1fr_1.2fr] gap-2 border-t border-line bg-white px-3 py-2 md:hidden">
        <button
          type="button"
          disabled={disabled}
          onClick={handleAdd}
          className="h-12 rounded-lg border-2 border-navy font-bold text-navy disabled:opacity-50"
        >
          Thêm vào giỏ
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={handleBuyNow}
          className="h-12 rounded-lg bg-cta font-bold text-white disabled:opacity-50"
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
}
