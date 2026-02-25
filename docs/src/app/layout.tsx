import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flitter",
  description:
    "High-performance Canvas/SVG rendering libraries for the web. Charts, diagrams, and beyond.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-white text-gray-900 antialiased">
        <header className="sticky top-0 z-50 flex h-14 items-center border-b border-gray-200 bg-white/80 px-6 backdrop-blur-sm">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Flitter
          </Link>
          <nav className="ml-8 flex gap-6">
            <Link
              href="/chart/getting-started"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Chart
            </Link>
            <Link
              href="/advanced/what-is-flitter"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Advanced
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <a
              href="https://github.com/anthropics/flitter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 transition-colors hover:text-gray-900"
            >
              GitHub
            </a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
