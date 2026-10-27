export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Áo điều hoà", href: "/ao-dieu-hoa" },
  { label: "Áo sưởi ấm", href: "/ao-suoi-am" },
  { label: "Máy hút ẩm", href: "/may-hut-am" },
  { label: "Giảm giá", href: "/giam-gia" },
  { label: "Giải pháp", href: "/giai-phap" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
];

export const industries = [
  { slug: "xay-dung", name: "Xây dựng" },
  { slug: "nong-nghiep", name: "Nông nghiệp" },
  { slug: "co-khi", name: "Cơ khí" },
  { slug: "dien-luc", name: "Điện lực" },
  { slug: "y-te", name: "Y tế" },
  { slug: "giao-duc", name: "Giáo dục" },
  { slug: "du-lich", name: "Du lịch" },
  { slug: "the-thao", name: "Thể thao" },
];

export const policies = [
  { slug: "bao-hanh", name: "Chính sách bảo hành" },
  { slug: "doi-tra", name: "Đổi trả và hoàn tiền" },
  { slug: "giao-hang", name: "Giao hàng và kiểm hàng" },
  { slug: "thanh-toan", name: "Thanh toán" },
  { slug: "bao-mat", name: "Bảo mật thông tin" },
];

export const howItWorks = [
  {
    title: "Quạt nhỏ gắn ở lưng áo",
    body: "Hút không khí bên ngoài vào bên trong áo.",
  },
  {
    title: "Luồng khí lưu thông trong áo",
    body: "Khí chạy dọc cơ thể, làm bay hơi mồ hôi nhanh hơn.",
  },
  {
    title: "Cơ thể mát, khô thoáng",
    body: "Pin sạc dùng cả ca làm việc. [Thời lượng pin]",
  },
];

export const articles = [
  {
    slug: "cach-chon-size-ao-dieu-hoa",
    title: "Cách chọn size áo điều hoà vừa vặn",
    excerpt: "Quy đổi chiều cao, cân nặng sang size và những lưu ý khi mặc nhiều lớp.",
    date: "2026-10-01",
    body: ["[Nội dung bài viết về cách chọn size.]"],
  },
  {
    slug: "huong-dan-su-dung-bao-quan-ao-dieu-hoa",
    title: "Hướng dẫn sử dụng và bảo quản áo điều hoà",
    excerpt: "Cách sạc pin, bật quạt, giặt và cất áo đúng cách để dùng bền.",
    date: "2026-10-05",
    body: ["[Nội dung bài viết về sử dụng và bảo quản.]"],
  },
  {
    slug: "ao-dieu-hoa-cho-cong-nhan-xay-dung",
    title: "Áo điều hoà cho công nhân làm việc ngoài trời",
    excerpt: "Vì sao làm mát chủ động giúp giảm mệt mỏi khi làm việc dưới nắng.",
    date: "2026-10-12",
    body: ["[Nội dung bài viết về ứng dụng ngoài trời.]"],
  },
];

export const sizeChart = {
  head: ["Size", "Chiều cao (cm)", "Cân nặng (kg)"],
  rows: [
    ["S", "[...]", "[...]"],
    ["M", "[...]", "[...]"],
    ["L", "[...]", "[...]"],
    ["XL", "[...]", "[...]"],
    ["XXL", "[...]", "[...]"],
  ],
};

export const generalFaqs = [
  { q: "Áo điều hoà hoạt động như thế nào?", a: "Quạt nhỏ hút không khí vào áo, luồng khí lưu thông giúp mồ hôi bay hơi nhanh và cơ thể mát hơn." },
  { q: "Pin dùng được bao lâu?", a: "[Thời lượng pin theo từng mức quạt]" },
  { q: "Áo có giặt được không?", a: "[Hướng dẫn giặt]" },
  { q: "Chính sách đổi trả thế nào?", a: "[Điều kiện đổi trả]" },
];
