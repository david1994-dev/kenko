import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactBar } from "@/components/contact-bar";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, site } from "@/lib/site";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} - ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b3c5d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className="flex min-h-screen flex-col pb-[68px] md:pb-0">
        <div className="bg-mist px-4 py-2 text-center text-[13px] font-semibold text-navy">
          Kiểm tra hàng khi nhận · Bảo hành chính hãng
        </div>
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
      </body>
    </html>
  );
}
