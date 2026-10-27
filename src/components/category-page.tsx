import Link from "next/link";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { JsonLd } from "./json-ld";
import { ProductList } from "./product-list";
import { Container, ProseBlock } from "./ui";
import type { Product } from "@/lib/types";
import { absoluteUrl } from "@/lib/site";

type Chip = { label: string; href: string; active?: boolean };

export function CategoryPage({
  title,
  description,
  crumbs,
  products,
  chips,
  seoTitle,
  seoText,
  path,
}: {
  title: string;
  description: string;
  crumbs: Crumb[];
  products: Product[];
  chips?: Chip[];
  seoTitle?: string;
  seoText?: string;
  path: string;
}) {
  return (
    <Container className="pb-8 pt-3 md:pt-5">
      <Breadcrumbs items={crumbs} />
      <h1 className="mb-1 mt-3 text-2xl font-extrabold leading-tight md:text-[32px]">{title}</h1>
      <p className="mb-3 text-sm text-muted md:text-base">{description}</p>

      {chips && (
        <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {chips.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              aria-current={c.active ? "page" : undefined}
              className={`flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold ${
                c.active ? "border-navy bg-navy text-white" : "border-edge text-navy hover:bg-mist"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}

      <ProductList products={products} />

      {seoText && (
        <div className="mt-8">
          <ProseBlock title={seoTitle ?? `Giới thiệu ${title.toLowerCase()}`}>{seoText}</ProseBlock>
        </div>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: absoluteUrl(path),
          mainEntity: {
            "@type": "ItemList",
            itemListElement: products.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: absoluteUrl(`/san-pham/${p.slug}`),
              name: p.name,
            })),
          },
        }}
      />
    </Container>
  );
}
