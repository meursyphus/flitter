import Sidebar from "./Sidebar";
import type { NavSection } from "@/lib/navigation";

export default function DocsLayout({
  sections,
  children,
}: {
  sections: NavSection[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar sections={sections} />
      <main className="flex-1 overflow-x-hidden px-8 py-8">
        <div className="prose prose-gray mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
