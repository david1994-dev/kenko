import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/page-skeleton";
import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { ImagePlaceholder } from "@/components/ui";
import { articles } from "@/data/content";
import { formatDate } from "@/lib/format";
import { absoluteUrl, site } from "@/lib/site";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tin-tuc/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/tin-tuc/${article.slug}` },
    openGraph: { type: "article", publishedTime: article.date },
  };
}

export default function Page(props: PageProps<"/tin-tuc/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Content params={props.params} />
    </Suspense>
  );
}

async function Content({ params }: Pick<PageProps<"/tin-tuc/[slug]">, "params">) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <ContentPage
      title={article.title}
      lead={article.excerpt}
      crumbs={[
        { name: "Tin tức", href: "/tin-tuc" },
        { name: article.title, href: `/tin-tuc/${article.slug}` },
      ]}
    >
      <time dateTime={article.date} className="block text-sm text-subtle">
        {formatDate(article.date)}
      </time>
      <ImagePlaceholder label="Ảnh bài viết" ratio="aspect-video" />
      {article.body.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          mainEntityOfPage: absoluteUrl(`/tin-tuc/${article.slug}`),
          publisher: { "@type": "Organization", name: site.name },
        }}
      />
    </ContentPage>
  );
}
