import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s | Quản trị KENKO" },
  robots: { index: false, follow: false },
};

// Trang quản trị luôn đọc cookie và database theo từng yêu cầu nên không cần chuyển trang tức thì.
export const instant = false;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen bg-ground">{children}</div>;
}
