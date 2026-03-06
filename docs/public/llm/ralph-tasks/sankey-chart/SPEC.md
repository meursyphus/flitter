# Sankey Chart — Spec

## Status
headless-only

## Purpose
Use a sankey chart to visualize flow and quantity between nodes in a directed network. Ideal for energy flow diagrams, budget allocation, user journey mapping, and any dataset where the magnitude of connections between categories matters.

## Data Shape
```typescript
type SankeyChartData = {
  nodes: { id: string; label: string; color?: string }[];
  links: { source: string; target: string; value: number }[];
  title?: string;
};

type SankeyNodeLayout = {
  id: string; label: string; color: string;
  x: number; y: number; width: number; height: number;
  column: number; totalValue: number;
};

type SankeyLinkLayout = {
  source: string; target: string; value: number;
  sourceX: number; sourceY: number; sourceHeight: number;
  targetX: number; targetY: number; targetHeight: number;
  color: string;
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | `{ title, sankey }` | Root layout composing title and sankey diagram |
| sankey | `{ nodes, links, nodeLabels }` | Container for all nodes, links, and labels |
| node | `{ id, label, color, x, y, width, height }` | Individual node rectangle |
| link | `{ source, target, value, sourceX, sourceY, sourceHeight, targetX, targetY, targetHeight, color }` | Curved flow path between two nodes |
| nodeLabel | `{ id, label, x, y, width, height, column, totalColumns }` | Text label for a node |
| title | `{ name }` | Chart title |

**Total: 6 slots**

## Controller Methods
- `hoverNode(id)` -- highlight a node and its connected links
- `unhoverNode()` -- clear node hover state
- `hoverLink(source, target)` -- highlight a specific link
- `unhoverLink()` -- clear link hover state
- `setSize(width, height)` -- update chart dimensions, triggers layout recomputation

## Style Presets Needed
- **toast**: default color palette for nodes; node width and padding; link opacity and hover opacity; link curve style (bezier); nodeLabel (fontSize, color, position: left/right based on column); title styling; animation on data change

## UX Patterns
- Layout computation: nodes are arranged in columns, with vertical positioning minimizing link crossings (computed in `compute-layout.ts`)
- Flow highlighting: hovering a node highlights all its incoming and outgoing links; hovering a link highlights just that flow
- Label positioning: labels on left-column nodes appear to the right of the node, labels on right-column nodes appear to the left
- Link rendering: curved bezier paths with width proportional to flow value
- Color inheritance: links inherit the source node's color (with reduced opacity)
- Tooltip: shows flow value on link hover, shows total throughput on node hover

## Storybook Stories Required
- Basic (energy flow)
- Multi-column (3+ levels)
- Custom node colors
- Hover interaction (node and link)
- Dense connections
- Single source to many targets
