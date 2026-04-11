"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import { ecosystemNav } from "@/lib/navigation";

/**
 * Routes that have their own DocsLayout sidebar.
 * GlobalSidebar hides itself on these routes to avoid double sidebars.
 */
const ROUTES_WITH_OWN_SIDEBAR = ["/chart", "/advanced"];

export default function GlobalSidebar() {
  const pathname = usePathname();

  const hasOwnSidebar = ROUTES_WITH_OWN_SIDEBAR.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (hasOwnSidebar) {
    return null;
  }

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-neutral-100 bg-white md:block">
      <Sidebar sections={ecosystemNav.sections} />
    </aside>
  );
}
