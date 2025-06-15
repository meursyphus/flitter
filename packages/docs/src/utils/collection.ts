import type { CollectionEntry } from "astro:content";

/**
 * Removes numeric prefixes from path segments (e.g., "01_intro" -> "intro")
 */
export function removeNumericPrefix(segment: string): string {
  return segment.replace(/^\d+_/, "");
}

/**
 * Resolves a slug by removing numeric prefixes from all segments
 */
export function resolveSlug(slug: string): string {
  const segments = slug.split("/");
  const cleanedSegments = segments.map((segment) => removeNumericPrefix(segment));
  return cleanedSegments.join("/");
}

/**
 * Extracts the language code from a slug
 */
export function getLangFromSlug(slug: string): string {
  return slug.split("/")[0];
}

/**
 * Extracts the numeric order from a segment (e.g., "01_intro" -> 1)
 */
export function getOrderFromSegment(segment: string): number {
  const match = segment.match(/^(\d+)_/);
  return match ? parseInt(match[1]) : 0;
}

export interface ProcessedEntry<T extends CollectionEntry<"docs"> | CollectionEntry<"tutorial">> {
  original: T;
  slug: string;
  lang: string;
  order: number;
  navGroup: string;
  navGroupOrder: number;
  navOrder: number;
  title: string;
  navTitle?: string;
}

/**
 * Navigation group ordering
 * Uses Title Case names matching getNavGroupFromSlug output
 */
const NAV_GROUP_ORDER: Record<string, number> = {
  "Getting Started": 1,
  "Core Concepts": 2,
  "Basic Widgets": 3,
  "Layout": 4,
  "Interactions And Animations": 5,
  "Advanced Features": 6,
  "Widgets": 999,
  "General": 1000,
};

/**
 * Gets the order for a navigation group
 */
export function getNavGroupOrder(navGroup: string): number {
  return NAV_GROUP_ORDER[navGroup] ?? 9999;
}

/**
 * Converts kebab-case to Title Case
 * e.g., "getting-started" -> "Getting Started"
 */
export function kebabToTitleCase(str: string): string {
  return str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Gets navigation group from slug folder structure
 * e.g., "en/01_widgets/container" -> "Widgets"
 * e.g., "en/02_core-concepts/intro" -> "Core Concepts"
 */
export function getNavGroupFromSlug(slug: string): string {
  const segments = slug.split("/");
  // Skip language segment and get the folder name
  if (segments.length > 2) {
    // If it's in a subfolder, use the folder name as group
    const folderName = removeNumericPrefix(segments[1]);
    return kebabToTitleCase(folderName);
  } else if (segments.length === 2) {
    // If it's a direct file under language, use a default group
    return "General";
  }
  return "Widgets";
}

/**
 * Processes a collection of entries with common transformations
 */
export function processEntries<T extends CollectionEntry<"docs"> | CollectionEntry<"tutorial">>(
  entries: T[],
  options?: {
    filterLang?: string;
    resolveSlug?: boolean;
    useSlugAsNavGroup?: boolean;
  }
): ProcessedEntry<T>[] {
  const { filterLang, resolveSlug: shouldResolveSlug = true, useSlugAsNavGroup = true } = options || {};

  let processedEntries = entries.map((entry, index) => {
    const lang = getLangFromSlug(entry.slug);
    const segments = entry.slug.split("/");
    
    // Get order from the last segment (file name) or folder segment
    let order = index;
    if (segments.length > 2) {
      // Try to get order from file name first
      const fileOrder = getOrderFromSegment(segments[segments.length - 1]);
      // If no order in file name, try folder
      order = fileOrder > 0 ? fileOrder : getOrderFromSegment(segments[1]);
    } else if (segments.length > 1) {
      order = getOrderFromSegment(segments[1]);
    }
    
    // Use folder structure as nav_group if enabled, otherwise fall back to data
    const navGroup = useSlugAsNavGroup 
      ? getNavGroupFromSlug(entry.slug)
      : (entry.data.nav_group ?? "Widgets");
    
    const navGroupOrder = getNavGroupOrder(navGroup);
    const navOrder = entry.data.nav_order ?? order;

    return {
      original: entry,
      slug: shouldResolveSlug ? resolveSlug(entry.slug) : entry.slug,
      lang,
      order,
      navGroup,
      navGroupOrder,
      navOrder,
      title: entry.data.title,
      navTitle: 'nav_title' in entry.data ? entry.data.nav_title : entry.data.title,
    };
  });

  // Filter by language if specified
  if (filterLang) {
    processedEntries = processedEntries.filter((entry) => entry.lang === filterLang);
  }

  return processedEntries;
}


/**
 * Groups processed entries by navigation group
 */
export function groupEntriesByNavGroup<T extends CollectionEntry<"docs"> | CollectionEntry<"tutorial">>(
  entries: ProcessedEntry<T>[]
): Record<string, ProcessedEntry<T>[]> {
  return entries.reduce(
    (acc, entry) => {
      const group = entry.navGroup;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(entry);
      return acc;
    },
    {} as Record<string, ProcessedEntry<T>[]>
  );
}

/**
 * Helper function to find previous and next entries in a sorted array
 */
export function findAdjacentEntries<T extends CollectionEntry<"docs"> | CollectionEntry<"tutorial">>(
  entries: ProcessedEntry<T>[],
  currentSlug: string
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
  order: number;
  items: NavigationItem[];
}

export interface NavigationItem {
  url: string;
  title: string;
  order: number;
}

export function createNavigationStructure<T extends CollectionEntry<"docs"> | CollectionEntry<"tutorial">>(
  entries: ProcessedEntry<T>[],
  urlPrefix: string = "/docs"
): NavigationGroup[] {
  const grouped = groupEntriesByNavGroup(entries);
  
  const navigation: NavigationGroup[] = Object.entries(grouped).map(([groupName, groupEntries]) => ({
    name: groupName,
    order: getNavGroupOrder(groupName),
    items: groupEntries.map((entry) => ({
      url: `${urlPrefix}/${entry.slug}`,
      title: entry.navTitle ?? entry.title,
      order: entry.navOrder,
    })).sort((a, b) => a.order - b.order),
  }));

  // Sort groups by order
  return navigation.sort((a, b) => a.order - b.order);
}

/**
 * Normalizes a path by removing trailing slashes
 */
export function normalizePath(path: string): string {
  return path.endsWith("/") ? path.slice(0, -1) : path;
}