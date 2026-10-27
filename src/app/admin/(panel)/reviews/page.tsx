import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { SubmitButton } from "@/components/submit-button";
import { Stars } from "@/components/stars";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { formatDateTime } from "@/lib/order-status";
import { setReviewStatus } from "./actions";

export const instant = false;

export const metadata: Metadata = { title: "Đánh giá" };

const label = { pending: "Chờ duyệt", approved: "Đang hiện", hidden: "Đã ẩn" } as const;
const style = {
  pending: "bg-[#fff1c2] text-[#6b4a00]",
  approved: "bg-[#dcf3e2] text-[#14532d]",
  hidden: "bg-[#ece6dc] text-[#4a3f33]",
} as const;

export default async function Page() {
  await requireAdmin();
  const { productReviews, products, orders } = schema;

  const rows = await db
    .select({
      id: productReviews.id,
      rating: productReviews.rating,
      comment: productReviews.comment,
      status: productReviews.status,
      author: productReviews.authorName,
      createdAt: productReviews.createdAt,
      product: products.name,
      code: orders.code,
    })
    .from(productReviews)
    .innerJoin(products, eq(productReviews.productId, products.id))
    .innerJoin(orders, eq(productReviews.orderId, orders.id))
    .orderBy(desc(productReviews.createdAt))
    .limit(200);

  const order = { pending: 0, approved: 1, hidden: 2 } as const;
  rows.sort((a, b) => order[a.status] - order[b.status]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold">Đánh giá</h1>
        <p className="text-sm text-subtle">
          Chỉ khách đã nhận hàng (đơn ở trạng thái Đã giao) mới gửi được đánh giá. Đánh giá chỉ hiện ra ngoài sau khi bạn duyệt.
        </p>
      </div>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl bg-white p-4 ring-1 ring-line">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${style[r.status]}`}>{label[r.status]}</span>
              <Stars value={r.rating} size={16} />
              <span className="text-sm font-semibold">{r.product}</span>
            </div>
            <div className="mt-1 text-xs text-subtle">
              {r.author} · đơn {r.code} · {formatDateTime(r.createdAt)}
            </div>
            {r.comment && <p className="mt-2 whitespace-pre-line text-sm">{r.comment}</p>}
            <div className="mt-3 flex gap-2">
              {r.status !== "approved" && (
                <form action={setReviewStatus}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="approved" />
                  <SubmitButton pendingLabel="Đang lưu…" className="h-10 rounded-lg bg-cta px-4 text-sm font-bold text-white">
                    Duyệt, hiện ra ngoài
                  </SubmitButton>
                </form>
              )}
              {r.status !== "hidden" && (
                <form action={setReviewStatus}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="hidden" />
                  <SubmitButton
                    pendingLabel="Đang lưu…"
                    className="h-10 rounded-lg border border-edge px-4 text-sm font-semibold text-price"
                  >
                    Ẩn
                  </SubmitButton>
                </form>
              )}
            </div>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="rounded-xl bg-white p-8 text-center text-subtle ring-1 ring-line">Chưa có đánh giá.</li>
        )}
      </ul>
    </div>
  );
}
