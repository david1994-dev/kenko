import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategoryPage } from "@/components/category-page";
import { PageSkeleton } from "@/components/page-skeleton";
import { getCategories, getCategory, getProductsInCategory } from "@/lib/catalog";

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.filter((c) => c.parentSlug === "ao-dieu-hoa").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/ao-dieu-hoa/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat || cat.parentSlug !== "ao-dieu-hoa") return {};
  return {
    title: cat.title,
    description: cat.description,
    alternates: { canonical: cat.href },
  };
}

export default function Page(props: PageProps<"/ao-dieu-hoa/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Content params={props.params} />
    </Suspense>
  );
}

async function Content({ params }: Pick<PageProps<"/ao-dieu-hoa/[slug]">, "params">) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat || cat.parentSlug !== "ao-dieu-hoa") notFound();
  const products = await getProductsInCategory(cat.slug);

  return (
    <CategoryPage
      title={cat.title}
      description={cat.description}
      path={cat.href}
      crumbs={[
        { name: "Áo điều hoà", href: "/ao-dieu-hoa" },
        { name: cat.name, href: cat.href },
      ]}
      products={products}
      chips={[
        { label: "Tất cả", href: "/ao-dieu-hoa" },
        { label: "Dài tay", href: "/ao-dieu-hoa/dai-tay", active: cat.slug === "dai-tay" },
        { label: "Ngắn tay", href: "/ao-dieu-hoa/ngan-tay", active: cat.slug === "ngan-tay" },
        { label: "Phụ kiện", href: "/phu-kien" },
      ]}
      seoText={cat.seoText}
    />
  );
}
