import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Sản phẩm" };

const statusText = { active: "Đang bán", draft: "Nháp", hidden: "Ẩn" } as const;

export default async function Page() {
  await requireAdmin();
  const { products, categories, productImages } = schema;

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      salePrice: products.salePrice,
      status: products.status,
      category: categories.name,
      images: sql<number>`(select count(*)::int from ${productImages} where ${productImages.productId} = ${products.id})`,
      cover: sql<string | null>`(select ${productImages.url} from ${productImages} where ${productImages.productId} = ${products.id} order by ${productImages.sortOrder} asc limit 1)`,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(categories.sortOrder), desc(products.soldCount));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Sản phẩm</h1>
      <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-ground text-xs uppercase tracking-wide text-subtle">
            <tr>
              <th className="px-4 py-3">Ảnh</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3 text-right">Giá</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Số ảnh</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="px-4 py-2">
                  <div className="relative size-12 overflow-hidden rounded-lg bg-mist">
                    {p.cover && <Image src={p.cover} alt="" fill sizes="48px" className="object-cover" />}
                  </div>
                </td>
                <td className="px-4 py-2 font-semibold">
                  <Link href={`/admin/products/${p.id}`} className="text-navy underline">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-muted">{p.category}</td>
                <td className="px-4 py-2 text-right">
                  {formatPrice(p.salePrice ?? p.price)}
                  {p.salePrice ? <span className="ml-1 text-xs text-subtle line-through">{formatPrice(p.price)}</span> : null}
                </td>
                <td className="px-4 py-2">{statusText[p.status]}</td>
                <td className="px-4 py-2 text-right">{p.images}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
