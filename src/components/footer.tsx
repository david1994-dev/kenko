import Image from "next/image";
import Link from "next/link";
import { policies } from "@/data/content";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink pb-24 text-sm text-[#e6e9f2] md:pb-0">
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-8 md:grid-cols-4 md:px-6 md:py-10">
        <div>
          <Image
            src="/logo.png"
            alt="KENKO STORE"
            width={640}
            height={326}
            className="mb-3 h-16 w-auto rounded-lg"
          />
          <p>Hotline {site.hotline}</p>
          <p>{site.email}</p>
          <p>{site.hours}</p>
        </div>

        <div>
          <h2 className="mb-2 font-bold text-brand">Cửa hàng</h2>
          <ul className="space-y-1">
            {site.stores.map((s) => (
              <li key={s.city}>
                {s.city}: {s.address} · {s.phone}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-2 font-bold text-brand">Chính sách</h2>
          <ul>
            {policies.map((p) => (
              <li key={p.slug}>
                <Link href={`/chinh-sach/${p.slug}`} className="flex min-h-9 items-center hover:text-white hover:underline">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-2 font-bold text-brand">Mua trên</h2>
          <ul>
            {site.marketplaces.map((m) => (
              <li key={m.name}>
                <a href={m.href} className="flex min-h-9 items-center hover:text-white hover:underline">
                  {m.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 px-4 py-4 text-center text-xs text-[#aab0c4]">
        © {site.year} {site.name} · {site.company}
      </div>
    </footer>
  );
}
