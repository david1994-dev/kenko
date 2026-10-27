"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CartIcon, ChevronRightIcon, CloseIcon, MenuIcon, SearchIcon } from "./icons";
import { cartCount, useCart } from "@/lib/cart";
import { mainNav } from "@/data/content";
import { site } from "@/lib/site";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = cartCount(useCart());

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-2 lg:h-[72px] lg:gap-8 lg:px-6">
        <button
          type="button"
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="flex size-11 items-center justify-center lg:hidden"
        >
          <MenuIcon />
        </button>

        <Link href="/" className="text-[22px] font-extrabold tracking-[0.16em] text-navy lg:text-[26px]">
          {site.name}
        </Link>

        <nav aria-label="Menu chính" className="hidden flex-1 items-center gap-6 text-[15px] font-semibold lg:flex">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="flex min-h-11 items-center whitespace-nowrap hover:text-teal">
              {item.label}
            </Link>
          ))}
        </nav>

        <form
          action="/tim-kiem"
          role="search"
          className="hidden h-11 w-60 items-center gap-2 rounded-full border border-edge px-4 text-sm lg:flex"
        >
          <SearchIcon size={18} />
          <input
            name="q"
            type="search"
            aria-label="Tìm sản phẩm"
            placeholder="Tìm sản phẩm…"
            className="w-full bg-transparent outline-none placeholder:text-subtle"
          />
        </form>

        <div className="flex">
          <button
            type="button"
            aria-label="Tìm kiếm"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="flex size-11 items-center justify-center lg:hidden"
          >
            <SearchIcon />
          </button>
          <Link
            href="/gio-hang"
            aria-label={`Giỏ hàng, ${count} sản phẩm`}
            className="relative flex size-11 items-center justify-center"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-cta px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form action="/tim-kiem" role="search" className="border-t border-line bg-white p-3 lg:hidden">
          <input
            name="q"
            type="search"
            autoFocus
            aria-label="Tìm sản phẩm"
            placeholder="Tìm áo điều hoà, phụ kiện…"
            className="h-12 w-full rounded-lg border border-edge px-3 text-base outline-none focus:border-teal"
          />
        </form>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ink/50"
          />
          <div className="absolute inset-y-0 left-0 flex w-[84%] max-w-[340px] flex-col bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-line px-2 pl-4">
              <span className="text-[22px] font-extrabold tracking-[0.16em] text-navy">{site.name}</span>
              <button
                type="button"
                aria-label="Đóng menu"
                onClick={() => setMenuOpen(false)}
                className="flex size-11 items-center justify-center"
              >
                <CloseIcon />
              </button>
            </div>
            <nav aria-label="Menu di động" className="flex-1 overflow-y-auto py-2">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center justify-between px-4 text-base font-semibold hover:bg-ground"
                >
                  {item.label}
                  <ChevronRightIcon size={18} className="text-teal" />
                </Link>
              ))}
            </nav>
            <div className="border-t border-line p-4 text-sm text-muted">
              Hotline {site.hotline}
              <br />
              {site.hours}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
