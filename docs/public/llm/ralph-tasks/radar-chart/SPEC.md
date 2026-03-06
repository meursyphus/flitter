# Radar Chart -- Radix-Like Spec

## Status
production

## Purpose
Use a radar chart to compare profiles across a common set of dimensions. Each dataset forms a polygon on shared radial axes. Ideal for multi-variable comparison where shape matters more than exact values.

## Data Shape
```typescript
type RadarChartData = {
  labels: string[];
  datasets: { legend: string; values: number[] }[];
};

type RadarChartScale = {
  min: number;
  max: number;
  step: number;
};
```

`labels` defines the axis names (one per spoke). Each dataset's `values` array must have the same length as `labels`.

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | title: Widget, legends: Widget[], plot: Widget | Root layout (title, legend, plot) |
| plot | angularAxis: Widget, radialAxis: Widget, dataView: Widget | Plot area stacking axes and data |
| angularAxis | line: Widget, labels: Widget[] | Spokes + category labels container |
| angularAxisLine | axisCount: number | Spoke lines from center to edge |
| angularAxisLabel | index, label, angle, nx, ny | Individual label at a spoke endpoint |
| radialAxis | line: Widget, labels: Widget[] | Concentric grid + scale labels container |
| radialAxisLine | levels: number, axisCount: number | Concentric polygons (grid rings) |
| radialAxisLabel | value, index | Scale label at a grid ring level |
| dataView | radars: Widget[] | Container for all radar polygons |
| radar | legend: string, index: number, vertices: RadarVertex[] | One dataset's polygon |
| legend | name: string, index: number | Single legend item |
| title | -- | Chart title |

Total: 12 slots.

### RadarVertex
```typescript
type RadarVertex = {
  nx: number;    // Normalized x (0..1, center = 0.5)
  ny: number;    // Normalized y (0..1, center = 0.5)
  angle: number; // Radians from top (-PI/2 = top, clockwise)
  ratio: number; // value / max (0..1)
  value: number; // Raw data value
  label: string; // Axis label
  index: number; // Axis index
};
```

## Controller Methods
- `hoverRadar(index, legend)` -- highlight a radar polygon
- `unhoverRadar()` -- clear hover state
- `hoveredRadar` -- currently hovered { index, legend } or null
- `isRadarHovered(index, legend)` -- check hover state
- `toggleSeries(legend)` -- show/hide a dataset
- `showSeries(legend)` / `hideSeries(legend)` / `showAllSeries()` -- explicit visibility
- `isSeriesVisible(legend)` -- check visibility
- `setSize(width, height)` -- update chart dimensions
- `scale` -- computed { min, max, step } from data via getScale function
- `data` (getter) -- returns filtered data (hidden series excluded)
- `legends` (getter) -- all dataset legend names (including hidden)

## Scale
Explicit scale with `{ min, max, step }`. Computed by a `getScale` function passed to the controller. Scale recalculates when series are toggled.

## Style Presets
- **toast** only (no AG style, no plugin.ts)

## Config
```typescript
type ToastRadarChartConfig = ToastBaseConfig & {
  radar: {
    fillOpacity: number;   // default: 0.3
    strokeWidth: number;   // default: 2
    gridColor: string;     // default: "rgba(0, 0, 0, 0.1)"
    gridWidth: number;     // default: 1
    axisColor: string;     // default: "rgba(0, 0, 0, 0.1)"
    axisWidth: number;     // default: 1
    labelMargin: number;   // default: 24 (px around plot for labels)
  };
};
```

Default overrides from ToastBaseConfig:
- `legend.position`: "right-top"
- `padding`: { top: 20, right: 20, bottom: 20, left: 20 }

## Coordinate System
- Polar coordinates: angle 0 = top (12 o'clock), increasing clockwise
- In radians: top = -PI/2
- Normalized positions: nx/ny range 0..1, center = (0.5, 0.5)
- `ratio` = value / scale.max, range 0..1

## Layout
- Plot area stacks angularAxis, radialAxis, and dataView
- Concentric polygons for radial grid (number of sides = number of labels)
- Spokes from center to each label position
- Labels placed outside the outermost ring with `labelMargin` offset
- Title and legends placed outside the plot area

## UX Patterns
- **Radar hover**: highlights one polygon (increased opacity or stroke) on hover
- **Legend filter**: clicking a legend item calls `toggleSeries`; scale recalculates for remaining datasets
- **Profile comparison**: multiple overlapping polygons for comparing shapes
- **Animation**: polygons animate vertices on mount and data change

## Storybook Stories Required
- Basic single series
- Multi-series comparison
- With legend interaction
- Custom radar slot override
- Many axes (8+)
- With tooltip interaction
