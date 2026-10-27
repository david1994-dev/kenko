"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { statusLabel, type StatusKey } from "@/lib/order-status";

const { orders, orderItems, orderStatusHistory, productVariants } = schema;

const isFinal = (s: string) => s === "cancelled" || s === "returned";

export async function updateOrderStatus(data: FormData) {
  await requireAdmin();

  const id = String(data.get("orderId") ?? "");
  const next = String(data.get("status") ?? "");
  const note = String(data.get("note") ?? "").trim().slice(0, 500);
  if (!(next in statusLabel)) return;

  let restocked = false;
  await db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(eq(orders.id, id)).for("update");
    if (!order || order.status === next || isFinal(order.status)) return;

    await tx.update(orders).set({ status: next as StatusKey, updatedAt: new Date() }).where(eq(orders.id, id));
    await tx
      .insert(orderStatusHistory)
      .values({ orderId: id, fromStatus: order.status, toStatus: next as StatusKey, note });

    if (isFinal(next)) {
      // Huỷ hoặc hoàn: trả lại tồn kho cho những phân loại có theo dõi kho.
      const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, id));
      for (const it of items) {
        if (!it.variantId) continue;
        const res = await tx
          .update(productVariants)
          .set({ stock: sql`${productVariants.stock} + ${it.quantity}` })
          .where(and(eq(productVariants.id, it.variantId), sql`${productVariants.stock} is not null`))
          .returning({ id: productVariants.id });
        if (res.length) restocked = true;
      }
    }
  });

  if (restocked) updateTag("catalog");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}
