"use client";

import { useState } from "react";
import clsx from "clsx";

export function Tabs({
  items,
}: {
  items: { label: string; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="not-prose my-6">
      <div className="flex gap-0 border-b border-line">
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActive(i)}
            className={clsx(
              "px-4 py-2 text-sm font-medium transition-colors",
              active === i
                ? "-mb-px border-b-2 border-accent text-ink"
                : "text-faint hover:text-soft"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{items[active].content}</div>
    </div>
  );
}
