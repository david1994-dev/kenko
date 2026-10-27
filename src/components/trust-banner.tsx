import { BoltIcon, CheckIcon, ShieldIcon } from "./icons";

const items = [
  { icon: CheckIcon, title: "Kiểm tra, test hàng chính hãng", sub: "Trước khi nhận hàng" },
  { icon: BoltIcon, title: "Ship hàng hoả tốc", sub: "Giao nhanh tận nơi" },
  { icon: ShieldIcon, title: "Bảo hành 12 tháng", sub: "Hàng chính hãng" },
];

export function TrustBanner() {
  return (
    <section aria-label="Cam kết của KENKO" className="bg-navy text-white">
      <ul className="mx-auto grid w-full max-w-[1200px] gap-1 px-4 py-3 md:grid-cols-3 md:gap-6 md:px-6 md:py-4">
        {items.map(({ icon: Icon, title, sub }) => (
          <li key={title} className="flex items-center gap-3 md:justify-center">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 md:size-12">
              <Icon size={22} strokeWidth={2.4} />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold md:text-base">{title}</span>
              <span className="block text-[13px] text-white/90">{sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
