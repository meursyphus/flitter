"use client";

import { useState } from "react";

export default function CodePreview({
  chart,
  code,
  height = 400,
}: {
  chart: React.ReactNode;
  code?: string;
  height?: number;
}) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!code) {
    return (
      <div
        className="rounded-lg border border-neutral-100 bg-white p-4"
        style={{ height }}
      >
        {chart}
      </div>
    );
  }

  return (
    <div>
      {/* Toggle bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1">
          <button
            onClick={() => setShowCode(false)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              !showCode
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setShowCode(true)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              showCode
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            }`}
          >
            Code
          </button>
        </div>
        {showCode && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" />
              <path d="M9.5 4.5V2.5a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1h2" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      {showCode ? (
        <div className="overflow-auto rounded-lg border border-neutral-200 bg-neutral-50">
          <pre className="p-4 text-[13px] leading-relaxed text-neutral-700">
            <code>{code}</code>
          </pre>
        </div>
      ) : (
        <div
          style={{ height }}
          className="rounded-lg border border-neutral-100 bg-white p-4 overflow-hidden"
        >
          {chart}
        </div>
      )}
    </div>
  );
}
