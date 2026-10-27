export type CategoryId =
  | "ao-dieu-hoa"
  | "dai-tay"
  | "ngan-tay"
  | "phu-kien"
  | "ao-suoi-am"
  | "may-hut-am";

export type SeedCategory = {
  id: CategoryId;
  parent?: CategoryId;
  name: string;
  title: string;
  href: string;
  description: string;
  seoText: string;
};

export const categories: SeedCategory[] = [
  {
    id: "ao-dieu-hoa",
    name: "Áo điều hoà",
    title: "Áo điều hoà",
    href: "/ao-dieu-hoa",
    description:
      "Áo điều hoà KENKO làm mát chủ động cho người làm việc ngoài trời và trong nhà xưởng. Gồm 2 loại: áo dài tay, và ngắn tay + gile. Nhiều màu, nhiều size.",
    seoText: "[Đoạn nội dung SEO 100–150 chữ: áo điều hoà là gì, ai nên dùng, cách chọn size và pin.]",
  },
  {
    id: "dai-tay",
    parent: "ao-dieu-hoa",
    name: "Áo dài tay",
    title: "Áo điều hoà dài tay",
    href: "/ao-dieu-hoa/dai-tay",
    description: "Áo điều hoà dài tay, che nắng cho tay và cổ khi làm việc ngoài trời.",
    seoText:
      "[Đoạn nội dung SEO 100–150 chữ về áo điều hoà dài tay: ai nên dùng, chất liệu, cách chọn size và pin.]",
  },
  {
    id: "ngan-tay",
    parent: "ao-dieu-hoa",
    name: "Ngắn tay + Gile",
    title: "Áo điều hoà ngắn tay + gile",
    href: "/ao-dieu-hoa/ngan-tay",
    description: "Áo điều hoà ngắn tay và gile, thoáng và nhẹ cho môi trường nhà xưởng.",
    seoText:
      "[Đoạn nội dung SEO 100–150 chữ về áo điều hoà ngắn tay và gile.]",
  },
  {
    id: "phu-kien",
    name: "Phụ kiện",
    title: "Phụ kiện áo điều hoà",
    href: "/phu-kien",
    description: "Pin, bộ sạc và phụ kiện thay thế cho áo điều hoà.",
    seoText: "[Đoạn nội dung SEO về phụ kiện áo điều hoà.]",
  },
  {
    id: "ao-suoi-am",
    name: "Áo sưởi ấm",
    title: "Áo sưởi ấm",
    href: "/ao-suoi-am",
    description: "Áo giữ nhiệt và áo khoác sưởi ấm cho mùa lạnh.",
    seoText: "[Đoạn nội dung SEO về áo sưởi ấm.]",
  },
  {
    id: "may-hut-am",
    name: "Máy hút ẩm",
    title: "Máy hút ẩm",
    href: "/may-hut-am",
    description: "Máy hút ẩm cho gia đình, kho xưởng và văn phòng.",
    seoText: "[Đoạn nội dung SEO về máy hút ẩm.]",
  },
];

type Color = { name: string; hex: string };

export type SeedProduct = {
  slug: string;
  name: string;
  category: CategoryId;
  summary: string;
  description: string;
  // Giá mẫu để giỏ hàng chạy được, thay bằng giá thật khi có dữ liệu.
  price: number;
  salePrice?: number;
  sold: number;
  sku: string;
  colors: Color[];
  sizes: string[];
  specs: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
};

const clothingSizes = ["S", "M", "L", "XL", "XXL"];

const commonFaqs: SeedProduct["faqs"] = [
  { q: "Pin dùng được bao lâu?", a: "[Thời lượng pin theo từng mức quạt]" },
  { q: "Áo có giặt được không?", a: "[Hướng dẫn giặt: tháo quạt và pin trước khi giặt]" },
  { q: "Làm sao để chọn size phù hợp?", a: "Xem bảng quy đổi chiều cao, cân nặng trong trang Hướng dẫn chọn size." },
];

const commonSpecs: SeedProduct["specs"] = [
  { label: "Chất liệu", value: "[Chất liệu vải]" },
  { label: "Số quạt", value: "[Số quạt]" },
  { label: "Pin", value: "[Dung lượng pin]" },
  { label: "Trọng lượng", value: "[Trọng lượng]" },
];

const clothingDescription =
  "[Mô tả 150–250 chữ: công nghệ làm mát, chất liệu, ai nên dùng, điểm khác biệt.]";

export const products: SeedProduct[] = [
  {
    slug: "ao-dieu-hoa-dai-tay-xanh-than",
    name: "Áo điều hoà dài tay – Xanh than",
    category: "dai-tay",
    summary: "Áo điều hoà dài tay màu xanh than, làm mát chủ động suốt ca làm việc.",
    description: clothingDescription,
    price: 1000000,
    salePrice: 800000,
    sold: 120,
    sku: "KK-DT-XT",
    colors: [
      { name: "Xanh than", hex: "#1F3A5F" },
      { name: "Xanh rêu", hex: "#4F5D3A" },
      { name: "Camo", hex: "#6B7A4B" },
      { name: "Ghi", hex: "#8A8F94" },
    ],
    sizes: clothingSizes,
    specs: commonSpecs,
    faqs: commonFaqs,
  },
  {
    slug: "ao-dieu-hoa-dai-tay-camo",
    name: "Áo điều hoà dài tay – Camo",
    category: "dai-tay",
    summary: "Áo điều hoà dài tay hoạ tiết camo, bền và kín đáo.",
    description: clothingDescription,
    price: 1000000,
    salePrice: 850000,
    sold: 86,
    sku: "KK-DT-CM",
    colors: [
      { name: "Camo", hex: "#6B7A4B" },
      { name: "Xanh than", hex: "#1F3A5F" },
    ],
    sizes: clothingSizes,
    specs: commonSpecs,
    faqs: commonFaqs,
  },
  {
    slug: "ao-dieu-hoa-dai-tay-xanh-reu",
    name: "Áo điều hoà dài tay – Xanh rêu",
    category: "dai-tay",
    summary: "Áo điều hoà dài tay màu xanh rêu, dễ phối khi đi làm.",
    description: clothingDescription,
    price: 1000000,
    salePrice: 800000,
    sold: 64,
    sku: "KK-DT-XR",
    colors: [
      { name: "Xanh rêu", hex: "#4F5D3A" },
      { name: "Xanh than", hex: "#1F3A5F" },
    ],
    sizes: clothingSizes,
    specs: commonSpecs,
    faqs: commonFaqs,
  },
  {
    slug: "ao-dieu-hoa-dai-tay-jean-sang",
    name: "Áo điều hoà dài tay – Jean sáng",
    category: "dai-tay",
    summary: "Áo điều hoà dài tay màu jean sáng, trẻ trung.",
    description: clothingDescription,
    price: 1000000,
    salePrice: 750000,
    sold: 41,
    sku: "KK-DT-JS",
    colors: [
      { name: "Jean sáng", hex: "#9DB4CC" },
      { name: "Xanh than", hex: "#1F3A5F" },
    ],
    sizes: clothingSizes,
    specs: commonSpecs,
    faqs: commonFaqs,
  },
  {
    slug: "ao-dieu-hoa-ngan-tay-ghi",
    name: "Áo điều hoà ngắn tay – Ghi",
    category: "ngan-tay",
    summary: "Áo điều hoà ngắn tay màu ghi, thoáng nhẹ cho nhà xưởng.",
    description: clothingDescription,
    price: 900000,
    salePrice: 810000,
    sold: 98,
    sku: "KK-NT-GH",
    colors: [
      { name: "Ghi", hex: "#8A8F94" },
      { name: "Xanh than", hex: "#1F3A5F" },
      { name: "Xanh rêu", hex: "#4F5D3A" },
    ],
    sizes: clothingSizes,
    specs: commonSpecs,
    faqs: commonFaqs,
  },
  {
    slug: "ao-dieu-hoa-ngan-tay-xanh-lam",
    name: "Áo điều hoà ngắn tay – Xanh lam",
    category: "ngan-tay",
    summary: "Áo điều hoà ngắn tay màu xanh lam, nổi bật và dễ nhận diện.",
    description: clothingDescription,
    price: 900000,
    salePrice: 790000,
    sold: 52,
    sku: "KK-NT-XL",
    colors: [
      { name: "Xanh lam", hex: "#2F6DB5" },
      { name: "Ghi", hex: "#8A8F94" },
    ],
    sizes: clothingSizes,
    specs: commonSpecs,
    faqs: commonFaqs,
  },
  {
    slug: "ao-dieu-hoa-ngan-tay-camo",
    name: "Áo điều hoà ngắn tay – Camo",
    category: "ngan-tay",
    summary: "Áo điều hoà ngắn tay hoạ tiết camo.",
    description: clothingDescription,
    price: 900000,
    salePrice: 740000,
    sold: 33,
    sku: "KK-NT-CM",
    colors: [{ name: "Camo", hex: "#6B7A4B" }],
    sizes: clothingSizes,
    specs: commonSpecs,
    faqs: commonFaqs,
  },
  {
    slug: "pin-sac-du-phong",
    name: "Pin sạc dự phòng cho áo điều hoà",
    category: "phu-kien",
    summary: "Pin sạc dự phòng dùng cho áo điều hoà.",
    description: "[Mô tả pin: dung lượng, thời gian sạc, tương thích.]",
    price: 400000,
    sold: 140,
    sku: "KK-PK-PIN",
    colors: [],
    sizes: [],
    specs: [
      { label: "Dung lượng", value: "[mAh]" },
      { label: "Thời gian sạc", value: "[Giờ]" },
    ],
    faqs: [{ q: "Pin có dùng chung cho mọi mẫu áo không?", a: "[Thông tin tương thích]" }],
  },
  {
    slug: "bo-sac-nhanh",
    name: "Bộ sạc nhanh",
    category: "phu-kien",
    summary: "Bộ sạc nhanh cho pin áo điều hoà.",
    description: "[Mô tả bộ sạc.]",
    price: 200000,
    sold: 75,
    sku: "KK-PK-SAC",
    colors: [],
    sizes: [],
    specs: [{ label: "Công suất", value: "[W]" }],
    faqs: [],
  },
  {
    slug: "ao-suoi-am-giu-nhiet",
    name: "Áo sưởi ấm giữ nhiệt",
    category: "ao-suoi-am",
    summary: "Áo giữ nhiệt có sưởi, mặc trong hoặc ngoài khi trời lạnh.",
    description: "[Mô tả áo sưởi ấm.]",
    price: 1200000,
    salePrice: 990000,
    sold: 28,
    sku: "KK-SA-GN",
    colors: [
      { name: "Đen", hex: "#1B1F24" },
      { name: "Ghi", hex: "#8A8F94" },
    ],
    sizes: clothingSizes,
    specs: [
      { label: "Pin", value: "[Dung lượng pin]" },
      { label: "Số mức nhiệt", value: "[Số mức]" },
    ],
    faqs: [],
  },
  {
    slug: "may-hut-am-mini",
    name: "Máy hút ẩm mini",
    category: "may-hut-am",
    summary: "Máy hút ẩm nhỏ gọn cho phòng ngủ, tủ quần áo, văn phòng.",
    description: "[Mô tả máy hút ẩm.]",
    price: 2500000,
    sold: 17,
    sku: "KK-HA-MN",
    colors: [],
    sizes: [],
    specs: [
      { label: "Công suất hút", value: "[L/ngày]" },
      { label: "Diện tích phù hợp", value: "[m²]" },
    ],
    faqs: [],
  },
];
