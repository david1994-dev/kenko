import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/page-skeleton";
import { ContentPage } from "@/components/content-page";
import { ProductCard } from "@/components/ui";
import { industries } from "@/data/content";
import { productsByCategory } from "@/data/catalog";

export function generateStaticParams() {
  return industries.map((i) => ({ nganh: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/giai-phap/[nganh]">): Promise<Metadata> {
  const { nganh } = await params;
  const industry = industries.find((i) => i.slug === nganh);
  if (!industry) return {};
  return {
    title: `Áo điều hoà cho ngành ${industry.name.toLowerCase()}`,
    description: `Giải pháp làm mát bằng áo điều hoà KENKO cho người làm việc trong ngành ${industry.name.toLowerCase()}.`,
    alternates: { canonical: `/giai-phap/${industry.slug}` },
  };
}

export default function Page(props: PageProps<"/giai-phap/[nganh]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Content params={props.params} />
    </Suspense>
  );
}

async function Content({ params }: Pick<PageProps<"/giai-phap/[nganh]">, "params">) {
  const { nganh } = await params;
  const industry = industries.find((i) => i.slug === nganh);
  if (!industry) notFound();

  const picks = productsByCategory(["dai-tay", "ngan-tay"]).slice(0, 4);

  return (
    <ContentPage
      title={`Áo điều hoà cho ngành ${industry.name.toLowerCase()}`}
      crumbs={[
        { name: "Giải pháp", href: "/giai-phap" },
        { name: industry.name, href: `/giai-phap/${industry.slug}` },
      ]}
    >
      <p>[Nội dung 200–300 chữ: điều kiện làm việc trong ngành {industry.name.toLowerCase()}, vì sao cần làm mát, mẫu áo phù hợp.]</p>
      <h2 className="pt-2 text-lg font-bold">Sản phẩm gợi ý</h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3">
        {picks.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </ContentPage>
  );
}
