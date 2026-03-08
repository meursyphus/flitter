# Radial KPI Composite

Combine donut, gauge, progress, and custom paint ideas into one radial KPI experience.

Generated: 2026-03-07

## Use When

- The prompt asks for multiple bounded metrics in a radial arrangement
- A simple donut or gauge is not enough on its own
- The center and ring composition matter as much as the metric values

## Build Path

- Start by deciding whether any ring can stay as an existing chart family.
- Use Stack, Center, and CustomPaint to compose rings and center content.
- Keep each radial layer semantically separate instead of faking one giant custom chart too early.

## Related Charts

- `donut-chart`
- `gauge-chart`
- `progress-chart`
- `polar-area-chart`

## Source Paths

- `shared/chart-presets/charts/donut-chart`
- `shared/chart-presets/charts/gauge-chart`
- `packages/core/src/component/CustomPaint.ts`
