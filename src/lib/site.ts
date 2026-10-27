export const site = {
  name: "KENKO",
  tagline: "Áo điều hoà công nghệ làm mát",
  year: 2026,
  description:
    "KENKO - áo điều hoà giúp mát suốt ca làm việc ngoài trời và trong nhà xưởng. Áo dài tay, ngắn tay, phụ kiện, áo sưởi ấm.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Các giá trị trong ngoặc vuông là chỗ trống, cần thay bằng thông tin thật.
  hotline: "[SĐT]",
  hotlineHref: "tel:",
  zaloHref: "#",
  messengerHref: "#",
  email: "[Email]",
  hours: "8:00–17:30, Thứ 2 đến Thứ 7",
  company: "[Tên công ty / MST]",
  stores: [
    { city: "Hà Nội", address: "[Địa chỉ]", phone: "[SĐT]" },
    { city: "Đà Nẵng", address: "[Địa chỉ]", phone: "[SĐT]" },
    { city: "TP. Hồ Chí Minh", address: "[Địa chỉ]", phone: "[SĐT]" },
  ],
  marketplaces: [
    { name: "Facebook", href: "#" },
    { name: "Shopee", href: "#" },
    { name: "TikTok Shop", href: "#" },
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}
