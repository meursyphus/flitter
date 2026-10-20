import Link from "next/link";
import type { GalleryEntry } from "../_data/gallery/catalog";

export const thumbnailSrc = (slug: string, theme: "light" | "dark") =>
  `/diagram/thumbnails/${slug}-${theme}.svg`;

export default function GalleryCard({ entry }: { entry: GalleryEntry }) {
  return (
    <Link
      href={`/diagram/gallery/${entry.slug}`}
      data-card={entry.slug}
      className="group block min-w-0 overflow-hidden rounded-xl border border-line bg-canvas transition-colors hover:border-line-strong"
    >
      <div className="aspect-[16/10] overflow-hidden bg-[var(--chart-bg)]">
        {(["light", "dark"] as const).map((theme) => (
          <img
            key={theme}
            src={thumbnailSrc(entry.slug, theme)}
            alt=""
            loading="lazy"
            decoding="async"
            data-thumbnail={theme}
            className={`h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.015] ${theme === "light" ? "hidden light:block" : "light:hidden"}`}
          />
        ))}
      </div>
      <h3 className="border-t border-line px-5 py-5 text-xl font-semibold tracking-tight text-ink group-hover:text-accent">
        {entry.title}
      </h3>
    </Link>
  );
}
