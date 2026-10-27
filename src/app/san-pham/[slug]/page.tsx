import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/page-skeleton";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BuyBox } from "@/components/buy-box";
import { ChatIcon, ChevronDownIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { Container, DiscountBadge, ImagePlaceholder, Price, ProductCard, SectionHeading } from "@/components/ui";
import { categoryById, currentPrice, getProduct, products } from "@/data/catalog";
import { absoluteUrl, site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/san-pham/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/san-pham/${product.slug}` },
    openGraph: { type: "website", title: product.name, description: product.summary },
  };
}

function Accordion({
  title,
  open = false,
  children,
}: {
  title: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={open} className="group border-b border-line">
      <summary className="flex min-h-[52px] items-center justify-between text-base font-bold">
        {title}
        <ChevronDownIcon size={16} strokeWidth={2.5} className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-4 text-sm text-muted md:text-[15px]">{children}</div>
    </details>
  );
}

export default function Page(props: PageProps<"/san-pham/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Content params={props.params} />
    </Suspense>
  );
}

async function Content({ params }: Pick<PageProps<"/san-pham/[slug]">, "params">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = categoryById[product.category];
  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .concat(products.filter((p) => p.category !== product.category && p.slug !== product.slug))
    .slice(0, 4);

  return (
    <>
      <Container className="pt-3">
        <Breadcrumbs
          items={[
            ...(product.category === "dai-tay" || product.category === "ngan-tay"
              ? [{ name: "Áo điều hoà", href: "/ao-dieu-hoa" }]
              : []),
            { name: category.name, href: category.href },
            { name: product.name, href: `/san-pham/${product.slug}` },
          ]}
        />
      </Container>

      <Container className="grid gap-5 pt-3 md:grid-cols-2 md:gap-10 md:pt-5">
        <div>
          <ImagePlaceholder label="Ảnh sản phẩm · vuốt để xem thêm" className="!rounded-none md:!rounded-xl max-md:-mx-4 max-md:!w-[calc(100%+2rem)]">
            <DiscountBadge product={product} />
          </ImagePlaceholder>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg bg-mist ${i === 0 ? "border-2 border-navy" : "border border-line"}`}
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="mb-1.5 text-[22px] font-extrabold leading-snug md:text-[28px]">{product.name}</h1>
          <p className="mb-2.5 text-[13px] text-subtle">
            Mã: {product.sku} · Đã bán {product.sold} ·{" "}
            <span className="font-semibold text-[#0f766e]">Còn hàng</span>
          </p>
          <div className="mb-4">
            <Price product={product} size="lg" />
          </div>

          <BuyBox product={product} />

          <ul className="mt-5 flex flex-col gap-3 border-t border-line pt-4 text-sm">
            <li className="flex items-center gap-3">
              <TruckIcon size={22} className="shrink-0 text-teal" />
              Giao hàng toàn quốc · [Thời gian dự kiến]
            </li>
            <li className="flex items-center gap-3">
              <ShieldIcon size={22} className="shrink-0 text-teal" />
              Bảo hành [Thời gian] · Đổi trả [Điều kiện]
            </li>
            <li className="flex items-center gap-3">
              <ChatIcon size={22} className="shrink-0 text-teal" />
              Cần tư vấn size? Nhắn Zalo / gọi hotline {site.hotline}
            </li>
          </ul>
        </div>
      </Container>

      <Container className="pt-6 md:pt-10">
        <div className="max-w-3xl border-t border-line">
          <Accordion title="Mô tả sản phẩm" open>
            <p>{product.description}</p>
          </Accordion>
          <Accordion title="Thông số">
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
              {product.specs.map((s) => (
                <div key={s.label} className="contents">
                  <dt className="font-semibold text-ink">{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </Accordion>
          {product.faqs.length > 0 && (
            <Accordion title="Câu hỏi thường gặp">
              <dl className="space-y-3">
                {product.faqs.map((f) => (
                  <div key={f.q}>
                    <dt className="font-semibold text-ink">{f.q}</dt>
                    <dd>{f.a}</dd>
                  </div>
                ))}
              </dl>
            </Accordion>
          )}
        </div>
      </Container>

      <Container className="py-8 md:py-12">
        <SectionHeading title="Sản phẩm liên quan" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-4 md:gap-x-5">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Container>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.summary,
          sku: product.sku,
          category: category.name,
          brand: { "@type": "Brand", name: site.name },
          offers: {
            "@type": "Offer",
            url: absoluteUrl(`/san-pham/${product.slug}`),
            priceCurrency: "VND",
            price: currentPrice(product),
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        }}
      />
      {product.faqs.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: product.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
      )}
    </>
  );
}
