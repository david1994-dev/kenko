"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/db";
import { reviewSources, reviewStatuses } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { removeImage, saveImage } from "@/lib/image-storage";

export type ReviewFormState = {
  ok?: boolean;
  message?: string;
  nonce?: string;
  // Giữ lại những gì đã nhập khi có lỗi để không phải gõ lại.
  values?: Record<string, string>;
};

const MAX_PHOTOS = 6;

const manualSources = reviewSources.filter((s) => s !== "order");

const todayVN = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

const entrySchema = z.object({
  id: z.uuid().optional(),
  productId: z.uuid("Vui lòng chọn sản phẩm."),
  rating: z.coerce.number().int().min(1, "Vui lòng chọn số sao.").max(5),
  authorName: z.string().trim().min(2, "Vui lòng nhập tên người đánh giá.").max(60, "Tên tối đa 60 ký tự."),
  comment: z.string().trim().max(1000, "Nhận xét tối đa 1000 ký tự."),
  source: z.enum(manualSources, "Vui lòng chọn nguồn của nhận xét."),
  reviewedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Vui lòng chọn ngày đánh giá."),
});

function refresh() {
  updateTag("catalog");
  revalidatePath("/admin/reviews");
}

export async function saveReview(_prev: ReviewFormState, data: FormData): Promise<ReviewFormState> {
  await requireAdmin();
  const parsed = entrySchema.safeParse({
    id: data.get("id") || undefined,
    productId: data.get("productId"),
    rating: data.get("rating") || 0,
    authorName: data.get("authorName"),
    comment: data.get("comment") ?? "",
    source: data.get("source"),
    reviewedOn: data.get("reviewedOn"),
  });
  const keptValues = Object.fromEntries(
    ["productId", "rating", "authorName", "comment", "source", "reviewedOn"].map((k) => [k, String(data.get(k) ?? "")]),
  );
  if (!parsed.success) return { message: parsed.error.issues[0].message, values: keptValues };

  const { id, reviewedOn, ...values } = parsed.data;
  if (reviewedOn > todayVN()) return { message: "Ngày đánh giá không được ở tương lai.", values: keptValues };
  const reviewedAt = new Date(`${reviewedOn}T12:00:00+07:00`);

  const files = data.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  const existing = id
    ? ((await db.select({ images: schema.productReviews.images }).from(schema.productReviews).where(eq(schema.productReviews.id, id)))[0]
        ?.images ?? [])
    : [];
  const drop = new Set(data.getAll("removeImage").map(String));
  const kept = existing.filter((u) => !drop.has(u));
  if (kept.length + files.length > MAX_PHOTOS) {
    return { message: `Mỗi đánh giá tối đa ${MAX_PHOTOS} ảnh.`, values: keptValues };
  }

  const [product] = await db
    .select({ slug: schema.products.slug })
    .from(schema.products)
    .where(eq(schema.products.id, values.productId));
  if (!product) return { message: "Không tìm thấy sản phẩm.", values: keptValues };

  const uploaded: string[] = [];
  try {
    for (const file of files) uploaded.push(await saveImage(file, product.slug, "reviews"));
  } catch (e) {
    await Promise.all(uploaded.map(removeImage));
    return { message: e instanceof Error ? e.message : "Không tải được ảnh.", values: keptValues };
  }
  const images = [...kept, ...uploaded];

  if (id) {
    await db
      .update(schema.productReviews)
      .set({ ...values, reviewedAt, images })
      .where(eq(schema.productReviews.id, id));
    await Promise.all(existing.filter((u) => drop.has(u)).map(removeImage));
  } else {
    await db.insert(schema.productReviews).values({ ...values, reviewedAt, images, status: "approved" });
  }
  refresh();
  return { ok: true, message: id ? "Đã lưu thay đổi." : "Đã thêm đánh giá.", nonce: randomUUID() };
}

export async function setReviewStatus(data: FormData) {
  await requireAdmin();
  const id = z.uuid().parse(data.get("id"));
  const status = z.enum(reviewStatuses).parse(data.get("status"));
  await db.update(schema.productReviews).set({ status }).where(eq(schema.productReviews.id, id));
  refresh();
}

export async function deleteReview(data: FormData) {
  await requireAdmin();
  const id = z.uuid().parse(data.get("id"));
  const [row] = await db.delete(schema.productReviews).where(eq(schema.productReviews.id, id)).returning({ images: schema.productReviews.images });
  await Promise.all((row?.images ?? []).map(removeImage));
  refresh();
}
