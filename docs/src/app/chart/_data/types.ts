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

export type ScenarioCard = {
  title: string;
  description: string;
  /** The live demo component — null means placeholder */
  demo?: React.ReactNode;
  /** Source code for the demo */
  code?: string;
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

export type StyleSummary = {
  slug: string[];
  title: string;
  tagline: string;
  inspiration?: string;
  /** Link to the original reference */
  reference?: string;
  /** Representative chart component rendered on the overview page */
  chart?: React.ReactNode;
};

export type ShowcaseExample = {
  /** Style variant badge label */
  style: "Toast" | "AG";
  /** The chart component to render */
  chart: React.ReactNode;
  /** Display title (legacy, optional) */
  title?: string;
  /** Short subtitle (legacy, optional) */
  subtitle?: string;
  /** 1–2 line description of what was customized or configured */
  description?: string;
  /** Card height in px (default 360) */
  height?: number;
  /** When true, rendered as a full-width hero card above the grid */
  featured?: boolean;
  /** When true, the card spans both columns in the 2-col grid */
  fullWidth?: boolean;
  /** Copyable source code string */
  code?: string;
};

export type OverviewPageData = ChartPageBase & {
  pageType: "overview";
  /** Quick start code snippet */
  quickStartCode?: string;
};

// ---------------------------------------------------------------------------
// Style — a specific visual style (toast, high, …)
// ---------------------------------------------------------------------------

export type ChartExample = {
  title: string;
  chart: React.ReactNode;
  /** Chart container height in px (default: 500) */
  height?: number;
  /** Copyable source code string */
  code?: string;
};

export type StylePageData = ChartPageBase & {
  pageType: "style";
  parent: string;
  styleMeta: {
    tagline: string;
    features: string[];
    inspiration?: string;
    reference?: string;
  };
  configSections: ConfigSection[];
  /** Chart examples displayed on the style page */
  examples?: ChartExample[];
};

// ---------------------------------------------------------------------------
// Advanced — headless API & custom renderers
// ---------------------------------------------------------------------------

export type AdvancedPageData = ChartPageBase & {
  pageType: "advanced";
  parent: string;
  code: {
    basic: string;
  };
  customElements: CustomElement[];
  scenarios?: ScenarioCard[];
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
    Component: React.ComponentType;
    code: string;
    installCommand: string;
  };
  relatedEntries: {
    slug: string;
    chartType: string;
    style: "Toast" | "AG";
    title: string;
    Component: React.ComponentType;
    code: string;
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
