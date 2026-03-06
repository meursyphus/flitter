# Ralph Prompt — Violin Plot

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Violin Plot as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (violin, median, quartiles, axes, grid, legend, title)
3. All 17 slots documented with TypeScript types
4. Storybook stories covering: basic, multi-series, box plot overlay, statistics tooltip, custom slot override, interaction
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/violin-plot/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/violin-plot/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/violin-plot/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/violin-plot/base/` — structural defaults
- `charts/violin-plot/styles/toast/` — config.ts, index.ts, parts/
- `charts/violin-plot/plugin.ts` — StyleMap
- `charts/violin-plot/index.ts` — factory function

## Key Implementation Details
- Density curve rendered as a CustomPaint path, mirrored on both sides of center
- Y-axis maps data values; width at each y-position maps density
- Median as a horizontal line; quartile box as a narrow rectangle within the violin
- Multiple violins per category when comparing datasets
- Kernel density estimation (KDE) may be needed if raw values provided instead of pre-computed density
- Animation: violins grow from center line (zero width) to full density width
- Hover shows statistical summary: median, mean, Q1, Q3, min, max

## Completion
Check all items in CHECKLIST.md.
Output `<promise>VIOLIN_PLOT COMPLETE</promise>` when done.
