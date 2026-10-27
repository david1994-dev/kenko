import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, desc, eq } from "drizzle-orm";
import { Card, StatusBadge } from "@/components/admin-ui";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/format";
import { formatDateTime, statusLabel, type StatusKey } from "@/lib/order-status";
import { updateOrderStatus } from "../actions";

export const metadata: Metadata = { title: "Chi tiết đơn hàng" };

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function Page({ params }: PageProps<"/admin/orders/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!uuid.test(id)) notFound();

  const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
  if (!order) notFound();

  const [items, history] = await Promise.all([
    db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, id)).orderBy(asc(schema.orderItems.productName)),
    db
      .select()
      .from(schema.orderStatusHistory)
      .where(eq(schema.orderStatusHistory.orderId, id))
      .orderBy(desc(schema.orderStatusHistory.createdAt)),
  ]);

  const final = order.status === "cancelled" || order.status === "returned";

  return (
    <div className="space-y-4">
      <Link href="/admin/orders" className="text-sm font-semibold text-navy underline">
        ← Danh sách đơn
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold">Đơn {order.code}</h1>
        <StatusBadge status={order.status} />
        <span className="text-sm text-subtle">{formatDateTime(order.createdAt)}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Khách hàng">
          <dl className="space-y-1 text-sm">
            <div><dt className="inline text-subtle">Họ tên: </dt><dd className="inline font-semibold">{order.shipName}</dd></div>
            <div>
              <dt className="inline text-subtle">Điện thoại: </dt>
              <dd className="inline font-semibold">
                <a href={`tel:${order.shipPhone}`} className="text-navy underline">{order.shipPhone}</a>
              </dd>
            </div>
            <div>
              <dt className="inline text-subtle">Địa chỉ: </dt>
              <dd className="inline">
                {[order.shipAddress, order.shipDistrict, order.shipProvince].filter(Boolean).join(", ")}
              </dd>
            </div>
            {order.note && (
              <div><dt className="inline text-subtle">Ghi chú: </dt><dd className="inline">{order.note}</dd></div>
            )}
            <div><dt className="inline text-subtle">Thanh toán: </dt><dd className="inline">COD (khi nhận hàng)</dd></div>
          </dl>
        </Card>

        <Card title="Cập nhật trạng thái">
          {final ? (
            <p className="text-sm text-muted">Đơn đã {statusLabel[order.status as StatusKey].toLowerCase()}, không đổi được nữa.</p>
          ) : (
            <form action={updateOrderStatus} className="flex flex-col gap-3">
              <input type="hidden" name="orderId" value={order.id} />
              <div>
                <label htmlFor="status" className="mb-1 block text-sm font-semibold">Trạng thái</label>
                <select
                  id="status"
                  name="status"
                  defaultValue={order.status}
                  className="h-12 w-full rounded-lg border border-edge bg-white px-3 text-base"
                >
                  {(Object.keys(statusLabel) as StatusKey[]).map((k) => (
                    <option key={k} value={k}>{statusLabel[k]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="note" className="mb-1 block text-sm font-semibold">Ghi chú nội bộ</label>
                <input
                  id="note"
                  name="note"
                  maxLength={500}
                  className="h-12 w-full rounded-lg border border-edge px-3 text-base"
                />
              </div>
              <button type="submit" className="h-12 rounded-lg bg-cta font-bold text-white hover:bg-cta-dark">
                Lưu trạng thái
              </button>
              <p className="text-xs text-subtle">Huỷ hoặc hoàn trả sẽ cộng lại tồn kho và không đổi lại được.</p>
            </form>
          )}
        </Card>
      </div>

      <Card title="Sản phẩm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-subtle">
              <tr>
                <th className="py-2">Sản phẩm</th>
                <th className="py-2 text-right">Đơn giá</th>
                <th className="py-2 text-right">SL</th>
                <th className="py-2 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t border-line">
                  <td className="py-2.5">
                    <div className="font-semibold">{it.productName}</div>
                    <div className="text-xs text-subtle">{[it.variantLabel, it.sku].filter(Boolean).join(" · ")}</div>
                  </td>
                  <td className="py-2.5 text-right">{formatPrice(it.unitPrice)}</td>
                  <td className="py-2.5 text-right">{it.quantity}</td>
                  <td className="py-2.5 text-right font-semibold">{formatPrice(it.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-line">
                <td colSpan={3} className="py-2 text-right text-muted">Tạm tính</td>
                <td className="py-2 text-right">{formatPrice(order.subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="py-1 text-right text-muted">Phí vận chuyển</td>
                <td className="py-1 text-right">{formatPrice(order.shippingFee)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="py-2 text-right font-bold">Tổng cộng</td>
                <td className="py-2 text-right text-lg font-extrabold text-price">{formatPrice(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <Card title="Lịch sử trạng thái">
        <ol className="space-y-2 text-sm">
          {history.map((h) => (
            <li key={h.id} className="flex flex-wrap items-center gap-2">
              <span className="text-subtle">{formatDateTime(h.createdAt)}</span>
              {h.fromStatus && (
                <>
                  <StatusBadge status={h.fromStatus} />
                  <span aria-hidden="true">→</span>
                </>
              )}
              <StatusBadge status={h.toStatus} />
              {h.note && <span className="text-muted">· {h.note}</span>}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
