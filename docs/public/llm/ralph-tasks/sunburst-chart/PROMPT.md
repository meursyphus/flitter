# Ralph Prompt — Sunburst Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart has a complete headless implementation in `packages/chart/src/headless/_todo/sunburst-chart/`. Your task is to:

1. **Move it out of _todo** to `headless/sunburst-chart/` and export from `headless/index.ts`
2. **Create the styled layer** following the pie-chart pattern (non-cartesian, toast-only):
   - `charts/sunburst-chart/index.ts` -- `SunburstChart()` factory function
   - `charts/sunburst-chart/base/index.ts` -- structural defaults for all 7 slots
   - `charts/sunburst-chart/styles/toast/index.ts` -- `toastStyleConfig`
   - `charts/sunburst-chart/styles/toast/config.ts` -- `ToastSunburstChartConfig` extending `ToastBaseConfig`
   - `charts/sunburst-chart/styles/toast/parts/` -- segment.ts (arc rendering)
3. **Create storybook stories** in `dev/chart-storybook/src/stories/`:
   - Basic, Deep hierarchy, Custom colors, Hover path, Drill-down, Many segments
4. **Export from package** -- add to `charts/index.ts` and `src/index.ts`

## Key Implementation Details
- 7 headless slots (layout, sunburst, segment, legend, legendItem, title)
- Non-cartesian chart: renders concentric rings of arcs -- similar to pie-chart structure
- Hierarchical data: `SunburstNode` has recursive `children` array
- `FlatSegment` is the computed representation: `{ node, depth, startAngle, endAngle, color }`
- Segments are flattened from the tree and passed to the sunburst slot
- Segment slot receives a single `FlatSegment` with all rendering info
- Depth-based coloring: children inherit parent color but progressively lighter
- Arc rendering: each segment is an arc at a specific radius (determined by depth) spanning startAngle to endAngle
- Legend shows top-level categories (root's direct children) with their colors
- LegendItem slot renders individual legend entries with label and color swatch
- Hover: highlight segment and show full path (e.g., "Root > Parent > Child") with value

## Context Files
- Spec: `docs/public/llm/ralph-tasks/sunburst-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/sunburst-chart/CHECKLIST.md`
- Headless source: `packages/chart/src/headless/_todo/sunburst-chart/`
- Golden reference (pie-chart pattern): `packages/chart/src/charts/pie-chart/`
- Shared toast components: `packages/chart/src/styles/toast/`

## Convention
Follow the pie-chart pattern for non-cartesian charts. The headless layer already has:
- `types.ts` -- SunburstCustom (7 slots), SunburstNode, SunburstChartData, FlatSegment, SunburstConfig
- `chart.ts` -- Component tree (Layout, Sunburst, Segments, Legend)
- `provider.ts` -- SunburstConfigProvider
- `default/` -- Default implementations (layout, sunburst, segment, legend, title)
- `index.ts` -- Entry point

Your job is to wire styled rendering to each slot. The segment rendering requires CustomPaint or arc-drawing primitives (similar to pie-chart slices but as ring segments at specific depths). Legend and title can reuse toast shared components.

## Completion
Check all items in CHECKLIST.md.
Output `<promise>SUNBURST_CHART COMPLETE</promise>` when done.
