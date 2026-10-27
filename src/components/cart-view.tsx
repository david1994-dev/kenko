"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CloseIcon } from "./icons";
import { QuantityStepper } from "./quantity-stepper";
import { ImagePlaceholder } from "./ui";
import { cart, cartTotal, useCart, useHydrated } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

const payments = [
  { id: "cod", name: "Thanh toán khi nhận hàng (COD)", hint: "Kiểm tra hàng rồi mới trả tiền" },
  { id: "bank", name: "Chuyển khoản ngân hàng", hint: "Nhận thông tin chuyển khoản sau khi đặt hàng" },
];

type Errors = Partial<Record<"name" | "phone" | "address", string>>;

const inputClass =
  "h-12 w-full rounded-lg border border-edge bg-white px-3 text-base outline-none focus:border-teal aria-[invalid=true]:border-cta";

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
        <p id={`${id}-error`} className="mt-1 text-[13px] font-medium text-cta-dark">
          {error}
        </p>
      )}
    </div>
  );
}

export function CartView() {
  const router = useRouter();
  const items = useCart();
  const hydrated = useHydrated();
  const [errors, setErrors] = useState<Errors>({});
  const [payment, setPayment] = useState("cod");

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

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Errors = {};
    if (!String(data.get("name") ?? "").trim()) next.name = "Vui lòng nhập họ và tên.";
    if (!/^(0|\+84)\d{9,10}$/.test(String(data.get("phone") ?? "").replace(/\s/g, "")))
      next.phone = "Số điện thoại chưa đúng.";
    if (!String(data.get("address") ?? "").trim()) next.address = "Vui lòng nhập địa chỉ nhận hàng.";
    setErrors(next);
    const firstInvalid = (["name", "phone", "address"] as const).find((k) => next[k]);
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    // TODO: gửi đơn hàng lên API khi có backend; hiện chỉ xoá giỏ và chuyển trang.
    cart.clear();
    router.push("/dat-hang-thanh-cong");
  }

  const bind = (key: keyof Errors) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1fr)_380px] md:items-start md:gap-8"
    >
      <div className="space-y-4">
        <section className="rounded-xl bg-white p-4 ring-1 ring-line">
          <h2 className="mb-3 text-base font-bold">Sản phẩm ({items.length})</h2>
          <ul className="flex flex-col gap-4">
            {items.map((it) => (
              <li key={it.id} className="flex gap-3">
                <ImagePlaceholder label="Ảnh" className="!w-20 shrink-0 !text-[11px] !rounded-lg" />
                <div className="min-w-0 flex-1">
                  <Link href={`/san-pham/${it.slug}`} className="text-sm font-semibold leading-snug hover:underline">
                    {it.name}
                  </Link>
                  {it.variant && <p className="mb-1.5 text-[13px] text-subtle">{it.variant}</p>}
                  <div className="flex items-center justify-between gap-2">
                    <QuantityStepper value={it.qty} onChange={(q) => cart.setQty(it.id, q)} />
                    <span className="font-bold text-cta">{formatPrice(it.price * it.qty)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Xoá ${it.name}`}
                  onClick={() => cart.remove(it.id)}
                  className="-mr-2 -mt-2 flex size-11 shrink-0 items-start justify-end text-subtle hover:text-cta"
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
            <Field id="province" label="Tỉnh / Thành phố">
              <input id="province" name="province" autoComplete="address-level1" className={inputClass} />
            </Field>
            <Field id="district" label="Quận / Huyện, Phường / Xã">
              <input id="district" name="district" autoComplete="address-level2" className={inputClass} />
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
            <Field id="note" label="Ghi chú (không bắt buộc)">
              <textarea
                id="note"
                name="note"
                rows={2}
                className="w-full rounded-lg border border-edge px-3 py-2.5 text-base outline-none focus:border-teal"
              />
            </Field>
          </div>
        </section>

        <fieldset className="rounded-xl bg-white p-4 ring-1 ring-line">
          <legend className="float-left mb-3 w-full text-base font-bold">Thanh toán</legend>
          <div className="clear-both flex flex-col gap-2">
            {payments.map((m) => (
              <label
                key={m.id}
                className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-2 ${
                  payment === m.id ? "border-navy bg-mist" : "border-line"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={m.id}
                  checked={payment === m.id}
                  onChange={() => setPayment(m.id)}
                  className="size-5 accent-navy"
                />
                <span>
                  <span className="block text-sm font-semibold">{m.name}</span>
                  <span className="block text-[13px] text-muted">{m.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
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
            <dd className="text-cta">{formatPrice(total)}</dd>
          </div>
        </dl>
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
          className="mt-4 hidden h-[52px] w-full items-center justify-between rounded-lg bg-cta px-4 text-base font-bold text-white hover:bg-cta-dark md:flex"
        >
          <span>Đặt hàng</span>
          <span>{formatPrice(total)}</span>
        </button>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-3 py-2 md:hidden">
        <button
          type="submit"
          className="flex h-[52px] w-full items-center justify-between rounded-lg bg-cta px-4 text-base font-bold text-white"
        >
          <span>Đặt hàng</span>
          <span>{formatPrice(total)}</span>
        </button>
      </div>
    </form>
  );
}
