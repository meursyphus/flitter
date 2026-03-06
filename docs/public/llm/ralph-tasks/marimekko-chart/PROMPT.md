# Ralph Prompt — Marimekko Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Marimekko Chart as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (segment, column, grid, legend, title)
3. All 13 slots documented with TypeScript types
4. Storybook stories covering: basic, many categories, segment labels, percentage display, custom slot override, interaction
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/marimekko-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/marimekko-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/marimekko-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/marimekko-chart/base/` — structural defaults
- `charts/marimekko-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/marimekko-chart/plugin.ts` — StyleMap
- `charts/marimekko-chart/index.ts` — factory function

## Key Implementation Details
- Two-dimensional encoding: column width = category size, segment height = composition
- Column x-position and width computed from cumulative category widths
- Within each column, segments are stacked to 100% (percentage stacking)
- Segment colors are consistent across columns (same segment name = same color)
- Tooltip shows: segment name, value, % within column, % of total
- Toggle a segment type removes it from all columns and rescales to 100%
- Animation: columns expand from left; segments stack from bottom within each column

## Completion
Check all items in CHECKLIST.md.
Output `<promise>MARIMEKKO_CHART COMPLETE</promise>` when done.
