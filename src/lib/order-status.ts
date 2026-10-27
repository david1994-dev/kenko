export const statusLabel = {
  new: "Mới",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã huỷ",
  returned: "Hoàn trả",
} as const;

export type StatusKey = keyof typeof statusLabel;

export const statusStyle: Record<StatusKey, string> = {
  new: "bg-[#fff1c2] text-[#6b4a00]",
  confirmed: "bg-[#dbe7ff] text-[#1f3a8a]",
  shipping: "bg-[#e0f0fa] text-[#0b4f73]",
  delivered: "bg-[#dcf3e2] text-[#14532d]",
  cancelled: "bg-[#fde2e2] text-[#8a1c1c]",
  returned: "bg-[#ece6dc] text-[#4a4333]",
};

export function formatDateTime(d: Date) {
  return d.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "short" });
}
