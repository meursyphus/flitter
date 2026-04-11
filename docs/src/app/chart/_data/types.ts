// ---------------------------------------------------------------------------
// Shared sub-types
// ---------------------------------------------------------------------------

export type ConfigSection = {
  title: string;
  description?: string;
  rows: ConfigRow[];
};

export type ConfigRow = {
  property: string;
  type: string;
  default: string;
  description?: string;
};

export type CustomElement = {
  element: string;
  args: string;
  description: string;
};

// ---------------------------------------------------------------------------
// Base (common fields for every chart page)
// ---------------------------------------------------------------------------

type ChartPageBase = {
  slug: string[];
  title: string;
  description: string;
};

// ---------------------------------------------------------------------------
// Overview — the landing page for a chart type
// ---------------------------------------------------------------------------

export type OverviewPageData = ChartPageBase & {
  pageType: "overview";
  /** Quick start code snippet */
  quickStartCode?: string;
};


// ---------------------------------------------------------------------------
// Gallery — single-page showcase with detail drill-down
// ---------------------------------------------------------------------------

export type GalleryIndexPageData = ChartPageBase & {
  pageType: "gallery-index";
};

export type GalleryDetailPageData = ChartPageBase & {
  pageType: "gallery-detail";
  entry: {
    slug: string;
    chartType: string;
    style: "Toast" | "AG";
    title: string;
    thumbnailUrl: string;
    Component: React.ComponentType;
    files: { filename: string; code: string }[];
    installCommand: string;
  };
  relatedEntries: {
    slug: string;
    chartType: string;
    style: "Toast" | "AG";
    title: string;
    thumbnailUrl: string;
    Component: React.ComponentType;
    files: { filename: string; code: string }[];
    installCommand: string;
  }[];
};

// ---------------------------------------------------------------------------
// API — per-chart reference page
// ---------------------------------------------------------------------------

export type ContextProperty = {
  name: string;
  type: string;
  description: string;
  kind: "property" | "method";
};

export type ApiPageData = ChartPageBase & {
  pageType: "api";
  parent?: string;
  dataFormat?: {
    typeName: string;
    typeDefinition: string;
    description: string;
  };
  agConfig?: { sections: ConfigSection[] };
  toastConfig?: { sections: ConfigSection[] };
  customParts?: CustomElement[];
  context?: {
    typeName: string;
    properties: ContextProperty[];
  };
  overrideExample?: string;
};

// ---------------------------------------------------------------------------
// Union type — discriminated by `pageType`
// ---------------------------------------------------------------------------

export type ChartPageData =
  | OverviewPageData
  | GalleryIndexPageData
  | GalleryDetailPageData
  | ApiPageData;

// ---------------------------------------------------------------------------
// Module contract — every chart folder exports this
// ---------------------------------------------------------------------------

/**
 * Each chart folder must `export const pages: ChartModule = [...]`.
 *
 * @example
 * ```ts
 * import type { ChartModule } from "../types";
 * export const pages: ChartModule = [ overviewPage, toastStyle, advancedPage ];
 * ```
 */
export type ChartModule = ChartPageData[];
