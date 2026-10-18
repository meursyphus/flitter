/**
 * The diagram gallery (todo/diagram.md §5). An entry without `load` is
 * hidden everywhere until its example exists. Data only: no widgets are
 * created by importing this file.
 */
import type { Widget } from "flitter-ui";
import type { Theme } from "@/lib/theme";
import type { CellId } from "../interactions/cells";

/** Gallery-only recipes built on controller methods (tier R). */
export type RecipeId =
  | "side-panel" | "live-status" | "per-field-handles" | "search-zoom"
  | "animated-edges" | "typed-ports" | "reroute" | "minimap" | "context-pad"
  | "quick-add" | "reparent" | "focus-path" | "lod" | "depth-filter"
  | "recentre" | "drill-down";

/** A chip is an interaction cell (links to its demo) or a recipe. */
export type Interaction = CellId | RecipeId;

export const recipeLabels: Record<RecipeId, string> = {
  "side-panel": "Side panel",
  "live-status": "Live status",
  "per-field-handles": "Per-field handles",
  "search-zoom": "Search and zoom",
  "animated-edges": "Animated edges",
  "typed-ports": "Typed ports",
  reroute: "Reroute node",
  minimap: "Minimap",
  "context-pad": "Context pad",
  "quick-add": "Quick add",
  reparent: "Reparent by drag",
  "focus-path": "Focus path",
  lod: "Zoom detail levels",
  "depth-filter": "Depth filter",
  recentre: "Click to recentre",
  "drill-down": "Drill down",
};

export type ExampleFactory = (theme: Theme, options?: { presentation?: "gallery" | "hero" }) => Widget;

export type GalleryEntry = {
  slug: string;
  title: string;
  /** Products this example echoes. */
  echoes: string[];
  chips: Interaction[];
  layout: string;
  /** Source file in `_examples/`, without `.ts`. Defaults to `slug`. */
  file?: string;
  load?: () => Promise<{ default: ExampleFactory }>;
};

export const catalog: GalleryEntry[] = [
  {
    slug: "deployment-canvas",
    title: "Deployment canvas",
    echoes: ["Railway"],
    chips: ["side-panel", "context-menu", "collapse", "live-status"],
    layout: "Manual + layered",
    load: () => import("../../_examples/deployment-canvas"),
  },
  {
    slug: "schema-visualizer",
    title: "Schema visualizer",
    echoes: ["ChartDB", "Supabase", "dbdiagram"],
    chips: ["per-field-handles", "hover", "connect", "search-zoom"],
    layout: "Layered LR",
    load: () => import("../../_examples/schema-visualizer"),
  },
  {
    slug: "automation-workflow",
    title: "Automation workflow",
    echoes: ["n8n", "Dify"],
    chips: ["drop-connection", "insert-on-edge", "animated-edges", "undo"],
    layout: "Manual LR + layered",
    load: () => import("../../_examples/automation-workflow"),
  },
  {
    slug: "linear-steps",
    title: "Linear steps with paths",
    echoes: ["Zapier"],
    chips: ["layout", "insert-on-edge", "collapse", "side-panel"],
    layout: "Tree TB",
    load: () => import("../../_examples/linear-steps"),
  },
  {
    slug: "scenario-router",
    title: "Scenario router",
    echoes: ["Make"],
    chips: ["context-menu", "insert-on-edge", "layout"],
    layout: "Manual + layered",
    load: () => import("../../_examples/scenario-router"),
  },
  {
    slug: "pipeline-run",
    title: "Pipeline run",
    echoes: ["GitHub Actions", "Dagster"],
    chips: ["read-only", "collapse", "hover", "live-status"],
    layout: "Layered LR, groups",
    load: () => import("../../_examples/pipeline-run"),
  },
  {
    slug: "dataflow-graph",
    title: "Dataflow graph",
    echoes: ["ComfyUI", "Blender"],
    chips: ["typed-ports", "reroute", "collapse", "clipboard", "minimap"],
    layout: "Manual",
    load: () => import("../../_examples/dataflow-graph"),
  },
  {
    slug: "process-diagram",
    title: "Process diagram",
    echoes: ["bpmn.io", "Lucidchart"],
    chips: ["context-pad", "waypoints", "text-edit", "snap-guides"],
    layout: "Manual",
    load: () => import("../../_examples/process-diagram"),
  },
  {
    slug: "whiteboard",
    title: "Whiteboard flowchart",
    echoes: ["Excalidraw", "FigJam"],
    chips: ["quick-add", "resize", "snap-guides", "context-menu"],
    layout: "Manual",
    load: () => import("../../_examples/whiteboard"),
  },
  {
    slug: "org-chart",
    title: "Org chart",
    echoes: ["Pingboard", "ChartHop"],
    chips: ["collapse", "reparent", "focus-path", "lod"],
    layout: "Tree TB",
    load: () => import("../../_examples/org-chart"),
  },
  {
    slug: "knowledge-graph",
    title: "Knowledge graph",
    echoes: ["Obsidian", "Logseq"],
    chips: ["hover", "depth-filter", "recentre", "lod"],
    layout: "Force",
    load: () => import("../../_examples/knowledge-graph"),
  },
  {
    slug: "state-machine",
    title: "State machine",
    echoes: ["Stately"],
    chips: ["groups", "drill-down", "connect"],
    layout: "Layered + manual",
    load: () => import("../../_examples/state-machine"),
  },
];

/** Entries with a live example, in catalog order. */
export const listedEntries = catalog.filter((entry) => entry.load);

export function findEntry(slug: string) {
  return listedEntries.find((entry) => entry.slug === slug);
}

/** Up to `limit` listed entries sharing the most chips with `slug`. */
export function relatedEntries(slug: string, limit = 2) {
  const entry = findEntry(slug);
  if (!entry) return [];
  return listedEntries
    .filter((other) => other.slug !== slug)
    .map((other) => ({ other, shared: other.chips.filter((chip) => entry.chips.includes(chip)).length }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ other }) => other);
}
