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
  /** Display title, e.g. "Monthly Revenue" */
  title: string;
  /** Short subtitle describing the use case */
  subtitle: string;
  /** Style variant badge label */
  style: "Toast" | "AG";
  /** The chart component to render */
  chart: React.ReactNode;
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
  /** Style variants shown on the overview page */
  styles?: StyleSummary[];
  /** Showcase examples displayed in the gallery grid */
  showcaseExamples?: ShowcaseExample[];
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
