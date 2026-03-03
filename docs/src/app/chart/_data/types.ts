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

export type StyleSummary = {
  slug: string[];
  title: string;
  tagline: string;
  inspiration?: string;
  /** Representative chart component rendered on the overview page */
  chart?: React.ReactNode;
};

export type OverviewPageData = ChartPageBase & {
  pageType: "overview";
  /** Quick start code snippet */
  quickStartCode?: string;
  /** Style variants shown on the overview page */
  styles?: StyleSummary[];
  /** Whether an advanced page exists */
  hasAdvanced?: boolean;
};

// ---------------------------------------------------------------------------
// Style — a specific visual style (toast, high, …)
// ---------------------------------------------------------------------------

export type ChartExample = {
  title: string;
  chart: React.ReactNode;
  /** Chart container height in px (default: 500) */
  height?: number;
};

export type StylePageData = ChartPageBase & {
  pageType: "style";
  parent: string;
  styleMeta: {
    tagline: string;
    features: string[];
    inspiration?: string;
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
};

// ---------------------------------------------------------------------------
// Union type — discriminated by `pageType`
// ---------------------------------------------------------------------------

export type ChartPageData = OverviewPageData | StylePageData | AdvancedPageData;

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
