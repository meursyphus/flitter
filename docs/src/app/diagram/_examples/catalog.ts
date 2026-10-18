/** Metadata is separate from widgets so server pages never instantiate a diagram. */
export const examples = [
  {
    slug: "workflow", title: "Deployment workflow", category: "Workflows", layout: "Layered · left to right",
    description: "Status cards, branching steps and an approval action. Select a task and mark it complete.",
    concept: "A node can contain a status, a title and a detail line. The toolbar updates domain data through the builder context; the engine keeps selection, dragging and connections working.",
    edits: [
      { file: "workflow.ts → nodeTypes.task.build", change: "Replace the card contents with your own widgets and application data." },
      { file: "workflow.ts → nodeTypes.task.toolbar", change: "Replace Mark complete with your product action. flow.updateNodeData refreshes the affected node." },
      { file: "workflow.ts → layout + handles", change: "Change the layout direction and declared handle sides together." },
    ],
  },
  {
    slug: "database-schema", title: "Database schema", category: "Data models", layout: "Manual · field-level ports",
    description: "Tables with a connection handle on every field. Drag a relationship between columns or move the whole table.",
    concept: "Node contents and connection geometry come from the same fields array. Every row declares source and target handles at its own y offset; edges name the fields they connect.",
    edits: [
      { file: "database-schema.ts → tableNode", change: "Draw your schema's fields, types and constraints using widgets." },
      { file: "database-schema.ts → tableHandles", change: "Keep declared handle positions aligned with your row heights." },
      { file: "database-schema.ts → relations", change: "Use sourceHandle and targetHandle to connect specific fields." },
    ],
  },
  {
    slug: "organization", title: "People and teams", category: "Hierarchies", layout: "Tree · top to bottom",
    description: "Avatar pills and reporting lines. The node sizes come from their widget contents.",
    concept: "A tree places people; a node builder composes their portraits, names and roles. You can replace the initials with an Image widget without adding a diagram option.",
    edits: [
      { file: "organization.ts → nodeTypes.person.build", change: "Compose an avatar, role badge or profile summary using ordinary Flitter widgets." },
      { file: "organization.ts → people + edges", change: "Load your own team data and reporting relationships." },
      { file: "organization.ts → custom.background", change: "Return a widget for a custom backdrop, or null for the surrounding surface." },
    ],
  },
  {
    slug: "service-map", title: "Service traffic", category: "Networks", layout: "Force · seeded",
    description: "Circular service nodes and edges whose width represents traffic. Hover a link to highlight it.",
    concept: "The engine computes edge geometry and hit testing. The traffic builder decides what that geometry looks like using edge.data; edge width is an application mapping you own.",
    edits: [
      { file: "service-map.ts → edgeTypes.traffic", change: "Map your data to stroke, patterns or additional shapes. path is already in local coordinates." },
      { file: "service-map.ts → nodeTypes.service", change: "Replace service metrics with your own content. This example deliberately declares no connection handles." },
      { file: "flow-diagram/parts/paint.ts", change: "ShapePaint is a copied helper. Extend it or replace it with your own CustomPaint implementation." },
    ],
  },
  {
    slug: "grouped-pipeline", title: "Grouped data pipeline", category: "Workflows", layout: "Manual · nested groups",
    description: "Labeled stages contain draggable steps. Drag a stage to move its children with it.",
    concept: "Groups are nodes with your own builder. parentId supplies the spatial relationship; the stage header, container and child cards are all application widgets.",
    edits: [
      { file: "grouped-pipeline.ts → nodeTypes.stage", change: "Draw your own group header and frame. A custom group type declares handles: [] explicitly." },
      { file: "grouped-pipeline.ts → nodes", change: "Use parentId and positions relative to the parent to build stages, swimlanes or nested processes." },
      { file: "grouped-pipeline.ts → nodeTypes.default", change: "Replace the preset's registered default node builder for every untyped child." },
    ],
  },
  {
    slug: "card-grid", title: "Resource board", category: "Collections", layout: "Grid · three columns",
    description: "A zoomable collection of resource cards. Select and rearrange cards without drawing any edges.",
    concept: "The scene also works as a spatial collection. A grid arranges the cards initially; selection and dragging continue to work after layout. Your card builder decides the whole composition.",
    edits: [
      { file: "card-grid.ts → nodeTypes.resource.build", change: "Add content, badges or a chart inside the card using Flitter widgets." },
      { file: "card-grid.ts → layout", change: "Change the starting arrangement or supply a custom LayoutAlgorithm." },
      { file: "card-grid.ts → handles + edges", change: "This board has no ports or links. Add them only when your product needs relationships." },
    ],
  },
  {
    slug: "headless", title: "A style from scratch", category: "Headless", layout: "Circular · custom paint",
    description: "An editorial process loop built directly with Flow. No xyflow style imports or preset config.",
    concept: "Flow receives a complete FlowCustom<OrbitTheme> and your own config type. This example draws nodes, handles, edges, the background and selection itself while keeping the engine's interactions.",
    edits: [
      { file: "headless.ts → OrbitTheme + orbitParts", change: "Define the design inputs and widgets your product actually needs. There is no required xyflow token schema." },
      { file: "headless.ts → Stroke", change: "Own the SVG and Canvas drawing code, or reuse a paint helper from your copied source." },
      { file: "headless.ts → edgePath", change: "Supply path geometry that the engine uses for drawing and hit testing together." },
    ],
  },
] as const;

export type ExampleSlug = (typeof examples)[number]["slug"];
export type Example = (typeof examples)[number];
export const categories = ["All", "Workflows", "Hierarchies", "Networks", "Data models", "Collections", "Headless"] as const;
