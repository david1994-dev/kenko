"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ui";

export type Tab = { id: string; label: string; products: Product[] };

export function BestSellers({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div role="tablist" aria-label="Nhóm sản phẩm" className="mb-4 flex gap-2 overflow-x-auto">
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={on}
              aria-controls="best-sellers-panel"
              onClick={() => setActive(t.id)}
              className={`h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
                on ? "border-navy bg-navy text-white" : "border-edge bg-white text-navy hover:bg-mist"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id="best-sellers-panel"
        aria-labelledby={`tab-${current.id}`}
        className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-4 md:gap-x-5 md:gap-y-6"
      >
        {current.products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
