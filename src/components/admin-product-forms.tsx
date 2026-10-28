"use client";
import { RichTextEditor } from "./rich-text-editor";
import { descriptionToHtml } from "@/lib/rich-text";
import { Spinner } from "./spinner";

import { useActionState, useState, useTransition } from "react";
import { shrinkImage } from "@/lib/shrink-image";
import { updateProduct, uploadImages, type FormState } from "@/app/admin/(panel)/products/actions";

const input = "h-12 w-full rounded-lg border border-edge bg-white px-3 text-base outline-none focus:border-teal";

function Message({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p role="status" className={`text-sm font-semibold ${state.ok ? "text-[#14532d]" : "text-price"}`}>
      {state.message}
    </p>
  );
}

export type ProductFormValues = {
  id: string;
  categoryId: number;
  name: string;
  sku: string;
  summary: string;
  description: string;
  price: number;
  salePrice: number | null;
  soldCount: number;
  giftNote: string;
  status: string;
};

export function ProductForm({
  product,
  categories,
}: {
  product: ProductFormValues;
  categories: { id: number; name: string }[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProduct, {});
  return (
    <form action={action} className="grid gap-3 md:grid-cols-2">
      <input type="hidden" name="id" value={product.id} />
      <div className="md:col-span-2">
        <label htmlFor="name" className="mb-1 block text-sm font-semibold">Tên sản phẩm</label>
        <input id="name" name="name" defaultValue={product.name} required className={input} />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="categoryId" className="mb-1 block text-sm font-semibold">Danh mục</label>
        <select id="categoryId" name="categoryId" defaultValue={product.categoryId} className={input}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="price" className="mb-1 block text-sm font-semibold">Giá gốc (₫)</label>
        <input id="price" name="price" type="number" min={0} step={500} defaultValue={product.price} required className={input} />
      </div>
      <div>
        <label htmlFor="salePrice" className="mb-1 block text-sm font-semibold">Giá khuyến mãi (₫, để trống nếu không giảm)</label>
        <input id="salePrice" name="salePrice" type="number" min={0} step={500} defaultValue={product.salePrice ?? ""} className={input} />
      </div>
      <div>
        <label htmlFor="soldCount" className="mb-1 block text-sm font-semibold">Số lượng đã bán</label>
        <input id="soldCount" name="soldCount" type="number" min={0} step={1} defaultValue={product.soldCount} className={input} />
        <p className="mt-1 text-xs text-subtle">Nhập số đã bán thật, kể cả đã bán qua Shopee, TikTok, Facebook.</p>
      </div>
      <div>
        <label htmlFor="status" className="mb-1 block text-sm font-semibold">Trạng thái</label>
        <select id="status" name="status" defaultValue={product.status} className={input}>
          <option value="active">Đang bán</option>
          <option value="draft">Nháp</option>
          <option value="hidden">Ẩn</option>
        </select>
      </div>
      <div>
        <label htmlFor="sku" className="mb-1 block text-sm font-semibold">Mã sản phẩm</label>
        <input id="sku" name="sku" defaultValue={product.sku} className={input} />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="giftNote" className="mb-1 block text-sm font-semibold">Quà tặng miễn phí (để trống nếu không có)</label>
        <textarea
          id="giftNote"
          name="giftNote"
          rows={2}
          maxLength={500}
          defaultValue={product.giftNote}
          placeholder="Mỗi quà một dòng"
          className="w-full rounded-lg border border-edge px-3 py-2.5 text-base outline-none focus:border-teal"
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="summary" className="mb-1 block text-sm font-semibold">Mô tả ngắn</label>
        <input id="summary" name="summary" defaultValue={product.summary} className={input} />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="description" className="mb-1 block text-sm font-semibold">Mô tả chi tiết</label>
        <RichTextEditor id="description" name="description" initialHtml={descriptionToHtml(product.description)} />
      </div>
      <div className="flex items-center gap-3 md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-cta px-6 font-bold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          {pending && <Spinner />}
          {pending ? "Đang lưu…" : "Lưu sản phẩm"}
        </button>
        <Message state={state} />
      </div>
    </form>
  );
}

const MAX_TOTAL_BYTES = 3.8 * 1024 * 1024;

export function UploadForm({ productId }: { productId: string }) {
  const [state, action, actionPending] = useActionState<FormState, FormData>(uploadImages, {});
  const [, startTransition] = useTransition();
  const [preparing, setPreparing] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const pending = actionPending || preparing;

  // Ảnh gốc nặng bao nhiêu cũng chọn được: thu nhỏ trong trình duyệt trước khi gửi (máy chủ nhận tối đa khoảng 4 MB mỗi lần).
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(undefined);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    fd.delete("files");
    if (files.length === 0) {
      setLocalError("Chưa chọn ảnh.");
      return;
    }
    setPreparing(true);
    try {
      const small = await Promise.all(files.map((f) => shrinkImage(f, 1600, 0.85)));
      if (small.reduce((n, f) => n + f.size, 0) > MAX_TOTAL_BYTES) {
        setLocalError("Tổng ảnh vẫn quá lớn cho một lần tải. Vui lòng chọn ít ảnh hơn mỗi lần.");
        return;
      }
      small.forEach((f) => fd.append("files", f));
    } catch {
      setLocalError("Không đọc được ảnh. Vui lòng chọn ảnh JPG, PNG hoặc WebP.");
      return;
    } finally {
      setPreparing(false);
    }
    startTransition(() => action(fd));
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input type="hidden" name="productId" value={productId} />
      <div>
        <label htmlFor="files" className="mb-1 block text-sm font-semibold">Chọn ảnh (JPG, PNG, WebP)</label>
        <input
          id="files"
          name="files"
          type="file"
          accept="image/*"
          multiple
          className="block w-full text-sm file:mr-3 file:h-11 file:rounded-lg file:border-0 file:bg-mist file:px-4 file:font-semibold file:text-navy"
        />
        <p className="mt-1 text-xs text-subtle">Ảnh gốc nặng bao nhiêu cũng được, hệ thống tự thu nhỏ (cạnh dài tối đa 1600px) trước khi tải lên.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center gap-2 rounded-lg border-2 border-navy px-6 font-bold text-navy hover:bg-mist disabled:opacity-60"
        >
          {pending && <Spinner />}
          {pending ? "Đang tải lên…" : "Tải ảnh lên"}
        </button>
        {localError ? (
          <p role="alert" className="text-sm font-semibold text-price">
            {localError}
          </p>
        ) : (
          <Message state={state} />
        )}
      </div>
    </form>
  );
}
