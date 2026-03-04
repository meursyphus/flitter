"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import FlitterLogo from "./flitter-logo";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <FlitterLogo size={22} />
            <span className="text-[22px] font-bold tracking-tight text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
              flitter-ui (지금 베타입니다잉)
            </span>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-neutral-100 md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-neutral-600">
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMenuOpen(false)} />
          <nav className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg border-l border-neutral-200">
            <div className="flex h-14 items-center justify-between border-b border-neutral-200 px-5">
              <span className="text-sm font-medium text-neutral-900">Menu</span>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-neutral-500">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>
            <div className="px-3 py-4 space-y-1">
              <Link
                href="/chart"
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  "block rounded-md px-3 py-2 text-sm transition-colors",
                  pathname.startsWith("/chart") ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
                )}
              >
                Chart
              </Link>
              <Link
                href="/integration"
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  "block rounded-md px-3 py-2 text-sm transition-colors",
                  pathname.startsWith("/integration") ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
                )}
              >
                Integration
              </Link>
              <Link
                href="/advanced/what-is-flitter"
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  "block rounded-md px-3 py-2 text-sm transition-colors",
                  pathname.startsWith("/advanced") ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
                )}
              >
                API Reference
              </Link>
              <a
                href="https://github.com/meursyphus/flitter"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
              >
                GitHub
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
