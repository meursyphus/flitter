# Ralph Prompt — Stream Graph

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Stream Graph as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (layer, legend, title)
3. All 9 slots documented with TypeScript types
4. Storybook stories covering: basic, baseline algorithms, many layers, layer labels, custom slot override, interaction
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/stream-graph/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/stream-graph/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/stream-graph/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/stream-graph/base/` — structural defaults
- `charts/stream-graph/styles/toast/` — config.ts, index.ts, parts/
- `charts/stream-graph/plugin.ts` — StyleMap
- `charts/stream-graph/index.ts` — factory function

## Key Implementation Details
- Stream layers are stacked areas with variable baselines
- Baseline algorithms: wiggle (minimize weighted change in slope), silhouette (center around midpoint), expand (normalize to 100%), zero (traditional stacked area from y=0)
- Each layer is a filled path between its top and bottom boundaries
- CustomPaint with monotone cubic interpolation for smooth organic curves
- Layer order affects visual appearance — consider inside-out ordering for wiggle
- Hover highlights one layer; dims others to low opacity
- Toggle series removes a layer and recomputes baselines for remaining layers
- Animation: layers expand from center line outward

## Completion
Check all items in CHECKLIST.md.
Output `<promise>STREAM_GRAPH COMPLETE</promise>` when done.
