# Ralph Prompt — Funnel Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart has a complete headless implementation in `packages/chart/src/headless/_todo/funnel-chart/`. Your task is to:

1. **Move it out of _todo** to `headless/funnel-chart/` and export from `headless/index.ts`
2. **Create the styled layer** following the pie-chart pattern (non-cartesian, toast-only):
   - `charts/funnel-chart/index.ts` -- `FunnelChart()` factory function
   - `charts/funnel-chart/base/index.ts` -- structural defaults for all 7 slots
   - `charts/funnel-chart/styles/toast/index.ts` -- `toastStyleConfig`
   - `charts/funnel-chart/styles/toast/config.ts` -- `ToastFunnelChartConfig` extending `ToastBaseConfig`
   - `charts/funnel-chart/styles/toast/parts/` -- stage.ts (trapezoid shapes), stageLabel.ts, dataLabel.ts
3. **Create storybook stories** in `dev/chart-storybook/src/stories/`:
   - Basic, Custom colors, Percentage labels, Hover interaction, Many stages, Equal values
4. **Export from package** -- add to `charts/index.ts` and `src/index.ts`

## Key Implementation Details
- 7 headless slots (layout, funnel, stage, stageLabel, dataLabel, legend, title)
- Non-cartesian chart: no axes, no grid -- similar to pie-chart structure
- Each stage is a trapezoid that tapers from top to bottom
- Stage width proportional to its value relative to the first (largest) stage
- `ratio` field on stage slot = value / maxValue
- `percentage` field on dataLabel slot = value / previousStageValue (conversion rate)
- Default color palette: stages get sequential colors from palette if not in data
- Stage slot receives both `stageLabel` and `dataLabel` as pre-built Widget children

## Context Files
- Spec: `docs/public/llm/ralph-tasks/funnel-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/funnel-chart/CHECKLIST.md`
- Headless source: `packages/chart/src/headless/_todo/funnel-chart/`
- Golden reference (pie-chart pattern): `packages/chart/src/charts/pie-chart/`
- Shared toast components: `packages/chart/src/styles/toast/`

## Convention
Follow the pie-chart pattern for non-cartesian charts. The headless layer already has:
- `types.ts` -- FunnelChartCustom (7 slots), FunnelChartData, FunnelChartConfig
- `chart.ts` -- Component tree (Layout, Funnel, Stages with labels)
- `provider.ts` -- FunnelChartConfigProvider
- `default/` -- Default implementations (layout, funnel, stage, stageLabel, dataLabel, legend, title)
- `index.ts` -- Entry point

Your job is to wire styled rendering to each slot. Create chart-specific parts for stage (trapezoid shape with color), stageLabel (positioned text), and dataLabel (value + percentage display).

## Completion
Check all items in CHECKLIST.md.
Output `<promise>FUNNEL_CHART COMPLETE</promise>` when done.
