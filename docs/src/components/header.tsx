"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DISCORD_URL, GITHUB_REPO_URL } from "@/lib/site-config";
import FlitterLogo from "./flitter-logo";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isLanding = pathname === "/";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between px-5">
          {/* Left: Brand + product nav */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <FlitterLogo size={28} />
              <span className="text-[20px] font-black tracking-tight text-gray-900">
                FLITTER
              </span>
            </Link>

            {/* Product indicator — like TanStack QUERY */}
            {!isLanding && pathname.startsWith("/chart") && (
              <Link href="/chart" className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-sm bg-rose-500" />
                <span className="text-[17px] font-black tracking-tight text-rose-500">
                  CHART
                </span>
              </Link>
            )}
            {!isLanding && pathname.startsWith("/advanced") && (
              <Link
                href="/advanced/what-is-flitter"
                className="flex items-center gap-1.5"
              >
                <span className="h-3.5 w-3.5 rounded-sm bg-violet-400" />
                <span className="text-[17px] font-black tracking-tight text-violet-500">
                  CORE
                </span>
              </Link>
            )}
          </div>

          {/* Right: community links */}
          <div className="hidden items-center gap-2 md:flex">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub"
              className="flex h-10 w-10 items-center justify-center text-gray-900"
            >
              <svg width="30" height="30" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join Discord"
              className="flex h-10 w-10 items-center justify-center text-[#4752C4]"
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.317 4.369A19.79 19.79 0 0015.885 3c-.191.328-.403.769-.554 1.112a18.27 18.27 0 00-5.325 0A11.64 11.64 0 009.45 3a19.736 19.736 0 00-4.433 1.37C2.21 8.58 1.45 12.687 1.824 16.737a19.9 19.9 0 005.436 2.763c.438-.6.828-1.235 1.165-1.905a12.955 12.955 0 01-1.833-.877c.154-.112.305-.23.45-.352 3.534 1.659 7.365 1.659 10.857 0 .148.122.299.24.45.352a12.89 12.89 0 01-1.837.879c.338.669.728 1.304 1.166 1.903a19.86 19.86 0 005.438-2.763c.438-4.695-.747-8.765-3.799-12.368zM8.02 14.31c-1.06 0-1.932-.965-1.932-2.15 0-1.186.852-2.15 1.932-2.15 1.09 0 1.95.974 1.932 2.15 0 1.185-.852 2.15-1.932 2.15zm7.96 0c-1.06 0-1.932-.965-1.932-2.15 0-1.186.852-2.15 1.932-2.15 1.09 0 1.95.974 1.932 2.15 0 1.185-.842 2.15-1.932 2.15z" />
              </svg>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-gray-100 md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-500">
              <path d="M3 4.5h12M3 9h12M3 13.5h12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMenuOpen(false)} />
          <nav className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg border-l border-gray-200">
            <div className="flex h-14 items-center justify-between border-b border-gray-100 px-5">
              <span className="text-[13px] font-bold text-gray-900">Menu</span>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-400">
                  <path d="M2 2l10 10M12 2L2 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 px-3 py-4">
              <div className="flex items-center gap-2">
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open GitHub"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gray-700">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </a>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join Discord"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 text-[#5865F2] hover:bg-gray-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.317 4.369A19.79 19.79 0 0015.885 3c-.191.328-.403.769-.554 1.112a18.27 18.27 0 00-5.325 0A11.64 11.64 0 009.45 3a19.736 19.736 0 00-4.433 1.37C2.21 8.58 1.45 12.687 1.824 16.737a19.9 19.9 0 005.436 2.763c.438-.6.828-1.235 1.165-1.905a12.955 12.955 0 01-1.833-.877c.154-.112.305-.23.45-.352 3.534 1.659 7.365 1.659 10.857 0 .148.122.299.24.45.352a12.89 12.89 0 01-1.837.879c.338.669.728 1.304 1.166 1.903a19.86 19.86 0 005.438-2.763c.438-4.695-.747-8.765-3.799-12.368zM8.02 14.31c-1.06 0-1.932-.965-1.932-2.15 0-1.186.852-2.15 1.932-2.15 1.09 0 1.95.974 1.932 2.15 0 1.185-.852 2.15-1.932 2.15zm7.96 0c-1.06 0-1.932-.965-1.932-2.15 0-1.186.852-2.15 1.932-2.15 1.09 0 1.95.974 1.932 2.15 0 1.185-.842 2.15-1.932 2.15z" />
                  </svg>
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
