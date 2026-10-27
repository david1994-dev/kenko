"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const current = `${pathname}?${search}`;
  const [from, setFrom] = useState<string | null>(null);

  // Thanh chạy cho tới khi địa chỉ trang thay đổi, nên không cần effect để tắt.
  const active = from !== null && from === current;

  useEffect(() => {
    let timer: number | undefined;
    const here = () => `${location.pathname}?${location.search.replace(/^\?/, "")}`;
    const start = () => {
      setFrom(here());
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setFrom(null), 15000);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      start();
    };

    // Form tìm kiếm dùng GET tới đường dẫn nội bộ; form server action thì không có action dạng đường dẫn.
    const onSubmit = (e: SubmitEvent) => {
      const action = (e.target as HTMLFormElement | null)?.getAttribute?.("action");
      if (action?.startsWith("/")) start();
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  if (!active) return null;
  return <div className="nav-progress" aria-hidden="true" />;
}
