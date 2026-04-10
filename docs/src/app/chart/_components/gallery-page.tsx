"use client";

import { useEffect, useRef } from "react";
import {
  galleryCategories,
  galleryEntries,
  getEntriesByCategory,
} from "../_data/gallery";
import { useGallery } from "@/state/gallery";
import GalleryCard from "./gallery-card";

function GalleryGrid() {
  const { actions } = useGallery((s) => ({ actions: s.actions }));
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            actions.setActiveCategory(entry.target.getAttribute("data-category")!);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    const markers = document.querySelectorAll("[data-category-marker]");
    markers.forEach((el) => observerRef.current!.observe(el));

    return () => observerRef.current?.disconnect();
  }, [actions]);

  // Build flat list with category markers on first entry of each group
  const firstOfCategory = new Set<string>();
  const flatEntries = galleryEntries.map((entry) => {
    const isFirst = !firstOfCategory.has(entry.chartType);
    if (isFirst) firstOfCategory.add(entry.chartType);
    return { ...entry, isFirstOfCategory: isFirst };
  });

  return (
    <div
      className="grid gap-5"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
      }}
    >
      {flatEntries.map((entry, i) => (
        <div
          key={entry.slug}
          {...(entry.isFirstOfCategory
            ? {
                id: entry.chartType,
                "data-category-marker": true,
                "data-category": entry.chartType,
                className: "scroll-mt-20",
              }
            : {})}
        >
          <GalleryCard
            slug={entry.slug}
            title={entry.title}
            style={entry.style}
            thumbnailUrl={entry.thumbnailUrl}
            index={i}
          />
        </div>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const { actions } = useGallery((s) => ({ actions: s.actions }));

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // Delay slightly to let the DOM render before scrolling
      requestAnimationFrame(() => {
        document
          .getElementById(hash)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        actions.setActiveCategory(hash);
      });
    } else if (galleryCategories.length > 0) {
      actions.setActiveCategory(galleryCategories[0].id);
    }
  }, [actions]);

  return (
    <div className="-mx-6 -mt-8 md:-mx-10">
      {/* Header */}
      <section className="px-6 pt-10 pb-6 md:px-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Chart Gallery
          </h1>
          <p className="mt-2 text-base leading-relaxed text-neutral-500">
            Browse all available chart styles. Click any chart to see its code
            and installation command.
          </p>
        </div>
      </section>

      {/* Grid — single flat grid */}
      <div className="px-6 pb-16 md:px-10 max-w-[1600px]">
        <GalleryGrid />
      </div>
    </div>
  );
}
