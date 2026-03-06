# Ralph Prompt — Bar Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
Ensure Bar Chart is fully implemented as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (bar.gap, bar.cornerRadius, axes, grid, legend, title)
3. AG preset with all config options (bar.gap, bar.cornerRadius, axes, grid, legend, title)
4. All 19 slots documented with TypeScript types
5. Storybook stories covering: basic, multi-series, horizontal, custom slot override, interaction, dense data
6. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/bar-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/bar-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/bar-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/bar-chart/base/` — structural defaults
- `charts/bar-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/bar-chart/styles/ag/` — same structure
- `charts/bar-chart/plugin.ts` — StyleMap
- `charts/bar-chart/index.ts` — factory function

## Key Implementation Details
- 16-case tooltip positioning based on bar position relative to chart center
- AnimatedFractionallySizedBox for bar grow animation
- Direction support (vertical/horizontal) swaps axis roles
- Legend toggle hides/shows datasets with animation
- barGroup slot arranges multiple bars side-by-side within a category

## Completion
Check all items in CHECKLIST.md.
Output `<promise>BAR_CHART COMPLETE</promise>` when done.
