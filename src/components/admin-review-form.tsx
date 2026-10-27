"use client";

import Image from "next/image";
import { useActionState, useState, useTransition } from "react";
import { saveReview, type ReviewFormState } from "@/app/admin/(panel)/reviews/actions";
import { sourceOptions } from "@/lib/review-source";
import { Spinner } from "./spinner";
import { Star } from "./stars";

export type ReviewFormValues = {
  id?: string;
  productId?: string;
  rating?: number;
  authorName?: string;
  comment?: string;
  source?: string;
  reviewedOn?: string;
  images?: string[];
};

const MAX_TOTAL_BYTES = 3.8 * 1024 * 1024;

// Thu nhỏ ảnh trước khi gửi: ảnh chụp điện thoại thường vài MB, vượt giới hạn 4 MB của máy chủ.
async function shrink(file: File): Promise<File> {
  if (file.type === "image/jpeg" && file.size <= 400_000) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
  if (!blob) throw new Error("toBlob");
  return new File([blob], `${file.name.replace(/\.\w+$/, "")}.jpg`, { type: "image/jpeg" });
}

const field = "h-12 w-full rounded-lg border border-edge bg-white px-3 text-base outline-none focus:border-teal";

function StarPicker({ initial }: { initial: number }) {
  const [value, setValue] = useState(initial);
  return (
    <fieldset>
      <legend className="mb-1 text-sm font-semibold">Số sao</legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="relative flex size-11 cursor-pointer items-center justify-center">
            <input
              type="radio"
              name="rating"
              value={n}
              checked={value === n}
              onChange={() => setValue(n)}
              className="peer sr-only"
            />
            <span className="rounded peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-teal">
              <Star filled={n <= value} size={30} />
            </span>
            <span className="sr-only">{n} sao</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function AdminReviewForm({
  products,
  today,
  values = {},
}: {
  products: { id: string; name: string }[];
  today: string;
  values?: ReviewFormValues;
}) {
  const [state, action, actionPending] = useActionState<ReviewFormState, FormData>(saveReview, {});
  const [, startTransition] = useTransition();
  const [preparing, setPreparing] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const pending = actionPending || preparing;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(undefined);
    const fd = new FormData(e.currentTarget);
    const files = fd.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
    fd.delete("photos");
    if (files.length > 0) {
      setPreparing(true);
      try {
        const small = await Promise.all(files.map(shrink));
        if (small.reduce((n, f) => n + f.size, 0) > MAX_TOTAL_BYTES) {
          setLocalError("Ảnh quá lớn, vui lòng chọn ít ảnh hơn mỗi lần.");
          return;
        }
        small.forEach((f) => fd.append("photos", f));
      } catch {
        setLocalError("Không đọc được ảnh. Vui lòng chọn ảnh JPG, PNG hoặc WebP.");
        return;
      } finally {
        setPreparing(false);
      }
    }
    startTransition(() => action(fd));
  }
  const uid = values.id ?? "new";
  const kept = state.values;
  const v = {
    productId: kept?.productId ?? values.productId ?? "",
    rating: kept ? Number(kept.rating) || 0 : (values.rating ?? 0),
    authorName: kept?.authorName ?? values.authorName ?? "",
    comment: kept?.comment ?? values.comment ?? "",
    source: kept?.source ?? values.source ?? "",
    reviewedOn: kept?.reviewedOn ?? values.reviewedOn ?? today,
  };

  return (
    <form key={state.nonce ?? uid} onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      <div className="md:col-span-2">
        <label htmlFor={`product-${uid}`} className="mb-1 block text-sm font-semibold">Sản phẩm</label>
        <select id={`product-${uid}`} name="productId" required defaultValue={v.productId} className={field}>
          <option value="" disabled>
            Chọn sản phẩm
          </option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`author-${uid}`} className="mb-1 block text-sm font-semibold">Tên người đánh giá</label>
        <input
          id={`author-${uid}`}
          name="authorName"
          required
          maxLength={60}
          defaultValue={v.authorName}
          className={field}
        />
      </div>
      <div>
        <StarPicker key={`${uid}-${v.rating}`} initial={v.rating} />
      </div>
      <div>
        <label htmlFor={`date-${uid}`} className="mb-1 block text-sm font-semibold">Ngày đánh giá</label>
        <input
          id={`date-${uid}`}
          name="reviewedOn"
          type="date"
          required
          max={today}
          defaultValue={v.reviewedOn}
          className={field}
        />
      </div>
      <div>
        <label htmlFor={`source-${uid}`} className="mb-1 block text-sm font-semibold">Nguồn nhận xét</label>
        <select id={`source-${uid}`} name="source" required defaultValue={v.source} className={field}>
          <option value="" disabled>
            Khách gửi qua đâu?
          </option>
          {sourceOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label htmlFor={`comment-${uid}`} className="mb-1 block text-sm font-semibold">Nội dung nhận xét của khách</label>
        <textarea
          id={`comment-${uid}`}
          name="comment"
          rows={3}
          maxLength={1000}
          defaultValue={v.comment}
          className="w-full rounded-lg border border-edge px-3 py-2.5 text-base outline-none focus:border-teal"
        />
      </div>
      <div className="md:col-span-2">
        {values.images && values.images.length > 0 && (
          <ul className="mb-3 flex flex-wrap gap-3">
            {values.images.map((url) => (
              <li key={url} className="w-20">
                <div className="relative mb-1 aspect-square overflow-hidden rounded-lg bg-mist">
                  <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                </div>
                <label className="flex items-center gap-1 text-xs text-price">
                  <input type="checkbox" name="removeImage" value={url} className="size-4" />
                  Xoá ảnh
                </label>
              </li>
            ))}
          </ul>
        )}
        <label htmlFor={`photos-${uid}`} className="mb-1 block text-sm font-semibold">
          Ảnh khách gửi (tối đa 6 ảnh, không bắt buộc)
        </label>
        <input
          id={`photos-${uid}`}
          name="photos"
          type="file"
          accept="image/*"
          multiple
          className="block w-full text-sm file:mr-3 file:h-11 file:rounded-lg file:border-0 file:bg-mist file:px-4 file:font-semibold file:text-navy"
        />
        <p className="mt-1 text-xs text-subtle">Ảnh được tự thu nhỏ trước khi tải lên. Chỉ đăng ảnh khách thật đã gửi cho shop.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-cta px-6 font-bold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          {pending && <Spinner />}
          {pending ? "Đang lưu…" : values.id ? "Lưu thay đổi" : "Thêm đánh giá"}
        </button>
        {localError && (
          <p role="alert" className="text-sm font-semibold text-price">
            {localError}
          </p>
        )}
        {state.message && (
          <p role="status" className={`text-sm font-semibold ${state.ok ? "text-[#14532d]" : "text-price"}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
