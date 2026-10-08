"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import type { NavItem, NavSection } from "@/lib/navigation";

/** Typography for MDX pages. Colors come from `.docs-prose` in globals.css. */
export const PROSE_CLASS =
  "docs-prose prose prose-sm mx-auto max-w-3xl prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-xl prose-h3:text-lg prose-pre:rounded-lg prose-pre:text-sm";

export default function DocsLayout({
  sections,
  home,
  product,
  noProse = false,
  fullWidth = false,
  children,
}: {
  sections: NavSection[];
  home?: NavItem;
  /** Sets the accent color for this section ("chart" | "diagram" | "core"). */
  product?: string;
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
    <div data-product={product} className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1920px]">
      {/* Desktop sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-line md:block">
        <Sidebar sections={sections} home={home} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={closeSidebar} />
          <aside className="animate-slide-in-left absolute inset-y-0 left-0 w-72 border-r border-line bg-canvas">
            <div className="flex h-12 items-center justify-between border-b border-line px-4">
              <span className="text-[13px] font-semibold text-ink">Navigation</span>
              <button
                onClick={closeSidebar}
                className="rounded-md p-1 text-faint hover:text-ink"
                aria-label="Close sidebar"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            <Sidebar sections={sections} home={home} onLinkClick={closeSidebar} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main
        className={
          fullWidth
            ? "min-w-0 flex-1 overflow-x-clip"
            : "min-w-0 flex-1 overflow-x-clip px-5 py-8 md:px-10 lg:px-16 lg:py-14"
        }
      >
        <div className={fullWidth ? "px-5 pt-4 md:hidden" : "mb-4 md:hidden"}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs font-medium text-soft hover:text-ink"
            aria-label="Open sidebar navigation"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 4h12M2 8h12M2 12h12" />
            </svg>
            Menu
          </button>
        </div>
        <article className={fullWidth ? "" : noProse ? "mx-auto max-w-4xl" : PROSE_CLASS}>
          {children}
        </article>
      </main>
    </div>
  );
}
