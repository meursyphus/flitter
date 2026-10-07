"use client";

import { useEffect } from "react";
import {
  galleryCategories,
  galleryEntries,
  getEntriesByCategory,
} from "../_data/gallery";
import { useGallery } from "@/state/gallery";
import GalleryCard from "./gallery-card";

function useCategoryScrollSpy() {
  const { actions } = useGallery((s) => ({ actions: s.actions }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            actions.setActiveCategory(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );
    for (const category of galleryCategories) {
      const el = document.getElementById(category.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [actions]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
        actions.setActiveCategory(hash);
      });
    } else if (galleryCategories.length > 0) {
      actions.setActiveCategory(galleryCategories[0].id);
    }
  }, [actions]);
}

export default function GalleryPage() {
  useCategoryScrollSpy();

  return (
    <div className="px-5 pb-20 md:px-10">
      <header className="relative max-w-3xl pt-10 pb-10 lg:pt-14">
        <h1 className="display text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
          Chart gallery
        </h1>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-soft">
          {galleryEntries.length} examples across {galleryCategories.length} chart
          types, each drawn live by Flitter. Hover to inspect, open one for its
          code and install command.
        </p>
      </header>

      <div className="max-w-[1600px] space-y-14">
        {galleryCategories.map((category) => {
          const entries = getEntriesByCategory(category.id);
          return (
            <section key={category.id} id={category.id} className="scroll-mt-24">
              <h2 className="mb-4 flex items-baseline gap-2 text-[15px] font-semibold text-ink">
                {category.label}
                <span className="text-[13px] font-normal text-faint">
                  {entries.length}
                </span>
              </h2>
              <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,380px),1fr))]">
                {entries.map((entry) => (
                  <GalleryCard key={entry.slug} entry={entry} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
