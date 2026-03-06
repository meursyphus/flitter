# Ralph Prompt — Chord Diagram

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Chord Diagram as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (arc, ribbon, label, legend, title)
3. All 8 slots documented with TypeScript types
4. Storybook stories covering: basic, large matrix, custom colors, value labels, custom slot override, interaction
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/chord-diagram/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/chord-diagram/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/chord-diagram/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/chord-diagram/base/` — structural defaults
- `charts/chord-diagram/styles/toast/` — config.ts, index.ts, parts/
- `charts/chord-diagram/plugin.ts` — StyleMap
- `charts/chord-diagram/index.ts` — factory function

## Key Implementation Details
- Chord layout algorithm: compute arc angles from matrix row/column sums
- Ribbon paths: cubic Bezier curves connecting source and target arc segments
- CustomPaint for rendering arcs and ribbons (Canvas path API)
- Arc angles: each entity's arc angle is proportional to its total flow
- Ribbon source/target sub-angles within parent arcs proportional to individual flow values
- Hover dims unrelated elements to 0.1 opacity, highlights related elements
- Entity toggle removes entity from matrix and recomputes layout

## Completion
Check all items in CHECKLIST.md.
Output `<promise>CHORD_DIAGRAM COMPLETE</promise>` when done.
