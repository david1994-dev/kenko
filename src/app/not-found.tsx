import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="flex max-w-lg flex-col items-center py-16 text-center">
      <p className="mb-1 text-5xl font-extrabold text-teal">404</p>
      <h1 className="mb-2 text-xl font-bold">Không tìm thấy trang</h1>
      <p className="mb-6 text-muted">Trang bạn tìm không tồn tại hoặc đã được chuyển đi.</p>
      <ButtonLink href="/" className="w-full max-w-xs">
        Về trang chủ
      </ButtonLink>
    </Container>
  );
}
