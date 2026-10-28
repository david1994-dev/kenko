"use client";

import { useState } from "react";

const field = "h-12 w-full rounded-lg border border-edge bg-white px-3 text-base outline-none focus:border-teal";
const presetSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

type Color = { key: number; name: string; hex: string };

// Ô nhập màu và size dùng chung cho thêm sản phẩm và thêm phân loại.
export function OptionFields({ hint, uid = "new" }: { hint?: string; uid?: string }) {
  const [colors, setColors] = useState<Color[]>([]);
  const [nextKey, setNextKey] = useState(1);

  const addColor = () => {
    setColors((c) => [...c, { key: nextKey, name: "", hex: "#1f3a5f" }]);
    setNextKey((k) => k + 1);
  };
  const patch = (key: number, p: Partial<Color>) =>
    setColors((c) => c.map((x) => (x.key === key ? { ...x, ...p } : x)));

  return (
    <>
      <fieldset className="rounded-xl border border-line p-4 md:col-span-2">
        <legend className="px-1 text-sm font-bold">Màu sắc (không bắt buộc)</legend>
        <ul className="space-y-2">
          {colors.map((c) => (
            <li key={c.key} className="flex items-center gap-2">
              <input
                type="color"
                name="colorHex"
                value={c.hex}
                onChange={(e) => patch(c.key, { hex: e.target.value })}
                aria-label="Chọn màu"
                className="size-11 shrink-0 cursor-pointer rounded-lg border border-edge bg-white p-1"
              />
              <input
                name="colorName"
                value={c.name}
                onChange={(e) => patch(c.key, { name: e.target.value })}
                placeholder="Tên màu, ví dụ Xanh than"
                aria-label="Tên màu"
                maxLength={40}
                className={field}
              />
              <button
                type="button"
                onClick={() => setColors((x) => x.filter((y) => y.key !== c.key))}
                aria-label="Xoá màu này"
                className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-edge text-price"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={addColor}
          disabled={colors.length >= 12}
          className="mt-3 h-11 rounded-lg border-2 border-navy px-4 text-sm font-bold text-navy hover:bg-mist disabled:opacity-50"
        >
          + Thêm màu
        </button>
      </fieldset>

      <fieldset className="rounded-xl border border-line p-4 md:col-span-2">
        <legend className="px-1 text-sm font-bold">Size (không bắt buộc)</legend>
        <div className="flex flex-wrap gap-2">
          {presetSizes.map((s) => (
            <label key={s} className="flex h-11 min-w-14 cursor-pointer items-center justify-center gap-2 rounded-lg border border-edge px-3 text-sm font-bold has-[:checked]:border-navy has-[:checked]:bg-navy has-[:checked]:text-white">
              <input type="checkbox" name="size" value={s} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
        <label htmlFor={`sizeExtra-${uid}`} className="mb-1 mt-3 block text-sm font-semibold">Size khác (cách nhau bằng dấu phẩy)</label>
        <input id={`sizeExtra-${uid}`} name="sizeExtra" placeholder="Ví dụ: 38, 39, 40" className={field} />
        <p className="mt-2 text-xs text-subtle">
          {hint}
        </p>
      </fieldset>
    </>
  );
}
