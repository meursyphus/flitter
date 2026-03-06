# Ralph Prompt — Area Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
Ensure Area Chart is fully implemented as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless` (reuses line-chart headless)
2. Toast preset with all config options (area.strokeWidth, area.opacity, area.spline, axes, grid, legend, title)
3. AG preset with all config options (area.strokeWidth, area.opacity, area.spline, axes, grid, legend, title)
4. All slots documented with TypeScript types
5. Storybook stories covering: basic, multi-series, spline, custom slot override, interaction, dense data
6. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/area-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/area-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/line-chart/` — reused (area shares line-chart headless)
- `charts/area-chart/base/` — structural defaults
- `charts/area-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/area-chart/styles/ag/` — same structure
- `charts/area-chart/plugin.ts` — StyleMap
- `charts/area-chart/index.ts` — factory function

## Key Implementation Details
- Reuses line-chart headless layer entirely
- The "line" slot renders a filled area (closed path from line to baseline) instead of just a stroke
- area.opacity controls the fill transparency (typical default around 0.3-0.5)
- area.strokeWidth controls the top border line of the area
- Spline mode uses cubic bezier interpolation for the area boundary
- Multiple series areas can overlap; order matters for visibility

## Completion
Check all items in CHECKLIST.md.
Output `<promise>AREA_CHART COMPLETE</promise>` when done.
