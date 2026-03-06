# Flitter Chart — Radix-Like Restructure + LLM Generation Spec

> This document is the single source of truth for restructuring `flitter-chart` into a
> Radix-like headless-first chart library, updating `llms.txt` to leverage it, and
> validating the result with comprehensive test cases.

---

## 1. Current State Summary

### 1.1 Architecture (3 layers)

```
packages/chart/src/
├── headless/          ← Pure logic: state, scale, data flow, slot invocations
│   ├── bar-chart/     (19 slots) ✅ production
│   ├── line-chart/    (19 slots) ✅ production — also used by AreaChart, StackedAreaChart
│   ├── scatter-chart/ (18 slots) ✅ production
│   ├── bubble-chart/  (18 slots) ✅ production
│   ├── pie-chart/     (5 slots)  ✅ production
│   ├── radar-chart/   (12 slots) ✅ production
│   ├── heatmap-chart/ (13 slots) ✅ production
│   └── _todo/
│       ├── box-plot-chart/     (18 slots) ✅ headless complete, no styled layer
│       ├── candlestick-chart/  (18 slots) ✅ headless complete, no styled layer
│       ├── funnel-chart/       (7 slots)  ✅ headless complete, no styled layer
│       ├── gauge-chart/        (6 slots)  ✅ headless complete, no styled layer
│       ├── sankey-chart/       (6 slots)  ✅ headless complete, no styled layer
│       ├── sunburst-chart/     (7 slots)  ✅ headless complete, no styled layer
│       ├── treemap-chart/      (6 slots)  ✅ headless complete, no styled layer
│       └── waterfall-chart/    (22 slots) ✅ headless complete, no styled layer
│
├── shared/            ← Parameterized, reusable visual components
│   ├── cartesian/     (14 files: axes, grid, layout, plot, scale, legend, title)
│   ├── bar-like/      (DataView, Grid, BarBox)
│   ├── line-like/     (DataView, Grid)
│   ├── point-like/    (Grid)
│   └── utils/         (scale.ts, draw-spline-line.ts)
│
├── styles/            ← Theme presets (config extraction → shared components)
│   ├── toast/         (10 vibrant colors, Arial, animation, tooltips)
│   └── ag/            (fills+strokes, Verdana, dashed grid, subtitle, no animation)
│
└── charts/            ← User-facing API (style selection → headless + theme wiring)
    ├── bar-chart/          toast ✅  ag ✅
    ├── stacked-bar-chart/  toast ✅  ag ✅
    ├── line-chart/         toast ✅  ag ✅
    ├── area-chart/         toast ✅  ag ✅
    ├── stacked-area-chart/ toast ✅  ag ✅
    ├── scatter-chart/      toast ✅  ag ✅
    ├── bubble-chart/       toast ✅  ag ✅
    ├── pie-chart/          toast ✅  ag ✗
    ├── radar-chart/        toast ✅  ag ✗
    └── heatmap-chart/      toast ✅  ag ✗
```

### 1.2 Slot Pattern (already Radix-like)

Every headless chart defines a `Custom<TConfig>` type where each slot is:
```ts
(args: SlotArgs, context: ChartContext<TConfig>) => Widget
```

Example — BarChart has 19+ slots:
```
layout, plot, dataView, barGroup, barBox, bar, dataLabel,
xAxis, yAxis, xAxisLabel, yAxisLabel, xAxisTick, yAxisTick,
xAxisLine, yAxisLine, grid, gridXLine, gridYLine, axisCorner,
legend, title
```

The user can override ANY slot while keeping the rest as defaults.

### 1.3 Controller Pattern

Each headless chart has a Controller (ChangeNotifier) that provides:
- **Data**: filtered datasets, legends, labels
- **Scale**: computed min/max/step (auto or custom)
- **Dimensions**: width/height via LayoutBuilder
- **Interaction**: hoverBar/unhoverBar, hoveredBar, toggleSeries, hiddenSeries
- **Direction** (cartesian): vertical/horizontal

### 1.4 What's Missing for Radix

| Gap | Description |
|-----|-------------|
| **custom is hidden** | The `custom` param exists but docs/API foreground `style: "toast"` |
| **No composable import** | Can't do `import { BarChart, useBarChartSlots } from "flitter-chart"` |
| **_todo charts blocked** | 8 headless charts have no styled layer → users can't use them |
| **No mix-and-match** | Can't combine bar+line in one cartesian frame |
| **llms.txt says "build from scratch"** | Instead of "use headless slots + override what you need" |

---

## 2. Target Architecture

### 2.1 Design Principle: Radix for Charts

Like Radix UI:
- **Headless primitives** handle all logic (state, scale, layout math)
- **Presets** (toast, ag) are optional starting points, not required
- **Users compose** by overriding specific slots with their own widgets
- **LLMs compose** the same way — override slots, not rebuild from zero

### 2.2 New API Surface

#### Level 1: Preset (current API, unchanged)
```ts
import { BarChart } from "flitter-chart";

BarChart({ style: "toast", data, config })
```

#### Level 2: Slot Override (Radix-like — make this first-class)
```ts
import { BarChart, toastBarChartDefaults } from "flitter-chart";

BarChart({
  style: "toast",
  data,
  config,
  custom: {
    ...toastBarChartDefaults,
    bar: (args, ctx) => MyCustomBar(args, ctx),
    layout: (args, ctx) => MyDashboardLayout(args, ctx),
  }
})
```

#### Level 3: Headless-only (full control)
```ts
import { HeadlessBarChart } from "flitter-chart/headless";
import { CartesianPlot, CartesianLayout, getScale } from "flitter-chart/shared";

HeadlessBarChart({
  data,
  getScale,
  custom: {
    layout: (args) => CartesianLayout(args),
    plot: (args) => CartesianPlot(args),
    bar: (args, ctx) => Container({ color: "blue", ... }),
    // ... all 19 slots
  }
})
```

#### Level 4: Composed / Combo Charts
```ts
// Bar + Line on same cartesian frame
// LLM builds this by using headless bar-chart slots for bars
// and manually adding line overlay via CustomPaint in the dataView slot
BarChart({
  style: "toast",
  data: barData,
  custom: {
    dataView: (args, ctx) => Stack({
      children: [
        defaultBarDataView(args, ctx),   // bars
        LineOverlay({ data: lineData, scale: ctx.scale }), // line on top
      ]
    })
  }
})
```

### 2.3 Export Structure

```ts
// flitter-chart (main)
export { BarChart, LineChart, ... } from "./charts";

// flitter-chart/headless
export { HeadlessBarChart, HeadlessLineChart, ... } from "./headless";
export type { BarChartCustom, BarChartContext, ... } from "./headless";

// flitter-chart/shared
export { CartesianLayout, CartesianPlot, getScale, ... } from "./shared";
export { BarBox, DataView as BarDataView, ... } from "./shared/bar-like";

// flitter-chart/presets
export { toastBarChartDefaults, agBarChartDefaults, ... } from "./charts/*/styles";
export { defaultToastBaseConfig, defaultAgBaseConfig } from "./styles";
```

### 2.4 _todo Charts → Production

Move all 8 _todo charts to production by:
1. Keep headless as-is (already complete)
2. Create minimal `charts/{chart}/base/` with structural defaults
3. Create `charts/{chart}/styles/toast/` with toast config
4. Wire to `charts/index.ts` exports
5. No AG style required initially

Priority order (by user demand likelihood):
1. waterfall-chart (22 slots, common in business dashboards)
2. treemap-chart (6 slots, data exploration)
3. funnel-chart (7 slots, conversion funnels)
4. gauge-chart (6 slots, KPI dashboards)
5. sankey-chart (6 slots, flow diagrams)
6. box-plot-chart (18 slots, statistical)
7. candlestick-chart (18 slots, financial)
8. sunburst-chart (7 slots, hierarchical)

---

## 3. Slot Reference (All Chart Types)

### 3.1 Cartesian Charts

#### BarChart / StackedBarChart (shared headless)
| Slot | Args | Purpose |
|------|------|---------|
| layout | `{title, legends[], plot}` | Top-level composition |
| plot | `{xAxis, yAxis, dataView, grid, axisCorner}` | Plot area |
| dataView | `{barGroups[]}` | Bar groups container |
| barGroup | `{bars[], index, label}` | One group at one x-position |
| barBox | `{bar, value, ratio, alignment, index}` | Size wrapper per bar |
| bar | `{value, label, legend, index}` | The actual bar visual |
| dataLabel | `{value, label, legend}` | Value label on bar |
| xAxis | `{line, labels[], tick}` | X-axis assembly |
| yAxis | `{line, labels[], tick}` | Y-axis assembly |
| xAxisLabel | `{name, index}` | Single x label |
| yAxisLabel | `{name, index}` | Single y label |
| xAxisTick | — | Tick mark |
| yAxisTick | — | Tick mark |
| xAxisLine | — | Axis baseline |
| yAxisLine | — | Axis baseline |
| grid | `{xLine, yLine}` | Grid overlay |
| gridXLine | — | Vertical grid line |
| gridYLine | — | Horizontal grid line |
| axisCorner | — | Corner junction |
| legend | `{name, index}` | Legend item |
| title | — | Title widget |

**Data**: `{ labels: string[], datasets: { legend: string, values: number[] }[] }`
**Scale**: `{ min, max, step }`
**Controller extras**: `direction`, `hoverBar/unhoverBar`, `toggleSeries`
**Stacked diff**: `stackedGetScale` (sums values), `stackedBarGroup` (vertical stacking)

#### LineChart / AreaChart / StackedAreaChart (shared headless)
| Slot | Args | Purpose |
|------|------|---------|
| layout | `{title, legends[], plot}` | Top-level |
| plot | `{xAxis, yAxis, dataView, grid, axisCorner}` | Plot area |
| dataView | `{lines[]}` | Lines/areas container |
| line | `{values[], legend, index}` | One series path (line or area) |
| dataLabel | `{value, label, legend}` | Point label |
| xAxis–yAxisLine | (same as bar) | Axes |
| grid–gridYLine | (same as bar) | Grid |
| axisCorner | — | Corner |
| legend | `{name, index}` | Legend |
| title | — | Title |

**Data**: `{ labels: string[], datasets: { legend: string, values: number[] }[] }`
**Controller extras**: `hoverPoint/unhoverPoint`, `hoveredPoint`
**Area diff**: filled path below line
**StackedArea diff**: `stackedGetScale`, cumulative paths

#### ScatterChart
| Slot | Args | Purpose |
|------|------|---------|
| scatter | `{label, legend, index}` | Point visual |
| dataView | `{scatters[{widget,x,y}], scale}` | Positioned points |
| dataLabel | `{x, y, value, label, legend}` | Point label |
| (axes, grid, layout same as bar) | | |

**Data**: `{ datasets: { legend, data: { x, y, label }[] }[] }`
**Scale**: `{ x: {min,max,step}, y: {min,max,step} }`
**Controller extras**: `hoverPoint/unhoverPoint`
**Shapes**: circle, square, triangle, star (toast)

#### BubbleChart
Same as scatter, but:
- Slot: `bubble` instead of `scatter`, args include `{value, label, legend, index}`
- **Data**: adds `value: number` per point
- **Scale**: adds `value: {min,max,step}` (3-dimensional)
- **Config**: `bubble: { minRadius, maxRadius, opacity }`

### 3.2 Non-Cartesian Charts

#### PieChart (5 slots)
| Slot | Args |
|------|------|
| layout | `{title, legends[], dataView}` |
| dataView | `{slices[{widget, startAngle, sweepAngle, percentage, index, name, value}]}` |
| slice | `{index, name, value, percentage, sweepAngle}` |
| legend | `{name, index}` |
| title | — |

**Data**: `{ datasets: { name, value }[] }`
**Config**: `pie: { strokeColor, strokeWidth, innerRadiusRatio }` (donut = innerRadiusRatio > 0)
**Controller**: `hoverSlice/unhoverSlice`, `toggleSeries`

#### RadarChart (12 slots)
| Slot | Args |
|------|------|
| layout | `{title, legends[], plot}` |
| plot | `{angularAxis, radialAxis, dataView}` |
| angularAxis | `{line, labels[]}` |
| angularAxisLine | `{axisCount}` |
| angularAxisLabel | `{index, label, angle, nx, ny}` |
| radialAxis | `{line, labels[]}` |
| radialAxisLine | `{levels, axisCount}` |
| radialAxisLabel | `{value, index}` |
| dataView | `{radars[]}` |
| radar | `{legend, index, vertices[{nx,ny,angle,ratio,value,label,index}]}` |
| legend | `{name, index}` |
| title | — |

**Data**: `{ labels: string[], datasets: { legend, values[] }[] }`
**Config**: `radar: { fillOpacity, strokeWidth, gridColor, gridWidth, axisColor, axisWidth, labelMargin }`
**Controller**: `hoverRadar/unhoverRadar`

#### HeatmapChart (13 slots)
| Slot | Args |
|------|------|
| layout | `{title, legend, plot}` (legend singular!) |
| plot | `{xAxis, yAxis, dataView, axisCorner}` |
| dataView | `{segments[][]}` (2D array) |
| segment | `{value, xIndex, yIndex}` |
| xAxis–yAxisTick | (same as cartesian) |
| xAxisLine, yAxisLine | — |
| axisCorner | — |
| legend | — (color scale, not series) |
| title | — |

**Data**: `{ xLabels[], yLabels[], values[][] }` (values[y][x])
**Scale**: `{ min, max }`
**Config**: `heatmap: { colorRange: [string,string,string], segment: { gap } }`
**Controller**: `setHovered({value,xIndex,yIndex,xLabel,yLabel})`, hover listeners

### 3.3 _todo Charts (headless complete, need styled layer)

| Chart | Slots | Data Shape | Key Logic |
|-------|-------|-----------|-----------|
| WaterfallChart | 22 | `{labels[], values[], totalIndices?[]}` | cumulative bars, 3 legends (increase/decrease/total) |
| TreemapChart | 6 | `{nodes: {label, value, color?}[]}` | squarify algorithm |
| FunnelChart | 7 | `{stages: {label, value, color?}[]}` | ratio/percentage calc |
| GaugeChart | 6 | `{value, min?, max?, zones?[]}` | needle angle, zone colors |
| SankeyChart | 6 | `{nodes[], links[{source,target,value}]}` | graph layout algorithm |
| BoxPlotChart | 18 | `{labels[], datasets[{legend, data[{min,q1,median,q3,max,outliers?}]}]}` | statistical |
| CandlestickChart | 18 | `{labels[], datasets[{open,high,low,close}]}` | OHLC |
| SunburstChart | 7 | `{root: {label, value?, children?[]}}` | hierarchical arc segments |

---

## 4. Updated llms.txt Structure

### 4.1 New Core Path

```
llms.txt
├── 1. setup.md              — install, run storybook
├── 2. fast-path.md          — intent → strategy (UPDATED: slot override as default)
├── 3. request-parser.md     — parse structure/interaction/complexity
├── 4. authoring-rules.md    — UPDATED: use headless slots, not rebuild from scratch
├── 5. intent-traps.md       — UPDATED: combo charts are slot overrides, not new APIs
```

### 4.2 New Build Path

```
├── 6. slot-composition.md   — NEW: how to read slot types, override, compose
├── 7. cartesian-skeleton.md — UPDATED: use shared cartesian, override slots
├── 8. interaction-patterns.md — hover/tooltip/legend via controller methods
├── 9. advanced-patterns.md  — stacking, negatives, overlays (via slot override)
├── 10. combo-charts.md      — NEW: bar+line, multi-axis via dataView slot
├── 11. custom-charts.md     — NEW: _todo charts, novel charts via headless
├── 12. novel-chart-design.md — design from semantics
```

### 4.3 New Reference Path

```
├── 13. repo-map.md          — UPDATED: headless/, shared/, styles/, charts/
├── 14. headless-reference.md — NEW: all slot tables (from Section 3 above)
├── 15. preset-reference.md  — toast/ag configs, defaults
├── 16. chart-selection.md   — quick chooser (unchanged)
├── 17. chart-type-docs/     — per-chart leaf docs (UPDATED with slot info)
├── 18. playground.md        — storybook validation
```

### 4.4 Key llms.txt Rule Changes

**Before (current):**
> Primary output target: build charts directly with `flitter-ui` primitives

**After:**
> Primary output target: use `flitter-chart` headless slots with selective overrides.
> Fall back to `flitter-ui` primitives only for slots you need to customize.
> Never rebuild scale calculation, axis layout, or data flow from scratch.

**Before:**
> do not assume the final output should import `flitter-chart`

**After:**
> Always start from `flitter-chart` headless. Import the chart, override specific
> slots via `custom: {}`. Only build from flitter-ui primitives for the specific
> visual elements that need customization.

**New combo chart rule:**
> To combine chart types (e.g., bar + line), use the `dataView` slot to Stack
> multiple data layers. Use the host chart's headless for axes and scale, and
> render the overlay as a CustomPaint or widget within the dataView slot.

---

## 5. Test Cases

### 5.1 Structure

Each test case has:
- `id`: unique identifier
- `prompt`: natural language user request
- `expected`: what the output MUST include
- `rejectIf`: what the output MUST NOT do
- `category`: chart-type | interaction | combo | custom | edge-case
- `difficulty`: basic | intermediate | advanced
- `storyExport`: Storybook story name for visual validation

### 5.2 Chart Type Coverage (10 production + 3 _todo priority)

```json
[
  {
    "id": "bar-basic-vertical",
    "category": "chart-type",
    "difficulty": "basic",
    "prompt": "Make a vertical bar chart for monthly revenue by region from January to June. Use a friendly default style.",
    "expected": [
      "BarChart",
      "style: \"toast\"",
      "direction: \"vertical\" or default",
      "labels with months",
      "datasets with region series"
    ],
    "rejectIf": [
      "builds from scratch without using flitter-chart",
      "invents unsupported config keys",
      "uses LineChart or PieChart"
    ]
  },
  {
    "id": "bar-horizontal-ranking",
    "category": "chart-type",
    "difficulty": "intermediate",
    "prompt": "Show platform migration risk ranked from highest to lowest by business unit. Labels are long enterprise names. Use a muted dashboard style.",
    "expected": [
      "BarChart",
      "style: \"ag\"",
      "direction: \"horizontal\"",
      "data sorted by risk descending"
    ],
    "rejectIf": [
      "chooses vertical despite long labels",
      "uses toast for muted dashboard",
      "converts to table or pie chart"
    ]
  },
  {
    "id": "stacked-bar-negative",
    "category": "chart-type",
    "difficulty": "intermediate",
    "prompt": "Show quarterly profit contribution by product line as a stacked chart. Some products have negative contributions that dragged performance down.",
    "expected": [
      "StackedBarChart",
      "negative values preserved in datasets",
      "stacking not grouping"
    ],
    "rejectIf": [
      "switches to grouped bars",
      "removes negative values",
      "uses WaterfallChart"
    ]
  },
  {
    "id": "line-basic-trend",
    "category": "chart-type",
    "difficulty": "basic",
    "prompt": "Create a line chart showing user retention rate over 12 months. Soft pastel style. No data given.",
    "expected": [
      "LineChart",
      "style: \"toast\"",
      "illustrative/mock dataset clearly labeled",
      "12 month labels"
    ],
    "rejectIf": [
      "uses BarChart",
      "invents data without noting it is illustrative"
    ]
  },
  {
    "id": "line-spline",
    "category": "chart-type",
    "difficulty": "intermediate",
    "prompt": "Show a smooth curved line chart of temperature changes across the year. Use spline interpolation.",
    "expected": [
      "LineChart",
      "config.line.spline: true",
      "12 monthly data points"
    ],
    "rejectIf": [
      "ignores spline request",
      "uses AreaChart when line was specified"
    ]
  },
  {
    "id": "area-filled-trend",
    "category": "chart-type",
    "difficulty": "basic",
    "prompt": "Display website session volume over the past quarter as a filled area chart with gentle opacity.",
    "expected": [
      "AreaChart",
      "config.area.opacity set (< 1)",
      "filled area below line"
    ],
    "rejectIf": [
      "uses LineChart without fill",
      "uses StackedAreaChart for single series"
    ]
  },
  {
    "id": "stacked-area-share",
    "category": "chart-type",
    "difficulty": "intermediate",
    "prompt": "Create a chart showing how traffic source share changed month by month across the year as one continuous trend.",
    "expected": [
      "StackedAreaChart",
      "style: \"toast\"",
      "multiple series stacked"
    ],
    "rejectIf": [
      "uses LineChart (no stacking)",
      "uses StackedBarChart (not continuous)",
      "uses PieChart (no time dimension)"
    ]
  },
  {
    "id": "scatter-basic",
    "category": "chart-type",
    "difficulty": "basic",
    "prompt": "Plot GDP per capita against life expectancy for several countries grouped by continent.",
    "expected": [
      "ScatterChart",
      "numeric x and y",
      "datasets grouped by continent"
    ],
    "rejectIf": [
      "uses BubbleChart without sizing dimension",
      "uses BarChart"
    ]
  },
  {
    "id": "bubble-three-dim",
    "category": "chart-type",
    "difficulty": "intermediate",
    "prompt": "Plot market opportunity: GDP per capita vs retention, sized by active accounts. Clean analytical look.",
    "expected": [
      "BubbleChart",
      "style: \"ag\"",
      "data points have x, y, value, label",
      "config.bubble.minRadius and maxRadius"
    ],
    "rejectIf": [
      "uses ScatterChart (loses size dimension)",
      "omits value field in data"
    ]
  },
  {
    "id": "pie-donut",
    "category": "chart-type",
    "difficulty": "basic",
    "prompt": "Show browser usage share as a donut chart.",
    "expected": [
      "PieChart",
      "config.pie.innerRadiusRatio > 0",
      "datasets with name and value"
    ],
    "rejectIf": [
      "innerRadiusRatio is 0 (not donut)",
      "uses BarChart"
    ]
  },
  {
    "id": "radar-profile",
    "category": "chart-type",
    "difficulty": "intermediate",
    "prompt": "Compare three engineering teams across 8 dimensions: architecture, delivery, testing, DX, reliability, observability, security, collaboration.",
    "expected": [
      "RadarChart",
      "shared labels across 3 datasets",
      "8 axes"
    ],
    "rejectIf": [
      "uses cartesian chart",
      "collapses into single series",
      "labels not shared"
    ]
  },
  {
    "id": "heatmap-matrix",
    "category": "chart-type",
    "difficulty": "intermediate",
    "prompt": "Build a heatmap of average response load by weekday (rows) and month (columns). Months left to right, weekdays top to bottom.",
    "expected": [
      "HeatmapChart",
      "xLabels: months",
      "yLabels: weekdays",
      "values[y][x] orientation"
    ],
    "rejectIf": [
      "xLabels and yLabels swapped",
      "matrix transposed",
      "uses bar or line chart"
    ]
  },
  {
    "id": "waterfall-cumulative",
    "category": "chart-type",
    "difficulty": "advanced",
    "prompt": "Build a waterfall chart showing how each factor increased or decreased operating profit from Q1 to Q2. Use flitter-chart headless if available.",
    "expected": [
      "uses headless waterfall-chart or builds from bar-chart with cumulative logic",
      "increase/decrease/total categories",
      "cumulative semantics preserved"
    ],
    "rejectIf": [
      "invents unsupported public WaterfallChart API without verifying",
      "ignores cumulative semantics",
      "rewrites as plain bar chart"
    ]
  }
]
```

### 5.3 Interaction Coverage

```json
[
  {
    "id": "hover-tooltip-bar",
    "category": "interaction",
    "difficulty": "intermediate",
    "prompt": "Make a bar chart of Q1-Q4 revenue. When hovering a bar, show the exact value in a tooltip.",
    "expected": [
      "BarChart with tooltip enabled",
      "config.tooltip.enabled: true OR custom bar slot with GestureDetector + Tooltip",
      "hover state management"
    ],
    "rejectIf": [
      "no hover interaction at all",
      "tooltip always visible (not on-demand)"
    ]
  },
  {
    "id": "legend-filter",
    "category": "interaction",
    "difficulty": "intermediate",
    "prompt": "Show a multi-series line chart. Clicking a legend item should toggle that series on/off.",
    "expected": [
      "LineChart with multiple datasets",
      "legend click triggers toggleSeries() via controller",
      "hidden series removed from chart"
    ],
    "rejectIf": [
      "legend is static/non-interactive",
      "clicking legend does nothing"
    ]
  },
  {
    "id": "hover-highlight-scatter",
    "category": "interaction",
    "difficulty": "intermediate",
    "prompt": "Create a scatter chart. When hovering a point, highlight it and dim other points.",
    "expected": [
      "ScatterChart",
      "custom scatter slot or toast default hover",
      "opacity change on hover (hovered=1, others dimmed)"
    ],
    "rejectIf": [
      "no hover behavior",
      "all points same opacity always"
    ]
  },
  {
    "id": "dense-label-fallback",
    "category": "interaction",
    "difficulty": "advanced",
    "prompt": "Make a bar chart with 50 categories. Labels would be unreadable if all shown. Handle the density.",
    "expected": [
      "horizontal bars OR label abbreviation OR tooltip-on-hover for full labels",
      "acknowledges density problem",
      "readable result"
    ],
    "rejectIf": [
      "renders 50 overlapping vertical labels",
      "ignores the density issue"
    ]
  },
  {
    "id": "click-selection-pie",
    "category": "interaction",
    "difficulty": "advanced",
    "prompt": "Create a pie chart for market share. Clicking a slice should highlight it (pull out or change opacity) and show details.",
    "expected": [
      "PieChart",
      "custom slice slot with GestureDetector onClick",
      "selected state tracked in StatefulWidget",
      "visual feedback on selection"
    ],
    "rejectIf": [
      "no click interaction",
      "uses React hooks for state"
    ]
  }
]
```

### 5.4 Slot Override / Composition Tests

```json
[
  {
    "id": "custom-bar-slot",
    "category": "composition",
    "difficulty": "intermediate",
    "prompt": "Use a toast bar chart but replace the bar rendering with rounded gradient bars instead of solid colors.",
    "expected": [
      "BarChart with custom.bar override",
      "headless handles scale/axes/layout",
      "only bar slot is overridden",
      "uses Container with BoxDecoration gradient"
    ],
    "rejectIf": [
      "rebuilds entire chart from scratch",
      "overrides all slots when only bar needs changing"
    ]
  },
  {
    "id": "custom-layout-slot",
    "category": "composition",
    "difficulty": "advanced",
    "prompt": "Build a bar chart where the title is above, legend is on the right side, and there is a subtitle below the title. Use AG style as base.",
    "expected": [
      "BarChart style: \"ag\"",
      "custom.layout override OR config.title + config.subtitle + config.legend.position",
      "layout customization without rebuilding axes/bars"
    ],
    "rejectIf": [
      "rebuilds entire chart for layout change",
      "loses axis/bar functionality"
    ]
  },
  {
    "id": "combo-bar-line",
    "category": "composition",
    "difficulty": "advanced",
    "prompt": "Show revenue as bars and profit margin as a line on the same chart. Both share the x-axis (months).",
    "expected": [
      "starts from BarChart or HeadlessBarChart",
      "overrides dataView slot to Stack bars + line overlay",
      "line rendered via CustomPaint or widget in dataView",
      "shared x-axis, bar scale for bars"
    ],
    "rejectIf": [
      "invents combo-chart API",
      "invents dual-axis config that doesn't exist",
      "gives up and makes two separate charts"
    ]
  },
  {
    "id": "headless-only-custom",
    "category": "composition",
    "difficulty": "advanced",
    "prompt": "Build a custom scorecard: ranked horizontal bars with threshold markers and hover details. Use headless bar-chart for structure.",
    "expected": [
      "imports HeadlessBarChart or BarChart with extensive custom overrides",
      "threshold markers as additional widgets in bar or barGroup slot",
      "hover details via GestureDetector in bar slot",
      "horizontal direction"
    ],
    "rejectIf": [
      "builds entirely from flitter-ui without headless",
      "collapses to plain bar chart without thresholds",
      "no hover interaction"
    ]
  },
  {
    "id": "heatmap-custom-color",
    "category": "composition",
    "difficulty": "intermediate",
    "prompt": "Make a heatmap but use a blue-to-red diverging color scale instead of the default orange.",
    "expected": [
      "HeatmapChart",
      "config.heatmap.colorRange with blue-to-red colors",
      "OR custom segment slot with color interpolation"
    ],
    "rejectIf": [
      "uses default orange color range without changing",
      "rebuilds heatmap from scratch"
    ]
  }
]
```

### 5.5 Edge Cases

```json
[
  {
    "id": "unsupported-combo-reject",
    "category": "edge-case",
    "difficulty": "intermediate",
    "prompt": "Make a combo chart with revenue bars and margin as a line on a second Y-axis.",
    "expected": [
      "does NOT invent dual-axis config",
      "either: single-axis overlay via slot override, or acknowledges dual-axis is not built-in",
      "suggests workaround if possible"
    ],
    "rejectIf": [
      "invents dual-axis API",
      "pretends the feature exists"
    ]
  },
  {
    "id": "single-point-pie",
    "category": "edge-case",
    "difficulty": "basic",
    "prompt": "Show traffic source share for this one quarter only.",
    "expected": [
      "PieChart (single snapshot)",
      "no time axis"
    ],
    "rejectIf": [
      "uses StackedAreaChart",
      "invents time dimension"
    ]
  },
  {
    "id": "share-over-time-not-pie",
    "category": "edge-case",
    "difficulty": "basic",
    "prompt": "Show how traffic source share changed across the year.",
    "expected": [
      "StackedAreaChart (share over time)"
    ],
    "rejectIf": [
      "uses PieChart (collapses time)",
      "single snapshot"
    ]
  },
  {
    "id": "no-data-mock",
    "category": "edge-case",
    "difficulty": "basic",
    "prompt": "Make me a pretty radar chart for team skills. No data provided.",
    "expected": [
      "RadarChart",
      "synthesized illustrative dataset",
      "clearly labeled as mock/illustrative"
    ],
    "rejectIf": [
      "refuses without data",
      "presents mock data as real"
    ]
  },
  {
    "id": "sankey-flow-novel",
    "category": "edge-case",
    "difficulty": "advanced",
    "prompt": "I need a sankey-like flow view for acquisition sources → product funnels → paid plans. We can build it manually.",
    "expected": [
      "recognizes sankey structure",
      "uses headless sankey-chart if available, or designs from semantics",
      "nodes + links + positioned layout"
    ],
    "rejectIf": [
      "forces into bars or lines",
      "claims packaged support without verification"
    ]
  }
]
```

---

## 6. Validation Conditions

### 6.1 Hard Tests (Automated)

| Test | Method | Pass Condition |
|------|--------|----------------|
| **Build** | `tsc --noEmit` on generated file | No type errors |
| **Import validity** | Static analysis | All imports resolve to real modules |
| **Chart type** | String match in generated code | Matches expected chart family |
| **Reject patterns** | String search | None of rejectIf patterns found |
| **Storybook render** | Playwright: navigate to story, check for errors | No console errors, canvas/SVG rendered |
| **Screenshot** | Playwright screenshot | Non-empty render (width > 0, height > 0) |

### 6.2 Soft Tests (Critic Review)

| Criterion | Question |
|-----------|----------|
| **Slot efficiency** | Did the LLM override only needed slots, not rebuild from scratch? |
| **Scale correctness** | Is the scale computation delegated to headless, not reinvented? |
| **Interaction completeness** | Does hover/tooltip/legend filtering work as requested? |
| **Style faithfulness** | Does the output match the requested style (toast/ag/custom)? |
| **Data shape** | Does the data match the headless chart's expected type? |
| **Convention compliance** | Factory functions, StatefulWidget (not hooks), proper imports? |

### 6.3 Completion Criteria for Ralph/Codex

The docs are considered **complete** when:

1. All 28 test cases pass hard tests (build + render + type match + no reject)
2. Critic review confirms slot efficiency for composition tests
3. Combo chart (bar+line) renders correctly via slot override
4. At least one _todo chart (waterfall) works via headless import
5. No test case requires building from flitter-ui primitives when headless covers it

Signal:
```
<promise>RADIX DOCS COMPLETE</promise>
```

---

## 7. Implementation Order

### Phase 1: Export Surface (code change)
1. Add subpath exports to `flitter-chart` package.json:
   - `flitter-chart/headless`
   - `flitter-chart/shared`
   - `flitter-chart/presets`
2. Export preset defaults (toastBarChartDefaults, etc.) from each style
3. Export HeadlessBarChart etc. from headless/index.ts

### Phase 2: Promote _todo Charts (code change)
1. Move waterfall-chart out of _todo
2. Create `charts/waterfall-chart/base/` + `styles/toast/`
3. Wire to exports
4. Repeat for treemap, funnel, gauge (priority order)

### Phase 3: Update llms.txt (docs change)
1. Rewrite fast-path.md: slot override as default strategy
2. Write new slot-composition.md
3. Write new combo-charts.md
4. Update authoring-rules.md: headless-first rule
5. Update all chart leaf docs with slot tables
6. Update repo-map.md with new export paths

### Phase 4: Test Cases (docs + storybook)
1. Update evaluation-cases.json with all 28 cases
2. Create Storybook stories for each test case
3. Write Playwright tests for automated validation
4. Run evaluation loop, patch docs

### Phase 5: Ralph Loop Validation
1. Run Ralph with testing-prompts.md
2. For each prompt: generate → build → render → validate
3. Patch narrowest doc on failure
4. Iterate until all 28 pass

---

## 8. File Locations Reference

### Core Package
```
packages/chart/src/
├── index.ts                              ← Public exports (UPDATE)
├── headless/index.ts                     ← Headless exports (CREATE)
├── shared/index.ts                       ← Shared exports (CREATE)
├── headless/{chart}/types.ts             ← Slot type definitions
├── headless/{chart}/controller.ts        ← State + methods
├── headless/{chart}/chart.ts             ← Widget tree (slot invocations)
├── headless/{chart}/provider.ts          ← ChangeNotifierProvider
├── charts/{chart}/index.ts               ← Factory function
├── charts/{chart}/base/index.ts          ← Structural defaults
├── charts/{chart}/styles/toast/index.ts  ← Toast preset
├── charts/{chart}/styles/toast/config.ts ← Toast config type
├── charts/{chart}/styles/ag/index.ts     ← AG preset
├── styles/toast/cartesian/config.ts      ← ToastBaseConfig
├── styles/ag/cartesian/config.ts         ← AgCartesianBaseConfig
├── shared/cartesian/                     ← Reusable axis/grid/layout
├── shared/bar-like/                      ← Bar-specific shared
├── shared/line-like/                     ← Line-specific shared
├── shared/point-like/                    ← Scatter-specific shared
└── shared/utils/                         ← Scale, spline utilities
```

### Docs
```
docs/public/
├── llms.txt                              ← Router (UPDATE)
├── llm/setup.md                          ← Install guide
├── llm/fast-path.md                      ← Strategy (UPDATE)
├── llm/slot-composition.md               ← NEW: slot override guide
├── llm/combo-charts.md                   ← NEW: composition guide
├── llm/headless-reference.md             ← NEW: all slot tables
├── llm/authoring-rules.md                ← UPDATE: headless-first
├── llm/evaluation-cases.json             ← UPDATE: 28 cases
├── llm/testing-prompts.md                ← UPDATE: 28+ prompts
└── llm/RADIX_RESTRUCTURE_SPEC.md         ← THIS FILE
```

### Storybook
```
dev/chart-storybook/src/stories/
├── LLMEvaluation.stories.tsx             ← UPDATE: all 28 test stories
```
