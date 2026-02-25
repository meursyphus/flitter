import DocsLayout from "@/components/DocsLayout";
import { advancedNav } from "@/lib/navigation";

export default function AdvancedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayout sections={advancedNav}>{children}</DocsLayout>;
}
