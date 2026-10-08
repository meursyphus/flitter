import type { Metadata } from "next";
import DocsLayout from "@/components/docs-layout";
import { diagramNav } from "@/lib/navigation";

export const metadata: Metadata = {
  title: {
    default: "Diagram",
    template: "%s | Flitter Diagram",
  },
  description:
    "Node and edge editors with React Flow's interactions, drawn by Flitter on SVG or Canvas.",
  openGraph: {
    images: [
      {
        url: "/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "Flitter Diagram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/og-default.png"],
  },
};

export default function DiagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocsLayout sections={diagramNav.sections} product="diagram" noProse fullWidth>
      {children}
    </DocsLayout>
  );
}
