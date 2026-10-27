import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { StatusBadge } from "@/components/admin-ui";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/format";
import { formatDateTime, statusLabel, type StatusKey } from "@/lib/order-status";

export const instant = false;

export const metadata: Metadata = { title: "Đơn hàng" };

export default async function Page({ searchParams }: PageProps<"/admin/orders">) {
  await requireAdmin();
  const { status } = await searchParams;
  const filter = typeof status === "string" && status in statusLabel ? (status as StatusKey) : null;

  const rows = await db
    .select()
    .from(schema.orders)
    .where(filter ? eq(schema.orders.status, filter) : undefined)
    .orderBy(desc(schema.orders.createdAt))
    .limit(200);

  const tabs: { key: StatusKey | null; label: string }[] = [
    { key: null, label: "Tất cả" },
    ...(Object.keys(statusLabel) as StatusKey[]).map((k) => ({ key: k, label: statusLabel[k] })),
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Đơn hàng</h1>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.key ? `/admin/orders?status=${t.key}` : "/admin/orders"}
            className={`flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold ${
              t.key === filter ? "border-navy bg-navy text-white" : "border-edge bg-white text-navy"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-ground text-xs uppercase tracking-wide text-subtle">
            <tr>
              <th className="px-4 py-3">Mã đơn</th>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Điện thoại</th>
              <th className="px-4 py-3 text-right">Tổng tiền</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-t border-line">
                <td className="px-4 py-3 font-bold">
                  <Link href={`/admin/orders/${o.id}`} className="text-navy underline">
                    {o.code}
                  </Link>
                </td>
                <td className="px-4 py-3">{o.shipName}</td>
                <td className="px-4 py-3">{o.shipPhone}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 text-muted">{formatDateTime(o.createdAt)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-subtle">
                  Chưa có đơn hàng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
