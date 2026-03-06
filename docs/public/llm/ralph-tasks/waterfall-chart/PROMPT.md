# Ralph Prompt — Waterfall Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart has a complete headless implementation in `packages/chart/src/headless/_todo/waterfall-chart/`. Your task is to:

1. **Move it out of _todo** to `headless/waterfall-chart/` and export from `headless/index.ts`
2. **Create the styled layer** following the bar-chart pattern:
   - `charts/waterfall-chart/index.ts` -- `WaterfallChart()` factory function
   - `charts/waterfall-chart/base/index.ts` -- structural defaults for all 22 slots
   - `charts/waterfall-chart/styles/toast/index.ts` -- `toastStyleConfig` (custom + createConfig + getScaleOptions)
   - `charts/waterfall-chart/styles/toast/config.ts` -- `ToastWaterfallChartConfig` extending `ToastBaseConfig`
   - `charts/waterfall-chart/styles/toast/parts/` -- bar.ts (3-color bars), connector.ts (dashed lines), dataLabel.ts
3. **Create storybook stories** in `dev/chart-storybook/src/stories/`:
   - Basic, With total indices, Custom colors, Data labels, Hover interaction, Negative-heavy
4. **Export from package** -- add to `charts/index.ts` and `src/index.ts`

## Key Implementation Details
- 22 headless slots (cartesian base + bar, connector, dataLabel)
- 3 fixed legends: Increase, Decrease, Total (not dataset-driven like bar-chart)
- Bar coloring: increase=green (#22c55e), decrease=red (#ef4444), total=gray (#6b7280) by default
- Bars float from their cumulative baseline, not from zero (except totals which start at zero)
- Connector lines: dashed horizontal lines from one bar's cumulative top to the next bar's start
- `cumulativeValues` array is pre-computed in the config and available to all slots
- Scale computation must account for the full range of cumulative values

## Context Files
- Spec: `docs/public/llm/ralph-tasks/waterfall-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/waterfall-chart/CHECKLIST.md`
- Headless source: `packages/chart/src/headless/_todo/waterfall-chart/`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`
- Shared toast components: `packages/chart/src/styles/toast/`
- Shared cartesian components: `packages/chart/src/shared/cartesian/`

## Convention
Follow the bar-chart pattern exactly. The headless layer already has:
- `types.ts` -- WaterfallChartCustom (22 slots), WaterfallChartData, WaterfallChartConfig
- `chart.ts` -- Full component tree with Layout, Plot, DataView, Bar, Connector, Axes, Grid
- `provider.ts` -- WaterfallChartConfigProvider
- `index.ts` -- Entry point

Your job is to wire styled rendering to each slot. Reuse `@styles/toast/` cartesian components (axis labels, ticks, lines, grid) and create chart-specific parts only for bar, connector, and dataLabel.

## Completion
Check all items in CHECKLIST.md.
Output `<promise>WATERFALL_CHART COMPLETE</promise>` when done.
