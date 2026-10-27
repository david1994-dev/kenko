import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { discountPercent, formatPrice } from "@/lib/format";
import { RatingLine } from "./stars";
import type { Product } from "@/lib/types";

export function ImagePlaceholder({
  label = "Ảnh sản phẩm",
  className = "",
  ratio = "aspect-square",
  children,
}: {
  label?: string;
  className?: string;
  ratio?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative flex ${ratio} w-full items-center justify-center rounded-xl bg-mist px-2 text-center text-xs text-muted ${className}`}
    >
      {label}
      {children}
    </div>
  );
}

export function Price({
  product,
  size = "md",
}: {
  product: Pick<Product, "price" | "salePrice">;
  size?: "md" | "lg";
}) {
  const main = size === "lg" ? "text-[26px] font-extrabold" : "text-base font-bold";
  const old = size === "lg" ? "text-[15px]" : "text-[13px]";
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={`${main} text-price`}>{formatPrice(product.salePrice ?? product.price)}</span>
      {product.salePrice ? (
        <span className={`${old} text-subtle line-through`}>{formatPrice(product.price)}</span>
      ) : null}
    </div>
  );
}

export function DiscountBadge({ product }: { product: Pick<Product, "price" | "salePrice"> }) {
  if (!product.salePrice) return null;
  return (
    <span className="absolute left-2 top-2 rounded-md bg-price px-2 py-0.5 text-xs font-bold text-white">
      -{discountPercent(product.price, product.salePrice)}%
    </span>
  );
}

export function ProductThumb({
  product,
  sizes = "(min-width: 768px) 25vw, 50vw",
  priority = false,
  className = "",
  children,
}: {
  product: Pick<Product, "name" | "images">;
  sizes?: string;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const image = product.images[0];
  if (!image) {
    return <ImagePlaceholder className={className}>{children}</ImagePlaceholder>;
  }
  return (
    <div className={`relative aspect-square w-full overflow-hidden rounded-xl bg-mist ${className}`}>
      <Image
        src={image.url}
        alt={image.alt || product.name}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {children}
    </div>
  );
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link
      href={`/san-pham/${product.slug}`}
      prefetch={priority}
      className="group flex flex-col gap-1.5"
    >
      <ProductThumb product={product} className="transition-colors group-hover:bg-[#ffe8bd]">
        <DiscountBadge product={product} />
      </ProductThumb>
      <h3 className="text-sm font-semibold leading-snug md:text-[15px]">{product.name}</h3>
      {product.colors.length > 0 && (
        <ul className="flex gap-1.5" aria-label="Màu sắc">
          {product.colors.map((c) => (
            <li
              key={c.name}
              title={c.name}
              className="size-3.5 rounded-full border border-edge"
              style={{ background: c.hex }}
            />
          ))}
        </ul>
      )}
      <Price product={product} />
      {product.rating && <RatingLine rating={product.rating} size={13} />}
      <span className="text-xs text-subtle">Đã bán {product.sold}</span>
    </Link>
  );
}

export function SectionHeading({
  title,
  href,
  linkLabel = "Xem tất cả",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4 md:mb-5">
      <h2 className="text-lg font-bold md:text-2xl md:font-extrabold">{title}</h2>
      {href && (
        <Link href={href} className="flex min-h-11 items-center text-sm font-semibold text-teal hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-[1200px] px-4 md:px-6 ${className}`}>{children}</div>;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "outline-light" | "outline-on-brand";
  className?: string;
}) {
  const styles = {
    primary: "bg-cta text-white hover:bg-cta-dark",
    outline: "border-2 border-navy text-navy hover:bg-mist",
    "outline-light": "border-2 border-white text-white hover:bg-white/10",
    "outline-on-brand": "border-2 border-navy text-navy hover:bg-white/50",
  }[variant];
  return (
    <Link
      href={href}
      className={`flex h-12 items-center justify-center rounded-lg px-6 text-[15px] font-bold transition-colors ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}

export function ProseBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl bg-ground p-4 md:p-6">
      <h2 className="mb-2 text-base font-bold md:text-lg">{title}</h2>
      <div className="text-sm text-muted md:text-[15px]">{children}</div>
    </section>
  );
}
