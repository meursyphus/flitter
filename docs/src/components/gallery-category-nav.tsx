"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGallery } from "@/state/gallery";
import {
  galleryCategories,
  todoCategories,
} from "@/app/chart/_data/gallery";

function toLabel(id: string) {
  return id
    .replace(/-chart$/, "")
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default function GalleryCategoryNav() {
  const pathname = usePathname();
  const isGalleryIndex = pathname === "/chart/gallery" || pathname === "/chart/gallery/";
  const { activeCategoryId } = useGallery((s) => ({
    activeCategoryId: s.activeCategoryId,
  }));

  return (
    <div className="mt-0.5 ml-3 border-l border-line">
      {galleryCategories.map((cat) => (
        <Link
          key={cat.id}
          href={`/chart/gallery#${cat.id}`}
          scroll={false}
          className={clsx(
            "block py-1 pl-3 text-[12.5px] transition-colors",
            activeCategoryId === cat.id
              ? "-ml-px border-l-2 border-accent font-medium text-ink"
              : "text-soft hover:text-ink",
          )}
          onClick={(e) => {
            if (isGalleryIndex) {
              e.preventDefault();
              document
                .getElementById(cat.id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        >
          {cat.label}
        </Link>
      ))}

      {todoCategories.length > 0 && (
        <>
          <div className="pt-2 pb-0.5 pl-3">
            <span className="text-[11px] font-semibold text-faint">
              Coming soon
            </span>
          </div>
          {todoCategories.map((id) => (
            <span
              key={id}
              className="block cursor-default py-1 pl-3 text-[12.5px] text-faint/60"
            >
              {toLabel(id)}
            </span>
          ))}
        </>
      )}
    </div>
  );
}
