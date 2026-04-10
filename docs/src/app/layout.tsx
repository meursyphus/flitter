import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import GlobalSidebar from "@/components/global-sidebar";
import Providers from "./providers";
import "./globals.css";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-body",
});

const displayFont = Inter({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Flitter",
  description: "High-performance Canvas/SVG rendering engine for the web.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${pretendard.variable} ${displayFont.variable}`}
    >
      <head />
      <body className="bg-white text-neutral-900 antialiased">
        <Providers>
          <Header />
          <div className="mx-auto flex max-w-[1920px]">
            <GlobalSidebar />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
