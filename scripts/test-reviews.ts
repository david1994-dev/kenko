// Dữ liệu thử nghiệm: đơn "KK-TEST…" đã giao kèm đánh giá đã duyệt, để xem giao diện sao.
// Chạy: npm run db:test-reviews        (thêm)
//       npm run db:test-reviews:remove (xoá sạch)
import { eq, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

// Không cho chạy nhầm lên database thật của cửa hàng.
const host = new URL(url).hostname;
if (!["localhost", "127.0.0.1"].includes(host) && process.env.ALLOW_TEST_DATA !== "1") {
  console.error(`Từ chối: ${host} không phải database trên máy. Đặt ALLOW_TEST_DATA=1 nếu bạn chắc chắn.`);
  process.exit(1);
}

const client = postgres(url, { max: 1 });
const db = drizzle(client, { schema });
const { customers, orders, orderItems, productReviews, products, productVariants } = schema;

const PHONE = "0900000000";
const samples = [
  { rating: 5, comment: "Đánh giá thử nghiệm: áo mát, vừa size." },
  { rating: 4, comment: "Đánh giá thử nghiệm: giao nhanh, đóng gói kỹ." },
  { rating: 5, comment: "Đánh giá thử nghiệm: đúng mô tả." },
  { rating: 3, comment: "Đánh giá thử nghiệm: tạm ổn, pin hơi nhanh hết." },
  { rating: 5, comment: "" },
];

async function remove() {
  const deleted = await db.delete(orders).where(like(orders.code, "KK-TEST%")).returning({ id: orders.id });
  await db.delete(customers).where(eq(customers.phone, PHONE));
  console.log(`Đã xoá ${deleted.length} đơn thử nghiệm và các đánh giá kèm theo.`);
}

async function add() {
  await remove();
  const [customer] = await db
    .insert(customers)
    .values({ fullName: "Khách Thử Nghiệm", phone: PHONE })
    .returning({ id: customers.id });

  const list = await db
    .select({ id: products.id, name: products.name, variantId: sql<string>`(select id from ${productVariants} where ${productVariants.productId} = ${products.id} limit 1)` })
    .from(products)
    .where(eq(products.status, "active"));

  let n = 0;
  let total = 0;
  for (const [pi, p] of list.entries()) {
    // Sản phẩm đầu: 5 đánh giá, sản phẩm sau ít dần; vài sản phẩm để trống cho đối chiếu.
    const count = [5, 4, 3, 2, 1][pi] ?? 0;
    for (let i = 0; i < count; i++) {
      const s = samples[(i + pi) % samples.length];
      const [order] = await db
        .insert(orders)
        .values({
          code: `KK-TEST${String(++n).padStart(2, "0")}`,
          customerId: customer.id,
          status: "delivered",
          subtotal: 0,
          total: 0,
          shipName: "Khách Thử Nghiệm",
          shipPhone: PHONE,
          shipAddress: "Địa chỉ thử nghiệm",
        })
        .returning({ id: orders.id });
      await db.insert(orderItems).values({
        orderId: order.id,
        variantId: p.variantId,
        productName: p.name,
        unitPrice: 0,
        quantity: 1,
        lineTotal: 0,
      });
      await db.insert(productReviews).values({
        productId: p.id,
        orderId: order.id,
        authorName: "Khách Thử Nghiệm",
        rating: s.rating,
        comment: s.comment,
        status: "approved",
      });
      total++;
    }
  }
  console.log(`Đã thêm ${total} đánh giá thử nghiệm cho ${Math.min(list.length, 5)} sản phẩm.`);
}

(process.argv.includes("--remove") ? remove() : add())
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => client.end());
