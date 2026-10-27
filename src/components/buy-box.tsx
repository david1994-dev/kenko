"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuantityStepper } from "./quantity-stepper";
import { CheckIcon } from "./icons";
import { cart } from "@/lib/cart";
import { currentPrice, type Product } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

export function BuyBox({ product }: { product: Product }) {
  const router = useRouter();
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState(product.sizes[Math.floor(product.sizes.length / 2)] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const color = product.colors[colorIdx];
  const variant = [color?.name, size && `Size ${size}`].filter(Boolean).join(" · ");

  function addToCart() {
    cart.add(
      {
        id: [product.slug, color?.name, size].filter(Boolean).join("|"),
        slug: product.slug,
        name: product.name,
        variant,
        price: currentPrice(product),
      },
      qty,
    );
  }

  function handleAdd() {
    addToCart();
    setAdded(true);
  }

  function handleBuyNow() {
    addToCart();
    router.push("/gio-hang");
  }

  return (
    <div>
      {product.colors.length > 0 && (
        <fieldset className="mb-5">
          <legend className="mb-2 text-sm font-bold">
            Màu: <span className="font-medium text-muted">{color?.name}</span>
          </legend>
          <div className="flex gap-3">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                aria-label={c.name}
                aria-pressed={i === colorIdx}
                onClick={() => setColorIdx(i)}
                className={`flex size-11 items-center justify-center rounded-full border-2 bg-white p-[3px] ${
                  i === colorIdx ? "border-navy" : "border-line"
                }`}
              >
                <span className="block size-full rounded-full" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {product.sizes.length > 0 && (
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
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={s === size}
                onClick={() => setSize(s)}
                className={`h-11 min-w-14 rounded-lg border-2 px-3 font-bold ${
                  s === size ? "border-navy bg-navy text-white" : "border-edge text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mb-4">
        <div className="mb-2 text-sm font-bold">Số lượng</div>
        <QuantityStepper value={qty} onChange={setQty} />
      </div>

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
          onClick={handleAdd}
          className="h-12 flex-1 rounded-lg border-2 border-navy font-bold text-navy hover:bg-mist"
        >
          Thêm vào giỏ
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="h-12 flex-[1.2] rounded-lg bg-cta font-bold text-white hover:bg-cta-dark"
        >
          Mua ngay · {formatPrice(currentPrice(product) * qty)}
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[1fr_1.2fr] gap-2 border-t border-line bg-white px-3 py-2 md:hidden">
        <button
          type="button"
          onClick={handleAdd}
          className="h-12 rounded-lg border-2 border-navy font-bold text-navy"
        >
          Thêm vào giỏ
        </button>
        <button type="button" onClick={handleBuyNow} className="h-12 rounded-lg bg-cta font-bold text-white">
          Mua ngay
        </button>
      </div>
    </div>
  );
}
