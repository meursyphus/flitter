"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGallery } from "@/state/gallery";
import { galleryCategories } from "@/app/chart/_data/gallery";

export default function GalleryCategoryNav() {
  const pathname = usePathname();
  const isGalleryIndex =
    pathname === "/chart/gallery" || pathname === "/chart/gallery/";
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
            "block py-1 pl-3 text-sm transition-colors",
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
    </div>
  );
}
