# Ralph Prompt — Stacked Area Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
Ensure Stacked Area Chart is fully implemented as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless` (reuses line-chart headless with stackedGetScale)
2. Toast preset with all config options (area.opacity: 0.6, area.strokeWidth, area.spline, axes, grid, legend, title)
3. AG preset with all config options (area.opacity: 0.7, area.strokeWidth, area.spline, axes, grid, legend, title)
4. All slots documented with TypeScript types
5. Storybook stories covering: basic, multi-series, spline, custom slot override, interaction, dense data
6. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/stacked-area-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/stacked-area-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/line-chart/` — reused (stacked area shares line-chart headless with stackedGetScale)
- `charts/stacked-area-chart/base/` — structural defaults
- `charts/stacked-area-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/stacked-area-chart/styles/ag/` — same structure
- `charts/stacked-area-chart/plugin.ts` — StyleMap
- `charts/stacked-area-chart/index.ts` — factory function

## Key Implementation Details
- Reuses line-chart headless with stackedGetScale for cumulative y-axis domain
- Cumulative paths: each area's bottom boundary is the top boundary of the area below it
- area.opacity defaults to 0.6 (toast) / 0.7 (ag) for overlapping visibility
- Toggling a series via legend recomputes all cumulative paths and animates the transition
- Spline mode applies cubic bezier interpolation to both top and bottom boundaries of each area
- Render order matters: first dataset is at the bottom, last is on top

## Completion
Check all items in CHECKLIST.md.
Output `<promise>STACKED_AREA_CHART COMPLETE</promise>` when done.
