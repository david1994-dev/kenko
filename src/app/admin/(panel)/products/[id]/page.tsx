import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { Card } from "@/components/admin-ui";
import { ProductForm, UploadForm } from "@/components/admin-product-forms";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteImage, makeCover, updateVariants } from "../actions";
import { SubmitButton } from "@/components/submit-button";

export const instant = false;

export const metadata: Metadata = { title: "Sửa sản phẩm" };

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function Page({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const created = (await searchParams).created === "1";
  if (!uuid.test(id)) notFound();

  const { products, productVariants, productImages } = schema;
  const [product] = await db.select().from(products).where(eq(products.id, id));
  if (!product) notFound();

  const [variants, images] = await Promise.all([
    db.select().from(productVariants).where(eq(productVariants.productId, id)).orderBy(asc(productVariants.sortOrder)),
    db.select().from(productImages).where(eq(productImages.productId, id)).orderBy(asc(productImages.sortOrder)),
  ]);

  return (
    <div className="space-y-4">
      <Link href="/admin/products" className="text-sm font-semibold text-navy underline">
        ← Danh sách sản phẩm
      </Link>
      <h1 className="text-2xl font-extrabold">{product.name}</h1>
      {created && (
        <p role="status" className="rounded-lg bg-mist p-3 text-sm font-semibold text-navy">
          Đã tạo sản phẩm. Thêm ảnh ở mục bên dưới
          {product.status === "draft" ? ", rồi đổi trạng thái sang Đang bán để hiện ra ngoài." : "."}
        </p>
      )}

      <Card title="Thông tin">
        <ProductForm
          product={{
            id: product.id,
            name: product.name,
            sku: product.sku,
            summary: product.summary,
            description: product.description,
            price: product.price,
            salePrice: product.salePrice,
            soldCount: product.soldCount,
            giftNote: product.giftNote,
            status: product.status,
          }}
        />
      </Card>

      <Card title={`Ảnh sản phẩm (${images.length})`}>
        {images.length > 0 && (
          <ul className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {images.map((img, i) => (
              <li key={img.id} className="flex flex-col gap-2">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-mist">
                  <Image src={img.url} alt={img.alt} fill sizes="200px" className="object-cover" />
                  {i === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-navy px-1.5 py-0.5 text-[11px] font-bold text-white">
                      Ảnh bìa
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5">
                  {i > 0 && (
                    <form action={makeCover} className="flex-1">
                      <input type="hidden" name="imageId" value={img.id} />
                      <SubmitButton
                        pendingLabel="Đang đổi…"
                        className="h-10 w-full rounded-lg border border-edge text-xs font-semibold text-navy hover:bg-mist"
                      >
                        Đặt làm bìa
                      </SubmitButton>
                    </form>
                  )}
                  <form action={deleteImage} className="flex-1">
                    <input type="hidden" name="imageId" value={img.id} />
                    <SubmitButton
                      pendingLabel="Đang xoá…"
                      className="h-10 w-full rounded-lg border border-edge text-xs font-semibold text-price hover:bg-[#fdeee6]"
                    >
                      Xoá
                    </SubmitButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
        <UploadForm productId={product.id} />
      </Card>

      <Card title="Phân loại và tồn kho">
        <form action={updateVariants}>
          <input type="hidden" name="productId" value={product.id} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-subtle">
                <tr>
                  <th className="py-2">Mã</th>
                  <th className="py-2">Màu</th>
                  <th className="py-2">Size</th>
                  <th className="py-2">Tồn kho</th>
                  <th className="py-2">Đang bán</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v) => (
                  <tr key={v.id} className="border-t border-line">
                    <td className="py-2 text-xs text-subtle">{v.sku}</td>
                    <td className="py-2">{v.colorName ?? "—"}</td>
                    <td className="py-2">{v.size ?? "—"}</td>
                    <td className="py-2">
                      <input
                        name={`stock-${v.id}`}
                        type="number"
                        min={0}
                        defaultValue={v.stock ?? ""}
                        placeholder="Không theo dõi"
                        aria-label={`Tồn kho ${v.sku}`}
                        className="h-10 w-32 rounded-lg border border-edge px-2"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        name={`active-${v.id}`}
                        type="checkbox"
                        defaultChecked={v.isActive}
                        aria-label={`Đang bán ${v.sku}`}
                        className="size-5 accent-navy"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-subtle">Để trống tồn kho nếu không muốn theo dõi số lượng. Khi nhập số, hệ thống tự trừ theo đơn hàng.</p>
          <SubmitButton
            pendingLabel="Đang lưu…"
            className="mt-3 h-12 rounded-lg bg-cta px-6 font-bold text-white hover:bg-cta-dark"
          >
            Lưu phân loại
          </SubmitButton>
        </form>
      </Card>
    </div>
  );
}
