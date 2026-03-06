# Repo Map

Use this map to find the right files quickly.

## Source of truth priority

1. `dev/chart-storybook/src/stories/*.stories.tsx`
   These are the best examples for runnable chart code in the current repo.

2. `packages/chart/src/charts/*`
   These define the public chart factories such as `BarChart`, `LineChart`, and `HeatmapChart`.

3. `packages/chart/src/headless/*/types.ts`
   These define the real data shapes and custom renderer contracts.

4. `packages/chart/src/charts/index.ts`
   This is the authoritative export list for currently exposed chart APIs.

5. `docs/src/app/chart/_data/*`
   These are useful for public documentation patterns, but some snippets can lag behind Storybook.

## Important top-level packages

- `packages/chart`
  Internal chart implementation package.
  Read this as reference architecture, not as the intended final consumption surface.

- `packages/flitter`
  Public umbrella package.
  It re-exports `flitter-core` as `flitter-ui`.

- `integrations/react`
  React renderer package.
  The current repo surface exports the default `Widget` component.

## Imports to use

### For final direct-build output

```tsx
import Widget from "@flitterjs/react";
import {
  Container,
  Row,
  Column,
  Stack,
  Positioned,
  Text,
  CustomPaint,
  LayoutBuilder,
} from "flitter-ui";
```

### For reference reading only

- `packages/chart/src/charts/*`
- `packages/chart/src/headless/*`
- `packages/chart/src/shared/*`
- `dev/chart-storybook/src/stories/*`

If you see older examples that import `flitter-chart` or `flitter-ui/chart`, treat them as internal reference material unless the branch explicitly says otherwise.

## Chart families

### Cartesian charts with `toast` and `ag`

- `BarChart`
- `StackedBarChart`
- `LineChart`
- `AreaChart`
- `StackedAreaChart`
- `ScatterChart`
- `BubbleChart`

### Toast-only charts

- `PieChart`
- `RadarChart`
- `HeatmapChart`

## Where to inspect each concern

### Public API

- `packages/chart/src/charts/index.ts`
- `packages/chart/src/charts/*/index.ts`

### Data shapes

- `packages/chart/src/headless/bar-chart/types.ts`
- `packages/chart/src/headless/line-chart/types.ts`
- `packages/chart/src/headless/scatter-chart/types.ts`
- `packages/chart/src/headless/bubble-chart/types.ts`
- `packages/chart/src/headless/pie-chart/types.ts`
- `packages/chart/src/headless/radar-chart/types.ts`
- `packages/chart/src/headless/heatmap-chart/types.ts`

### Style defaults and style-specific options

- `packages/chart/src/styles/toast/`
- `packages/chart/src/styles/ag/`
- `packages/chart/src/charts/*/styles/toast/`
- `packages/chart/src/charts/*/styles/ag/`

### Best runnable examples

- `dev/chart-storybook/src/stories/BarChart.stories.tsx`
- `dev/chart-storybook/src/stories/BarChart.ag.stories.tsx`
- `dev/chart-storybook/src/stories/LineChart.stories.tsx`
- `dev/chart-storybook/src/stories/LineChart.ag.stories.tsx`
- `dev/chart-storybook/src/stories/AreaChart.stories.tsx`
- `dev/chart-storybook/src/stories/AreaChart.ag.stories.tsx`
- `dev/chart-storybook/src/stories/StackedBarChart.stories.tsx`
- `dev/chart-storybook/src/stories/StackedBarChart.ag.stories.tsx`
- `dev/chart-storybook/src/stories/StackedAreaChart.stories.tsx`
- `dev/chart-storybook/src/stories/StackedAreaChart.ag.stories.tsx`
- `dev/chart-storybook/src/stories/ScatterChart.stories.tsx`
- `dev/chart-storybook/src/stories/ScatterChart.ag.stories.tsx`
- `dev/chart-storybook/src/stories/BubbleChart.stories.tsx`
- `dev/chart-storybook/src/stories/BubbleChart.ag.stories.tsx`
- `dev/chart-storybook/src/stories/PieChart.stories.tsx`
- `dev/chart-storybook/src/stories/RadarChart.stories.tsx`
- `dev/chart-storybook/src/stories/HeatmapChart.stories.tsx`

### Best direct-build primitive examples

- `dev/storybook/src/stories/CustomPaint/Widget.stories.tsx`
- `dev/storybook/src/stories/Flex/Widget.stories.tsx`
- `dev/storybook/src/stories/Stack/Stack.stories.tsx`
- `dev/storybook/src/stories/Tooltip/Widget.stories.tsx`
- `dev/storybook/src/stories/GestureDetector/Widget.stories.tsx`

## Files that can mislead you

- `packages/chart/TODO.md`
  Treat this as historical notes, not a current support matrix.

- Older generated or hand-written docs snippets
  If they conflict with Storybook or package source, ignore the older snippet.
