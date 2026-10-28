import { Suspense } from "react";
import Link from "next/link";
import { logout } from "../actions";
import { SubmitButton } from "@/components/submit-button";

export const instant = false;

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <header className="border-b border-brand-deep bg-brand">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-5 px-4">
          <Link href="/admin/orders" className="font-extrabold tracking-[0.12em] text-ink">
            KENKO STORE · QUẢN TRỊ
          </Link>
          <nav className="flex flex-1 gap-4 text-sm font-semibold">
            <Link href="/admin/orders" className="flex min-h-11 items-center hover:underline">
              Đơn hàng
            </Link>
            <Link href="/admin/products" className="flex min-h-11 items-center hover:underline">
              Sản phẩm
            </Link>
            <Link href="/admin/reviews" className="flex min-h-11 items-center hover:underline">
              Đánh giá
            </Link>
            <Link href="/admin/banner" className="flex min-h-11 items-center hover:underline">
              Banner
            </Link>
          </nav>
          <form action={logout}>
            <SubmitButton pendingLabel="Đang thoát…" className="min-h-11 text-sm font-semibold hover:underline">
              Đăng xuất
            </SubmitButton>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Suspense fallback={<p className="text-subtle">Đang tải…</p>}>{children}</Suspense>
      </main>
    </>
  );
}
