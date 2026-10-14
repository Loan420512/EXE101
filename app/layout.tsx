import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import UniverseRoot from "@/components/UniverseRoot";
import BottomNav from "@/components/BottomNav";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  weight: ["600", "700", "800", "900"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#D23A22",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ngucung.vn"),
  title: {
    default: "Ngũ Cung — Bộ Bài Âm Nhạc Dân Gian (7+)",
    template: "%s | Ngũ Cung",
  },
  description:
    "Thu thập ngũ hành. Nghe văn hóa. Bộ bài âm nhạc dân gian Việt Nam dành cho gia đình và trẻ em 7+. 15 nhạc cụ, 45 lá bài in khắc phong cách tranh Đông Hồ.",
  keywords: [
    "Ngũ Cung",
    "board game Việt Nam",
    "nhạc cụ dân tộc",
    "ngũ âm",
    "ngũ hành",
    "tranh Đông Hồ",
    "game giáo dục 7+",
    "đàn đá",
    "trống đồng",
  ],
  authors: [{ name: "Ngũ Cung Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Ngũ Cung — Bộ Bài Âm Nhạc Dân Gian (7+)",
    description: "Thu thập ngũ hành. Nghe văn hóa. Khám phá 15 nhạc cụ cổ truyền và thi đấu tương sinh tương khắc.",
    url: "https://ngucung.vn",
    siteName: "Ngũ Cung Board Game",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/logo/logongucung.png",
        width: 676,
        height: 369,
        alt: "Logo Ngũ Cung Card Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ngũ Cung — Bộ Bài Âm Nhạc Dân Gian (7+)",
    description: "Bộ bài card game giáo dục âm nhạc truyền thống Việt Nam dành cho bé từ 7 tuổi và gia đình.",
    images: ["/images/logo/logongucung.png"],
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "Game",
  "name": "Ngũ Cung",
  "alternateName": "Five Tones Board Game",
  "description": "Card game giáo dục âm nhạc dân tộc Việt Nam dựa trên thang ngũ âm (Cung, Thương, Giốc, Chủy, Vũ) và chu trình ngũ hành.",
  "genre": ["Educational Game", "Card Game", "Cultural Music"],
  "numberOfPlayers": {
    "@type": "QuantitativeValue",
    "minValue": 2,
    "maxValue": 5,
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "Trẻ em từ 7 tuổi, học sinh và gia đình",
    "suggestedMinAge": 7,
  },
  "inLanguage": "vi",
  "publisher": {
    "@type": "Organization",
    "name": "Dự án Ngũ Cung",
    "url": "https://ngucung.vn",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${playfairDisplay.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
        <link rel="preload" as="image" type="image/webp" href="/images/backgroundweb/nen-mac-dinh-1280.webp" />
        <link rel="preload" as="image" type="image/webp" href="/images/backgroundweb/canh-tho-1280.webp" />
        <link rel="preload" as="image" type="image/webp" href="/images/backgroundweb/canh-kim-1280.webp" />
        <link rel="preload" as="image" type="image/webp" href="/images/backgroundweb/canh-moc-1280.webp" />
        <link rel="preload" as="image" type="image/webp" href="/images/backgroundweb/canh-hoa-1280.webp" />
        <link rel="preload" as="image" type="image/webp" href="/images/backgroundweb/canh-thuy-1280.webp" />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-[#F2B632] selection:text-[#16141A]" suppressHydrationWarning>
        {/* WCAG 2.2 AA Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#D23A22] focus:text-white focus:font-black focus:rounded-lg focus:shadow-lg focus:border-2 focus:border-black"
        >
          Bỏ qua đến nội dung chính
        </a>

        <UniverseRoot>
          <div id="main-content" className="flex-1 flex flex-col pb-16 md:pb-0" suppressHydrationWarning>
            {children}
          </div>
          <BottomNav />
        </UniverseRoot>

        {/* PWA Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').catch(function() {});
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
