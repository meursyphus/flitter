import type { CollectionEntry } from "astro:content";

/**
 * Removes numeric prefixes from path segments (e.g., "01_intro" -> "intro")
 */
function removeNumericPrefix(segment: string): string {
  return segment.replace(/^\d+_/, "");
}

/**
 * Resolves a slug by removing numeric prefixes from all segments
 */
function resolveSlug(slug: string): string {
  const segments = slug.split("/");
  const cleanedSegments = segments.map((segment) =>
    removeNumericPrefix(segment),
  );
  return cleanedSegments.join("/");
}

/**
 * Extracts the language code from a slug
 */
function getLangFromSlug(slug: string): string {
  return slug.split("/")[0];
}

/**
 * Extracts the numeric order from a segment (e.g., "01_intro" -> 1)
 */
function getOrderFromSegment(segment: string): number {
  const match = segment.match(/^(\d+)_/);
  return match ? parseInt(match[1]) : 0;
}

interface ProcessedEntry<
  T extends CollectionEntry<"docs"> | CollectionEntry<"tutorial">,
> {
  original: T;
  slug: string;
  lang: string;

  navGroup: string;
  description: string
  title: string;
  navTitle?: string;
}

/**
 * Converts kebab-case to Title Case
 * e.g., "getting-started" -> "Getting Started"
 */
function kebabToTitleCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Gets navigation group from slug folder structure
 * e.g., "en/01_widgets/container" -> "Widgets"
 * e.g., "en/02_core-concepts/intro" -> "Core Concepts"
 */
function getNavGroupFromSlug(slug: string): string {
  const segments = slug.split("/");
  // Skip language segment and get the folder name
  if (segments.length > 2) {
    // If it's in a subfolder, use the folder name as group
    const folderName = removeNumericPrefix(segments[1]);
    return kebabToTitleCase(folderName);
  }
  // If it's a direct file under language, use a default group
  return "General";
}

/**
 * Processes a collection of entries with common transformations
 */
export function processEntries<
  T extends CollectionEntry<"docs"> | CollectionEntry<"tutorial">,
>(
  entries: T[],
  options?: {
    filterLang?: string;
  },
): ProcessedEntry<T>[] {
  const { filterLang } = options || {};
  const processedEntries = entries
    .sort((a, b) => a.slug.localeCompare(b.slug)) //폴더랑 파일 배치 기준으로 정렬
    .map((entry, index) => {
      const lang = getLangFromSlug(entry.slug);

      return {
        original: entry,
        slug: resolveSlug(entry.slug),
        lang,
        navGroup: getNavGroupFromSlug(entry.slug),
        title: entry.data.title,
        navTitle: entry.data.nav_title ?? entry.data.title,
        description: entry.data.description ?? ""
      };
    })
    .filter((entry) => {
      if (!filterLang) return true;

      return entry.lang === filterLang;
    });

  return processedEntries;
}

/**
 * Groups processed entries by navigation group
 * Returns a Map with insertion order preserved
 */
export function groupEntriesByNavGroup<
  T extends CollectionEntry<"docs"> | CollectionEntry<"tutorial">,
>(entries: ProcessedEntry<T>[]): Map<string, ProcessedEntry<T>[]> {
  // Use Map to maintain insertion order
  const groupMap = new Map<string, ProcessedEntry<T>[]>();

  // Group entries by navGroup
  entries.forEach((entry) => {
    const group = entry.navGroup;
    if (!groupMap.has(group)) {
      groupMap.set(group, []);
    }
    groupMap.get(group)!.push(entry);
  });

  return groupMap;
}

/**
 * Helper function to find previous and next entries in a sorted array
 */
export function findAdjacentEntries<
  T extends CollectionEntry<"docs"> | CollectionEntry<"tutorial">,
>(
  entries: ProcessedEntry<T>[],
  currentSlug: string,
): { prev: ProcessedEntry<T> | null; next: ProcessedEntry<T> | null } {
  const currentIndex = entries.findIndex((entry) => entry.slug === currentSlug);

  return {
    prev: currentIndex > 0 ? entries[currentIndex - 1] : null,
    next: currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null,
  };
}

/**
 * Creates navigation structure for sidebars
 */
export interface NavigationGroup {
  name: string;
  items: NavigationItem[];
}

export interface NavigationItem {
  url: string;
  title: string;
  order: number;
}

/**
 * Normalizes a path by removing trailing slashes
 */
export function normalizePath(path: string): string {
  return path.endsWith("/") ? path.slice(0, -1) : path;
}
