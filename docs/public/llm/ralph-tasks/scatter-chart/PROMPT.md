# Ralph Prompt — Scatter Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
Ensure Scatter Chart is fully implemented as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (scatter.size: 10, scatter.fill: false, scatter.strokeWidth: 2, 4 shapes, axes, grid, legend, title)
3. AG preset with all config options (scatter.size: 10, scatter.strokeWidth: 2, axes, grid, legend, title)
4. All 18 slots documented with TypeScript types
5. Storybook stories covering: basic, multi-series, custom slot override, interaction, dense data, with labels
6. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/scatter-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/scatter-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/scatter-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/scatter-chart/base/` — structural defaults
- `charts/scatter-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/scatter-chart/styles/ag/` — same structure
- `charts/scatter-chart/plugin.ts` — StyleMap
- `charts/scatter-chart/index.ts` — factory function

## Key Implementation Details
- Data shape differs from bar/line: uses { x, y, label? } per point instead of parallel arrays
- Both axes are numeric (not categorical) — scale computes min/max/step from data
- Scale config allows manual override of min, max, step for both x and y
- Toast preset cycles through 4 shapes (circle, square, triangle, star) per dataset for accessibility
- scatter.fill: false means points are rendered as outlines by default in toast
- Point hover shows x, y coordinates and optional label in tooltip

## Completion
Check all items in CHECKLIST.md.
Output `<promise>SCATTER_CHART COMPLETE</promise>` when done.
