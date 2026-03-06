# Ralph Prompt — Radial Bar Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Radial Bar Chart as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (bar, axis, legend, title)
3. All 11 slots documented with TypeScript types
4. Storybook stories covering: basic, multi-series, data labels, custom inner radius, custom slot override, interaction
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/radial-bar-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/radial-bar-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/radial-bar-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/radial-bar-chart/base/` — structural defaults
- `charts/radial-bar-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/radial-bar-chart/plugin.ts` — StyleMap
- `charts/radial-bar-chart/index.ts` — factory function

## Key Implementation Details
- Bars are arc segments rendered via CustomPaint (Canvas arc API)
- Each category gets an equal angular slice; bar length = arc extent proportional to value
- Radial scale: inner radius to outer radius maps to value range
- Multi-series: multiple arcs per category at different radii or as stacked arcs
- Concentric grid lines as circles at regular value intervals
- Angular labels positioned at the midpoint angle of each category
- Animation: bars grow from inner radius outward
- Inner radius configurable: 0 = full pie, 0.3-0.5 = typical donut-like appearance

## Completion
Check all items in CHECKLIST.md.
Output `<promise>RADIAL_BAR_CHART COMPLETE</promise>` when done.
