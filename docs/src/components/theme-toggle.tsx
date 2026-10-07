"use client";

import { useTheme } from "@/lib/use-theme";

/**
 * Both icons are always rendered and swapped with the theme variants, so the
 * markup is identical whichever theme the server stamped on <html>.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Switch color theme"
      title="Switch color theme"
      className={`flex h-9 w-9 items-center justify-center rounded-md border border-line text-soft transition-colors hover:border-line-strong hover:text-ink ${className}`}
    >
      {/* Shown in dark: sun = switch to light */}
      <svg
        className="light:hidden"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
      </svg>
      {/* Shown in light: moon = switch to dark */}
      <svg
        className="dark:hidden"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1Z" />
      </svg>
    </button>
  );
}
