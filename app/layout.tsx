import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  Noto_Serif_Bengali,
  Hind_Siliguri,
  JetBrains_Mono,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";

const shadhinata = localFont({
  src: [
    {
      path: "../public/font/Shadhinata_Unicode.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://www.rajshahimango.site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rajshahi Mango — বাগান থেকে সরাসরি তাজা আম",
    template: "%s | Rajshahi Mango",
  },
  description:
    "রাজশাহীর সেরা আম বাগান থেকে হাতে বাছাই করা, রাসায়নিকমুক্ত তাজা আম। হিমসাগর, গোপালভোগ, আমরুপালি — সরাসরি বাগান থেকে আপনার দরজায়।",
  keywords: [
    "রাজশাহী আম",
    "তাজা আম",
    "হিমসাগর আম",
    "গোপালভোগ আম",
    "আমরুপালি আম",
    "Rajshahi mango",
    "fresh mango Bangladesh",
    "buy mango online",
    "আম অর্ডার",
    "রাসায়নিকমুক্ত আম",
  ],
  authors: [{ name: "Rajshahi Mango" }],
  creator: "Rajshahi Mango",
  publisher: "Rajshahi Mango",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: SITE_URL,
    siteName: "Rajshahi Mango",
    title: "Rajshahi Mango — বাগান থেকে সরাসরি তাজা আম",
    description:
      "রাজশাহীর সেরা আম বাগান থেকে হাতে বাছাই করা, রাসায়নিকমুক্ত তাজা আম। সরাসরি বাগান থেকে আপনার দরজায়।",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rajshahi Mango — তাজা আম",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rajshahi Mango — বাগান থেকে সরাসরি তাজা আম",
    description:
      "রাজশাহীর সেরা আম বাগান থেকে হাতে বাছাই করা, রাসায়নিকমুক্ত তাজা আম।",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${shadhinata.variable} ${notoSerifBengali.variable} ${hindSiliguri.variable} ${jetbrainsMono.variable} bg-background`}
    >
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Rajshahi Mango",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              sameAs: [],
            }),
          }}
        />
        <QueryProvider>{children}</QueryProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
