import Link from "next/link";
import type { GalleryEntry } from "../_data/gallery/catalog";
import Chips from "./chips";
import ExamplePreview from "./example-preview";

/** A live example with its title, echoes line and interaction chips. */
export default function GalleryCard({ entry }: { entry: GalleryEntry }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-line transition-colors hover:border-line-strong">
      <ExamplePreview slug={entry.slug} size="card" framed={false} />
      <Link href={`/diagram/gallery/${entry.slug}`} className="group block space-y-2 border-t border-line px-4 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="truncate text-[14px] font-medium text-ink group-hover:text-accent">{entry.title}</h3>
          <span className="shrink-0 truncate text-[12px] text-faint">{entry.echoes.join(" · ")}</span>
        </div>
        <Chips chips={entry.chips} />
      </Link>
    </article>
  );
}
