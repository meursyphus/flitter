import type { Metadata } from "next";
import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";
import Header from "@/components/Header";
import GlobalSidebar from "@/components/GlobalSidebar";
import "./globals.css";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-body",
});
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Flitter",
  description:
    "High-performance Canvas/SVG rendering engine for the web.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pretendard.variable} ${instrumentSerif.variable}`}>
      <body className="bg-white text-neutral-900 antialiased" style={{ fontFamily: "var(--font-body)" }}>
        <Header />
        <div className="flex">
          <GlobalSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </body>
    </html>
  );
}
