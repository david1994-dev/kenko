import { Container } from "./ui";

export function PageSkeleton() {
  return (
    <Container className="py-6" aria-hidden="true">
      <div className="mb-4 h-8 w-2/3 animate-pulse rounded-lg bg-ground" />
      <div className="aspect-square w-full animate-pulse rounded-xl bg-ground md:aspect-video" />
    </Container>
  );
}
