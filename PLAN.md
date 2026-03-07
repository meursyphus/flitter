# Flitter Chart - Headless Primitives Plan

## Goal
chart package = headless primitives + building blocks only.
Styled charts move to shared/ as reference code for storybook/docs.
LLM-ready docs so anyone can build any chart.

---

## Reference: Headless 5-File Pattern

Every headless chart follows this exact pattern. Two reference implementations exist:

### Cartesian (with axes/scale): `packages/chart/src/headless/bar-chart/`
### Non-Cartesian (no axes): `packages/chart/src/headless/pie-chart/`

### File 1: types.ts
```typescript
import type { Widget } from 'flitter-core';
import type { XXXController } from './controller';

type CustomArgs<T = undefined, TConfig = {}> = (args: T, context: XXXContext<TConfig>) => Widget;

export type XXXContext<TConfig = {}> = XXXController & { config: TConfig };

export type XXXCustom<TConfig = {}> = {
  // MUST have: layout, dataView, legend, title
  // Cartesian: + plot, xAxis, yAxis, xAxisLabel, yAxisLabel, xAxisTick, yAxisTick,
  //              xAxisLine, yAxisLine, grid, gridXLine, gridYLine, axisCorner
  // Chart-specific: bar, line, slice, node, etc.
  layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
  dataView: CustomArgs<{ ... }, TConfig>;
  // ...
};

export type XXXData = { ... };
export type XXXScale = { min: number; max: number; step: number };  // cartesian only
```

### File 2: controller.ts
```typescript
import { ChangeNotifier } from "flitter-core";

export class XXXController extends ChangeNotifier {
  #rawData: XXXData;
  #hiddenSeries: Set<string> = new Set();
  #width: number = 0;
  #height: number = 0;
  custom!: XXXCustom<any>;
  config: any;

  // Cartesian only:
  #scale: XXXScale | null = null;
  #getScale: GetScaleFn;

  // data getter filters by hiddenSeries
  // setSize() triggers scale recalc + notifyListeners()
  // toggleSeries/showSeries/hideSeries/showAllSeries
  // hover state: chart-specific (hoverBar, hoverSlice, etc.)
}
```

### File 3: provider.ts
```typescript
const XXX_KEY = Symbol("XXXKey");

export function XXXProvider({ custom, data, config, ... }): Widget {
  return ChangeNotifierProvider({
    providerKey: XXX_KEY,
    create: () => new XXXController({ data, custom, config, ... }),
    update: (notifier) => {
      const controller = notifier as XXXController;
      controller.data = data;
      controller.custom = custom;
      controller.config = config;
    },
    child: new Chart(),
  });
}

XXXProvider.of = (context: BuildContext): XXXController => {
  return Provider.of(XXX_KEY, context) as XXXController;
};
```

### File 4: chart.ts
```typescript
// Chart → SizeTracker → Layout
// Layout calls ctx.custom.layout({ title, legends, plot/dataView }, ctx)
// Each leaf widget calls ctx.custom.XXX(args, ctx)
// ALL visual decisions delegated to custom functions
// chart.ts only handles: data iteration, scale label generation, angle calculation, etc.
```

### File 5: index.ts
```typescript
export default function XXXChart<TConfig = {}>(props: {
  custom: XXXCustom<TConfig>;
  data: XXXData;
  config?: TConfig;
  // cartesian: + getScale, getScaleOptions?, direction?
}): Widget {
  return XXXProvider(props as any);
}
```

---

## Phase 0: Package Structure Cleanup

### Task 0-1: Move styled charts to shared/chart-styles
- [ ] Create `shared/chart-styles/` directory at project root
- [ ] Move `packages/chart/src/charts/` entirety to `shared/chart-styles/charts/`
- [ ] Move `packages/chart/src/styles/` (toast/, ag/) to `shared/chart-styles/styles/`
- [ ] Create `shared/chart-styles/package.json` with flitter-chart as dependency
- [ ] Set up tsconfig paths (@shared, @styles, @headless aliases)

**Verify:**
- `packages/chart/src/` only contains `headless/` and `shared/`
- `npm run flitter:build` succeeds

### Task 0-2: Clean chart package exports
- [ ] Rewrite `packages/chart/src/index.ts`:
```typescript
export * from './headless';
export * as Cartesian from './shared/cartesian';
export * as BarLike from './shared/bar-like';
export * as LineLike from './shared/line-like';
export * as PointLike from './shared/point-like';
export * as Utils from './shared/utils';
```
- [ ] Clean `packages/chart/src/headless/index.ts`: remove _todo references, export all active charts

**Verify:**
- `npm run flitter:build` succeeds

### Task 0-3: Fix storybook/docs imports
- [ ] Update all imports in storybook to use `shared/chart-styles/`
- [ ] Update all imports in docs to use `shared/chart-styles/`

**Verify:**
- `npm run story:start` - all existing charts render correctly
- `npm run docs:start` - chart doc pages work

---

## Phase 1: Promote TODO Headless Charts

8 charts in `headless/_todo/` need to move to `headless/` as first-class citizens.
Each has 70-90% complete implementations.

**For each task below:**
1. Move folder from `_todo/` to `headless/`
2. Ensure 5-file pattern (index.ts, types.ts, controller.ts, provider.ts, chart.ts)
3. Remove `default/` folder if present (visual defaults belong in shared, not headless)
4. Move any layout algorithms (squarify, compute-layout, flattenTree) INTO controller.ts
5. Add export to `headless/index.ts`
6. Verify `npm run flitter:build` succeeds

**Reference for cartesian charts:** `headless/bar-chart/` (5 files, 332 lines total)
**Reference for non-cartesian:** `headless/pie-chart/` (5 files, ~180 lines total)

### Task 1-1: Promote box-plot-chart
- [ ] Move `headless/_todo/box-plot-chart/` → `headless/box-plot-chart/`
- [ ] Remove `default/` folder
- [ ] Verify Custom points (17): layout, plot, dataView, boxPlotGroup, boxPlot, outlier, xAxis, yAxis, xAxisLabel, yAxisLabel, xAxisTick, yAxisTick, xAxisLine, yAxisLine, grid, gridXLine, gridYLine, axisCorner, legend, title
- [ ] Verify Data type: `{ labels: string[]; datasets: { legend: string; data: BoxPlotDataPoint[] }[] }` where BoxPlotDataPoint = `{ min, q1, median, q3, max, outliers? }`
- [ ] Controller has: getScale, direction support, hiddenSeries, hover
- [ ] Export from headless/index.ts

### Task 1-2: Promote candlestick-chart
- [ ] Move → `headless/candlestick-chart/`
- [ ] Remove `default/`
- [ ] Custom points (16): layout, plot, dataView, candlestick, xAxis, yAxis, xAxisLabel, yAxisLabel, xAxisTick, yAxisTick, xAxisLine, yAxisLine, grid, gridXLine, gridYLine, axisCorner, legend, title, dataLabel
- [ ] Data: `{ labels: string[]; datasets: { legend: string; data: { open, high, low, close }[] }[] }`
- [ ] Controller: OHLC scale (min of lows, max of highs)
- [ ] Export from headless/index.ts

### Task 1-3: Promote waterfall-chart
- [ ] Move → `headless/waterfall-chart/`
- [ ] Remove `default/`
- [ ] Custom points (19): layout, plot, dataView, bar, connector, xAxis, yAxis, xAxisLabel, yAxisLabel, xAxisTick, yAxisTick, xAxisLine, yAxisLine, grid, gridXLine, gridYLine, axisCorner, legend, title, dataLabel
- [ ] Data: `{ labels: string[]; values: number[]; totalIndices?: number[] }`
- [ ] Controller: cumulative values, bar type classification (increase/decrease/total)
- [ ] Export from headless/index.ts

### Task 1-4: Promote funnel-chart
- [ ] Move → `headless/funnel-chart/`
- [ ] Remove `default/`
- [ ] Custom points (7): layout, funnel, stage, stageLabel, dataLabel, legend, title
- [ ] Data: `{ stages: { label: string; value: number; color?: string }[] }`
- [ ] Controller: stage ratio calculation (value / maxValue), NO scale needed
- [ ] Export from headless/index.ts

### Task 1-5: Promote gauge-chart
- [ ] Move → `headless/gauge-chart/`
- [ ] Remove `default/`
- [ ] Custom points (6): layout, title, gauge, needle, valueLabel, scale
- [ ] Data: `{ value: number; min: number; max: number; zones?: { min, max, color }[] }`
- [ ] Controller: value→angle conversion, zone handling, NO scale auto-calc
- [ ] Export from headless/index.ts

### Task 1-6: Promote treemap-chart
- [ ] Move → `headless/treemap-chart/`
- [ ] Remove `default/` but keep squarify algorithm in controller
- [ ] Custom points (5): layout, title, legend, treemap, node
- [ ] Data: `{ nodes: TreemapNode[] }` where TreemapNode = `{ label, value, color? }`
- [ ] Controller: squarify layout calculation in setSize(), hover tracking
- [ ] Export from headless/index.ts

### Task 1-7: Promote sankey-chart
- [ ] Move → `headless/sankey-chart/`
- [ ] Remove `default/` but keep compute-layout in controller
- [ ] Custom points (5+): layout, sankey, node, link, nodeLabel, title
- [ ] Data: `{ nodes: { id, label?, color? }[]; links: { source, target, value }[] }`
- [ ] Controller: topological sort, node/link position calculation
- [ ] Export from headless/index.ts

### Task 1-8: Promote sunburst-chart
- [ ] Move → `headless/sunburst-chart/`
- [ ] Remove `default/` but keep flattenTree in controller
- [ ] Custom points (6): layout, title, legend, legendItem, sunburst, segment
- [ ] Data: `{ root: SunburstNode }` where SunburstNode = `{ label, value, children?, color? }`
- [ ] Controller: recursive tree traversal, angle calculation, depth-based coloring
- [ ] Export from headless/index.ts

### Task 1-9: Delete _todo/ and finalize headless/index.ts
- [ ] Delete `headless/_todo/` directory entirely
- [ ] Update `headless/index.ts` with all 15 charts:
  - Existing (7): BarChart, LineChart, ScatterChart, BubbleChart, HeatmapChart, PieChart, RadarChart
  - Promoted (8): BoxPlotChart, CandlestickChart, WaterfallChart, FunnelChart, GaugeChart, TreemapChart, SankeyChart, SunburstChart
- [ ] Each exports: default function + Custom type + Data type + Context type + Controller class + Scale type (if applicable)

**Verify:**
- `npm run flitter:build` succeeds
- `headless/_todo/` does not exist
- All 15 charts importable from flitter-chart

---

## Phase 2: New Headless Charts

Create new headless charts following the 5-file pattern.
Each is independent - can be parallelized.

**IMPORTANT: Follow the exact pattern from reference implementations.**
- Cartesian charts: model after `headless/bar-chart/` (see files above)
- Non-cartesian charts: model after `headless/pie-chart/` (see files above)

### Task 2-1: donut-chart (non-cartesian, based on pie-chart)
**Reference:** `packages/chart/src/headless/pie-chart/` - copy and extend

- [ ] Create `headless/donut-chart/` with 5 files
- [ ] types.ts:
  - Data: `{ datasets: { name: string; value: number }[] }` (same as pie)
  - Custom: `layout, dataView, slice, legend, title, centerContent`
  - centerContent is the only addition vs pie - renders in the donut hole
- [ ] controller.ts: same as PieChartController + `innerRadiusRatio` (default 0.6)
- [ ] chart.ts: same as pie but DataView passes centerContent to custom.dataView
- [ ] provider.ts, index.ts: standard pattern
- [ ] Export from headless/index.ts

**Verify:** `npm run flitter:build` succeeds

### Task 2-2: histogram-chart (cartesian, based on bar-chart)
**Reference:** `packages/chart/src/headless/bar-chart/` - adapt for continuous data

- [ ] Create `headless/histogram-chart/` with 5 files
- [ ] types.ts:
  - Data: `{ values: number[]; binCount?: number }` OR `{ bins: { min: number; max: number; count: number }[] }`
  - Scale: `{ min: number; max: number; step: number }` (value axis)
  - Custom: `layout, plot, dataView, bar, xAxis, yAxis, xAxisLabel, yAxisLabel, xAxisTick, yAxisTick, xAxisLine, yAxisLine, grid, gridXLine, gridYLine, axisCorner, title, dataLabel`
  - bar args: `{ binMin: number; binMax: number; count: number; index: number }`
- [ ] controller.ts: auto-bin calculation (Sturges' rule: binCount = ceil(log2(n) + 1)), scale for value axis
- [ ] chart.ts: cartesian layout (like bar-chart), bars are contiguous (no gap between bins)
- [ ] provider.ts, index.ts: standard pattern, NO legend (single series)
- [ ] Export from headless/index.ts

**Verify:** `npm run flitter:build` succeeds

### Task 2-3: polar-area-chart (non-cartesian, based on pie-chart)
**Reference:** `packages/chart/src/headless/pie-chart/`

- [ ] Create `headless/polar-area-chart/` with 5 files
- [ ] types.ts:
  - Data: `{ datasets: { name: string; value: number }[] }` (same as pie)
  - Custom: `layout, dataView, sector, legend, title, scale`
  - Difference from pie: equal angles, radius proportional to value
  - sector args: `{ index, name, value, ratio, angle, startAngle }`
- [ ] controller.ts: calculate maxValue for radius ratio, equal angle = 2PI/count
- [ ] chart.ts: DataView computes equal angles + radius ratios
- [ ] Export from headless/index.ts

**Verify:** `npm run flitter:build` succeeds

### Task 2-4: combo-chart (cartesian, dual y-axis)
**Reference:** `packages/chart/src/headless/bar-chart/` + `headless/line-chart/`

- [ ] Create `headless/combo-chart/` with 5 files
- [ ] types.ts:
  - Data: `{ labels: string[]; datasets: { legend: string; values: number[]; type: 'bar' | 'line' | 'area'; yAxisId?: 'primary' | 'secondary' }[] }`
  - Scale: `{ primary: { min, max, step }; secondary?: { min, max, step } }`
  - Custom: `layout, plot, dataView, bar, line, linePoint, area, xAxis, yAxis, yAxis2, xAxisLabel, yAxisLabel, yAxis2Label, xAxisTick, yAxisTick, xAxisLine, yAxisLine, grid, gridXLine, gridYLine, axisCorner, legend, title, dataLabel`
- [ ] controller.ts: dual scale calculation (primary + secondary y-axis), series type grouping
- [ ] chart.ts: Plot has yAxis2, DataView renders bars/lines/areas by type
- [ ] Export from headless/index.ts

**Verify:** `npm run flitter:build` succeeds

### Task 2-5: gantt-chart (cartesian-like, horizontal timeline)
**Reference:** `packages/chart/src/headless/bar-chart/` - horizontal bars with time axis

- [ ] Create `headless/gantt-chart/` with 5 files
- [ ] types.ts:
  - Data: `{ tasks: { id: string; label: string; start: number; end: number; progress?: number; group?: string; dependencies?: string[] }[] }`
  - Scale: `{ min: number; max: number; step: number }` (time axis)
  - Custom: `layout, plot, dataView, taskBar, milestone, dependency, xAxis, xAxisLabel, xAxisTick, xAxisLine, yAxisLabel, grid, gridXLine, title, legend`
  - taskBar args: `{ task, index, startRatio, widthRatio }`
- [ ] controller.ts: time range scale, task sorting by start, group collection
- [ ] chart.ts: horizontal layout - y = task rows, x = time axis
- [ ] Export from headless/index.ts

**Verify:** `npm run flitter:build` succeeds

### Task 2-6: network-chart (non-cartesian, force layout)
**Reference:** `packages/chart/src/headless/sankey-chart/` - node+link pattern

- [ ] Create `headless/network-chart/` with 5 files
- [ ] types.ts:
  - Data: `{ nodes: { id: string; label?: string; group?: string; size?: number }[]; edges: { source: string; target: string; weight?: number }[] }`
  - Layout: `{ nodes: { id, x, y, ... }[]; edges: { source, target, x1, y1, x2, y2 }[] }`
  - Custom: `layout, network, node, edge, nodeLabel, title, legend`
  - node args: `{ id, label, x, y, size, group, index }`
  - edge args: `{ source, target, x1, y1, x2, y2, weight }`
- [ ] controller.ts: simple force-directed layout (repulsion + attraction + centering)
- [ ] chart.ts: render nodes and edges from computed layout
- [ ] Export from headless/index.ts

**Verify:** `npm run flitter:build` succeeds

### Task 2-7: progress-chart (non-cartesian, simplest)
**Reference:** `packages/chart/src/headless/gauge-chart/` - simple value display

- [ ] Create `headless/progress-chart/` with 5 files
- [ ] types.ts:
  - Data: `{ value: number; max?: number; label?: string }` or segments: `{ segments: { value: number; label: string; color?: string }[]; max?: number }`
  - Custom: `layout, title, track, fill, valueLabel, segmentLabel`
  - fill args: `{ value, ratio, index, label }`
- [ ] controller.ts: ratio calculation (value/max), segment percentages
- [ ] chart.ts: simple structure - Layout → Track + Fill(s) + ValueLabel
- [ ] Export from headless/index.ts

**Verify:** `npm run flitter:build` succeeds

### Task 2-8: Finalize headless/index.ts with all 22 charts
- [ ] All 22 charts exported:
  - Cartesian (8): bar, line, scatter, bubble, heatmap, box-plot, candlestick, waterfall, histogram, combo
  - Part-of-whole (5): pie, donut, funnel, treemap, sunburst
  - Polar (2): radar, polar-area
  - Flow/Relation (2): sankey, network
  - Indicator (2): gauge, progress
  - Timeline (1): gantt
- [ ] Each: default function + Custom + Data + Context + Controller + Scale (if any)

**Verify:** `npm run flitter:build` succeeds, all types importable

---

## Phase 3: Shared Building Blocks Cleanup

### Task 3-1: Parameterize shared/cartesian (remove hardcoded styles)
**Reference:** `packages/chart/src/shared/cartesian/`

- [ ] XAxisLabel, YAxisLabel: accept `{ fontSize, color, fontFamily }` params (currently hardcoded)
- [ ] XAxisTick, YAxisTick: accept `{ width, height, color }` params (currently hardcoded)
- [ ] XAxisLine, YAxisLine: accept `{ thickness, color }` params
- [ ] GridXLine, GridYLine: accept `{ thickness, color }` params
- [ ] All keep sensible defaults so they work without params too
- [ ] Update index.ts exports

**Verify:** `npm run flitter:build` succeeds, existing headless charts still compile

### Task 3-2: Parameterize shared/bar-like, line-like, point-like
- [ ] Same approach: remove hardcoded styles, accept params with defaults
- [ ] Update index.ts exports

**Verify:** `npm run flitter:build` succeeds

### Task 3-3: Add shared utility functions
- [ ] `shared/utils/color.ts`: color interpolation for heatmap/gauge/gradient use
- [ ] `shared/utils/angle.ts`: deg↔rad, polar↔cartesian coordinate conversion
- [ ] `shared/utils/index.ts`: re-export all

**Verify:** `npm run flitter:build` succeeds

---

## Phase 4: Reference Styled Implementations (in shared/chart-styles)

These are example implementations showing how to wire headless → visuals.
Used by storybook and docs as reference. NOT part of chart package.

### Task 4-1: Verify existing 10 styled charts work after move
- [ ] bar, stacked-bar, line, area, stacked-area, scatter, bubble, pie, radar, heatmap
- [ ] All imports updated to new paths

**Verify:** `npm run story:start` - all 10 render correctly

### Task 4-2: Cartesian TODO charts - toast style reference
- [ ] box-plot-chart: box (Container) + whisker (Container) + median (Container) + outlier (circle)
- [ ] candlestick-chart: candle body + wick via CustomPaint, up=green down=red
- [ ] waterfall-chart: increase(green)/decrease(red)/total(blue) bars + connector lines
- [ ] histogram-chart: contiguous bars (no gap), bin range as x labels

Each toast style needs: `index.ts` (styleConfig), `config.ts` (extends ToastBaseConfig), `parts/` folder

**Verify:** `npm run story:start` - each chart renders with sample data

### Task 4-3: Non-cartesian TODO charts - toast style reference
- [ ] funnel-chart: trapezoid segments narrowing downward, labels + percentages
- [ ] gauge-chart: semi-circle arc + needle + zones + value label via CustomPaint
- [ ] treemap-chart: squarified rectangles with labels, color per node
- [ ] sankey-chart: rectangular nodes + curved Bezier links via CustomPaint
- [ ] sunburst-chart: concentric arcs via CustomPaint, depth = ring level

**Verify:** `npm run story:start` - each chart renders with sample data

### Task 4-4: New charts - toast style reference
- [ ] donut-chart: pie with inner cutout + center text
- [ ] polar-area-chart: equal-angle sectors with value-proportional radius
- [ ] combo-chart: bar groups + line overlay + dual y-axis
- [ ] gantt-chart: horizontal task bars + dependency arrows
- [ ] network-chart: circle nodes + curved edges
- [ ] progress-chart: rounded track + filled bar + percentage label

**Verify:** `npm run story:start` - each chart renders with sample data

---

## Phase 5: Storybook Stories

### Task 5-1: Storybook setup for chart-styles
- [ ] Configure storybook to import from `shared/chart-styles/`
- [ ] Common decorator: chart container (width/height), background
- [ ] Sample data generators for each chart type

**Verify:** `npm run story:start` runs without errors

### Task 5-2: Stories for existing charts (variations)
- [ ] bar-chart: basic, horizontal, grouped, negative values
- [ ] line-chart: basic, multi-series, spline, stepped, with-points
- [ ] area-chart: basic, stacked, gradient fill
- [ ] scatter-chart: basic, multi-series, large dataset
- [ ] bubble-chart: basic, multi-series
- [ ] pie-chart: basic, with-labels, many-slices
- [ ] radar-chart: basic, multi-series, filled
- [ ] heatmap-chart: basic, custom-color-range

**Verify:** `npm run story:start` - all stories render, interactions work (hover, legend toggle)

### Task 5-3: Stories for promoted charts
- [ ] box-plot: basic, with-outliers, horizontal
- [ ] candlestick: basic OHLC, multi-month
- [ ] waterfall: basic, with-totals, negative
- [ ] funnel: basic, with-conversion-rates
- [ ] gauge: basic, with-zones, full-range
- [ ] treemap: basic, nested-groups
- [ ] sankey: basic, multi-level
- [ ] sunburst: basic, 3-depth

**Verify:** `npm run story:start` - all stories render

### Task 5-4: Stories for new charts
- [ ] donut: basic, with-center-content
- [ ] histogram: basic, custom-bin-count
- [ ] polar-area: basic
- [ ] combo: bar+line, dual-y-axis
- [ ] gantt: basic, with-dependencies
- [ ] network: basic, grouped-nodes
- [ ] progress: linear, multi-segment

**Verify:** `npm run story:start` - all stories render

---

## Phase 6: LLM Documentation

### Task 6-1: Headless pattern guide
- [ ] Create `docs/llm/headless-pattern.md`
- [ ] 5-file pattern with full code examples (use bar-chart + pie-chart as examples)
- [ ] Custom point design guide:
  - Common: layout, dataView, legend, title (ALL charts)
  - Cartesian: plot, xAxis, yAxis, xAxisLabel/Tick/Line, grid/gridXLine/gridYLine, axisCorner
  - Chart-specific: bar, line, slice, node, etc.
- [ ] Controller design guide:
  - ChangeNotifier pattern
  - data filtering via hiddenSeries
  - scale recalculation triggers
  - hover state management
- [ ] Step-by-step: "Build a donut chart from scratch"

### Task 6-2: Flitter widget reference
- [ ] Create `docs/llm/widget-reference.md`
- [ ] Layout: Column, Row, Stack, Flex, Expanded, SizedBox, FractionallySizedBox, Positioned, Padding, Center, Align, LayoutBuilder
- [ ] Drawing: Container, CustomPaint (Canvas: drawRect, drawCircle, drawPath, drawLine, drawArc), ClipRect, Opacity
- [ ] Interaction: GestureDetector (onClick, onMouseEnter, onMouseLeave)
- [ ] Animation: AnimationController, Tween, CurvedAnimation, AnimatedBuilder
- [ ] State: StatefulWidget/State, ChangeNotifier, ChangeNotifierProvider, Provider.of()
- [ ] Each with props type + usage example

### Task 6-3: Building blocks catalog
- [ ] Create `docs/llm/building-blocks.md`
- [ ] shared/cartesian: Layout, Plot, XAxis, YAxis, Grid, getScale - with input/output/usage
- [ ] shared/bar-like: BarBox, DataView, Grid
- [ ] shared/line-like: DataView, Grid
- [ ] shared/point-like: Grid
- [ ] shared/utils: refineScale, drawSplineLine, color interpolation

### Task 6-4: Chart recipes
- [ ] Create `docs/llm/recipes/` directory
- [ ] `cartesian-recipe.md`: bar-chart full example (headless + cartesian building blocks)
- [ ] `non-cartesian-recipe.md`: pie-chart full example (headless + CustomPaint)
- [ ] `complex-recipe.md`: sankey full example (headless + compute-layout + CustomPaint)
- [ ] Each: complete runnable code + inline comments explaining decisions

### Task 6-5: llms.txt entry point
- [ ] Create `llms.txt` at project root
- [ ] Reading order: headless-pattern → widget-reference → building-blocks → recipes
- [ ] Chart category guide: which building blocks for which chart type
- [ ] "Don't do" list: no React hooks, no direct class export, no state mutation outside setState

---

## Dependency Graph

```
Phase 0 (structure cleanup)
  |
  +---> Phase 1 (promote TODO)  ----+
  |                                  |
  +---> Phase 3 (shared cleanup) ---+---> Phase 2 (new charts)
                                          |
                                          +---> Phase 4 (styled refs)
                                          |      |
                                          |      +---> Phase 5 (storybook)
                                          |
                                          +---> Phase 6 (LLM docs)
```

Phase 1 + Phase 3 = parallel
Phase 2 depends on Phase 1 + 3
Phase 4 depends on Phase 2
Phase 5 depends on Phase 4
Phase 6 depends on Phase 2 (can start before Phase 5)
