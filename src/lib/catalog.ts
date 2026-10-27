import "server-only";
import { asc, desc, eq, inArray } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, schema } from "@/db";
import type { Category, Color, Product } from "./types";

const { categories, products, productVariants, productImages } = schema;

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
  const [variants, images] = await Promise.all([
    db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.productId, ids))
      .orderBy(asc(productVariants.sortOrder)),
    db.select().from(productImages).where(inArray(productImages.productId, ids)).orderBy(asc(productImages.sortOrder)),
  ]);

  return rows.map(({ p, c }) => {
    const vs = variants.filter((v) => v.productId === p.id && v.isActive);
    const colors = new Map<string, Color>();
    for (const v of vs) if (v.colorName) colors.set(v.colorName, { name: v.colorName, hex: v.colorHex ?? "#cccccc" });
    const sizes = [...new Set(vs.flatMap((v) => (v.size ? [v.size] : [])))];

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
      sku: p.sku,
      colors: [...colors.values()],
      sizes,
      specs: p.specs,
      faqs: p.faqs,
      images: images.filter((i) => i.productId === p.id).map((i) => ({ id: i.id, url: i.url, alt: i.alt })),
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
