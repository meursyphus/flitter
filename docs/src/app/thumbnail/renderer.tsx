"use client";

import type { Widget } from "flitter-core";
import LiveChart from "@/components/live-chart";

type Entry = {
  slug: string;
  createWidget: () => Widget;
};

/** Every gallery chart at 800×500 on white, for scripts/generate-gallery-thumbnails. */
export default function ThumbnailGrid({ entries }: { entries: Entry[] }) {
  return (
    <div>
      {entries.map((entry) => (
        <div
          key={entry.slug}
          data-slug={entry.slug}
          style={{
            width: 800,
            height: 500,
            background: "white",
            overflow: "hidden",
          }}
        >
          <LiveChart create={entry.createWidget} theme="light" animate={false} />
        </div>
      ))}
    </div>
  );
}
