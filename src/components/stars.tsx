import { formatRating } from "@/lib/format";
import type { Rating } from "@/lib/types";

const STAR = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z";

function Row({ color, size }: { color: string; size: number }) {
  return (
    <span className="flex" style={{ color }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}

export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const pct = Math.max(0, Math.min(5, value)) * 20;
  return (
    <span className="relative inline-block" aria-hidden="true">
      <Row color="#d9cfb8" size={size} />
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <Row color="#f59e0b" size={size} />
      </span>
    </span>
  );
}

export function RatingLine({ rating, size = 14 }: { rating: Rating; size?: number }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[13px]"
      role="img"
      aria-label={`${formatRating(rating.avg)} trên 5 sao, ${rating.count} đánh giá`}
    >
      <Stars value={rating.avg} size={size} />
      <span className="font-bold text-ink">{formatRating(rating.avg)}</span>
      <span className="text-subtle">({rating.count})</span>
    </span>
  );
}

export function Star({ filled, size = 24 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={STAR} fill={filled ? "#f59e0b" : "#d9cfb8"} />
    </svg>
  );
}
