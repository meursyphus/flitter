# Flitter Chart - Bar Chart Reference

> This document is designed for LLMs. Pass this file to your AI assistant to generate Flitter bar charts.

## Installation

```bash
npm install @flitterjs/chart @flitterjs/react   # React
npm install @flitterjs/chart @flitterjs/svelte   # Svelte
```

## Quick Start

```typescript
import { BarChart } from "@flitterjs/chart";

const chart = BarChart({
  style: "toast",
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      { legend: "Sales", values: [40, 60, 80] },
    ],
  },
});
```

### Rendering (React)

```tsx
import Widget from "@flitterjs/react";
import { BarChart } from "@flitterjs/chart";

function App() {
  const chart = BarChart({
    style: "toast",
    data: { labels: ["A", "B", "C"], datasets: [{ legend: "v1", values: [10, 20, 30] }] },
  });

  return <Widget widget={chart} width="600px" height="400px" renderer="svg" />;
}
```

### Rendering (Svelte)

```svelte
<script>
  import Widget from "@flitterjs/svelte";
  import { BarChart } from "@flitterjs/chart";

  const chart = BarChart({
    style: "toast",
    data: { labels: ["A", "B", "C"], datasets: [{ legend: "v1", values: [10, 20, 30] }] },
  });
</script>

<Widget widget={chart} width="600px" height="400px" renderer="svg" />
```

---

## Data Types

### BarChartData

```typescript
type BarChartData = {
  labels: string[];                              // Category labels (x-axis for vertical)
  datasets: { legend: string; values: number[] }[];  // One entry per series
};
```

### BarChartScale

```typescript
type BarChartScale = {
  min: number;   // Minimum value on value axis
  max: number;   // Maximum value on value axis
  step: number;  // Tick interval
};
```

### BarChartDirection

```typescript
type BarChartDirection = "vertical" | "horizontal";
```

---

## BarChart Props

```typescript
BarChart({
  style: "toast",                    // Required - style preset name
  data: BarChartData,                // Required - chart data
  config?: Partial<ToastBarChartConfig>,  // Optional - override style config
  custom?: Partial<BarChartCustom<ToastBarChartConfig>>,  // Optional - override renderers
  title?: string,                    // Optional - chart title text
  direction?: "vertical" | "horizontal",  // Optional - default "vertical"
  getScale?: (data: BarChartData) => BarChartScale,  // Optional - custom scale calculation
})
```

---

## Toast Style Config (`ToastBarChartConfig`)

All properties are optional when passed as `config`. Defaults are shown.

### colors

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `colors` | `string[]` | `["#00a9ff", "#ffb840", "#ff5a46", "#00bd9f", "#785fff", "#f28b8c", "#989486", "#516f7d", "#28e6eb", "#28695f"]` | Color palette for data series. Colors cycle if datasets exceed palette length. |

### font

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `font.family` | `string` | `"Noto Sans JP"` | Base font family for all text |
| `font.size` | `number` | `11` | Base font size (px) |

### title

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title.visible` | `boolean` | `true` | Show/hide chart title |
| `title.color` | `string` | `"#000000"` | Title text color |
| `title.fontSize` | `number` | `16` | Title font size (px) |
| `title.fontFamily` | `string?` | `undefined` | Title font family (falls back to `font.family`) |
| `title.fontWeight` | `string?` | `"bold"` | Title font weight |
| `title.position` | `"top" \| "bottom"` | `"top"` | Title placement |
| `title.alignment` | `"start" \| "center" \| "end"` | `"center"` | Title horizontal alignment |

### legend

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `legend.visible` | `boolean` | `true` | Show/hide legend |
| `legend.position` | `"top" \| "bottom"` | `"bottom"` | Legend placement |

### axis

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `axis.color` | `string` | `"#BBBBBB"` | Axis line and tick color |
| `axis.thickness` | `number` | `1` | Axis line thickness (px) |
| `axis.label.color` | `string` | `"#666666"` | Axis label text color |
| `axis.label.fontSize` | `number` | `11` | Axis label font size (px) |
| `axis.label.gap` | `number` | `8` | Gap between tick and label (px) |
| `axis.tick.size` | `number` | `6` | Tick mark length (px) |

### grid

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `grid.color` | `string` | `"#EEEEEE"` | Grid line color |
| `grid.thickness` | `number` | `1` | Grid line thickness (px) |

### padding

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `padding.top` | `number` | `30` | Top padding (px) |
| `padding.right` | `number` | `20` | Right padding (px) |
| `padding.bottom` | `number` | `40` | Bottom padding (px) |
| `padding.left` | `number` | `60` | Left padding (px) |

### bar

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `bar.gap` | `number` | `1` | Horizontal margin between bars within a group (px) |
| `bar.cornerRadius` | `number` | `0` | Bar corner radius (px) |

### animation

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `animation.enabled` | `boolean` | `true` | Enable/disable entry animation |
| `animation.duration` | `number` | `300` | Animation duration (ms) |
| `animation.staggerDelay` | `number` | `60` | Delay between bar group animations (ms) |

---

## Custom Renderers (`BarChartCustom`)

Override any visual element by providing a custom renderer function. Each function receives its specific args and the full `BarChartContext`.

```typescript
type BarChartContext<TConfig> = {
  custom: BarChartCustom<TConfig>;
  data: BarChartData;
  scale: BarChartScale;
  title: string;
  direction: BarChartDirection;
  config: TConfig;
};
```

### Element Reference

| Element | Args | Description |
|---------|------|-------------|
| `layout` | `{ title: Widget, legends: Widget[], plot: Widget }` | Root layout - arranges title, legend, and plot area |
| `plot` | `{ xAxis: Widget, yAxis: Widget, series: Widget, grid: Widget, axisCorner: Widget }` | Plot area - arranges axes, data series, and grid |
| `series` | `{ barGroups: Widget[] }` | Container for all bar groups |
| `barGroup` | `{ bars: Widget[], index: number, label: string, values: number[] }` | A group of bars for one category |
| `bar` | `{ value: number, label: string, legend: string, index: number }` | Individual bar |
| `title` | `{ name: string }` | Chart title |
| `legend` | `{ name: string, index: number }` | Single legend item |
| `dataLabel` | `{ value: number, label: string, legend: string }` | Data label on a bar |
| `xAxis` | `{ line: Widget, labels: Widget[], tick: Widget }` | X-axis container |
| `yAxis` | `{ line: Widget, labels: Widget[], tick: Widget }` | Y-axis container |
| `xAxisLabel` | `{ name: string, index: number }` | Single x-axis label |
| `yAxisLabel` | `{ name: string, index: number }` | Single y-axis label |
| `xAxisTick` | `undefined` | X-axis tick mark |
| `yAxisTick` | `undefined` | Y-axis tick mark |
| `xAxisLine` | `undefined` | X-axis line |
| `yAxisLine` | `undefined` | Y-axis line |
| `axisCorner` | `undefined` | Corner where axes meet |
| `grid` | `{ xLine: Widget, yLine: Widget }` | Grid container |
| `gridXLine` | `undefined` | Horizontal grid line |
| `gridYLine` | `undefined` | Vertical grid line |

### Custom Renderer Signature

```typescript
type CustomRenderer<TArgs, TConfig> = (
  args: TArgs,
  context: BarChartContext<TConfig>
) => Widget;
```

### Custom Renderer Example

```typescript
import { BarChart } from "@flitterjs/chart";
import { Container, BoxDecoration, BorderRadius, Border, EdgeInsets } from "flitter-core";

const chart = BarChart({
  style: "toast",
  data: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      { legend: "Revenue", values: [120, 180, 240, 200] },
      { legend: "Cost", values: [80, 100, 140, 120] },
    ],
  },
  config: {
    colors: ["#6366f1", "#f43f5e"],
    bar: { cornerRadius: 4, gap: 2 },
    animation: { duration: 500, staggerDelay: 100 },
  },
  custom: {
    bar: ({ value, legend, index }, context) => {
      const { colors } = context.config;
      const idx = context.data.datasets.findIndex((d) => d.legend === legend);
      return Container({
        margin: EdgeInsets.symmetric({ horizontal: 2 }),
        decoration: new BoxDecoration({
          color: colors[idx % colors.length],
          borderRadius: BorderRadius.only({
            topLeft: 4,
            topRight: 4,
          }),
          border: Border.all({ color: "#00000022", width: 1 }),
        }),
      });
    },
  },
});
```

---

## Config Override Examples

### Horizontal Bar Chart

```typescript
BarChart({
  style: "toast",
  direction: "horizontal",
  data: { labels: ["A", "B", "C"], datasets: [{ legend: "v1", values: [30, 50, 70] }] },
});
```

### Custom Colors and Animation

```typescript
BarChart({
  style: "toast",
  data: { labels: ["Jan", "Feb", "Mar"], datasets: [{ legend: "Sales", values: [40, 60, 80] }] },
  config: {
    colors: ["#6366f1", "#ec4899", "#14b8a6"],
    animation: { enabled: true, duration: 600, staggerDelay: 120 },
  },
});
```

### No Animation, Bottom Title

```typescript
BarChart({
  style: "toast",
  title: "Monthly Report",
  data: { labels: ["Jan", "Feb"], datasets: [{ legend: "v1", values: [100, 200] }] },
  config: {
    animation: { enabled: false, duration: 0, staggerDelay: 0 },
    title: { visible: true, position: "bottom", alignment: "start", color: "#333", fontSize: 14, fontWeight: "600" },
  },
});
```

### Multi-Dataset with Custom Grid

```typescript
BarChart({
  style: "toast",
  title: "Quarterly Comparison",
  data: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      { legend: "2024", values: [150, 200, 180, 220] },
      { legend: "2025", values: [170, 210, 240, 260] },
    ],
  },
  config: {
    grid: { color: "#f0f0f0", thickness: 1 },
    axis: { color: "#999", thickness: 1, label: { color: "#555", fontSize: 12, gap: 10 }, tick: { size: 4 } },
    padding: { top: 40, right: 30, bottom: 50, left: 70 },
  },
});
```

### Custom Scale

```typescript
BarChart({
  style: "toast",
  data: { labels: ["A", "B"], datasets: [{ legend: "v1", values: [15, 25] }] },
  getScale: (data) => ({ min: 0, max: 50, step: 10 }),
});
```

---

## Imports

```typescript
// Chart factory
import { BarChart } from "@flitterjs/chart";

// Type imports
import type { ToastBarChartConfig } from "@flitterjs/chart";

// Headless (advanced)
import { Headless } from "@flitterjs/chart";
const HeadlessBarChart = Headless.BarChart;

// Widget rendering primitives (for custom renderers)
import {
  Container, Text, TextStyle, Row, Column, Expanded, Flexible,
  SizedBox, Padding, EdgeInsets, BoxDecoration, Border, BorderRadius,
  Alignment, MainAxisAlignment, CrossAxisAlignment, MainAxisSize,
  FractionallySizedBox, Stack, Positioned,
} from "flitter-core";

// Framework integration
import Widget from "@flitterjs/react";   // React
import Widget from "@flitterjs/svelte";  // Svelte
```
