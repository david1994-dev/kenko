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
        Hotline: <strong>{site.hotline}</strong>
        <br />
        Email: {site.email}
        <br />
        Giờ làm việc: {site.hours}
      </p>
      <h2 className="pt-2 text-lg font-bold">Hệ thống cửa hàng</h2>
      <ul className="space-y-2">
        {site.stores.map((s) => (
          <li key={s.city} className="rounded-lg border border-line p-3">
            <strong>{s.city}</strong>
            <br />
            {s.address} · {s.phone}
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
