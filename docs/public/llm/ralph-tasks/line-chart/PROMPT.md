# Ralph Prompt — Line Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
Ensure Line Chart is fully implemented as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (line.strokeWidth, line.spline, axes, grid, legend, title)
3. AG preset with all config options (line.strokeWidth, line.spline, axes, grid, legend, title)
4. All slots documented with TypeScript types
5. Storybook stories covering: basic, multi-series, spline, custom slot override, interaction, dense data
6. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/line-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/line-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/line-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/line-chart/base/` — structural defaults
- `charts/line-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/line-chart/styles/ag/` — same structure
- `charts/line-chart/plugin.ts` — StyleMap
- `charts/line-chart/index.ts` — factory function

## Key Implementation Details
- Line slot renders a path (SVG path or Canvas path) connecting data points
- Spline mode uses cubic bezier interpolation between points
- Point slot renders individual data point markers (circles by default)
- hoverPoint triggers nearest-point detection with vertical crosshair
- Progressive line-draw animation on mount
- Smooth transition animation on data change

## Completion
Check all items in CHECKLIST.md.
Output `<promise>LINE_CHART COMPLETE</promise>` when done.
