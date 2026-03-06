# Ralph Prompt — Network Graph

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Network Graph (Force-Directed Graph) as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (node, edge, label, legend, title)
3. All 8 slots documented with TypeScript types
4. Storybook stories covering: basic, grouped, weighted edges, drag, zoom/pan, custom slot override, interaction, large graph
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/network-graph/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/network-graph/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/network-graph/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/network-graph/base/` — structural defaults
- `charts/network-graph/styles/toast/` — config.ts, index.ts, parts/
- `charts/network-graph/plugin.ts` — StyleMap
- `charts/network-graph/index.ts` — factory function

## Key Implementation Details
- Force-directed layout simulation: implement simple force simulation (repulsion + spring forces)
- Simulation runs iteratively; nodes settle into stable positions over ~300 ticks
- Node positions stored in controller state; updated each tick via setState
- Edge rendering: lines from source (x,y) to target (x,y) via CustomPaint
- Node drag: pin a node to cursor position during drag; release returns it to simulation
- Zoom/pan: transform matrix applied to the graph container
- Performance: for large graphs, consider spatial indexing or Barnes-Hut approximation
- Group colors: nodes colored by group; legend toggles group visibility
- Node radius: can map to degree centrality or custom size attribute

## Completion
Check all items in CHECKLIST.md.
Output `<promise>NETWORK_GRAPH COMPLETE</promise>` when done.
