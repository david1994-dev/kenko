import Image from "next/image";
import Link from "next/link";
import { policies } from "@/data/content";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink pb-24 text-sm text-[#e6e9f2] md:pb-0">
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-8 md:grid-cols-3 md:px-6 md:py-10">
        <div>
          <Image
            src="/logo.png"
            alt="KENKO STORE"
            width={640}
            height={326}
            className="mb-3 h-16 w-auto rounded-lg"
          />
          <p>
            Hotline:{" "}
            <a href={site.hotlineHref} className="font-semibold text-white hover:underline">
              {site.hotline}
            </a>
          </p>
          <p>
            Zalo:{" "}
            <a href={site.zaloHref} className="font-semibold text-white hover:underline">
              {site.hotline}
            </a>
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-bold text-brand">Địa chỉ</h2>
          <p>{site.address}</p>
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

      </div>
      <div className="border-t border-white/15 px-4 py-4 text-center text-xs text-[#aab0c4]">
        © {site.year} {site.name}
      </div>
    </footer>
  );
}
