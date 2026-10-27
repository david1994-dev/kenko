import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/category-page";
import { getCategory, getProductsInCategory } from "@/lib/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const cat = await getCategory("ao-dieu-hoa");
  return {
    title: "Áo điều hoà dài tay, ngắn tay + gile - làm mát chủ động",
    description: cat?.description,
    alternates: { canonical: "/ao-dieu-hoa" },
  };
}

export default async function Page() {
  const cat = await getCategory("ao-dieu-hoa");
  if (!cat) notFound();
  const products = await getProductsInCategory("ao-dieu-hoa");

  return (
    <CategoryPage
      title={cat.title}
      description={cat.description}
      path={cat.href}
      crumbs={[{ name: cat.name, href: cat.href }]}
      products={products}
      chips={[
        { label: "Tất cả", href: "/ao-dieu-hoa", active: true },
        { label: "Dài tay", href: "/ao-dieu-hoa/dai-tay" },
        { label: "Ngắn tay + Gile", href: "/ao-dieu-hoa/ngan-tay" },
      ]}
      seoTitle="Chọn áo điều hoà phù hợp"
      seoText={cat.seoText}
    />
  );
}
