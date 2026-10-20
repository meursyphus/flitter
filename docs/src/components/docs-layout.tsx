"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import MobileDrawer from "./mobile-drawer";
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
      <MobileDrawer
        id="docs-navigation"
        open={sidebarOpen}
        onClose={closeSidebar}
        title="Navigation"
        closeLabel="Close sidebar"
      >
        <Sidebar sections={sections} home={home} onLinkClick={closeSidebar} />
      </MobileDrawer>

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
            type="button"
            onClick={(event) => {
              // Safari does not focus buttons on touch; let the dialog restore it.
              event.currentTarget.focus();
              setSidebarOpen(true);
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3 text-sm font-medium text-soft hover:text-ink"
            aria-label="Open sidebar navigation"
            aria-expanded={sidebarOpen}
            aria-controls="docs-navigation"
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
