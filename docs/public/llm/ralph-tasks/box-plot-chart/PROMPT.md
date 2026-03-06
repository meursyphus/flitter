# Ralph Prompt — Box Plot Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart has a complete headless implementation in `packages/chart/src/headless/_todo/box-plot-chart/`. Your task is to:

1. **Move it out of _todo** to `headless/box-plot-chart/` and export from `headless/index.ts`
2. **Create the styled layer** following the bar-chart pattern (cartesian):
   - `charts/box-plot-chart/index.ts` -- `BoxPlotChart()` factory function
   - `charts/box-plot-chart/base/index.ts` -- structural defaults for all 18 slots
   - `charts/box-plot-chart/styles/toast/index.ts` -- `toastStyleConfig` (custom + createConfig + getScaleOptions)
   - `charts/box-plot-chart/styles/toast/config.ts` -- `ToastBoxPlotChartConfig` extending `ToastBaseConfig`
   - `charts/box-plot-chart/styles/toast/parts/` -- boxPlot.ts (box + whiskers + median), outlier.ts (marker)
3. **Create storybook stories** in `dev/chart-storybook/src/stories/`:
   - Basic, Multi-dataset, With outliers, Hover stats, Legend filtering, Dense categories
4. **Export from package** -- add to `charts/index.ts` and `src/index.ts`

## Key Implementation Details
- 18 headless slots (cartesian base 14 + boxPlotGroup, boxPlot, outlier, legend)
- Cartesian chart: uses shared cartesian axes, grid, and layout -- similar to bar-chart
- BoxPlotGroup groups multiple datasets per category label (like barGroup in bar-chart)
- BoxPlot anatomy: whisker from min to Q1, filled box from Q1 to Q3, median line inside box, whisker from Q3 to max
- Outlier markers: points rendered beyond whiskers using `outliers` array
- Scale must account for all values including outliers
- BoxPlot slot receives `{ dataPoint: { min, q1, median, q3, max, outliers? }, index, legend, label }`
- Hover tooltip: shows all five-number summary stats
- Multi-dataset: colored by dataset legend, side-by-side within each group

## Context Files
- Spec: `docs/public/llm/ralph-tasks/box-plot-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/box-plot-chart/CHECKLIST.md`
- Headless source: `packages/chart/src/headless/_todo/box-plot-chart/`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`
- Shared toast components: `packages/chart/src/styles/toast/`
- Shared cartesian components: `packages/chart/src/shared/cartesian/`

## Convention
Follow the bar-chart pattern for cartesian charts. The headless layer already has:
- `types.ts` -- BoxPlotChartCustom (18 slots), BoxPlotDataPoint, BoxPlotChartData, BoxPlotChartScale
- `chart.ts` -- Full component tree (Layout, Plot, DataView, BoxPlotGroups, Axes, Grid)
- `provider.ts` -- BoxPlotChartConfigProvider
- `default/` -- Default implementations for all structural slots
- `index.ts` -- Entry point

Your job is to wire styled rendering to each slot. Reuse `@styles/toast/` cartesian components for axes, grid, legend, title. Create chart-specific parts for boxPlot (the actual box+whisker drawing) and outlier (marker rendering).

## Completion
Check all items in CHECKLIST.md.
Output `<promise>BOX_PLOT_CHART COMPLETE</promise>` when done.
