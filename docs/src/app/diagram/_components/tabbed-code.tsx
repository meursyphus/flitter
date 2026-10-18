"use client";

import { useState } from "react";
import CopyButton from "./copy-button";

export type CodeFile = { filename: string; code: string; html: string };

/** Pre-highlighted files behind tabs; Copy delivers the exact file. */
export default function TabbedCode({ files }: { files: CodeFile[] }) {
  const [active, setActive] = useState(0);
  const file = files[active];
  return (
    <div className="code-surface overflow-hidden rounded-xl" data-code-tabs>
      <div role="tablist" className="flex border-b border-line">
        {files.map((f, i) => (
          <button
            key={f.filename}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-[12px] transition-colors ${i === active ? "border-accent text-ink" : "border-transparent text-faint hover:text-soft"}`}
          >
            {f.filename}
          </button>
        ))}
      </div>
      <div className="relative overflow-x-auto text-[13px] leading-relaxed [&_pre]:p-5">
        <CopyButton text={file.code} className="absolute right-2.5 top-2.5" />
        <div dangerouslySetInnerHTML={{ __html: file.html }} />
      </div>
    </div>
  );
}
