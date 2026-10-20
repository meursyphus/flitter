"use client";

import Link from "next/link";
import LiveChart from "@/components/live-chart";
import type { GalleryEntry } from "../_data/gallery";

/** A gallery tile: the chart drawn live, at its final frame. */
export default function GalleryCard({
  entry,
  height = 340,
}: {
  entry: GalleryEntry;
  height?: number;
}) {
  return (
    <Link
      href={`/chart/gallery/${entry.slug}`}
      className="group block overflow-hidden rounded-xl border border-line bg-[var(--chart-bg)] transition-colors hover:border-line-strong"
    >
      {/* Charts take pointer events; the link still works via the caption and padding. */}
      <div className="p-4" style={{ height }}>
        <LiveChart create={entry.createWidget} animate={false} lazy />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-5">
        <span className="text-lg font-semibold text-ink transition-colors group-hover:text-ink">
          {entry.title}
        </span>
      </div>
    </Link>
  );
}
