export const site = {
  name: "KENKO STORE",
  tagline: "Áo điều hoà công nghệ làm mát",
  year: 2026,
  description:
    "KENKO STORE - áo điều hoà giúp mát suốt ca làm việc ngoài trời và trong nhà xưởng. Áo dài tay, ngắn tay + gile, phụ kiện, áo sưởi ấm.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Các giá trị trong ngoặc vuông là chỗ trống, cần thay bằng thông tin thật.
  hotline: "0358 585 363",
  hotlineHref: "tel:0358585363",
  zaloHref: "https://zalo.me/0358585363",
  address: "Phường Cửa Lò, tỉnh Nghệ An",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}
