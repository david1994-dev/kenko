"use server";

import { and, eq, like, min, sql } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, schema } from "@/db";
import { productStatuses } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { removeImage, saveImage } from "@/lib/image-storage";
import { slugify } from "@/lib/slug";

const { products, productVariants, productImages } = schema;

export type FormState = { ok?: boolean; message?: string };

const intOrNull = (v: unknown) => {
  const s = String(v ?? "").trim();
  return s === "" ? null : Number(s);
};

const productSchema = z
  .object({
    id: z.uuid(),
    name: z.string().trim().min(2, "Tên sản phẩm quá ngắn.").max(200),
    sku: z.string().trim().max(60),
    summary: z.string().trim().max(500),
    description: z.string().trim().max(10000),
    price: z.number().int("Giá phải là số nguyên.").min(0, "Giá không hợp lệ."),
    salePrice: z.number().int().min(0).nullable(),
    soldCount: z.number().int("Số đã bán phải là số nguyên.").min(0, "Số đã bán không hợp lệ."),
    giftNote: z.string().trim().max(500, "Quà tặng tối đa 500 ký tự."),
    status: z.enum(productStatuses),
  })
  .refine((v) => v.salePrice === null || v.salePrice < v.price, {
    path: ["salePrice"],
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc.",
  });

function touchCatalog(productId: string) {
  updateTag("catalog");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/admin/products");
}

export async function updateProduct(_prev: FormState, data: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = productSchema.safeParse({
    id: data.get("id"),
    name: data.get("name"),
    sku: data.get("sku") ?? "",
    summary: data.get("summary") ?? "",
    description: data.get("description") ?? "",
    price: Number(data.get("price")),
    salePrice: intOrNull(data.get("salePrice")),
    soldCount: Number(data.get("soldCount") || 0),
    giftNote: data.get("giftNote") ?? "",
    status: data.get("status"),
  });
  if (!parsed.success) return { message: parsed.error.issues[0].message };

  const { id, ...values } = parsed.data;
  await db.update(products).set({ ...values, updatedAt: new Date() }).where(eq(products.id, id));
  touchCatalog(id);
  return { ok: true, message: "Đã lưu." };
}

export async function updateVariants(data: FormData) {
  await requireAdmin();
  const productId = z.uuid().parse(data.get("productId"));

  const rows = await db
    .select({ id: productVariants.id })
    .from(productVariants)
    .where(eq(productVariants.productId, productId));

  await db.transaction(async (tx) => {
    for (const { id } of rows) {
      const stock = intOrNull(data.get(`stock-${id}`));
      if (stock !== null && (!Number.isInteger(stock) || stock < 0)) continue;
      await tx
        .update(productVariants)
        .set({ stock, isActive: data.get(`active-${id}`) === "on" })
        .where(eq(productVariants.id, id));
    }
  });
  touchCatalog(productId);
}

export async function uploadImages(_prev: FormState, data: FormData): Promise<FormState> {
  await requireAdmin();
  const productId = z.uuid().parse(data.get("productId"));
  const files = data.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { message: "Chưa chọn ảnh." };

  const [product] = await db.select({ slug: products.slug, name: products.name }).from(products).where(eq(products.id, productId));
  if (!product) return { message: "Không tìm thấy sản phẩm." };

  const [{ next }] = await db
    .select({ next: sql<number>`coalesce(max(${productImages.sortOrder}), -1) + 1` })
    .from(productImages)
    .where(eq(productImages.productId, productId));

  let order = next;
  try {
    for (const file of files) {
      const url = await saveImage(file, product.slug);
      await db.insert(productImages).values({ productId, url, alt: product.name, sortOrder: order++ });
    }
  } catch (e) {
    touchCatalog(productId);
    return { message: e instanceof Error ? e.message : "Không tải được ảnh." };
  }

  touchCatalog(productId);
  return { ok: true, message: `Đã tải lên ${files.length} ảnh.` };
}

export async function deleteImage(data: FormData) {
  await requireAdmin();
  const imageId = z.uuid().parse(data.get("imageId"));
  const [img] = await db.delete(productImages).where(eq(productImages.id, imageId)).returning();
  if (!img) return;
  await removeImage(img.url);
  touchCatalog(img.productId);
}

export async function makeCover(data: FormData) {
  await requireAdmin();
  const imageId = z.uuid().parse(data.get("imageId"));
  const [img] = await db.select().from(productImages).where(eq(productImages.id, imageId));
  if (!img) return;

  const [{ first }] = await db
    .select({ first: min(productImages.sortOrder) })
    .from(productImages)
    .where(and(eq(productImages.productId, img.productId)));
  await db
    .update(productImages)
    .set({ sortOrder: (first ?? 0) - 1 })
    .where(eq(productImages.id, imageId));
  touchCatalog(img.productId);
}

const createSchema = z
  .object({
    name: z.string().trim().min(2, "Tên sản phẩm quá ngắn.").max(200, "Tên sản phẩm tối đa 200 ký tự."),
    categoryId: z.coerce.number().int("Vui lòng chọn danh mục.").positive("Vui lòng chọn danh mục."),
    sku: z.string().trim().max(40),
    summary: z.string().trim().max(500),
    description: z.string().trim().max(10000),
    giftNote: z.string().trim().max(500),
    price: z.number().int("Giá phải là số nguyên.").min(1, "Vui lòng nhập giá gốc."),
    salePrice: z.number().int().min(0).nullable(),
    soldCount: z.number().int().min(0, "Số đã bán không hợp lệ."),
    status: z.enum(productStatuses),
  })
  .refine((v) => v.salePrice === null || v.salePrice < v.price, {
    path: ["salePrice"],
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc.",
  });

const HEX = /^#[0-9a-f]{6}$/i;
const MAX_OPTIONS = 12;

export async function createProduct(_prev: FormState, data: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = createSchema.safeParse({
    name: data.get("name"),
    categoryId: data.get("categoryId"),
    sku: data.get("sku") ?? "",
    summary: data.get("summary") ?? "",
    description: data.get("description") ?? "",
    giftNote: data.get("giftNote") ?? "",
    price: Number(data.get("price")),
    salePrice: intOrNull(data.get("salePrice")),
    soldCount: Number(data.get("soldCount") || 0),
    status: data.get("status"),
  });
  if (!parsed.success) return { message: parsed.error.issues[0].message };

  const names = data.getAll("colorName").map((v) => String(v).trim());
  const hexes = data.getAll("colorHex").map(String);
  const colors: { name: string; hex: string }[] = [];
  names.forEach((name, i) => {
    if (!name || colors.some((c) => c.name.toLowerCase() === name.toLowerCase())) return;
    colors.push({ name: name.slice(0, 40), hex: HEX.test(hexes[i] ?? "") ? hexes[i] : "#cccccc" });
  });

  const sizes = [
    ...new Set(
      [...data.getAll("size").map(String), ...String(data.get("sizeExtra") ?? "").split(",")]
        .map((s) => s.trim().toUpperCase().slice(0, 12))
        .filter(Boolean),
    ),
  ];
  if (colors.length > MAX_OPTIONS || sizes.length > MAX_OPTIONS) {
    return { message: `Tối đa ${MAX_OPTIONS} màu và ${MAX_OPTIONS} size cho mỗi sản phẩm.` };
  }

  const { categoryId, ...values } = parsed.data;
  const [category] = await db.select({ id: schema.categories.id }).from(schema.categories).where(eq(schema.categories.id, categoryId));
  if (!category) return { message: "Danh mục không tồn tại." };

  const base = slugify(values.name) || "san-pham";
  const taken = new Set(
    (await db.select({ slug: products.slug }).from(products).where(like(products.slug, `${base}%`))).map((r) => r.slug),
  );
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

  const sku = values.sku || `KK-${slug.slice(0, 12).toUpperCase()}`;
  const colorOptions = colors.length ? colors : [null];
  const sizeOptions = sizes.length ? sizes : [null];

  let id: string;
  try {
    id = await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values({ ...values, sku, slug, categoryId, soldCount: values.soldCount })
        .returning({ id: products.id });
      await tx.insert(productVariants).values(
        colorOptions.flatMap((color, ci) =>
          sizeOptions.map((size, si) => ({
            productId: product.id,
            sku: [sku, color && slugify(color.name), size && slugify(size)].filter(Boolean).join("-"),
            colorName: color?.name ?? null,
            colorHex: color?.hex ?? null,
            size,
            sortOrder: ci * sizeOptions.length + si,
          })),
        ),
      );
      return product.id;
    });
  } catch (e) {
    const code = (e as { code?: string; cause?: { code?: string } })?.code ?? (e as { cause?: { code?: string } })?.cause?.code;
    if (code === "23505") return { message: "Mã sản phẩm đã tồn tại. Vui lòng nhập mã khác." };
    console.error(e);
    return { message: "Không tạo được sản phẩm. Vui lòng thử lại." };
  }

  updateTag("catalog");
  revalidatePath("/admin/products");
  redirect(`/admin/products/${id}?created=1`);
}
