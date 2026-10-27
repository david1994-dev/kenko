import { statusLabel, statusStyle, type StatusKey } from "@/lib/order-status";

export function StatusBadge({ status }: { status: string }) {
  const key = (status in statusLabel ? status : "new") as StatusKey;
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${statusStyle[key]}`}>
      {statusLabel[key]}
    </span>
  );
}

export function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-white p-4 ring-1 ring-line">
      {title && <h2 className="mb-3 text-base font-bold">{title}</h2>}
      {children}
    </section>
  );
}
