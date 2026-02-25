import DocsLayout from "@/components/DocsLayout";
import { chartNav } from "@/lib/navigation";

export default function ChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayout sections={chartNav}>{children}</DocsLayout>;
}
