import type { Metadata } from "next";
import DocsLayout from "@/components/docs-layout";
import { chartNav } from "@/lib/navigation";

export const metadata: Metadata = {
  title: {
    default: "Chart",
    template: "%s | Flitter Chart",
  },
  description:
    "Every chart you need, in one library. Shadcn-style installable charts built on Flitter.",
  openGraph: {
    images: [
      {
        url: "/og/og-chart.png",
        width: 1200,
        height: 630,
        alt: "Flitter Chart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/og-chart.png"],
  },
};

export default function ChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocsLayout
      sections={chartNav.sections}
      noProse
      fullWidth
    >
      {children}
    </DocsLayout>
  );
}
