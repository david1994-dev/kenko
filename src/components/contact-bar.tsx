"use client";

import { usePathname } from "next/navigation";
import { PhoneIcon } from "./icons";
import { site } from "@/lib/site";

const hiddenOn = ["/san-pham/", "/gio-hang", "/dat-hang-thanh-cong"];

export function ContactBar() {
  const pathname = usePathname();
  if (hiddenOn.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav
      aria-label="Liên hệ nhanh"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 gap-2 border-t border-line bg-white px-3 py-2 md:hidden"
    >
      <a
        href={site.hotlineHref}
        className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-cta text-sm font-bold text-white"
      >
        <PhoneIcon size={18} />
        Gọi
      </a>
      <a
        href={site.zaloHref}
        className="flex h-11 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white"
      >
        Zalo
      </a>
      <a
        href={site.messengerHref}
        className="flex h-11 items-center justify-center rounded-lg bg-teal text-sm font-bold text-white"
      >
        Messenger
      </a>
    </nav>
  );
}
