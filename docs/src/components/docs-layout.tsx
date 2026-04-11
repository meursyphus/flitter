"use client";

import Sidebar from "./sidebar";
import type { NavItem, NavSection } from "@/lib/navigation";

export default function DocsLayout({
  sections,
  home,
  noProse = false,
  fullWidth = false,
  children,
}: {
  sections: NavSection[];
  home?: NavItem;
  noProse?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1920px]">
      {/* Desktop sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-neutral-100 bg-white md:block">
        <Sidebar
          sections={sections}
          home={home}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-x-hidden px-6 py-8 md:px-10 lg:px-16 lg:py-14">
        <article className={fullWidth ? "" : noProse ? "mx-auto max-w-4xl" : "prose prose-neutral prose-sm mx-auto max-w-3xl prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-lg prose-pre:text-sm prose-a:text-neutral-900 prose-a:no-underline hover:prose-a:underline"}>
          {children}
        </article>
      </main>
    </div>
  );
}
