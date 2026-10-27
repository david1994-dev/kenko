import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { ChevronRightIcon } from "@/components/icons";
import { industries } from "@/data/content";

export const metadata: Metadata = {
  title: "Giải pháp làm mát theo ngành",
  description: "Áo điều hoà KENKO cho xây dựng, nông nghiệp, cơ khí, điện lực, y tế, giáo dục, du lịch và thể thao.",
  alternates: { canonical: "/giai-phap" },
};

export default function Page() {
  return (
    <ContentPage
      title="Giải pháp làm mát theo ngành"
      lead="Chọn ngành nghề của bạn để xem cách áo điều hoà giúp giảm nóng bức khi làm việc."
      crumbs={[{ name: "Giải pháp", href: "/giai-phap" }]}
    >
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {industries.map((i) => (
          <li key={i.slug}>
            <Link
              href={`/giai-phap/${i.slug}`}
              className="flex min-h-14 items-center justify-between rounded-lg border border-line px-4 font-semibold hover:bg-mist"
            >
              {i.name}
              <ChevronRightIcon size={16} strokeWidth={2.5} className="text-teal" />
            </Link>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
