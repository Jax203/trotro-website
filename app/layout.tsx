import type { Metadata, Viewport } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.jointrotro.com"),
  title: {
    default: "TroTro — A better ride to school. A calmer morning.",
    template: "%s | TroTro",
  },
  description:
    "Thoughtfully coordinated school transportation, documented driver verification and helpful ride updates. Check availability for your school and neighborhood.",
  openGraph: {
    type: "website",
    siteName: "TroTro",
    locale: "en_US",
    images: [
      {
        url: "/images/hero.webp",
        width: 1800,
        height: 1000,
        alt: "An illustrative school morning with a family and driver",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#243F34" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
