import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Giới thiệu KENKO và công nghệ áo điều hoà làm mát.",
  alternates: { canonical: "/gioi-thieu" },
};

export default function Page() {
  return (
    <ContentPage title="Giới thiệu KENKO" crumbs={[{ name: "Giới thiệu", href: "/gioi-thieu" }]}>
      <p>[Nội dung giới thiệu thương hiệu, câu chuyện và cam kết.]</p>
    </ContentPage>
  );
}
