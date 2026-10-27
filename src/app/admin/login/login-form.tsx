"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="flex flex-col gap-3">
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-semibold">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          aria-invalid={state.message ? true : undefined}
          className="h-12 w-full rounded-lg border border-edge px-3 text-base outline-none focus:border-teal"
        />
        {state.message && <p className="mt-1 text-[13px] font-medium text-price">{state.message}</p>}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-lg bg-cta font-bold text-white hover:bg-cta-dark disabled:opacity-60"
      >
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>
    </form>
  );
}
