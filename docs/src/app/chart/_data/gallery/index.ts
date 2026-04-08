import {
  galleryEntries,
  galleryCategories,
  todoCategories,
} from "./entries.generated";

export type { GalleryCategory, GalleryEntry } from "./types";
export { galleryEntries, galleryCategories, todoCategories };

export function findGalleryEntry(slug: string) {
  return galleryEntries.find((e) => e.slug === slug);
}

export function getEntriesByCategory(categoryId: string) {
  return galleryEntries.filter((e) => e.chartType === categoryId);
}

export function getRelatedEntries(slug: string) {
  const entry = findGalleryEntry(slug);
  if (!entry) return [];
  return galleryEntries.filter(
    (e) => e.chartType === entry.chartType && e.slug !== slug,
  );
}
