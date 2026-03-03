"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function GlobalSidebar() {
  const pathname = usePathname();

  // Only show on landing page
  if (pathname !== "/") return null;

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-48 shrink-0 overflow-y-auto border-r border-neutral-100 bg-white md:block">
      <nav className="px-4 py-6">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
          Libraries
        </p>

        <div className="space-y-1">
          <Link
            href="/chart"
            className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
          >
            Chart
          </Link>
          <span className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-neutral-300 cursor-default">
            Diagram
          </span>
        </div>

        <div className="mt-6 border-t border-neutral-100 pt-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Guide
          </p>
          <div className="space-y-1">
            <Link
              href="/integration"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
            >
              Integration
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-neutral-100 pt-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Reference
          </p>
          <div className="space-y-1">
            <Link
              href="/advanced/what-is-flitter"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
            >
              Core API
            </Link>
            <a
              href="https://github.com/meursyphus/flitter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>
    </aside>
  );
}
