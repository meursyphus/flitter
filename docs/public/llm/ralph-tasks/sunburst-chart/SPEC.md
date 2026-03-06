# Sunburst Chart — Spec

## Status
headless-only

## Purpose
Use a sunburst chart to visualize hierarchical data as concentric rings of arc segments. Ideal for organizational structures, file system usage, taxonomies, and any tree-structured data where depth and proportion both matter.

## Data Shape
```typescript
type SunburstChartData = {
  root: SunburstNode;
  title?: string;
};

type SunburstNode = {
  label: string;
  value?: number;
  color?: string;
  children?: SunburstNode[];
};

type FlatSegment = {
  node: SunburstNode;
  depth: number;
  startAngle: number;
  endAngle: number;
  color: string;
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | `{ title, sunburst, legend }` | Root layout composing title, sunburst ring, and legend |
| sunburst | `{ segments }` | Container for all arc segments (receives FlatSegment[]) |
| segment | `{ segment }` | Individual arc segment with depth, angles, and color |
| legend | `{ items }` | Legend container for top-level categories |
| legendItem | `{ label, color }` | Individual legend entry |
| title | `{ name }` | Chart title |

**Total: 6 slots** (plus legendItem = 7 counting all)

## Controller Methods
- `hoverSegment(segment)` -- highlight a segment and its ancestor path
- `unhoverSegment()` -- clear hover state
- `setSize(width, height)` -- update chart dimensions
- `segments` -- computed flat segment list from hierarchical data
- `drillDown(segment)` -- zoom into a subtree (optional)
- `drillUp()` -- return to parent level (optional)

## Style Presets Needed
- **toast**: depth-based color lightening (inner rings darker, outer lighter); arc gap between segments; ring thickness per depth level; hover effect (opacity or stroke highlight); legend, title styling; label display (on arc or tooltip-only); animation on mount (arcs sweep in)

## UX Patterns
- Hierarchical arcs: root children form the inner ring, their children form the next ring outward, and so on
- Depth-based coloring: children inherit parent color but lighter; alternatively, each top-level branch gets a distinct hue
- Segment hover: highlights the segment and shows the full path (e.g., "Root > Category > Sub-category") with value
- Drill-down: clicking a segment makes it the new root, zooming into that subtree with animation
- Breadcrumb: optional breadcrumb trail showing the current drill-down path
- Angle calculation: each segment's arc width is proportional to its value relative to its parent
- Legend: shows top-level categories with their colors

## Storybook Stories Required
- Basic (organization hierarchy)
- Deep hierarchy (4+ levels)
- Custom colors per branch
- Hover interaction (path display)
- Drill-down interaction
- Many segments (50+)
