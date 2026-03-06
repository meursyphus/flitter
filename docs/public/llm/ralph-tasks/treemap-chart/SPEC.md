# Treemap Chart — Spec

## Status
headless-only

## Purpose
Use a treemap chart to display hierarchical or proportional data as nested rectangles. Ideal for visualizing part-to-whole relationships, disk usage, portfolio allocation, and any dataset where area should encode magnitude.

## Data Shape
```typescript
type TreemapData = {
  nodes: TreemapNode[];
};

type TreemapNode = {
  label: string;
  value: number;
  color?: string;
};

type TreemapLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | `{ title, legends, treemap }` | Root layout composing title, legends, and treemap area |
| treemap | `{ nodes }` | Container for all node rectangles |
| node | `{ label, value, color, index, ratio, x, y, width, height }` | Individual rectangle with position and size |
| legend | `{ name, index }` | Legend item for each node |
| title | -- | Chart title |

**Total: 5 slots** (plus the treemap container = 6 counting layout)

## Controller Methods
- `setSize(width, height)` -- update chart dimensions, triggers layout recalculation
- `hoverNode(index)` -- highlight a node
- `unhoverNode()` -- clear hover state
- `isNodeHovered(index)` -- check hover state
- `toggleSeries(name)` -- show/hide a node by label
- `isSeriesVisible(name)` -- check visibility
- `showAllSeries()` -- reset all visibility
- `layouts` -- computed squarify layout positions
- `visibleData` -- filtered data excluding hidden series

## Style Presets Needed
- **toast**: default color palette; node border (color, thickness); node label (fontSize, color, fontWeight, position); hover effect (opacity or border highlight); legend, title styling; padding between nodes

## UX Patterns
- Squarify algorithm: rectangles are laid out to minimize aspect ratio, producing near-square shapes
- Node hover: highlights the hovered rectangle, shows tooltip with label and value
- Legend filtering: clicking a legend item hides/shows the corresponding node and recalculates layout
- Size-proportional: each rectangle area is proportional to its value
- Color coding: each node gets a distinct color from the palette or from data
- Label placement: labels are rendered inside rectangles when space permits, hidden when too small

## Storybook Stories Required
- Basic (portfolio allocation)
- Custom colors
- Many nodes (20+)
- Legend filtering interaction
- Hover with tooltip
- Small values handling
