import type { Metadata } from "next";
import DocsLayout from "@/components/docs-layout";
import { advancedNav } from "@/lib/navigation";

export const metadata: Metadata = {
  title: {
    default: "Advanced",
    template: "%s | Flitter",
  },
  description:
    "Core concepts, widget reference, and advanced guides for the Flitter rendering engine.",
};

export default function AdvancedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayout sections={advancedNav}>{children}</DocsLayout>;
}
