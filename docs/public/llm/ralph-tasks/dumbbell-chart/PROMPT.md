# Ralph Prompt — Dumbbell Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Dumbbell Chart as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (connector, dot, gap, axes, grid, legend, title)
3. All 17 slots documented with TypeScript types
4. Storybook stories covering: basic, gap labels, sorted by gap, custom colors, custom slot override, interaction
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/dumbbell-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/dumbbell-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/dumbbell-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/dumbbell-chart/base/` — structural defaults
- `charts/dumbbell-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/dumbbell-chart/plugin.ts` — StyleMap
- `charts/dumbbell-chart/index.ts` — factory function

## Key Implementation Details
- Exactly two datasets required — each provides one dot per category
- Connector is a horizontal line between the two dots
- Horizontal layout by default: categories on y-axis, values on x-axis
- Gap label shows the absolute difference between the two values
- Dots have distinct colors per dataset (e.g., blue and orange)
- Animation: dots start at midpoint and animate outward to final positions
- Hover highlights the entire dumbbell (both dots + connector)

## Completion
Check all items in CHECKLIST.md.
Output `<promise>DUMBBELL_CHART COMPLETE</promise>` when done.
