"use client";

import { useMemo, useState } from "react";
import { CheckIcon, ChevronDownIcon, CloseIcon, FilterIcon } from "./icons";
import { ProductCard } from "./ui";
import { currentPrice } from "@/lib/price";
import type { Product } from "@/lib/types";
import { discountPercent } from "@/lib/format";

const sorts = [
  { id: "popular", label: "Bán chạy" },
  { id: "price-asc", label: "Giá thấp đến cao" },
  { id: "price-desc", label: "Giá cao đến thấp" },
  { id: "discount", label: "Giảm giá nhiều" },
] as const;

type SortId = (typeof sorts)[number]["id"];

function discountOf(p: Product) {
  return p.salePrice ? discountPercent(p.price, p.salePrice) : 0;
}

export function ProductList({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortId>("popular");
  const [colors, setColors] = useState<string[]>([]);
  const [onlySale, setOnlySale] = useState(false);
  const [open, setOpen] = useState(false);

  const allColors = useMemo(
    () => [...new Set(products.flatMap((p) => p.colors.map((c) => c.name)))],
    [products],
  );

  const visible = useMemo(() => {
    const list = products.filter(
      (p) =>
        (colors.length === 0 || p.colors.some((c) => colors.includes(c.name))) &&
        (!onlySale || p.salePrice),
    );
    const by: Record<SortId, (a: Product, b: Product) => number> = {
      popular: (a, b) => b.sold - a.sold,
      "price-asc": (a, b) => currentPrice(a) - currentPrice(b),
      "price-desc": (a, b) => currentPrice(b) - currentPrice(a),
      discount: (a, b) => discountOf(b) - discountOf(a),
    };
    return [...list].sort(by[sort]);
  }, [products, colors, onlySale, sort]);

  const activeFilters = colors.length + (onlySale ? 1 : 0);
  const showFilter = allColors.length > 0 || products.some((p) => p.salePrice);

  const toggleColor = (name: string) =>
    setColors((cur) => (cur.includes(name) ? cur.filter((c) => c !== name) : [...cur, name]));

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 grid grid-cols-2 border-y border-line bg-white md:static md:mx-0 md:flex md:items-center md:justify-between md:border-0 md:pb-4">
        {showFilter ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-12 items-center justify-center gap-2 border-r border-line text-sm font-semibold md:h-11 md:justify-start md:rounded-lg md:border md:border-edge md:px-4"
          >
            <FilterIcon size={18} />
            Bộ lọc{activeFilters > 0 && ` (${activeFilters})`}
          </button>
        ) : (
          <span />
        )}
        <label className="relative flex h-12 items-center justify-center gap-1 text-sm font-semibold md:h-11 md:rounded-lg md:border md:border-edge md:px-4">
          <span className="text-subtle">Sắp xếp:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            className="appearance-none bg-transparent pr-5 font-semibold outline-none"
            aria-label="Sắp xếp sản phẩm"
          >
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon size={16} className="pointer-events-none absolute right-3 md:right-3" />
        </label>
      </div>

      <p className="py-3 text-[13px] text-subtle" aria-live="polite">
        {visible.length} sản phẩm
      </p>

      {visible.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-4 md:gap-x-5 md:gap-y-6">
          {visible.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-ground p-6 text-center text-muted">
          Không có sản phẩm phù hợp bộ lọc.{" "}
          <button
            type="button"
            className="font-semibold text-teal underline"
            onClick={() => {
              setColors([]);
              setOnlySale(false);
            }}
          >
            Xoá bộ lọc
          </button>
        </p>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center" role="dialog" aria-modal="true" aria-label="Bộ lọc">
          <button type="button" aria-label="Đóng bộ lọc" className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md rounded-t-2xl bg-white p-4 md:rounded-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">Bộ lọc</h2>
              <button type="button" aria-label="Đóng" onClick={() => setOpen(false)} className="flex size-11 items-center justify-center">
                <CloseIcon />
              </button>
            </div>

            <button
              type="button"
              aria-pressed={onlySale}
              onClick={() => setOnlySale((v) => !v)}
              className="mb-4 flex h-12 w-full items-center justify-between rounded-lg border border-edge px-3 text-sm font-semibold"
            >
              Chỉ sản phẩm đang giảm giá
              {onlySale && <CheckIcon size={18} className="text-teal" />}
            </button>

            {allColors.length > 0 && (
              <fieldset className="mb-4">
                <legend className="mb-2 text-sm font-bold">Màu sắc</legend>
                <div className="flex flex-wrap gap-2">
                  {allColors.map((name) => {
                    const on = colors.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleColor(name)}
                        className={`h-10 rounded-full border px-4 text-sm font-semibold ${
                          on ? "border-navy bg-navy text-white" : "border-edge text-navy"
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setColors([]);
                  setOnlySale(false);
                }}
                className="h-12 rounded-lg border-2 border-navy font-bold text-navy"
              >
                Xoá lọc
              </button>
              <button type="button" onClick={() => setOpen(false)} className="h-12 rounded-lg bg-cta font-bold text-white">
                Xem {visible.length} sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
