import type { Metadata } from "next";
import Image from "next/image";
import { desc, eq, asc } from "drizzle-orm";
import { AdminReviewForm } from "@/components/admin-review-form";
import { Card } from "@/components/admin-ui";
import { Stars } from "@/components/stars";
import { SubmitButton } from "@/components/submit-button";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { adminSourceLabel } from "@/lib/review-source";
import { deleteReview, setReviewStatus } from "./actions";

export const instant = false;

export const metadata: Metadata = { title: "Đánh giá" };

const label = { pending: "Chờ duyệt", approved: "Đang hiện", hidden: "Đã ẩn" } as const;
const style = {
  pending: "bg-[#fff1c2] text-[#6b4a00]",
  approved: "bg-[#dcf3e2] text-[#14532d]",
  hidden: "bg-[#ece6dc] text-[#4a3f33]",
} as const;

const dateVN = (d: Date) => d.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

export default async function Page() {
  await requireAdmin();
  const { productReviews, products } = schema;
  const today = dateVN(new Date());

  const [rows, productList] = await Promise.all([
    db
      .select({
        id: productReviews.id,
        productId: productReviews.productId,
        rating: productReviews.rating,
        comment: productReviews.comment,
        images: productReviews.images,
        status: productReviews.status,
        source: productReviews.source,
        author: productReviews.authorName,
        reviewedAt: productReviews.reviewedAt,
        product: products.name,
      })
      .from(productReviews)
      .innerJoin(products, eq(productReviews.productId, products.id))
      .orderBy(desc(productReviews.reviewedAt))
      .limit(200),
    db.select({ id: products.id, name: products.name }).from(products).orderBy(asc(products.name)),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Đánh giá</h1>

      <Card title="Thêm đánh giá">
        <p className="mb-3 rounded-lg bg-mist p-3 text-sm text-muted">
          Chỉ nhập nhận xét thật mà khách đã gửi cho shop. Chọn đúng nguồn khách gửi, nguồn sẽ hiện công khai dưới
          mỗi nhận xét. Ngày đánh giá là ngày khách gửi nhận xét, không được ở tương lai.
        </p>
        <AdminReviewForm products={productList} today={today} />
      </Card>

      <h2 className="pt-2 text-lg font-bold">Tất cả đánh giá ({rows.length})</h2>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl bg-white p-4 ring-1 ring-line">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${style[r.status]}`}>{label[r.status]}</span>
              <Stars value={r.rating} size={16} />
              <span className="text-sm font-semibold">{r.product}</span>
            </div>
            <div className="mt-1 text-xs text-subtle">
              {r.author} · {dateVN(r.reviewedAt).split("-").reverse().join("/")} · {adminSourceLabel(r.source)}
            </div>
            {r.comment && <p className="mt-2 whitespace-pre-line text-sm">{r.comment}</p>}
            {r.images.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {r.images.map((url) => (
                  <li key={url} className="relative size-16 overflow-hidden rounded-lg bg-mist">
                    <Image src={url} alt="" fill sizes="64px" className="object-cover" />
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {r.status !== "approved" && (
                <form action={setReviewStatus}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="approved" />
                  <SubmitButton pendingLabel="Đang lưu…" className="h-10 rounded-lg bg-cta px-4 text-sm font-bold text-white">
                    Hiện ra ngoài
                  </SubmitButton>
                </form>
              )}
              {r.status !== "hidden" && (
                <form action={setReviewStatus}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="hidden" />
                  <SubmitButton pendingLabel="Đang lưu…" className="h-10 rounded-lg border border-edge px-4 text-sm font-semibold">
                    Ẩn
                  </SubmitButton>
                </form>
              )}
              {r.source !== "order" && (
                <details className="w-full">
                  <summary className="flex h-10 w-fit cursor-pointer items-center rounded-lg border border-edge px-4 text-sm font-semibold text-navy">
                    Sửa
                  </summary>
                  <div className="mt-3 rounded-lg bg-ground p-3">
                    <AdminReviewForm
                      products={productList}
                      today={today}
                      values={{
                        id: r.id,
                        productId: r.productId,
                        rating: r.rating,
                        authorName: r.author,
                        comment: r.comment,
                        source: r.source,
                        reviewedOn: dateVN(r.reviewedAt),
                        images: r.images,
                      }}
                    />
                  </div>
                </details>
              )}
              <details>
                <summary className="flex h-10 w-fit cursor-pointer items-center rounded-lg border border-edge px-4 text-sm font-semibold text-price">
                  Xoá
                </summary>
                <form action={deleteReview} className="mt-2">
                  <input type="hidden" name="id" value={r.id} />
                  <SubmitButton pendingLabel="Đang xoá…" className="h-10 rounded-lg bg-price px-4 text-sm font-bold text-white">
                    Xác nhận xoá đánh giá này
                  </SubmitButton>
                </form>
              </details>
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
