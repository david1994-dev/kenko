"use client";

import { useActionState, useTransition } from "react";
import { addVariants, type FormState } from "@/app/admin/(panel)/products/actions";
import { OptionFields } from "./admin-option-fields";
import { Spinner } from "./spinner";

export function AddVariantsForm({ productId }: { productId: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(addVariants, {});
  const [, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  }

  return (
    <form key={state.ok ? state.message : "form"} onSubmit={onSubmit} className="grid gap-4">
      <input type="hidden" name="productId" value={productId} />
      <OptionFields uid={productId} hint="Màu mới được ghép với mọi size hiện có, size mới được ghép với mọi màu hiện có." />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center gap-2 rounded-lg border-2 border-navy px-6 font-bold text-navy hover:bg-mist disabled:opacity-60"
        >
          {pending && <Spinner />}
          {pending ? "Đang lưu…" : "Lưu phân loại"}
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
