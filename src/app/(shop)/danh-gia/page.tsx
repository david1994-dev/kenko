import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { ReviewForm } from "@/components/review-form";

export const metadata: Metadata = {
  title: "Đánh giá sản phẩm",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <ContentPage
      title="Đánh giá sản phẩm"
      lead="Dành cho khách đã nhận hàng. Nhập mã đơn và số điện thoại đặt hàng để đánh giá."
      crumbs={[{ name: "Đánh giá sản phẩm", href: "/danh-gia" }]}
    >
      <ReviewForm />
    </ContentPage>
  );
}
