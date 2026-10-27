import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/page-skeleton";
import { ContentPage } from "@/components/content-page";
import { policies } from "@/data/content";

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/chinh-sach/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const policy = policies.find((p) => p.slug === slug);
  if (!policy) return {};
  return {
    title: policy.name,
    alternates: { canonical: `/chinh-sach/${policy.slug}` },
  };
}

export default function Page(props: PageProps<"/chinh-sach/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Content params={props.params} />
    </Suspense>
  );
}

async function Content({ params }: Pick<PageProps<"/chinh-sach/[slug]">, "params">) {
  const { slug } = await params;
  const policy = policies.find((p) => p.slug === slug);
  if (!policy) notFound();

  return (
    <ContentPage
      title={policy.name}
      crumbs={[{ name: policy.name, href: `/chinh-sach/${policy.slug}` }]}
    >
      <p>[Nội dung {policy.name.toLowerCase()} do cửa hàng cung cấp.]</p>
    </ContentPage>
  );
}
