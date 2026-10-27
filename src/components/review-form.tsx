"use client";

import { useActionState, useState } from "react";
import { lookupOrder, submitReviews, type LookupState, type SubmitState } from "@/app/(shop)/danh-gia/actions";
import { Spinner } from "./spinner";
import { Star } from "./stars";

const input = "h-12 w-full rounded-lg border border-edge bg-white px-3 text-base outline-none focus:border-teal";
const primary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-cta px-6 font-bold text-white hover:bg-cta-dark disabled:opacity-60";

function StarInput({ name, label }: { name: string; label: string }) {
  const [value, setValue] = useState(0);
  return (
    <fieldset>
      <legend className="mb-1 text-sm font-semibold">{label}</legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="relative flex size-11 cursor-pointer items-center justify-center">
            <input
              type="radio"
              name={name}
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

export function ReviewForm() {
  const [lookup, lookupAction, looking] = useActionState<LookupState, FormData>(lookupOrder, {});
  const [result, submitAction, submitting] = useActionState<SubmitState, FormData>(submitReviews, {});

  if (result.done) {
    return (
      <p role="status" className="rounded-xl bg-mist p-4 font-semibold">
        Cảm ơn bạn đã đánh giá. Đánh giá sẽ hiển thị sau khi cửa hàng duyệt.
      </p>
    );
  }

  if (lookup.items) {
    const open = lookup.items.filter((i) => !i.reviewed);
    return (
      <form action={submitAction} className="flex flex-col gap-5">
        <input type="hidden" name="code" value={lookup.code} />
        <input type="hidden" name="phone" value={lookup.phone} />
        {open.length === 0 && <p className="text-muted">Bạn đã đánh giá tất cả sản phẩm của đơn này.</p>}
        {open.map((i) => (
          <div key={i.productId} className="rounded-xl bg-white p-4 ring-1 ring-line">
            <div className="mb-2 font-bold">{i.name}</div>
            {i.variantLabel && <div className="mb-2 text-[13px] text-subtle">{i.variantLabel}</div>}
            <StarInput name={`rating-${i.productId}`} label="Số sao" />
            <label htmlFor={`comment-${i.productId}`} className="mb-1 mt-3 block text-sm font-semibold">
              Nhận xét (không bắt buộc)
            </label>
            <textarea
              id={`comment-${i.productId}`}
              name={`comment-${i.productId}`}
              rows={3}
              maxLength={500}
              className="w-full rounded-lg border border-edge px-3 py-2.5 text-base outline-none focus:border-teal"
            />
          </div>
        ))}
        {result.message && (
          <p role="alert" className="text-sm font-semibold text-price">
            {result.message}
          </p>
        )}
        {open.length > 0 && (
          <button type="submit" disabled={submitting} className={primary}>
            {submitting && <Spinner />}
            {submitting ? "Đang gửi…" : "Gửi đánh giá"}
          </button>
        )}
      </form>
    );
  }

  return (
    <form action={lookupAction} className="flex flex-col gap-3 rounded-xl bg-white p-4 ring-1 ring-line">
      <div>
        <label htmlFor="code" className="mb-1 block text-sm font-semibold">Mã đơn hàng</label>
        <input id="code" name="code" required placeholder="KK-XXXXXX" defaultValue={lookup.code} className={input} />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-semibold">Số điện thoại đặt hàng</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          required
          defaultValue={lookup.phone}
          className={input}
        />
      </div>
      {lookup.message && (
        <p role="alert" className="text-sm font-semibold text-price">
          {lookup.message}
        </p>
      )}
      <button type="submit" disabled={looking} className={primary}>
        {looking && <Spinner />}
        {looking ? "Đang tra cứu…" : "Tiếp tục"}
      </button>
    </form>
  );
}
