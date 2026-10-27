import "server-only";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";

const { orders, orderItems, productVariants, products, productReviews } = schema;

export class ReviewError extends Error {}

export function normalizePhone(v: string) {
  return v.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0");
}

export type ReviewableItem = { productId: string; name: string; variantLabel: string; reviewed: boolean };

// Chỉ đơn đã giao mới được đánh giá; mã đơn và số điện thoại phải khớp.
export async function findReviewableOrder(code: string, phone: string) {
  const [order] = await db
    .select({ id: orders.id, status: orders.status, shipName: orders.shipName })
    .from(orders)
    .where(and(eq(orders.code, code.trim().toUpperCase()), eq(orders.shipPhone, normalizePhone(phone))));
  if (!order) throw new ReviewError("Không tìm thấy đơn hàng với mã và số điện thoại này.");
  if (order.status !== "delivered") {
    throw new ReviewError("Đơn hàng chưa được xác nhận là đã giao. Bạn có thể đánh giá sau khi nhận hàng.");
  }

  const rows = await db
    .select({
      productId: products.id,
      name: products.name,
      variantLabel: orderItems.variantLabel,
    })
    .from(orderItems)
    .innerJoin(productVariants, eq(orderItems.variantId, productVariants.id))
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(eq(orderItems.orderId, order.id));

  const done = await db
    .select({ productId: productReviews.productId })
    .from(productReviews)
    .where(eq(productReviews.orderId, order.id));
  const reviewed = new Set(done.map((d) => d.productId));

  const seen = new Set<string>();
  const items: ReviewableItem[] = [];
  for (const r of rows) {
    if (seen.has(r.productId)) continue;
    seen.add(r.productId);
    items.push({ ...r, reviewed: reviewed.has(r.productId) });
  }
  return { orderId: order.id, authorName: order.shipName, items };
}

export async function saveReviews(
  orderId: string,
  authorName: string,
  entries: { productId: string; rating: number; comment: string }[],
) {
  if (entries.length === 0) return 0;
  const inserted = await db
    .insert(productReviews)
    .values(entries.map((e) => ({ ...e, orderId, authorName })))
    .onConflictDoNothing()
    .returning({ id: productReviews.id });
  return inserted.length;
}
