"use client";

import { useActionState, useState, useTransition } from "react";
import { uploadColorImage, type FormState } from "@/app/admin/(panel)/products/actions";
import { shrinkImage } from "@/lib/shrink-image";
import { Spinner } from "./spinner";

export function ColorImageForm({
  productId,
  colorName,
  hasImage,
}: {
  productId: string;
  colorName: string;
  hasImage: boolean;
}) {
  const [state, action, actionPending] = useActionState<FormState, FormData>(uploadColorImage, {});
  const [, startTransition] = useTransition();
  const [preparing, setPreparing] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const pending = actionPending || preparing;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(undefined);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("image");
    if (!(file instanceof File) || file.size === 0) {
      setLocalError("Chưa chọn ảnh.");
      return;
    }
    setPreparing(true);
    try {
      const small = await shrinkImage(file, 1280, 0.85);
      if (small.size > 3.8 * 1024 * 1024) {
        setLocalError("Ảnh quá lớn.");
        return;
      }
      fd.set("image", small);
    } catch {
      setLocalError("Không đọc được ảnh.");
      return;
    } finally {
      setPreparing(false);
    }
    startTransition(() => action(fd));
    form.reset();
  }

  const id = `color-image-${productId}-${colorName}`;
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="colorName" value={colorName} />
      <label htmlFor={id} className="sr-only">
        {hasImage ? "Thay ảnh" : "Chọn ảnh"} cho màu {colorName}
      </label>
      <input
        id={id}
        name="image"
        type="file"
        accept="image/*"
        className="block w-full text-xs file:mr-2 file:h-10 file:rounded-lg file:border-0 file:bg-mist file:px-3 file:text-xs file:font-semibold file:text-navy"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border-2 border-navy px-3 text-sm font-bold text-navy hover:bg-mist disabled:opacity-60"
      >
        {pending && <Spinner />}
        {pending ? "Đang lưu…" : hasImage ? "Thay ảnh" : "Tải ảnh lên"}
      </button>
      {(localError || state.message) && (
        <p role="status" className={`text-xs font-semibold ${state.ok && !localError ? "text-[#14532d]" : "text-price"}`}>
          {localError ?? state.message}
        </p>
      )}
    </form>
  );
}
