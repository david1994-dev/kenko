import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Đăng nhập" };

export default function Page() {
  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <div className="rounded-xl bg-white p-6 ring-1 ring-line">
        <h1 className="mb-4 text-xl font-extrabold">Đăng nhập quản trị</h1>
        <LoginForm />
      </div>
    </main>
  );
}
