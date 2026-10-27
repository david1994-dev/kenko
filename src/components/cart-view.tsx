"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { CheckIcon, CloseIcon } from "./icons";
import { QuantityStepper } from "./quantity-stepper";
import { Spinner } from "./spinner";
import { ImagePlaceholder } from "./ui";
import { placeOrder, type OrderFormState } from "@/app/(shop)/gio-hang/actions";
import { cart, cartTotal, useCart, useHydrated } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

const inputClass =
  "h-12 w-full rounded-lg border border-edge bg-white px-3 text-base outline-none focus:border-teal aria-[invalid=true]:border-price";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[13px] font-medium text-price">
          {error}
        </p>
      )}
    </div>
  );
}

const initialState: OrderFormState = {};

export function CartView() {
  const items = useCart();
  const hydrated = useHydrated();
  const [state, formAction, pending] = useActionState(placeOrder, initialState);

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-xl bg-ground" aria-hidden="true" />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-ground p-8 text-center">
        <p className="mb-4 text-muted">Giỏ hàng của bạn đang trống.</p>
        <Link
          href="/ao-dieu-hoa"
          className="inline-flex h-12 items-center rounded-lg bg-cta px-6 font-bold text-white hover:bg-cta-dark"
        >
          Xem áo điều hoà
        </Link>
      </div>
    );
  }

  const total = cartTotal(items);
  const errors = state.errors ?? {};
  const value = (k: string) => state.values?.[k] ?? "";
  const bind = (key: keyof typeof errors) => ({
    defaultValue: value(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  return (
    <form
      action={formAction}
      className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1fr)_380px] md:items-start md:gap-8"
    >
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(items.map((i) => ({ variantId: i.id, qty: i.qty })))}
      />
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="space-y-4">
        <section className="rounded-xl bg-white p-4 ring-1 ring-line">
          <h2 className="mb-3 text-base font-bold">Sản phẩm ({items.length})</h2>
          <ul className="flex flex-col gap-4">
            {items.map((it) => (
              <li key={it.id} className="flex gap-3">
                {it.image ? (
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-mist">
                    <Image src={it.image} alt={it.name} fill sizes="80px" className="object-cover" />
                  </div>
                ) : (
                  <ImagePlaceholder label="Ảnh" className="!w-20 shrink-0 !text-[11px] !rounded-lg" />
                )}
                <div className="min-w-0 flex-1">
                  <Link href={`/san-pham/${it.slug}`} className="text-sm font-semibold leading-snug hover:underline">
                    {it.name}
                  </Link>
                  {it.variant && <p className="mb-1.5 text-[13px] text-subtle">{it.variant}</p>}
                  <div className="flex items-center justify-between gap-2">
                    <QuantityStepper value={it.qty} onChange={(q) => cart.setQty(it.id, q)} />
                    <span className="font-bold text-price">{formatPrice(it.price * it.qty)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Xoá ${it.name}`}
                  onClick={() => cart.remove(it.id)}
                  className="-mr-2 -mt-2 flex size-11 shrink-0 items-start justify-end text-subtle hover:text-price"
                >
                  <span className="flex size-11 items-center justify-center">
                    <CloseIcon size={20} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl bg-white p-4 ring-1 ring-line">
          <h2 className="mb-0.5 text-base font-bold">Thông tin nhận hàng</h2>
          <p className="mb-3 text-[13px] text-subtle">Không cần tạo tài khoản.</p>
          <div className="flex flex-col gap-3">
            <Field id="name" label="Họ và tên" error={errors.name}>
              <input id="name" name="name" autoComplete="name" className={inputClass} {...bind("name")} />
            </Field>
            <Field id="phone" label="Số điện thoại" error={errors.phone}>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={inputClass}
                {...bind("phone")}
              />
            </Field>
            <Field id="province" label="Tỉnh / Thành phố" error={errors.province}>
              <input
                id="province"
                name="province"
                autoComplete="address-level1"
                className={inputClass}
                {...bind("province")}
              />
            </Field>
            <Field id="district" label="Quận / Huyện, Phường / Xã" error={errors.district}>
              <input
                id="district"
                name="district"
                autoComplete="address-level2"
                className={inputClass}
                {...bind("district")}
              />
            </Field>
            <Field id="address" label="Địa chỉ cụ thể" error={errors.address}>
              <input
                id="address"
                name="address"
                autoComplete="street-address"
                className={inputClass}
                {...bind("address")}
              />
            </Field>
            <Field id="note" label="Ghi chú (không bắt buộc)" error={errors.note}>
              <textarea
                id="note"
                name="note"
                rows={2}
                defaultValue={value("note")}
                className="w-full rounded-lg border border-edge px-3 py-2.5 text-base outline-none focus:border-teal"
              />
            </Field>
          </div>
        </section>

        <section className="rounded-xl bg-white p-4 ring-1 ring-line">
          <h2 className="mb-3 text-base font-bold">Thanh toán</h2>
          <div className="flex min-h-14 items-center gap-3 rounded-lg border-2 border-navy bg-mist px-3 py-2">
            <CheckIcon size={20} className="shrink-0 text-navy" />
            <p>
              <span className="block text-sm font-semibold">Thanh toán khi nhận hàng (COD)</span>
              <span className="block text-[13px] text-muted">Kiểm tra hàng rồi mới trả tiền</span>
            </p>
          </div>
        </section>
      </div>

      <aside className="rounded-xl bg-white p-4 ring-1 ring-line md:sticky md:top-24">
        <h2 className="mb-3 text-base font-bold">Tóm tắt đơn hàng</h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Tạm tính</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Phí vận chuyển</dt>
            <dd className="text-muted">Xác nhận khi liên hệ</dd>
          </div>
          <div className="mt-1 flex justify-between border-t border-line pt-3 text-[17px] font-extrabold">
            <dt>Tổng cộng</dt>
            <dd className="text-price">{formatPrice(total)}</dd>
          </div>
        </dl>
        {state.message && (
          <p role="alert" className="mt-4 rounded-lg bg-[#fdeee6] px-3 py-2 text-sm font-medium text-price">
            {state.message}
          </p>
        )}
        <p className="mt-4 text-xs text-muted">
          Bằng việc đặt hàng, bạn đồng ý với{" "}
          <Link href="/chinh-sach/thanh-toan" className="text-teal underline">
            điều khoản mua hàng
          </Link>{" "}
          và{" "}
          <Link href="/chinh-sach/doi-tra" className="text-teal underline">
            chính sách đổi trả
          </Link>
          .
        </p>
        <button
          type="submit"
          disabled={pending}
          className="mt-4 hidden h-[52px] w-full items-center justify-between rounded-lg bg-cta px-4 text-base font-bold text-white hover:bg-cta-dark disabled:opacity-60 md:flex"
        >
          <span className="inline-flex items-center gap-2">{pending && <Spinner />}{pending ? "Đang gửi…" : "Đặt hàng"}</span>
          <span>{formatPrice(total)}</span>
        </button>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-3 py-2 md:hidden">
        <button
          type="submit"
          disabled={pending}
          className="flex h-[52px] w-full items-center justify-between rounded-lg bg-cta px-4 text-base font-bold text-white disabled:opacity-60"
        >
          <span className="inline-flex items-center gap-2">{pending && <Spinner />}{pending ? "Đang gửi…" : "Đặt hàng"}</span>
          <span>{formatPrice(total)}</span>
        </button>
      </div>
    </form>
  );
}
