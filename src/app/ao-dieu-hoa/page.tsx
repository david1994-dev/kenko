import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { productsByCategory } from "@/data/catalog";

const title = "Áo điều hoà";
const description =
  "Áo điều hoà KENKO làm mát chủ động cho người làm việc ngoài trời và trong nhà xưởng. Áo dài tay, ngắn tay, nhiều màu, nhiều size.";

export const metadata: Metadata = {
  title: "Áo điều hoà dài tay, ngắn tay - làm mát chủ động",
  description,
  alternates: { canonical: "/ao-dieu-hoa" },
};

export default function Page() {
  return (
    <CategoryPage
      title={title}
      description={description}
      path="/ao-dieu-hoa"
      crumbs={[{ name: title, href: "/ao-dieu-hoa" }]}
      products={productsByCategory(["dai-tay", "ngan-tay"])}
      chips={[
        { label: "Tất cả", href: "/ao-dieu-hoa", active: true },
        { label: "Dài tay", href: "/ao-dieu-hoa/dai-tay" },
        { label: "Ngắn tay", href: "/ao-dieu-hoa/ngan-tay" },
        { label: "Phụ kiện", href: "/phu-kien" },
      ]}
      seoText="[Đoạn nội dung SEO 100–150 chữ: áo điều hoà là gì, ai nên dùng, cách chọn size và pin.]"
      seoTitle="Chọn áo điều hoà phù hợp"
    />
  );
}
