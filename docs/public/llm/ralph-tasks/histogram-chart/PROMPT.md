# Ralph Prompt — Histogram Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Histogram Chart as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (bin.gap, bin.cornerRadius, bin.color, axes, grid, legend, title)
3. All 19 slots documented with TypeScript types
4. Storybook stories covering: basic, custom bin count, data labels, dense data, custom slot override, interaction
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/histogram-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/histogram-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/histogram-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/histogram-chart/base/` — structural defaults
- `charts/histogram-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/histogram-chart/plugin.ts` — StyleMap
- `charts/histogram-chart/index.ts` — factory function

## Key Implementation Details
- Bin computation: divide data range into N equal-width bins, count values per bin
- Continuous x-axis (not categorical like bar chart) — bin edges as tick positions
- Bins rendered edge-to-edge by default (gap: 0) for traditional histogram appearance
- AnimatedFractionallySizedBox for bin grow animation
- Tooltip shows bin range [min, max) and frequency count
- setBinCount triggers full recomputation and animated transition

## Completion
Check all items in CHECKLIST.md.
Output `<promise>HISTOGRAM_CHART COMPLETE</promise>` when done.
