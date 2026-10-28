"use client";

import { useActionState, useTransition } from "react";
import { createProduct, type FormState } from "@/app/admin/(panel)/products/actions";
import { OptionFields } from "./admin-option-fields";
import { Spinner } from "./spinner";

const field = "h-12 w-full rounded-lg border border-edge bg-white px-3 text-base outline-none focus:border-teal";
const area = "w-full rounded-lg border border-edge px-3 py-2.5 text-base outline-none focus:border-teal";

export function AdminNewProductForm({ categories }: { categories: { id: number; name: string }[] }) {
  const [state, action, actionPending] = useActionState<FormState, FormData>(createProduct, {});
  const [, startTransition] = useTransition();

  // Gửi bằng onSubmit để giữ nguyên những gì đã nhập khi có lỗi.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  }


  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label htmlFor="name" className="mb-1 block text-sm font-semibold">Tên sản phẩm</label>
        <input id="name" name="name" required maxLength={200} className={field} />
        <p className="mt-1 text-xs text-subtle">Đường dẫn của sản phẩm tự tạo từ tên.</p>
      </div>

      <div>
        <label htmlFor="categoryId" className="mb-1 block text-sm font-semibold">Danh mục</label>
        <select id="categoryId" name="categoryId" required defaultValue="" className={field}>
          <option value="" disabled>
            Chọn danh mục
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="sku" className="mb-1 block text-sm font-semibold">Mã sản phẩm (để trống sẽ tự tạo)</label>
        <input id="sku" name="sku" maxLength={40} className={field} />
      </div>

      <div>
        <label htmlFor="price" className="mb-1 block text-sm font-semibold">Giá gốc (₫)</label>
        <input id="price" name="price" type="number" min={0} step={500} required className={field} />
      </div>
      <div>
        <label htmlFor="salePrice" className="mb-1 block text-sm font-semibold">Giá khuyến mãi (₫, để trống nếu không giảm)</label>
        <input id="salePrice" name="salePrice" type="number" min={0} step={500} className={field} />
      </div>

      <div>
        <label htmlFor="soldCount" className="mb-1 block text-sm font-semibold">Số lượng đã bán</label>
        <input id="soldCount" name="soldCount" type="number" min={0} step={1} defaultValue={0} className={field} />
        <p className="mt-1 text-xs text-subtle">Nhập số đã bán thật, kể cả đã bán qua Shopee, TikTok, Facebook.</p>
      </div>
      <div>
        <label htmlFor="status" className="mb-1 block text-sm font-semibold">Trạng thái</label>
        <select id="status" name="status" defaultValue="draft" className={field}>
          <option value="draft">Nháp (chưa hiện ra ngoài)</option>
          <option value="active">Đang bán</option>
          <option value="hidden">Ẩn</option>
        </select>
      </div>

      <OptionFields hint="Hệ thống tự tạo mọi cặp màu và size. Sản phẩm không có màu hay size (ví dụ máy hút ẩm) thì để trống cả hai." />

      <div className="md:col-span-2">
        <label htmlFor="summary" className="mb-1 block text-sm font-semibold">Mô tả ngắn</label>
        <input id="summary" name="summary" maxLength={500} className={field} />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="description" className="mb-1 block text-sm font-semibold">Mô tả chi tiết</label>
        <textarea id="description" name="description" rows={6} className={area} />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="giftNote" className="mb-1 block text-sm font-semibold">Quà tặng miễn phí (để trống nếu không có)</label>
        <textarea id="giftNote" name="giftNote" rows={2} maxLength={500} placeholder="Mỗi quà một dòng" className={area} />
      </div>

      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
        <button
          type="submit"
          disabled={actionPending}
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-cta px-6 font-bold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          {actionPending && <Spinner />}
          {actionPending ? "Đang tạo…" : "Tạo sản phẩm"}
        </button>
        <p className="text-sm text-muted">Sau khi tạo, bạn sẽ được chuyển sang trang sửa để thêm ảnh.</p>
        {state.message && (
          <p role="alert" className="w-full text-sm font-semibold text-price">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
