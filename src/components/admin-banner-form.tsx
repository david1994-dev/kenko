"use client";

import { useActionState, useState, useTransition } from "react";
import { saveBanner, type BannerState } from "@/app/admin/(panel)/banner/actions";
import { shrinkImage } from "@/lib/shrink-image";
import { Spinner } from "./spinner";

export function AdminBannerForm({ hasImage, alt }: { hasImage: boolean; alt: string }) {
  const [state, action, actionPending] = useActionState<BannerState, FormData>(saveBanner, {});
  const [, startTransition] = useTransition();
  const [preparing, setPreparing] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const [preview, setPreview] = useState<string>();
  const pending = actionPending || preparing;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(undefined);
    const fd = new FormData(e.currentTarget);
    const file = fd.get("image");
    if (file instanceof File && file.size > 0) {
      setPreparing(true);
      try {
        const small = await shrinkImage(file, 1600, 0.85);
        if (small.size > 3.8 * 1024 * 1024) {
          setLocalError("Ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn.");
          return;
        }
        fd.set("image", small);
      } catch {
        setLocalError("Không đọc được ảnh. Vui lòng chọn ảnh JPG, PNG hoặc WebP.");
        return;
      } finally {
        setPreparing(false);
      }
    } else {
      fd.delete("image");
    }
    startTransition(() => action(fd));
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div>
        <label htmlFor="banner-image" className="mb-1 block text-sm font-semibold">
          {hasImage ? "Thay bằng ảnh khác" : "Chọn ảnh banner"}
        </label>
        <input
          id="banner-image"
          name="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            setPreview(f ? URL.createObjectURL(f) : undefined);
          }}
          className="block w-full text-sm file:mr-3 file:h-11 file:rounded-lg file:border-0 file:bg-mist file:px-4 file:font-semibold file:text-navy"
        />
        <p className="mt-1 text-xs text-subtle">
          Nên dùng ảnh dọc tỉ lệ 3:4 (ví dụ 1200×1600). Ảnh ngang sẽ bị cắt hai bên. Ảnh được tự thu nhỏ trước khi tải lên.
        </p>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Xem trước ảnh mới" className="mt-3 aspect-[3/4] w-40 rounded-xl object-cover" />
        )}
      </div>
      <div>
        <label htmlFor="banner-alt" className="mb-1 block text-sm font-semibold">Mô tả ảnh (cho người khiếm thị và Google)</label>
        <input
          id="banner-alt"
          name="alt"
          maxLength={200}
          defaultValue={alt}
          placeholder="Ví dụ: Người mặc áo điều hoà KENKO"
          className="h-12 w-full rounded-lg border border-edge bg-white px-3 text-base outline-none focus:border-teal"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-cta px-6 font-bold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          {pending && <Spinner />}
          {pending ? "Đang lưu…" : "Lưu banner"}
        </button>
        {(state.message || localError) && (
          <p role="status" className={`text-sm font-semibold ${state.ok && !localError ? "text-[#14532d]" : "text-price"}`}>
            {localError ?? state.message}
          </p>
        )}
      </div>
    </form>
  );
}
