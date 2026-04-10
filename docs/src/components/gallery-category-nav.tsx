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
    <div className="mt-0.5 ml-3 border-l border-neutral-200">
      {galleryCategories.map((cat) => (
        <Link
          key={cat.id}
          href={`/chart/gallery#${cat.id}`}
          scroll={false}
          className={clsx(
            "block py-1 pl-3 text-[12.5px] transition-colors",
            activeCategoryId === cat.id
              ? "border-l-2 border-teal-500 -ml-px font-medium text-teal-700"
              : "text-neutral-500 hover:text-neutral-900",
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
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300">
              Coming Soon
            </span>
          </div>
          {todoCategories.map((id) => (
            <span
              key={id}
              className="block py-1 pl-3 text-[12.5px] text-neutral-300 cursor-default"
            >
              {toLabel(id)}
            </span>
          ))}
        </>
      )}
    </div>
  );
}
