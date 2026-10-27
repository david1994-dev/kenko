import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { ChevronDownIcon } from "@/components/icons";
import { generalFaqs } from "@/data/content";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp",
  description: "Giải đáp về cách hoạt động, pin, giặt, đổi trả của áo điều hoà KENKO.",
  alternates: { canonical: "/cau-hoi-thuong-gap" },
};

export default function Page() {
  return (
    <ContentPage title="Câu hỏi thường gặp" crumbs={[{ name: "Câu hỏi thường gặp", href: "/cau-hoi-thuong-gap" }]}>
      <div className="border-t border-line">
        {generalFaqs.map((f) => (
          <details key={f.q} className="group border-b border-line">
            <summary className="flex min-h-[52px] items-center justify-between gap-3 font-bold">
              {f.q}
              <ChevronDownIcon size={16} strokeWidth={2.5} className="shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-4 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: generalFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </ContentPage>
  );
}
