import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ClearCart } from "@/components/clear-cart";
import { CheckIcon } from "@/components/icons";
import { ButtonLink, Container } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Đặt hàng thành công",
  robots: { index: false, follow: false },
};

async function OrderCode({ searchParams }: Pick<PageProps<"/dat-hang-thanh-cong">, "searchParams">) {
  const { code } = await searchParams;
  const value = Array.isArray(code) ? code[0] : code;
  if (!value || !/^KK-[A-Z0-9]{6}$/.test(value)) return null;
  return (
    <p className="mb-2 text-sm">
      Mã đơn hàng: <strong className="text-base tracking-wider">{value}</strong>
    </p>
  );
}

export default function Page(props: PageProps<"/dat-hang-thanh-cong">) {
  return (
    <Container className="flex max-w-lg flex-col items-center py-14 text-center">
      <ClearCart />
      <span className="mb-4 flex size-16 items-center justify-center rounded-full bg-mist text-navy">
        <CheckIcon size={32} />
      </span>
      <h1 className="mb-2 text-2xl font-extrabold">Cảm ơn bạn đã đặt hàng</h1>
      <Suspense fallback={null}>
        <OrderCode searchParams={props.searchParams} />
      </Suspense>
      <p className="mb-6 text-muted">
        Chúng tôi sẽ gọi xác nhận đơn trong thời gian sớm nhất. Cần hỗ trợ gấp, vui lòng gọi hotline {site.hotline}.
      </p>
      <p className="mb-6 text-sm text-muted">
        Sau khi nhận hàng, bạn có thể đánh giá sản phẩm tại <Link href="/danh-gia" className="font-semibold text-navy underline">trang đánh giá</Link> bằng mã đơn ở trên.
      </p>
      <ButtonLink href="/" className="w-full max-w-xs">
        Về trang chủ
      </ButtonLink>
    </Container>
  );
}
