import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { getSaleProducts } from "@/lib/catalog";

const description = "Các sản phẩm KENKO đang giảm giá: áo điều hoà, áo sưởi ấm và phụ kiện.";

export const metadata: Metadata = {
  title: "Sản phẩm giảm giá",
  description,
  alternates: { canonical: "/giam-gia" },
};

export default async function Page() {
  return (
    <CategoryPage
      title="Sản phẩm giảm giá"
      description={description}
      path="/giam-gia"
      crumbs={[{ name: "Giảm giá", href: "/giam-gia" }]}
      products={await getSaleProducts()}
    />
  );
}
