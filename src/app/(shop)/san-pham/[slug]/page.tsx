import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/page-skeleton";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BuyBox } from "@/components/buy-box";
import { ChatIcon, CheckIcon, ChevronDownIcon, GiftIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { Container, DiscountBadge, ImagePlaceholder, Price, ProductCard, SectionHeading } from "@/components/ui";
import { getProduct, getProductReviews, getProducts } from "@/lib/catalog";
import { RatingLine, Stars } from "@/components/stars";
import { formatRating, maskName } from "@/lib/format";
import { publicSourceLabel } from "@/lib/review-source";
import { currentPrice } from "@/lib/price";
import { absoluteUrl, site } from "@/lib/site";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/san-pham/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const image = product.images[0]?.url;
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/san-pham/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.summary,
      images: image ? [image] : undefined,
    },
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
  const [product, all] = await Promise.all([getProduct(slug), getProducts()]);
  if (!product) notFound();
  const reviews = await getProductReviews(product.id);

  const others = all.filter((p) => p.slug !== product.slug);
  const related = [...others.filter((p) => p.category === product.category), ...others.filter((p) => p.category !== product.category)].slice(0, 4);
  const [main, ...rest] = product.images;
  const isShirt = product.category === "dai-tay" || product.category === "ngan-tay";

  return (
    <>
      <Container className="pt-3">
        <Breadcrumbs
          items={[
            ...(isShirt ? [{ name: "Áo điều hoà", href: "/ao-dieu-hoa" }] : []),
            { name: product.categoryName, href: product.categoryHref },
            { name: product.name, href: `/san-pham/${product.slug}` },
          ]}
        />
      </Container>

      <Container className="grid gap-5 pt-3 md:grid-cols-2 md:gap-10 md:pt-5">
        <div>
          {main ? (
            <div className="relative aspect-square w-full overflow-hidden bg-mist max-md:-mx-4 max-md:!w-[calc(100%+2rem)] md:rounded-xl">
              <Image
                src={main.url}
                alt={main.alt || product.name}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <DiscountBadge product={product} />
            </div>
          ) : (
            <ImagePlaceholder
              label="Ảnh sản phẩm"
              className="!rounded-none md:!rounded-xl max-md:-mx-4 max-md:!w-[calc(100%+2rem)]"
            >
              <DiscountBadge product={product} />
            </ImagePlaceholder>
          )}
          {rest.length > 0 && (
            <ul className="mt-2 grid grid-cols-5 gap-2">
              {product.images.slice(0, 5).map((img) => (
                <li key={img.id} className="relative aspect-square overflow-hidden rounded-lg bg-mist">
                  <Image src={img.url} alt={img.alt || product.name} fill sizes="80px" className="object-cover" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h1 className="mb-1.5 text-[22px] font-extrabold leading-snug md:text-[28px]">{product.name}</h1>
          <p className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-subtle">
            {product.rating && <RatingLine rating={product.rating} />}
            <span>
              Mã: {product.sku} · Đã bán {product.sold}
            </span>
          </p>
          <div className="mb-4">
            <Price product={product} size="lg" />
          </div>

          <BuyBox product={product} />

          {product.giftNote && (
            <div className="mt-4 flex gap-3 rounded-xl border border-brand-deep bg-mist p-3">
              <GiftIcon size={24} className="mt-0.5 shrink-0 text-price" />
              <div>
                <div className="text-sm font-bold">Quà tặng miễn phí</div>
                <p className="whitespace-pre-line text-sm text-muted">{product.giftNote}</p>
              </div>
            </div>
          )}

          <ul className="mt-5 flex flex-col gap-3 border-t border-line pt-4 text-sm">
            <li className="flex items-center gap-3">
              <TruckIcon size={22} className="shrink-0 text-teal" />
              Miễn phí vận chuyển · Ship hoả tốc
            </li>
            <li className="flex items-center gap-3">
              <CheckIcon size={22} className="shrink-0 text-teal" />
              Kiểm tra, test hàng chính hãng trước khi thanh toán (COD)
            </li>
            <li className="flex items-center gap-3">
              <ShieldIcon size={22} className="shrink-0 text-teal" />
              Bảo hành 12 tháng
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
        </div>
      </Container>

      <Container className="pt-8">
        <div className="max-w-3xl">
          <h2 className="mb-3 text-lg font-bold md:text-2xl md:font-extrabold">Đánh giá của khách hàng</h2>
          {product.rating ? (
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-ground p-3">
              <span className="text-3xl font-extrabold">{formatRating(product.rating.avg)}</span>
              <div>
                <Stars value={product.rating.avg} size={20} />
                <div className="text-[13px] text-subtle">{product.rating.count} đánh giá</div>
              </div>
            </div>
          ) : (
            <p className="mb-4 text-sm text-muted">Chưa có đánh giá.</p>
          )}
          <ul className="divide-y divide-line">
            {reviews.map((r) => (
              <li key={r.id} className="py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{r.source === "order" ? maskName(r.authorName) : r.authorName}</span>
                  <Stars value={r.rating} size={14} />
                  <span className="text-xs text-subtle">
                    {new Date(r.reviewedAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                  </span>
                </div>
                <div className="text-xs text-subtle">{publicSourceLabel(r.source)}</div>
                {r.comment && <p className="mt-1 whitespace-pre-line text-sm text-muted">{r.comment}</p>}
              </li>
            ))}
          </ul>
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
          category: product.categoryName,
          image: product.images.map((i) => i.url),
          ...(product.rating
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: Number(product.rating.avg.toFixed(1)),
                  reviewCount: product.rating.count,
                  bestRating: 5,
                  worstRating: 1,
                },
              }
            : {}),
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
    </>
  );
}
