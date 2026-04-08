import DocsLayout from "@/components/docs-layout";
import { chartNav } from "@/lib/navigation";

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
