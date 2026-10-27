import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Giỏ hàng và thanh toán",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <div className="bg-ground py-4 md:py-8">
      <Container>
        <h1 className="mb-4 text-xl font-extrabold md:text-3xl">Giỏ hàng · Thanh toán</h1>
        <CartView />
      </Container>
    </div>
  );
}
