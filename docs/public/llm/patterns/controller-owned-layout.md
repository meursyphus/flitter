# Controller-Owned Layout Pattern

Use the controller to compute geometry first when the chart is fundamentally about layout.

Generated: 2026-03-30

## Use When

- The chart needs algorithmic placement, not just axis scaling
- Node-link, flow, hierarchy, or diagram-like geometry is central
- Visual slots are just painting the computed layout

## Build Path

- Keep geometry computation in the controller.
- Keep chart.ts focused on composition and slot dispatch.
- Let custom renderers paint nodes, links, sectors, or segments from precomputed layout.

## Related Charts

- `sankey-chart`
- `network-chart`
- `sunburst-chart`
- `treemap-chart`

## Source Paths

- `packages/chart/src/headless/sankey-chart`
- `packages/chart/src/headless/network-chart`
- `packages/chart/src/headless/sunburst-chart`
- `packages/chart/src/headless/treemap-chart`
