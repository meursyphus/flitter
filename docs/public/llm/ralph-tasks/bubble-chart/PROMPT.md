# Ralph Prompt — Bubble Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
Ensure Bubble Chart is fully implemented as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (bubble.minRadius: 5, bubble.maxRadius: 50, bubble.opacity: 0.6, axes, grid, legend, title)
3. AG preset with all config options (bubble.minRadius: 3, bubble.maxRadius: 25, bubble.opacity: 0.7, axes, grid, legend, title)
4. All 18 slots documented with TypeScript types
5. Storybook stories covering: basic, multi-series, custom slot override, interaction, dense data, with labels, size range
6. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/bubble-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/bubble-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/bubble-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/bubble-chart/base/` — structural defaults
- `charts/bubble-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/bubble-chart/styles/ag/` — same structure
- `charts/bubble-chart/plugin.ts` — StyleMap
- `charts/bubble-chart/index.ts` — factory function

## Key Implementation Details
- Extends scatter chart with a third dimension: value maps to bubble radius
- Data shape adds `value: number` per point compared to scatter
- Scale config adds `value: { min, max, step }` for controlling radius mapping
- Value-to-radius mapping: linear interpolation between minRadius and maxRadius based on value scale domain
- bubble.opacity controls fill transparency (bubbles overlap, so semi-transparency is important)
- Toast defaults: minRadius 5, maxRadius 50, opacity 0.6
- AG defaults: minRadius 3, maxRadius 25, opacity 0.7
- Tooltip shows all three dimensions: x, y, value (plus optional label)

## Completion
Check all items in CHECKLIST.md.
Output `<promise>BUBBLE_CHART COMPLETE</promise>` when done.
