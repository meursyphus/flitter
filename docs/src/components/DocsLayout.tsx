"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import type { NavSection } from "@/lib/navigation";

export default function DocsLayout({
  sections,
  children,
}: {
  sections: NavSection[];
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Desktop sidebar */}
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-52 shrink-0 border-r border-neutral-100 bg-white md:block">
        <Sidebar sections={sections} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={closeSidebar} />
          <aside className="absolute inset-y-0 left-0 w-60 bg-white shadow-lg animate-slide-in-left">
            <div className="flex h-14 items-center justify-between border-b border-neutral-100 px-4">
              <span className="text-sm font-medium text-neutral-700">Navigation</span>
              <button
                onClick={closeSidebar}
                className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                aria-label="Close sidebar"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 5l8 8M13 5l-8 8" />
                </svg>
              </button>
            </div>
            <Sidebar sections={sections} onLinkClick={closeSidebar} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-x-hidden px-6 py-8 md:px-10">
        {/* Mobile menu button */}
        <div className="mb-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
            aria-label="Open sidebar navigation"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 4h12M2 8h12M2 12h12" />
            </svg>
            Menu
          </button>
        </div>
        <article className="prose prose-neutral prose-sm mx-auto max-w-3xl prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-lg prose-pre:text-sm prose-a:text-neutral-900 prose-a:no-underline hover:prose-a:underline">
          {children}
        </article>
      </main>
    </div>
  );
}
