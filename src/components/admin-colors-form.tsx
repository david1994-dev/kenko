"use client";

import { useActionState } from "react";
import { updateColors, type FormState } from "@/app/admin/(panel)/products/actions";
import { Spinner } from "./spinner";

export function AdminColorsForm({
  productId,
  colors,
}: {
  productId: string;
  colors: { name: string; hex: string }[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateColors, {});
  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="productId" value={productId} />
      <ul className="space-y-2">
        {colors.map((c, i) => (
          <li key={`${c.name}-${c.hex}`} className="flex items-center gap-2">
            <input type="hidden" name="oldName" value={c.name} />
            <input
              type="color"
              name="hex"
              defaultValue={c.hex}
              aria-label={`Mã màu của ${c.name}`}
              className="size-11 shrink-0 cursor-pointer rounded-lg border border-edge bg-white p-1"
            />
            <input
              name="newName"
              defaultValue={c.name}
              required
              maxLength={40}
              aria-label={`Tên màu ${i + 1}`}
              className="h-12 w-full rounded-lg border border-edge bg-white px-3 text-base outline-none focus:border-teal"
            />
          </li>
        ))}
      </ul>
      <p className="text-xs text-subtle">
        Đổi tên màu sẽ đổi cả tên trong các phân loại và ảnh theo màu. Mã màu chỉ dùng cho chấm màu khi màu chưa có ảnh.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-cta px-6 font-bold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          {pending && <Spinner />}
          {pending ? "Đang lưu…" : "Lưu màu"}
        </button>
        {state.message && (
          <p role="status" className={`text-sm font-semibold ${state.ok ? "text-[#14532d]" : "text-price"}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
