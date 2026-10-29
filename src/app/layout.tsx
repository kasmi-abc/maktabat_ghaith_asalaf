import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import FloatingContact from "@/components/floating-contact";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "مكتبة غيث السلف",
    template: "%s | مكتبة غيث السلف",
  },
  description:
    "مكتبة غيث السلف — متجر الكتب الإسلامية المتخصص في كتب السنة والعقيدة والسيرة والتفسير ومتون طالب العلم, توصيل لجميع الولايات مع الدفع عند الاستلام.",
  keywords: ["مكتبة غيث السلف", "متجر كتب", "كتب السنة", "عثُق"],
  openGraph: {
    title: "مكتبة غيث السلف | متجر الكتب الإسلامية",
    description: "متجر الكتب الإسلامية لعثّة السلف وفروع جميع الولايات.",
    images: ["/logo.jpg"],
    locale: "ar_DZ",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            <SiteHeader />
            <main className="min-h-[60vh]">{children}</main>
            <SiteFooter />
            <FloatingContact />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
