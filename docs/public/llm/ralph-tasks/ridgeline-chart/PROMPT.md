# Ralph Prompt — Ridgeline Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Ridgeline Chart as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (ridge, overlap, legend, title)
3. All 10 slots documented with TypeScript types
4. Storybook stories covering: basic, many distributions, variable overlap, ridge labels, custom slot override, interaction
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/ridgeline-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/ridgeline-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/ridgeline-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/ridgeline-chart/base/` — structural defaults
- `charts/ridgeline-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/ridgeline-chart/plugin.ts` — StyleMap
- `charts/ridgeline-chart/index.ts` — factory function

## Key Implementation Details
- Each ridge is a filled density curve rendered via CustomPaint
- Ridges overlap vertically — each ridge's baseline is offset downward
- Overlap factor controls vertical spacing (0 = no overlap, 1 = full overlap)
- Kernel density estimation (KDE) to compute smooth density from raw values
- Shared x-axis across all ridges for comparability
- Ridges rendered back-to-front (last dataset at back) so front ridges overlay
- Hover brings a ridge to front (z-order change) and highlights it
- Animation: density curves grow from flat baseline to full height

## Completion
Check all items in CHECKLIST.md.
Output `<promise>RIDGELINE_CHART COMPLETE</promise>` when done.
