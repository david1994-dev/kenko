import Link from "next/link";
import { JsonLd } from "./json-ld";
import { absoluteUrl } from "@/lib/site";

export type Crumb = { name: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "Trang chủ", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Đường dẫn" className="text-[13px] text-subtle">
        <ol className="flex flex-wrap items-center gap-x-1.5">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="font-semibold text-ink">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.href} className="inline-flex min-h-8 items-center hover:text-teal">
                      {c.name}
                    </Link>
                    <span aria-hidden="true">›</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: absoluteUrl(c.href),
          })),
        }}
      />
    </>
  );
}
