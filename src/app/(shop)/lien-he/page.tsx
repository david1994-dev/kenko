import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Thông tin liên hệ, hệ thống cửa hàng và giờ làm việc của KENKO.",
  alternates: { canonical: "/lien-he" },
};

export default function Page() {
  return (
    <ContentPage title="Liên hệ" crumbs={[{ name: "Liên hệ", href: "/lien-he" }]}>
      <p>
        Hotline: <a href={site.hotlineHref} className="font-bold text-navy underline">{site.hotline}</a>
        <br />
        Email: {site.email}
        <br />
        Giờ làm việc: {site.hours}
      </p>
      <h2 className="pt-2 text-lg font-bold">Địa chỉ cửa hàng</h2>
      <p className="rounded-lg border border-line p-3">{site.address}</p>
    </ContentPage>
  );
}
