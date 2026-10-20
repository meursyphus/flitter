/**
 * The diagram gallery (todo/diagram.md §5). An entry without `load` is
 * hidden everywhere until its example exists. Data only: no widgets are
 * created by importing this file.
 */
import type { Widget } from "flitterjs";
import type { Theme } from "@/lib/theme";
import type { CellId } from "../interactions/cells";

/** Gallery-only recipes built on controller methods (tier R). */
export type RecipeId =
  | "side-panel"
  | "live-status"
  | "per-field-handles"
  | "search-zoom"
  | "animated-edges"
  | "typed-ports"
  | "reroute"
  | "minimap"
  | "context-pad"
  | "quick-add"
  | "reparent"
  | "focus-path"
  | "lod"
  | "depth-filter"
  | "recentre"
  | "drill-down";

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

export type ExampleFactory = (
  theme: Theme,
  options?: { presentation?: "gallery" | "hero" },
) => Widget;

export const categories = [
  "People",
  "Processes",
  "Data",
  "Connections",
] as const;
export type GalleryEntry = {
  slug: string;
  title: string;
  description: string;
  category: (typeof categories)[number];
  customParts: string[];
  echoes: string[];
  references: { name: string; url: string }[];
  /** A real task to try in the running example. */
  tryIt: string;
  /** The visible outcome of replacing widgets. */
  customization: string;
  chips: Interaction[];
  layout: string;
  file?: string;
  load: () => Promise<{ default: ExampleFactory }>;
};

/** Application recipes only. Small slot demos belong in Quick Start / API. */
export const catalog: GalleryEntry[] = [
  {
    slug: "schema-visualizer",
    title: "Database schema studio",
    description:
      "Explore a commerce database, follow foreign keys, and connect individual fields.",
    category: "Data",
    customParts: ["layout", "node", "handle", "edge", "controls"],
    echoes: ["dbdiagram", "EasyRD", "Supabase"],
    references: [
      { name: "dbdiagram editor", url: "https://dbdiagram.io/d" },
      { name: "EasyRD workspace", url: "https://easyrd.dev/workspace/demo" },
      { name: "React Flow showcase", url: "https://reactflow.dev/showcase" },
    ],
    tryIt:
      "Select a table, search in the explorer, then drag a foreign-key port to a matching primary key.",
    customization:
      "A node becomes a table with row-level ports. The layout becomes an editor with an explorer and a persistent toolbar.",
    chips: ["per-field-handles", "connect", "search-zoom"],
    layout: "Manual ERD",
    load: () => import("../../_examples/schema-visualizer"),
  },

  {
    slug: "family-tree",
    title: "Family tree",
    description:
      "Three generations connected through couples and their children.",
    category: "People",
    customParts: ["node", "nodeToolbar", "background"],
    echoes: [],
    references: [],
    tryIt:
      "Select a person to add a child or collapse descendants. Undo restores the family structure.",
    customization:
      "People use circular monograms. Explicit union nodes keep both parents attached to the same sibling branch, including newly added children. All names are fictional.",
    chips: ["collapse", "quick-add", "undo"],
    layout: "Generations and family unions",
    load: () => import("../../_examples/family-tree"),
  },
  {
    slug: "genetic-pedigree",
    title: "Genetic pedigree",
    description:
      "Record a fictional trait across three generations using pedigree symbols.",
    category: "People",
    customParts: ["node", "background", "handle"],
    echoes: [],
    references: [
      {
        name: "Pedigree symbols · University of Iowa",
        url: "https://humangenetics.medicine.uiowa.edu/resources/how-draw-pedigree",
      },
    ],
    tryIt:
      "In Trait mode, click a person to toggle a filled symbol. In Deceased mode, click to toggle the diagonal mark. Undo reverses either edit.",
    customization:
      "Square, circle, and diamond symbols replace cards. Partner and sibling lines encode family structure. The fictional trait is recorded visually; this example does not calculate inheritance or assess medical risk.",
    chips: ["read-only", "undo"],
    layout: "Three-generation pedigree",
    load: () => import("../../_examples/genetic-pedigree"),
  },
  {
    slug: "decision-flowchart",
    title: "Returns flowchart",
    description:
      "A return policy drawn with start/end capsules, process boxes, and a decision diamond.",
    category: "Processes",
    customParts: ["node", "handle", "background"],
    echoes: ["Lucidchart"],
    references: [
      {
        name: "Flowchart notation · Lucid",
        url: "https://lucid.co/diagram/flowchart/symbols",
      },
    ],
    tryIt:
      "Double-click a shape to edit its label. Select a shape, append a process or decision, connect it, and undo.",
    customization:
      "Native Flitter shape painters draw each flowchart symbol in SVG and Canvas. Editable labels, shape-specific ports, snapping, and waypoint editing share the same engine.",
    chips: ["text-edit", "connect", "quick-add", "waypoints", "undo"],
    layout: "Top-down decision flow",
    load: () => import("../../_examples/decision-flowchart"),
  },
  {
    slug: "edge-routing",
    title: "Cable routing",
    description: "Route video and audio cables around an equipment rack.",
    category: "Connections",
    customParts: ["edge", "edgeHandle", "reconnectHandle", "handle", "node"],
    echoes: [],
    references: [],
    tryIt:
      "Select a cable. Drag its diamond grips to move bends, or a hollow midpoint to add one. Double-click a bend to remove it. Drag an endpoint ring to a compatible port, switch Elbow/Curve, and undo.",
    customization:
      "Edges are the main editing surface: colored paths, visible reconnection rings, distinct bend/midpoint widgets, and port-type validation. Waypoints belong to the editable graph; the rack is a visual obstacle, not an automatic routing solver.",
    chips: ["waypoints", "connect", "typed-ports", "undo"],
    layout: "User-edited cable paths",
    load: () => import("../../_examples/edge-routing"),
  },

  {
    slug: "automation-workflow",
    title: "Lead qualification workflow",
    description:
      "Edit a workflow, then switch to review and choose the path yourself.",
    category: "Processes",
    customParts: ["node", "edgeLabel", "controls"],
    echoes: ["n8n", "Dify", "Attio"],
    references: [
      {
        name: "n8n execution workflow",
        url: "https://docs.n8n.io/workflows/executions/all-executions/",
      },
      { name: "Dify Workflow Studio", url: "https://www.dify.ai/workflows" },
      { name: "Attio in React Flow", url: "https://reactflow.dev/showcase" },
    ],
    tryIt:
      "In Review, approve a lead or send it to nurture. Switch to Edit to drag nodes and insert steps; the review follows your edited graph.",
    customization:
      "Custom node buttons choose a business outcome. Review mode protects the graph, while Edit enables dragging, connections, insertion, and undo.",
    chips: ["drop-connection", "insert-on-edge", "animated-edges", "undo"],
    layout: "Branching workflow",
    load: () => import("../../_examples/automation-workflow"),
  },
  {
    slug: "deployment-canvas",
    title: "Service architecture",
    description:
      "Inspect services and storage inside a production environment, with deployment status at a glance.",
    category: "Connections",
    customParts: ["node", "nodeToolbar"],
    echoes: ["Railway"],
    references: [
      {
        name: "Railway project canvas",
        url: "https://docs.railway.com/projects",
      },
    ],
    tryIt:
      "Select receipt-worker and simulate a redeploy. Toggle references or collapse the storage group.",
    customization:
      "Nodes become service cards and nested environments, with contextual actions and a selection-aware inspector.",
    chips: ["side-panel", "context-menu", "collapse", "live-status"],
    layout: "Nested service groups",
    load: () => import("../../_examples/deployment-canvas"),
  },
  {
    slug: "pipeline-run",
    title: "CI run explorer",
    description:
      "Trace a failed build through its dependencies and read the selected job’s logs.",
    category: "Connections",
    customParts: ["node", "edge", "controls"],
    echoes: ["GitHub Actions", "Dagster"],
    references: [
      {
        name: "GitHub Actions monitoring",
        url: "https://docs.github.com/en/actions/how-tos/monitor-workflows",
      },
    ],
    tryIt:
      "Click a job to read its logs, hover to trace dependencies, then simulate a fresh run.",
    customization:
      "The same engine becomes a viewer: stage groups, status badges, dependency emphasis, and a log drawer.",
    chips: ["read-only", "collapse", "hover", "live-status"],
    layout: "Grouped dependency graph",
    load: () => import("../../_examples/pipeline-run"),
  },
  {
    slug: "dataflow-graph",
    title: "Image processing studio",
    description:
      "Wire text, image, and seed inputs into a typed image-processing pipeline.",
    category: "Data",
    customParts: ["node", "handle", "edge", "nodeToolbar"],
    echoes: ["ComfyUI", "Blender"],
    references: [
      {
        name: "ComfyUI nodes",
        url: "https://docs.comfy.org/basic-concepts/nodes",
      },
    ],
    tryIt:
      "Select the sampler to bypass it. Connect ports of the same type or insert a reroute point.",
    customization:
      "Typed ports control validation and wire color; node toolbars expose bypass and compact views.",
    chips: ["typed-ports", "reroute", "collapse", "clipboard", "minimap"],
    layout: "Typed dataflow",
    load: () => import("../../_examples/dataflow-graph"),
  },
  {
    slug: "state-machine",
    title: "Checkout state editor",
    description:
      "Model payment authorization, capture, and recovery inside nested checkout states.",
    category: "Processes",
    customParts: ["node", "handle", "edge"],
    echoes: ["Stately"],
    references: [
      { name: "Stately editor", url: "https://stately.ai/docs/editor" },
    ],
    tryIt:
      "Double-click inside a state group to add a child. Drag from + to create a transition, then undo.",
    customization:
      "Custom state shapes, nested frames, transition handles, and routed labels form a domain-specific editor.",
    chips: ["groups", "drill-down", "connect"],
    layout: "Nested statechart",
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
    .map((other) => ({
      other,
      shared: other.chips.filter((chip) => entry.chips.includes(chip)).length,
    }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ other }) => other);
}
