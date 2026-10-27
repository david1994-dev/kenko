import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/page-skeleton";
import { CategoryPage } from "@/components/category-page";
import { categoryById, productsByCategory, type CategoryId } from "@/data/catalog";

const slugs: CategoryId[] = ["dai-tay", "ngan-tay"];

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/ao-dieu-hoa/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cat = slugs.includes(slug as CategoryId) ? categoryById[slug as CategoryId] : undefined;
  if (!cat) return {};
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
  if (!slugs.includes(slug as CategoryId)) notFound();
  const cat = categoryById[slug as CategoryId];

  return (
    <CategoryPage
      title={cat.title}
      description={cat.description}
      path={cat.href}
      crumbs={[
        { name: "Áo điều hoà", href: "/ao-dieu-hoa" },
        { name: cat.name, href: cat.href },
      ]}
      products={productsByCategory([cat.id])}
      chips={[
        { label: "Tất cả", href: "/ao-dieu-hoa" },
        { label: "Dài tay", href: "/ao-dieu-hoa/dai-tay", active: cat.id === "dai-tay" },
        { label: "Ngắn tay", href: "/ao-dieu-hoa/ngan-tay", active: cat.id === "ngan-tay" },
        { label: "Phụ kiện", href: "/phu-kien" },
      ]}
      seoText={cat.seoText}
    />
  );
}
