import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { saleProducts } from "@/data/catalog";

const description = "Các sản phẩm KENKO đang giảm giá: áo điều hoà, áo sưởi ấm và phụ kiện.";

export const metadata: Metadata = {
  title: "Sản phẩm giảm giá",
  description,
  alternates: { canonical: "/giam-gia" },
};

export default function Page() {
  return (
    <CategoryPage
      title="Sản phẩm giảm giá"
      description={description}
      path="/giam-gia"
      crumbs={[{ name: "Giảm giá", href: "/giam-gia" }]}
      products={saleProducts}
    />
  );
}
