import Link from "next/link";
import type { GalleryEntry } from "../_data/gallery/catalog";

/**
 * Static SVG snapshots of each example's stage, one per theme. The browser
 * check writes them: `DIAGRAM_DOCS_THUMBNAILS=1 pnpm test:diagram-docs`.
 */
export const thumbnailSrc = (slug: string, theme: "light" | "dark") =>
  `/diagram/thumbnails/${slug}-${theme}.svg`;

/** A gallery tile: a snapshot of the example, its title, echoes line and chips. */
export default function GalleryCard({ entry }: { entry: GalleryEntry }) {
  return (
    <Link
      href={`/diagram/gallery/${entry.slug}`}
      data-card={entry.slug}
      className="group block min-w-0 overflow-hidden rounded-xl border border-line transition-colors hover:border-line-strong"
    >
      <div className="h-[260px] overflow-hidden bg-[var(--chart-bg)]">
        {(["light", "dark"] as const).map((theme) => (
          <img
            key={theme}
            src={thumbnailSrc(entry.slug, theme)}
            alt=""
            loading="lazy"
            decoding="async"
            data-thumbnail={theme}
            className={`h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] ${theme === "light" ? "hidden light:block" : "light:hidden"}`}
          />
        ))}
      </div>
      <div className="space-y-2 border-t border-line px-4 py-3">
        <div className="flex items-baseline justify-between gap-3 whitespace-nowrap">
          <h3 className="min-w-0 truncate text-[14px] font-medium text-ink transition-colors group-hover:text-accent">
            {entry.title}
          </h3>
          <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-faint">
            Default
          </span>
        </div>
        <p className="text-[12px] leading-relaxed text-faint">
          {entry.description ??
            "A complete example built from custom diagram widgets."}
        </p>
      </div>
    </Link>
  );
}
