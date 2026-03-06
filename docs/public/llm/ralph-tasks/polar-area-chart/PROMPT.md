# Ralph Prompt — Polar Area Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Polar Area Chart (Rose Chart) as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (sector, grid, legend, title)
3. All 8 slots documented with TypeScript types
4. Storybook stories covering: basic, many categories, grid labels, category labels, custom slot override, interaction
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/polar-area-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/polar-area-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/polar-area-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/polar-area-chart/base/` — structural defaults
- `charts/polar-area-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/polar-area-chart/plugin.ts` — StyleMap
- `charts/polar-area-chart/index.ts` — factory function

## Key Implementation Details
- Unlike pie chart: all sectors have EQUAL angles (360/N), only radius varies
- Radius of each sector proportional to sqrt(value) or value (configurable) for area-accurate representation
- CustomPaint for rendering sectors as filled arcs
- Radial scale: 0 at center, max value at outer edge
- Concentric grid circles at regular value intervals with optional labels
- Category labels positioned at sector midpoint angle, outside the outermost ring
- Animation: sectors grow from zero radius to target radius
- Hover: sector slightly extends outward (explode) and shows tooltip

## Completion
Check all items in CHECKLIST.md.
Output `<promise>POLAR_AREA_CHART COMPLETE</promise>` when done.
