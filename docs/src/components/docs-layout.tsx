"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1920px]">
      {/* Desktop sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-neutral-100 bg-white md:block">
        <Sidebar
          sections={sections}
          home={home}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={closeSidebar} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-lg animate-slide-in-left">
            <div className="flex h-12 items-center justify-between border-b border-neutral-100 px-4">
              <span className="text-[13px] font-semibold text-neutral-700">Navigation</span>
              <button
                onClick={closeSidebar}
                className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                aria-label="Close sidebar"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            <Sidebar
              sections={sections}
              home={home}
              onLinkClick={closeSidebar}
            />
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
        <article className={fullWidth ? "" : noProse ? "mx-auto max-w-4xl" : "prose prose-neutral prose-sm mx-auto max-w-3xl prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-lg prose-pre:text-sm prose-a:text-neutral-900 prose-a:no-underline hover:prose-a:underline"}>
          {children}
        </article>
      </main>
    </div>
  );
}
