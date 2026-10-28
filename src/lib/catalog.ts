import "server-only";
import { asc, avg, count, desc, eq, inArray, and } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, schema } from "@/db";
import type { Category, Color, Product, Review } from "./types";

const { categories, products, productVariants, productImages, productReviews, siteSettings } = schema;

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");

  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  const slugById = new Map(rows.map((r) => [r.id, r.slug]));
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    title: r.title,
    href: r.href,
    description: r.description,
    seoText: r.seoText,
    parentSlug: r.parentId ? (slugById.get(r.parentId) ?? null) : null,
  }));
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");

  const rows = await db
    .select({ p: products, c: categories })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.status, "active"))
    .orderBy(desc(products.soldCount), asc(products.name));
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.p.id);
  const [variants, images, ratings] = await Promise.all([
    db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.productId, ids))
      .orderBy(asc(productVariants.sortOrder)),
    db.select().from(productImages).where(inArray(productImages.productId, ids)).orderBy(asc(productImages.sortOrder)),
    db
      .select({ productId: productReviews.productId, avg: avg(productReviews.rating), n: count() })
      .from(productReviews)
      .where(and(inArray(productReviews.productId, ids), eq(productReviews.status, "approved")))
      .groupBy(productReviews.productId),
  ]);
  const ratingByProduct = new Map(ratings.map((r) => [r.productId, { avg: Number(r.avg), count: r.n }]));

  return rows.map(({ p, c }) => {
    const vs = variants.filter((v) => v.productId === p.id && v.isActive);
    const colors = new Map<string, Color>();
    for (const v of vs) if (v.colorName) colors.set(v.colorName, { name: v.colorName, hex: v.colorHex ?? "#cccccc" });
    const sizes = [...new Set(vs.flatMap((v) => (v.size ? [v.size] : [])))];
    const firstColor = [...colors.keys()][0];

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: c.slug,
      categoryName: c.name,
      categoryHref: c.href,
      summary: p.summary,
      description: p.description,
      price: p.price,
      salePrice: p.salePrice ?? undefined,
      sold: p.soldCount,
      giftNote: p.giftNote,
      rating: ratingByProduct.get(p.id) ?? null,
      sku: p.sku,
      colors: [...colors.values()],
      sizes,
      specs: p.specs,
      faqs: p.faqs,
      // Ảnh của màu đầu tiên đứng đầu, để thẻ sản phẩm và trang chi tiết khớp với màu mặc định.
      images: images
        .filter((i) => i.productId === p.id)
        .sort((a, b) => Number(b.colorName === firstColor) - Number(a.colorName === firstColor))
        .map((i) => ({ id: i.id, url: i.url, alt: i.alt, colorName: i.colorName })),
      variants: vs.map((v) => ({
        id: v.id,
        sku: v.sku,
        colorName: v.colorName,
        colorHex: v.colorHex,
        size: v.size,
        stock: v.stock,
      })),
    };
  });
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getProductsInCategory(slug: string) {
  const cats = await getCategories();
  const slugs = new Set([slug, ...cats.filter((c) => c.parentSlug === slug).map((c) => c.slug)]);
  return (await getProducts()).filter((p) => slugs.has(p.category));
}

export async function getSaleProducts() {
  return (await getProducts()).filter((p) => p.salePrice);
}

export async function getCategory(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");

  const rows = await db
    .select()
    .from(productReviews)
    .where(and(eq(productReviews.productId, productId), eq(productReviews.status, "approved")))
    .orderBy(desc(productReviews.reviewedAt))
    .limit(50);
  return rows.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    comment: r.comment,
    images: r.images,
    source: r.source,
    reviewedAt: r.reviewedAt.toISOString(),
  }));
}

export async function getHeroBanner(): Promise<{ url: string; alt: string } | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");

  const rows = await db.select().from(siteSettings);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const url = map.get("hero_image");
  return url ? { url, alt: map.get("hero_alt") || "" } : null;
}
