# Ralph Prompt — Treemap Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart has a complete headless implementation in `packages/chart/src/headless/_todo/treemap-chart/`. Your task is to:

1. **Move it out of _todo** to `headless/treemap-chart/` and export from `headless/index.ts`
2. **Create the styled layer** following the pie-chart pattern (non-cartesian, toast-only):
   - `charts/treemap-chart/index.ts` -- `TreemapChart()` factory function
   - `charts/treemap-chart/base/index.ts` -- structural defaults for all 6 slots
   - `charts/treemap-chart/styles/toast/index.ts` -- `toastStyleConfig`
   - `charts/treemap-chart/styles/toast/config.ts` -- `ToastTreemapChartConfig` extending `ToastBaseConfig`
   - `charts/treemap-chart/styles/toast/parts/` -- node.ts (colored rectangles with labels)
3. **Create storybook stories** in `dev/chart-storybook/src/stories/`:
   - Basic, Custom colors, Many nodes, Legend filtering, Hover tooltip, Small values
4. **Export from package** -- add to `charts/index.ts` and `src/index.ts`

## Key Implementation Details
- 6 headless slots (layout, treemap, node, legend, title + controller generics)
- Non-cartesian chart: no axes, no grid -- similar to pie-chart structure
- `TreemapController` extends `ChangeNotifier` -- has hover state, series visibility, LayoutBuilder
- `squarify.ts` implements the squarify treemap algorithm for rectangular packing
- Controller recalculates layouts when size changes or series are toggled
- Node slot receives computed `x, y, width, height` from the squarify algorithm plus `ratio` (value/total)
- Labels should render inside rectangles when space permits, be hidden when too small
- Color assignment: from data if provided, otherwise from default palette by index

## Context Files
- Spec: `docs/public/llm/ralph-tasks/treemap-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/treemap-chart/CHECKLIST.md`
- Headless source: `packages/chart/src/headless/_todo/treemap-chart/`
- Golden reference (pie-chart pattern): `packages/chart/src/charts/pie-chart/`
- Shared toast components: `packages/chart/src/styles/toast/`

## Convention
Follow the pie-chart pattern for non-cartesian charts. The headless layer already has:
- `types.ts` -- TreemapCustom (6 slots), TreemapData, TreemapNode, TreemapLayout
- `controller.ts` -- TreemapController with squarify, hover, visibility
- `chart.ts` -- Component tree using LayoutBuilder for size tracking
- `provider.ts` -- TreemapProvider
- `squarify.ts` -- Squarify algorithm
- `index.ts` -- Entry point

Your job is to wire styled rendering to each slot. Create chart-specific parts for node rendering (colored rectangle with label text, hover effect).

## Completion
Check all items in CHECKLIST.md.
Output `<promise>TREEMAP_CHART COMPLETE</promise>` when done.
