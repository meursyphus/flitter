# Heatmap Chart -- Ralph Task Prompt

You are Ralph, an AI agent that builds and validates flitter-chart implementations.

## Task
Implement or audit the **heatmap chart** for flitter-chart. This is a **toast-only** chart type with cartesian-style axes but no grid lines and no series toggling. There is no `plugin.ts` and no AG style.

## Context Files to Read

### Spec & Checklist
- `docs/public/llm/ralph-tasks/heatmap-chart/SPEC.md`
- `docs/public/llm/ralph-tasks/heatmap-chart/CHECKLIST.md`

### Headless Layer
- `packages/chart/src/headless/heatmap-chart/types.ts` -- HeatmapCustom, HeatmapData, HeatmapScale
- `packages/chart/src/headless/heatmap-chart/controller.ts` -- HeatmapController, HeatmapHoverInfo
- `packages/chart/src/headless/heatmap-chart/chart.ts` -- headless component tree
- `packages/chart/src/headless/heatmap-chart/provider.ts` -- ChangeNotifierProvider
- `packages/chart/src/headless/heatmap-chart/index.ts` -- HeadlessHeatmap entry

### Styled Layer (Toast)
- `packages/chart/src/charts/heatmap-chart/index.ts` -- HeatmapChart factory
- `packages/chart/src/charts/heatmap-chart/styles/toast/index.ts` -- toastStyleConfig
- `packages/chart/src/charts/heatmap-chart/styles/toast/config.ts` -- ToastHeatmapChartConfig + defaults
- `packages/chart/src/charts/heatmap-chart/styles/toast/parts/segment.ts` -- cell renderer
- `packages/chart/src/charts/heatmap-chart/styles/toast/parts/legend.ts` -- color scale legend renderer

### Base Layer
- `packages/chart/src/charts/heatmap-chart/base/index.ts` -- BaseHeatmap structural defaults
- `packages/chart/src/charts/heatmap-chart/base/data-view.ts` -- data view composition

### Shared Styles (Toast Common)
- `packages/chart/src/styles/toast/index.ts` -- defaultToastBaseConfig
- `packages/chart/src/styles/toast/cartesian/` -- toast axis components (used for x/y axes)
- `packages/chart/src/styles/toast/legend.ts` -- toast legend (NOT used for heatmap; heatmap has custom color legend)
- `packages/chart/src/styles/toast/title.ts` -- toast title
- `packages/chart/src/styles/toast/tooltip.ts` -- toast tooltip

### Architecture Reference
- `packages/chart/CLAUDE.md` -- full architecture overview

## Key Constraints
1. Heatmap is **toast-only** -- do not create plugin.ts or AG style
2. `values[y][x]` -- row-first indexing is critical; do not transpose
3. Legend is a **continuous color gradient**, not categorical checkboxes
4. `layout` slot receives `legend` as singular Widget (not `legends: Widget[]`)
5. Hover uses a **separate listener system** (`addHoverListener`/`removeHoverListener`) to avoid full tree rebuilds
6. Color interpolation is 3-point: colorRange[0] at min, colorRange[1] at midpoint, colorRange[2] at max
7. No series toggling -- heatmap has no concept of hideable datasets
8. Follow StatefulWidget + setState pattern, not React hooks

## Completion Signal
When finished, verify every checkbox in CHECKLIST.md passes. Report:
```
DONE heatmap-chart | pass: <count> | fail: <count> | skip: <count>
```
