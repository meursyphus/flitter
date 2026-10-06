"use client";

import { useState } from "react";

/** A shell command with a copy button. */
export default function CopyCommand({
  command,
  className = "",
}: {
  command: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={`code-surface inline-flex max-w-full items-center gap-3 rounded-lg py-1.5 pl-4 pr-1.5 text-[13px] ${className}`}
    >
      <code className="truncate !border-0 !bg-transparent !p-0 text-ink">
        <span className="select-none text-accent">$ </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : `Copy command: ${command}`}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-faint transition-colors hover:bg-line hover:text-ink"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M3 7.5l3 3 5-6" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" />
            <path d="M9.5 4.5V2.5a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1h2" />
          </svg>
        )}
      </button>
    </div>
  );
}
