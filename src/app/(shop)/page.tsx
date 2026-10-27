import type { Metadata } from "next";
import Link from "next/link";
import { BestSellers } from "@/components/best-sellers";
import { CheckIcon, ChevronRightIcon } from "@/components/icons";
import { TrustBanner } from "@/components/trust-banner";
import { ButtonLink, Container, ImagePlaceholder, SectionHeading } from "@/components/ui";
import { articles, howItWorks, industries } from "@/data/content";
import { getCategories, getProducts } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${site.name} - Áo điều hoà làm mát, áo sưởi ấm, máy hút ẩm` },
  description: site.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const bestSellerTabs = [
    { id: "dai-tay", label: "Dài tay" },
    { id: "ngan-tay", label: "Ngắn tay + Gile" },
    { id: "phu-kien", label: "Phụ kiện" },
  ].map((t) => ({
    ...t,
    products: products.filter((p) => p.category === t.id).slice(0, 4),
  }));
  const tiles = [
    ...categories.filter((c) => c.parentSlug || c.slug !== "ao-dieu-hoa"),
    { id: 0, slug: "giam-gia", name: "Giảm giá", href: "/giam-gia" },
  ];

  return (
    <>
      <TrustBanner />
      <section className="bg-brand text-ink">
        <Container className="flex flex-col gap-8 py-6 md:flex-row md:items-center md:gap-12 md:py-14">
          <div className="md:flex-1">
            <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-navy md:text-sm">
              {site.tagline}
            </p>
            <h1 className="mb-3 text-[28px] font-extrabold leading-tight md:mb-4 md:text-[44px] md:leading-[1.15]">
              Mát suốt ca làm việc, dù ngoài trời nắng gắt
            </h1>
            <p className="mb-5 max-w-[520px] text-[15px] text-ink md:mb-7 md:text-[17px]">
              Luồng khí lưu thông trong áo giúp cơ thể khô thoáng. Dành cho công nhân, kỹ sư, người
              đi đường dài.
            </p>
            <div className="flex gap-3">
              <ButtonLink href="/ao-dieu-hoa" className="flex-1 md:flex-none md:px-8">
                Mua ngay
              </ButtonLink>
              <ButtonLink
                href="/huong-dan-chon-size"
                variant="outline-on-brand"
                className="flex-1 md:flex-none md:px-8"
              >
                Tư vấn size
              </ButtonLink>
            </div>
          </div>
          <div className="md:flex-1">
            <ImagePlaceholder
              label="Ảnh banner · người mặc áo điều hoà"
              ratio="aspect-[16/10]"
              className="!bg-white/60 !text-ink"
            />
          </div>
        </Container>
      </section>

      <Container className="pt-5 md:pt-10">
        <SectionHeading title="Danh mục" />
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
          {tiles.map((c) => (
            <Link key={c.slug} href={c.href} className="flex flex-col items-center gap-1.5 text-center">
              <ImagePlaceholder label="Ảnh" className="!text-[11px]" />
              <span className="text-[13px] font-semibold leading-tight md:text-[15px]">{c.name}</span>
            </Link>
          ))}
        </div>
      </Container>

      <Container className="py-2 md:py-4">
        <SectionHeading title="Bán chạy" href="/ao-dieu-hoa" />
        <BestSellers tabs={bestSellerTabs} />
      </Container>

      <section className="mt-6 md:mt-12">
        <Container>
          <div className="grid gap-5 rounded-2xl bg-brand p-5 md:grid-cols-[1.3fr_1fr] md:gap-8 md:p-8">
            <div>
              <h2 className="mb-2 text-xl font-extrabold md:text-2xl">Về {site.name}</h2>
              <p className="mb-3 text-[15px]">
                {site.name} bán áo điều hoà làm mát và phụ kiện cho người làm việc ngoài trời, trong nhà xưởng.
                Mua tại cửa hàng ở {site.address} hoặc đặt hàng online, nhận hàng rồi mới thanh toán.
              </p>
              <ul className="grid gap-1.5 text-[15px] font-semibold">
                {[
                  "Kiểm tra, test hàng chính hãng trước khi thanh toán",
                  "Miễn phí vận chuyển",
                  "Ship hàng hoả tốc",
                  "Bảo hành 12 tháng",
                  "Tư vấn chọn size qua Zalo",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckIcon size={20} strokeWidth={3} className="mt-0.5 shrink-0 text-navy" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center gap-3 rounded-xl bg-white p-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-subtle">Địa chỉ</div>
                <div className="font-semibold">{site.address}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-subtle">Hotline / Zalo</div>
                <div className="text-xl font-extrabold text-navy">{site.hotline}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={site.hotlineHref}
                  className="flex h-11 items-center justify-center rounded-lg bg-cta text-sm font-bold text-white hover:bg-cta-dark"
                >
                  Gọi ngay
                </a>
                <a
                  href={site.zaloHref}
                  className="flex h-11 items-center justify-center rounded-lg border-2 border-navy text-sm font-bold text-navy hover:bg-mist"
                >
                  Nhắn Zalo
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="mt-6 bg-ground py-6 md:mt-12 md:py-12">
        <Container>
          <h2 className="mb-4 text-lg font-bold md:mb-6 md:text-2xl md:font-extrabold">
            Áo điều hoà hoạt động thế nào?
          </h2>
          <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
            {howItWorks.map((s, i) => (
              <li key={s.title} className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold">{s.title}</h3>
                  <p className="text-sm text-muted md:text-[15px]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <ButtonLink href="/huong-dan-chon-size" variant="outline" className="mt-5 md:inline-flex">
            Hướng dẫn chọn size
          </ButtonLink>
        </Container>
      </section>

      <Container className="pt-6 md:pt-12">
        <SectionHeading title="Giải pháp theo ngành" href="/giai-phap" />
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {industries.map((i) => (
            <li key={i.slug}>
              <Link
                href={`/giai-phap/${i.slug}`}
                className="flex min-h-12 items-center justify-between rounded-lg border border-line px-3 text-sm font-semibold hover:bg-mist md:min-h-14 md:px-4 md:text-[15px]"
              >
                {i.name}
                <ChevronRightIcon size={16} strokeWidth={2.5} className="text-teal" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <Container className="pt-6 md:pt-12">
        <SectionHeading title="Khách hàng nói gì" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {["Ảnh phản hồi 1", "Ảnh phản hồi 2", "Ảnh phản hồi 3", "Ảnh phản hồi 4"].map((l) => (
            <ImagePlaceholder key={l} label={l} ratio="aspect-[3/4]" />
          ))}
        </div>
      </Container>

      <Container className="py-6 md:py-12">
        <SectionHeading title="Tin tức & hướng dẫn" href="/tin-tuc" />
        <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-6">
          {articles.map((a) => (
            <Link key={a.slug} href={`/tin-tuc/${a.slug}`} className="flex items-center gap-3 md:flex-col md:items-stretch md:gap-2">
              <ImagePlaceholder
                label="Ảnh"
                ratio="aspect-[4/3]"
                className="!w-24 shrink-0 !text-[11px] !rounded-lg md:!w-full md:!aspect-video md:!rounded-xl"
              />
              <div>
                <h3 className="text-sm font-semibold leading-snug md:text-base">{a.title}</h3>
                <time dateTime={a.date} className="text-xs text-subtle md:text-[13px]">
                  {formatDate(a.date)}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
