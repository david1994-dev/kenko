import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { categoryById, productsByCategory } from "@/data/catalog";

const cat = categoryById["ao-suoi-am"];

export const metadata: Metadata = {
  title: cat.title,
  description: cat.description,
  alternates: { canonical: cat.href },
};

export default function Page() {
  return (
    <CategoryPage
      title={cat.title}
      description={cat.description}
      path={cat.href}
      crumbs={[{ name: cat.name, href: cat.href }]}
      products={productsByCategory([cat.id])}
      seoText={cat.seoText}
    />
  );
}
