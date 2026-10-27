import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { CheckIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: `Giới thiệu ${site.name}: áo điều hoà làm mát, kiểm tra hàng trước khi thanh toán, miễn phí vận chuyển, bảo hành 12 tháng. Địa chỉ ${site.address}.`,
  alternates: { canonical: "/gioi-thieu" },
};

const commitments = [
  "Kiểm tra, test hàng chính hãng trước khi thanh toán nhận hàng",
  "Miễn phí vận chuyển",
  "Ship hàng hoả tốc",
  "Bảo hành 12 tháng",
  "Tư vấn chọn size qua Zalo",
];

export default function Page() {
  return (
    <ContentPage
      title={`Giới thiệu ${site.name}`}
      lead={`${site.name} bán áo điều hoà làm mát và phụ kiện cho người làm việc ngoài trời, trong nhà xưởng.`}
      crumbs={[{ name: "Giới thiệu", href: "/gioi-thieu" }]}
    >
      <p>
        Bạn có thể đến cửa hàng tại {site.address} hoặc đặt hàng online. Hàng được giao tận nơi, bạn kiểm tra
        và test rồi mới thanh toán khi nhận hàng (COD).
      </p>

      <h2 className="pt-2 text-lg font-bold">Cam kết của cửa hàng</h2>
      <ul className="grid gap-2">
        {commitments.map((t) => (
          <li key={t} className="flex items-start gap-2 font-semibold">
            <CheckIcon size={20} strokeWidth={3} className="mt-0.5 shrink-0 text-navy" />
            {t}
          </li>
        ))}
      </ul>

      <h2 className="pt-2 text-lg font-bold">Liên hệ</h2>
      <div className="rounded-xl bg-brand p-4">
        <dl className="space-y-2">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-ink/70">Địa chỉ</dt>
            <dd className="font-semibold">{site.address}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-ink/70">Hotline / Zalo</dt>
            <dd className="text-xl font-extrabold text-navy">{site.hotline}</dd>
          </div>
        </dl>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={site.hotlineHref}
            className="flex h-12 items-center justify-center rounded-lg bg-cta font-bold text-white hover:bg-cta-dark"
          >
            Gọi ngay
          </a>
          <a
            href={site.zaloHref}
            className="flex h-12 items-center justify-center rounded-lg border-2 border-navy font-bold text-navy hover:bg-white/50"
          >
            Nhắn Zalo
          </a>
        </div>
      </div>

      <ButtonLink href="/ao-dieu-hoa" className="w-full sm:w-auto">
        Xem sản phẩm
      </ButtonLink>
    </ContentPage>
  );
}
