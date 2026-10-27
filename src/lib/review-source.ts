export const sourceOptions = [
  { value: "zalo", label: "Zalo", public: "Khách mua qua Zalo" },
  { value: "facebook", label: "Facebook", public: "Khách mua qua Facebook" },
  { value: "shopee", label: "Shopee", public: "Khách mua trên Shopee" },
  { value: "tiktok", label: "TikTok Shop", public: "Khách mua trên TikTok Shop" },
  { value: "store", label: "Tại cửa hàng", public: "Khách mua tại cửa hàng" },
] as const;

export function publicSourceLabel(source: string) {
  return sourceOptions.find((o) => o.value === source)?.public ?? "Khách đã mua hàng";
}

export function adminSourceLabel(source: string) {
  return sourceOptions.find((o) => o.value === source)?.label ?? "Đơn trên web";
}
