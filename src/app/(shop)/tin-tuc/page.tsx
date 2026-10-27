import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container, ImagePlaceholder } from "@/components/ui";
import { articles } from "@/data/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tin tức và hướng dẫn",
  description: "Hướng dẫn chọn size, sử dụng, bảo quản áo điều hoà và các giải pháp làm mát theo ngành.",
  alternates: { canonical: "/tin-tuc" },
};

export default function Page() {
  return (
    <Container className="pb-10 pt-3 md:pt-5">
      <Breadcrumbs items={[{ name: "Tin tức", href: "/tin-tuc" }]} />
      <h1 className="mb-4 mt-3 text-2xl font-extrabold md:text-[32px]">Tin tức và hướng dẫn</h1>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">
        {articles.map((a) => (
          <Link key={a.slug} href={`/tin-tuc/${a.slug}`} className="flex items-center gap-3 md:flex-col md:items-stretch md:gap-2">
            <ImagePlaceholder
              label="Ảnh"
              ratio="aspect-[4/3]"
              className="!w-28 shrink-0 !text-[11px] !rounded-lg md:!w-full md:!aspect-video md:!rounded-xl"
            />
            <div>
              <h2 className="text-base font-semibold leading-snug">{a.title}</h2>
              <p className="mt-0.5 text-sm text-muted">{a.excerpt}</p>
              <time dateTime={a.date} className="text-xs text-subtle">
                {formatDate(a.date)}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
