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
  metadataBase: new URL("https://ui.flitter.dev"),
  title: {
    default: "Flitter",
    template: "%s | Flitter",
  },
  description:
    "High-performance Canvas/SVG rendering engine for the web. Build interactive charts, graphics, and UIs with a Flutter-like declarative API.",
  keywords: [
    "flitter",
    "rendering engine",
    "canvas",
    "svg",
    "data visualization",
    "charts",
    "javascript",
    "flutter-like",
    "ui framework",
    "typescript",
  ],
  authors: [{ name: "Daeseung Moon" }],
  creator: "Daeseung Moon",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ui.flitter.dev",
    siteName: "Flitter",
    title: "Flitter",
    description:
      "High-performance Canvas/SVG rendering engine for the web.",
    images: [
      {
        url: "/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "Flitter — Canvas/SVG rendering engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flitter",
    description:
      "High-performance Canvas/SVG rendering engine for the web.",
    images: ["/og/og-default.png"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Flitter",
              url: "https://ui.flitter.dev",
              description:
                "High-performance Canvas/SVG rendering engine for the web.",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              author: {
                "@type": "Person",
                name: "Daeseung Moon",
              },
              license: "https://opensource.org/licenses/MIT",
            }),
          }}
        />
      </head>
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
