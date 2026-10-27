import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/category-page";
import { getCategory, getProductsInCategory } from "@/lib/catalog";

const SLUG = "phu-kien";

export async function generateMetadata(): Promise<Metadata> {
  const cat = await getCategory(SLUG);
  if (!cat) return {};
  return { title: cat.title, description: cat.description, alternates: { canonical: cat.href } };
}

export default async function Page() {
  const cat = await getCategory(SLUG);
  if (!cat) notFound();
  const products = await getProductsInCategory(SLUG);

  return (
    <CategoryPage
      title={cat.title}
      description={cat.description}
      path={cat.href}
      crumbs={[{ name: cat.name, href: cat.href }]}
      products={products}
      seoText={cat.seoText}
    />
  );
}
