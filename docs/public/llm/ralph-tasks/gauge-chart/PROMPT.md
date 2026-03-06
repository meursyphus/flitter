# Ralph Prompt — Gauge Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart has a complete headless implementation in `packages/chart/src/headless/_todo/gauge-chart/`. Your task is to:

1. **Move it out of _todo** to `headless/gauge-chart/` and export from `headless/index.ts`
2. **Create the styled layer** following the pie-chart pattern (non-cartesian, toast-only):
   - `charts/gauge-chart/index.ts` -- `GaugeChart()` factory function
   - `charts/gauge-chart/base/index.ts` -- structural defaults for all 6 slots
   - `charts/gauge-chart/styles/toast/index.ts` -- `toastStyleConfig`
   - `charts/gauge-chart/styles/toast/config.ts` -- `ToastGaugeChartConfig` extending `ToastBaseConfig`
   - `charts/gauge-chart/styles/toast/parts/` -- needle.ts, scale.ts (arc with zones), valueLabel.ts
3. **Create storybook stories** in `dev/chart-storybook/src/stories/`:
   - Basic, Colored zones, Animated value, Custom range, No title, Multiple gauges
4. **Export from package** -- add to `charts/index.ts` and `src/index.ts`

## Key Implementation Details
- 6 headless slots (layout, gauge, needle, valueLabel, scale, title)
- Non-cartesian chart: renders an arc/semicircle -- no axes or grid
- Needle angle: ratio = (value - min) / (max - min), mapped to arc sweep (typically 180 degrees)
- Zone coloring: the arc background is segmented by zones array, each with min/max/color
- If no zones provided, render a single neutral-colored arc
- Needle slot receives `value` and `ratio` (0..1)
- ValueLabel slot receives `value`, `min`, `max` for formatting
- Scale slot receives `min`, `max`, `zones` for arc rendering
- Animated needle: use AnimationController to smoothly rotate needle on value change

## Context Files
- Spec: `docs/public/llm/ralph-tasks/gauge-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/gauge-chart/CHECKLIST.md`
- Headless source: `packages/chart/src/headless/_todo/gauge-chart/`
- Golden reference (pie-chart pattern): `packages/chart/src/charts/pie-chart/`
- Shared toast components: `packages/chart/src/styles/toast/`

## Convention
Follow the pie-chart pattern for non-cartesian charts. The headless layer already has:
- `types.ts` -- GaugeChartCustom (6 slots), GaugeChartData, GaugeChartZone, GaugeChartConfig
- `chart.ts` -- Component tree (Layout, Gauge, Needle, Scale, ValueLabel)
- `provider.ts` -- GaugeChartConfigProvider
- `default/` -- Default implementations (layout, gauge, needle, scale, title, value-label)
- `index.ts` -- Entry point

Your job is to wire styled rendering to each slot. The needle, scale (arc), and valueLabel are all chart-specific parts that need custom Flitter widget implementations (likely using CustomPaint or ClipPath for the arc shape).

## Completion
Check all items in CHECKLIST.md.
Output `<promise>GAUGE_CHART COMPLETE</promise>` when done.
