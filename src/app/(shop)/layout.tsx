import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactBar } from "@/components/contact-bar";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, site } from "@/lib/site";

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col pb-[68px] md:pb-0">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Suspense fallback={null}>
        <ContactBar />
      </Suspense>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.name,
          url: absoluteUrl("/"),
          description: site.description,
        }}
      />
    </div>
  );
}
