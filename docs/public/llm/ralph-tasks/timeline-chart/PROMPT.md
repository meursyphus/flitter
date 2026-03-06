# Ralph Prompt — Timeline Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Timeline Chart as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (marker, connector, label, axis, legend, title)
3. All 12 slots documented with TypeScript types
4. Storybook stories covering: basic, grouped events, dense timeline, vertical, custom slot override, interaction, zoom/scroll
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/timeline-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/timeline-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/timeline-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/timeline-chart/base/` — structural defaults
- `charts/timeline-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/timeline-chart/plugin.ts` — StyleMap
- `charts/timeline-chart/index.ts` — factory function

## Key Implementation Details
- Time-based axis using Date objects — events positioned along the time axis
- Events have markers (dots) on the axis connected to labels via connector lines
- Alternating label placement: odd events above/left, even events below/right to avoid overlap
- Group lanes (swimlanes): events grouped into horizontal/vertical lanes by group attribute
- Connectors are vertical/horizontal lines from axis to label position
- Time zoom: setTimeRange focuses on a date window with smooth animation
- Orientation: horizontal (time flows left-to-right) or vertical (time flows top-to-bottom)
- Event clustering: when many events are close together, cluster into a single marker with count
- Animation: events appear sequentially from earliest to latest on mount

## Completion
Check all items in CHECKLIST.md.
Output `<promise>TIMELINE_CHART COMPLETE</promise>` when done.
