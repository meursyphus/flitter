# Ralph Prompt — Stacked Bar Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
Ensure Stacked Bar Chart is fully implemented as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (bar.gap defaults to 0, bar.cornerRadius, axes, grid, legend, title)
3. AG preset with all config options
4. All 19 slots documented with TypeScript types
5. Storybook stories covering: basic, multi-series, horizontal, custom slot override, interaction, dense data, negative values
6. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/stacked-bar-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/stacked-bar-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/stacked-bar-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/stacked-bar-chart/base/` — structural defaults
- `charts/stacked-bar-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/stacked-bar-chart/styles/ag/` — same structure
- `charts/stacked-bar-chart/plugin.ts` — StyleMap
- `charts/stacked-bar-chart/index.ts` — factory function

## Key Implementation Details
- Shares the same 19 slots as bar-chart but with stacking behavior
- stackedGetScale sums values per category to determine y-axis domain
- stackedBarGroup arranges bars vertically (stacked) instead of side-by-side
- bar.gap defaults to 0 so segments are flush against each other
- Negative values are supported and render below the baseline
- Legend toggle removes a dataset from the stack and triggers rescale + animation

## Completion
Check all items in CHECKLIST.md.
Output `<promise>STACKED_BAR_CHART COMPLETE</promise>` when done.
