"use client";

export function QuantityStepper({
  value,
  onChange,
  label = "Số lượng",
}: {
  value: number;
  onChange: (next: number) => void;
  label?: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-lg border border-edge">
      <button
        type="button"
        aria-label="Giảm số lượng"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className="flex size-11 items-center justify-center text-xl disabled:opacity-40"
      >
        −
      </button>
      <span className="min-w-8 text-center font-bold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Tăng số lượng"
        onClick={() => onChange(value + 1)}
        className="flex size-11 items-center justify-center text-xl"
      >
        +
      </button>
    </div>
  );
}
