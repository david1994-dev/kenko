import { BoltIcon, CheckIcon, GiftIcon, ShieldIcon } from "./icons";

const items = [
  { icon: CheckIcon, title: "Kiểm tra, test hàng chính hãng", sub: "Trước khi thanh toán nhận hàng" },
  { icon: GiftIcon, title: "Miễn phí vận chuyển", sub: "Freeship" },
  { icon: BoltIcon, title: "Ship hàng hoả tốc", sub: "Giao nhanh tận nơi" },
  { icon: ShieldIcon, title: "Bảo hành 12 tháng", sub: "Hàng chính hãng" },
];

export function TrustBanner() {
  return (
    <section aria-label="Cam kết của KENKO STORE" className="bg-navy text-white">
      <ul className="mx-auto grid w-full max-w-[1200px] gap-1 px-4 py-3 md:grid-cols-4 md:gap-4 md:px-6 md:py-4">
        {items.map(({ icon: Icon, title, sub }) => (
          <li key={title} className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 md:size-11">
              <Icon size={22} strokeWidth={2.4} />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold">{title}</span>
              <span className="block text-[13px] text-white/90">{sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
