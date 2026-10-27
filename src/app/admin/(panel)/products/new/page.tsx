import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { Card } from "@/components/admin-ui";
import { AdminNewProductForm } from "@/components/admin-new-product-form";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";

export const instant = false;

export const metadata: Metadata = { title: "Thêm sản phẩm" };

export default async function Page() {
  await requireAdmin();
  const rows = await db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder));
  const parents = new Set(rows.flatMap((c) => (c.parentId ? [c.parentId] : [])));
  const categories = rows.filter((c) => !parents.has(c.id)).map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-4">
      <Link href="/admin/products" className="text-sm font-semibold text-navy underline">
        ← Danh sách sản phẩm
      </Link>
      <h1 className="text-2xl font-extrabold">Thêm sản phẩm</h1>
      <Card>
        <AdminNewProductForm categories={categories} />
      </Card>
    </div>
  );
}
