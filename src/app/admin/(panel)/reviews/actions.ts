"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/db";
import { reviewSources, reviewStatuses } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export type ReviewFormState = {
  ok?: boolean;
  message?: string;
  nonce?: string;
  // Giữ lại những gì đã nhập khi có lỗi để không phải gõ lại.
  values?: Record<string, string>;
};

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
  const kept = Object.fromEntries(
    ["productId", "rating", "authorName", "comment", "source", "reviewedOn"].map((k) => [k, String(data.get(k) ?? "")]),
  );
  if (!parsed.success) return { message: parsed.error.issues[0].message, values: kept };

  const { id, reviewedOn, ...values } = parsed.data;
  if (reviewedOn > todayVN()) return { message: "Ngày đánh giá không được ở tương lai.", values: kept };
  const reviewedAt = new Date(`${reviewedOn}T12:00:00+07:00`);

  if (id) {
    await db
      .update(schema.productReviews)
      .set({ ...values, reviewedAt })
      .where(eq(schema.productReviews.id, id));
  } else {
    await db.insert(schema.productReviews).values({ ...values, reviewedAt, status: "approved" });
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
  await db.delete(schema.productReviews).where(eq(schema.productReviews.id, id));
  refresh();
}
