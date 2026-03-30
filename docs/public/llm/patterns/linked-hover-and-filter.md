# Linked Hover And Filter

Coordinate hover, legend filtering, and focus across multiple charts or panels.

Generated: 2026-03-30

## Use When

- The prompt asks for synchronized hover or shared legend filtering
- One chart should highlight related data in another chart
- The experience is analytical rather than purely static

## Build Path

- Move shared selection or hover into a controller rather than duplicating local state.
- Use GestureDetector for pointer entry and exit.
- Use providers to broadcast selection state across composed widgets.

## Related Charts

- `scatter-chart`
- `bar-chart`
- `heatmap-chart`
- `network-chart`

## Source Paths

- `packages/core/src/provider/ChangeNotifierProvider.ts`
- `packages/core/src/component/GestureDetector.ts`
- `packages/chart/src/headless`
