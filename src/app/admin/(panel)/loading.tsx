export default function Loading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Đang tải">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-line" />
      <div className="h-64 animate-pulse rounded-xl bg-white ring-1 ring-line" />
    </div>
  );
}
