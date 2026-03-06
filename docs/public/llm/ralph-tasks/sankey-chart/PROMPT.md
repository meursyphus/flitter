# Ralph Prompt — Sankey Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart has a complete headless implementation in `packages/chart/src/headless/_todo/sankey-chart/`. Your task is to:

1. **Move it out of _todo** to `headless/sankey-chart/` and export from `headless/index.ts`
2. **Create the styled layer** following the pie-chart pattern (non-cartesian, toast-only):
   - `charts/sankey-chart/index.ts` -- `SankeyChart()` factory function
   - `charts/sankey-chart/base/index.ts` -- structural defaults for all 6 slots
   - `charts/sankey-chart/styles/toast/index.ts` -- `toastStyleConfig`
   - `charts/sankey-chart/styles/toast/config.ts` -- `ToastSankeyChartConfig` extending `ToastBaseConfig`
   - `charts/sankey-chart/styles/toast/parts/` -- node.ts, link.ts (bezier paths), nodeLabel.ts
3. **Create storybook stories** in `dev/chart-storybook/src/stories/`:
   - Basic, Multi-column, Custom colors, Hover interaction, Dense connections, Single source
4. **Export from package** -- add to `charts/index.ts` and `src/index.ts`

## Key Implementation Details
- 6 headless slots (layout, sankey, node, link, nodeLabel, title)
- Non-cartesian chart: custom layout with columns of nodes and curved flow links
- `compute-layout.ts` handles node positioning in columns and link path calculation
- Node slot receives computed `x, y, width, height` from layout algorithm
- Link slot receives source/target positions and heights for bezier path rendering
- NodeLabel positioning: labels on left-column nodes go right, labels on right-column nodes go left (use `column` and `totalColumns` args)
- Links render as curved bezier paths with width proportional to flow value
- Link color: inherits source node color with reduced opacity (e.g., 0.3 alpha)
- Hover: highlighting a node dims all non-connected links; highlighting a link brightens it

## Context Files
- Spec: `docs/public/llm/ralph-tasks/sankey-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/sankey-chart/CHECKLIST.md`
- Headless source: `packages/chart/src/headless/_todo/sankey-chart/`
- Golden reference (pie-chart pattern): `packages/chart/src/charts/pie-chart/`
- Shared toast components: `packages/chart/src/styles/toast/`

## Convention
Follow the pie-chart pattern for non-cartesian charts. The headless layer already has:
- `types.ts` -- SankeyChartCustom (6 slots), SankeyChartData, SankeyNodeLayout, SankeyLinkLayout, SankeyLayout
- `chart.ts` -- Component tree (Layout, Sankey, Nodes, Links, NodeLabels)
- `provider.ts` -- SankeyChartConfigProvider
- `default/` -- Default implementations (layout, sankey, node, link, node-label, title, compute-layout)
- `index.ts` -- Entry point

Your job is to wire styled rendering to each slot. The link rendering requires CustomPaint or Path for bezier curves. Node rendering is a colored rectangle. NodeLabel is positioned text.

## Completion
Check all items in CHECKLIST.md.
Output `<promise>SANKEY_CHART COMPLETE</promise>` when done.
