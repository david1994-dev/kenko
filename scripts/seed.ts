import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { categories as seedCategories, products as seedProducts } from "../src/db/seed-data";
import * as schema from "../src/db/schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const client = postgres(url, { max: 1 });
const db = drizzle(client, { schema });

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function main() {
  const categoryIds = new Map<string, number>();

  for (const [i, c] of seedCategories.entries()) {
    const parentId = c.parent ? categoryIds.get(c.parent) : undefined;
    const [row] = await db
      .insert(schema.categories)
      .values({
        slug: c.id,
        name: c.name,
        title: c.title,
        href: c.href,
        description: c.description,
        seoText: c.seoText,
        parentId: parentId ?? null,
        sortOrder: i,
      })
      .onConflictDoUpdate({
        target: schema.categories.slug,
        set: { name: c.name, title: c.title, href: c.href, description: c.description, parentId: parentId ?? null },
      })
      .returning({ id: schema.categories.id });
    categoryIds.set(c.id, row.id);
  }

  for (const p of seedProducts) {
    const [product] = await db
      .insert(schema.products)
      .values({
        slug: p.slug,
        name: p.name,
        categoryId: categoryIds.get(p.category)!,
        summary: p.summary,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice ?? null,
        soldCount: p.sold,
        sku: p.sku,
        specs: p.specs,
        faqs: p.faqs,
      })
      .onConflictDoNothing({ target: schema.products.slug })
      .returning({ id: schema.products.id });

    // Sản phẩm đã có thì giữ nguyên chỉnh sửa trong trang quản trị.
    if (!product) continue;

    const colors = p.colors.length ? p.colors : [null];
    const sizes = p.sizes.length ? p.sizes : [null];
    const variants = colors.flatMap((color) =>
      sizes.map((size) => ({
        productId: product.id,
        sku: [p.sku, color && slugify(color.name), size].filter(Boolean).join("-"),
        colorName: color?.name ?? null,
        colorHex: color?.hex ?? null,
        size,
      })),
    );
    await db.insert(schema.productVariants).values(variants.map((v, i) => ({ ...v, sortOrder: i })));
  }

  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(schema.products);
  console.log(`Seed xong: ${seedCategories.length} danh mục, ${n} sản phẩm.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => client.end());
