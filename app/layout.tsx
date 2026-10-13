import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Ngũ Cung (Five Tones) — Board Game Âm Nhạc Truyền Thống Việt Nam",
  description: "Card game giáo dục dựa trên ngũ âm và ngũ hành Việt Nam. Bộ bài 15 nhạc cụ, 45 lá bài mang hồn dân tộc vào trải nghiệm tương tác hiện đại.",
  keywords: ["Ngũ Cung", "board game Việt Nam", "nhạc cụ dân tộc", "ngũ âm", "ngũ hành", "Đông Hồ", "game giáo dục"],
  authors: [{ name: "Team 35" }],
  viewport: "width=device-width, initial-scale=1",
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
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-[#F2B632] selection:text-[#16141A]">
        {children}
      </body>
    </html>
  );
}
