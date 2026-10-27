import "server-only";
import { randomInt } from "node:crypto";
import { and, count, eq, gte, inArray, sql } from "drizzle-orm";
import { db, schema } from "@/db";

const { customers, orders, orderItems, orderStatusHistory, productVariants, products } = schema;

export class OrderError extends Error {}

export type OrderInput = {
  name: string;
  phone: string;
  province: string;
  district: string;
  address: string;
  note: string;
  items: { variantId: string; qty: number }[];
};

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode() {
  let s = "";
  for (let i = 0; i < 6; i++) s += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return `KK-${s}`;
}

const MAX_ORDERS_PER_PHONE = 3;
const WINDOW_MINUTES = 10;

export async function createOrder(input: OrderInput) {
  const merged = new Map<string, number>();
  for (const i of input.items) merged.set(i.variantId, (merged.get(i.variantId) ?? 0) + i.qty);
  const ids = [...merged.keys()];

  return db.transaction(async (tx) => {
    const recent = await tx
      .select({ n: count() })
      .from(orders)
      .where(
        and(
          eq(orders.shipPhone, input.phone),
          gte(orders.createdAt, sql`now() - make_interval(mins => ${WINDOW_MINUTES})`),
        ),
      );
    if ((recent[0]?.n ?? 0) >= MAX_ORDERS_PER_PHONE) {
      throw new OrderError("Bạn đã đặt nhiều đơn trong thời gian ngắn. Vui lòng gọi hotline để được hỗ trợ.");
    }

    // Giá luôn lấy từ database, không tin giá do trình duyệt gửi lên.
    const rows = await tx
      .select({
        id: productVariants.id,
        sku: productVariants.sku,
        colorName: productVariants.colorName,
        size: productVariants.size,
        stock: productVariants.stock,
        productName: products.name,
        price: products.price,
        salePrice: products.salePrice,
      })
      .from(productVariants)
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(
        and(inArray(productVariants.id, ids), eq(productVariants.isActive, true), eq(products.status, "active")),
      );

    if (rows.length !== ids.length) {
      throw new OrderError("Có sản phẩm không còn bán. Vui lòng xoá khỏi giỏ và thêm lại.");
    }

    const lines = rows.map((r) => {
      const quantity = merged.get(r.id)!;
      const unitPrice = r.salePrice ?? r.price;
      return {
        variantId: r.id,
        sku: r.sku,
        productName: r.productName,
        variantLabel: [r.colorName, r.size && `Size ${r.size}`].filter(Boolean).join(" · "),
        stock: r.stock,
        quantity,
        unitPrice,
        lineTotal: unitPrice * quantity,
      };
    });

    for (const l of lines) {
      if (l.stock === null) continue;
      const updated = await tx
        .update(productVariants)
        .set({ stock: sql`${productVariants.stock} - ${l.quantity}` })
        .where(and(eq(productVariants.id, l.variantId), gte(productVariants.stock, l.quantity)))
        .returning({ id: productVariants.id });
      if (updated.length === 0) {
        throw new OrderError(`"${l.productName}" không đủ hàng. Vui lòng giảm số lượng.`);
      }
    }

    const [customer] = await tx
      .insert(customers)
      .values({ fullName: input.name, phone: input.phone, lastOrderAt: new Date() })
      .onConflictDoUpdate({
        target: customers.phone,
        set: { fullName: input.name, lastOrderAt: new Date() },
      })
      .returning({ id: customers.id });

    const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    let order: { id: string; code: string } | undefined;
    for (let attempt = 0; attempt < 5 && !order; attempt++) {
      [order] = await tx
        .insert(orders)
        .values({
          code: makeCode(),
          customerId: customer.id,
          paymentMethod: "cod",
          subtotal,
          shippingFee: 0,
          total: subtotal,
          shipName: input.name,
          shipPhone: input.phone,
          shipProvince: input.province,
          shipDistrict: input.district,
          shipAddress: input.address,
          note: input.note,
        })
        .onConflictDoNothing({ target: orders.code })
        .returning({ id: orders.id, code: orders.code });
    }
    if (!order) throw new Error("Could not allocate an order code");

    await tx.insert(orderItems).values(
      lines.map((l) => ({
        orderId: order.id,
        variantId: l.variantId,
        productName: l.productName,
        variantLabel: l.variantLabel,
        sku: l.sku,
        unitPrice: l.unitPrice,
        quantity: l.quantity,
        lineTotal: l.lineTotal,
      })),
    );
    await tx.insert(orderStatusHistory).values({ orderId: order.id, fromStatus: null, toStatus: "new" });

    return { code: order.code, touchedStock: lines.some((l) => l.stock !== null) };
  });
}
