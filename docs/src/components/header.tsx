"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { DISCORD_URL, GITHUB_REPO_URL } from "@/lib/site-config";
import FlitterLogo from "./flitter-logo";
import ThemeToggle from "./theme-toggle";

const PRODUCTS = [
  { id: "chart", label: "Chart", href: "/chart", match: "/chart" },
  {
    id: "core",
    label: "Core",
    href: "/advanced/what-is-flitter",
    match: "/advanced",
  },
] as const;

const NAV_LINKS = [
  { label: "Chart", href: "/chart", match: "/chart" },
  { label: "Gallery", href: "/chart/gallery", match: "/chart/gallery" },
  { label: "Core API", href: "/advanced/what-is-flitter", match: "/advanced" },
  { label: "Integration", href: "/integration", match: "/integration" },
];

function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function DiscordIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.369A19.79 19.79 0 0015.885 3c-.191.328-.403.769-.554 1.112a18.27 18.27 0 00-5.325 0A11.64 11.64 0 009.45 3a19.736 19.736 0 00-4.433 1.37C2.21 8.58 1.45 12.687 1.824 16.737a19.9 19.9 0 005.436 2.763c.438-.6.828-1.235 1.165-1.905a12.955 12.955 0 01-1.833-.877c.154-.112.305-.23.45-.352 3.534 1.659 7.365 1.659 10.857 0 .148.122.299.24.45.352a12.89 12.89 0 01-1.837.879c.338.669.728 1.304 1.166 1.903a19.86 19.86 0 005.438-2.763c.438-4.695-.747-8.765-3.799-12.368zM8.02 14.31c-1.06 0-1.932-.965-1.932-2.15 0-1.186.852-2.15 1.932-2.15 1.09 0 1.95.974 1.932 2.15 0 1.185-.852 2.15-1.932 2.15zm7.96 0c-1.06 0-1.932-.965-1.932-2.15 0-1.186.852-2.15 1.932-2.15 1.09 0 1.95.974 1.932 2.15 0 1.185-.842 2.15-1.932 2.15z" />
    </svg>
  );
}

function isUnder(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const product = PRODUCTS.find((p) => isUnder(pathname, p.match));

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Most specific match wins, so "Gallery" beats "Chart" inside the gallery.
  const activeLink = NAV_LINKS.filter((link) => isUnder(pathname, link.match)).sort(
    (a, b) => b.match.length - a.match.length,
  )[0];

  return (
    <>
      <header
        data-product={product?.id}
        className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between gap-4 px-5">
          {/* Brand + current product */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <FlitterLogo size={26} />
              <span className="wordmark text-[18px] text-ink">FLITTER</span>
            </Link>

            {product && (
              <Link href={product.href} className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-[3px] bg-accent" />
                <span className="wordmark text-[15px] uppercase text-accent">
                  {product.label}
                </span>
              </Link>
            )}
          </div>

          <div className="hidden items-center gap-1 md:flex">
            <nav aria-label="Primary" className="mr-3 flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={activeLink === link ? "page" : undefined}
                  className={clsx(
                    "rounded-md px-3 py-1.5 text-[14px] font-medium transition-colors",
                    activeLink === link
                      ? "text-ink"
                      : "text-soft hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <ThemeToggle />
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Flitter on GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-md text-soft transition-colors hover:text-ink"
            >
              <GitHubIcon />
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Flitter Discord"
              className="flex h-9 w-9 items-center justify-center rounded-md text-soft transition-colors hover:text-ink"
            >
              <DiscordIcon />
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-soft"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 4.5h12M3 9h12M3 13.5h12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <nav
            aria-label="Menu"
            className="absolute right-0 top-0 h-full w-64 border-l border-line bg-canvas"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <span className="text-[13px] font-semibold text-ink">Menu</span>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-md text-soft hover:text-ink"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 2l10 10M12 2L2 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col px-3 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "rounded-md px-3 py-2.5 text-[15px] font-medium",
                    activeLink === link ? "bg-surface text-ink" : "text-soft",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-line px-5 py-4">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Flitter on GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-soft"
              >
                <GitHubIcon size={18} />
              </a>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Flitter Discord"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-soft"
              >
                <DiscordIcon size={18} />
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
