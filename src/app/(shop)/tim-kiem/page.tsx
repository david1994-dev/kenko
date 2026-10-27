import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, ProductCard } from "@/components/ui";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Tìm kiếm",
  robots: { index: false, follow: true },
};

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase();
}

async function Results({ searchParams }: Pick<PageProps<"/tim-kiem">, "searchParams">) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const products = await getProducts();
  const found = query
    ? products.filter((p) => normalize(`${p.name} ${p.summary}`).includes(normalize(query)))
    : [];

  return (
    <>
      <h1 className="mb-1 text-2xl font-extrabold">
        {query ? `Kết quả cho “${query}”` : "Tìm kiếm"}
      </h1>
      <p className="mb-4 text-sm text-subtle">
        {query ? `${found.length} sản phẩm` : "Nhập từ khoá để tìm sản phẩm."}
      </p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-4 md:gap-x-5">
        {found.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </>
  );
}

export default function Page(props: PageProps<"/tim-kiem">) {
  return (
    <Container className="py-4 md:py-8">
      <Suspense fallback={<p className="text-subtle">Đang tìm…</p>}>
        <Results searchParams={props.searchParams} />
      </Suspense>
    </Container>
  );
}
