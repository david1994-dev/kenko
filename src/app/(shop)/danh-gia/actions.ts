"use server";

import { z } from "zod";
import { findReviewableOrder, ReviewError, saveReviews, type ReviewableItem } from "@/lib/reviews";

export type LookupState = {
  message?: string;
  code?: string;
  phone?: string;
  items?: ReviewableItem[];
};

export type SubmitState = { message?: string; done?: boolean };

const text = (d: FormData, k: string) => String(d.get(k) ?? "");

export async function lookupOrder(_prev: LookupState, data: FormData): Promise<LookupState> {
  const code = text(data, "code");
  const phone = text(data, "phone");
  try {
    const found = await findReviewableOrder(code, phone);
    return { code, phone, items: found.items };
  } catch (e) {
    if (e instanceof ReviewError) return { message: e.message, code, phone };
    console.error(e);
    return { message: "Không tra cứu được đơn hàng. Vui lòng thử lại.", code, phone };
  }
}

const entrySchema = z.object({
  productId: z.uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(500),
});

export async function submitReviews(_prev: SubmitState, data: FormData): Promise<SubmitState> {
  try {
    const found = await findReviewableOrder(text(data, "code"), text(data, "phone"));
    const entries = found.items
      .filter((i) => !i.reviewed && data.get(`rating-${i.productId}`))
      .map((i) =>
        entrySchema.parse({
          productId: i.productId,
          rating: Number(data.get(`rating-${i.productId}`)),
          comment: text(data, `comment-${i.productId}`),
        }),
      );
    if (entries.length === 0) return { message: "Vui lòng chọn số sao cho ít nhất một sản phẩm." };
    await saveReviews(found.orderId, found.authorName, entries);
    return { done: true };
  } catch (e) {
    if (e instanceof ReviewError) return { message: e.message };
    if (e instanceof z.ZodError) return { message: "Đánh giá chưa hợp lệ. Vui lòng kiểm tra lại." };
    console.error(e);
    return { message: "Không gửi được đánh giá. Vui lòng thử lại." };
  }
}
