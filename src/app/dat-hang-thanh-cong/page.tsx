import type { Metadata } from "next";
import { ButtonLink, Container } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Đặt hàng thành công",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Container className="flex max-w-lg flex-col items-center py-14 text-center">
      <span className="mb-4 flex size-16 items-center justify-center rounded-full bg-mist text-teal">
        <CheckIcon size={32} />
      </span>
      <h1 className="mb-2 text-2xl font-extrabold">Cảm ơn bạn đã đặt hàng</h1>
      <p className="mb-6 text-muted">
        Chúng tôi sẽ gọi xác nhận đơn trong thời gian sớm nhất. Cần hỗ trợ gấp, vui lòng gọi hotline {site.hotline}.
      </p>
      <ButtonLink href="/" className="w-full max-w-xs">
        Về trang chủ
      </ButtonLink>
    </Container>
  );
}
