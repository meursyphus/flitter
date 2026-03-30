# Novel Chart Patterns

Generated: 2026-03-30

Use these patterns when the prompt should not be forced into one canonical chart family.

## Multi-Chart Dashboard Composition

Compose multiple charts in one screen when one chart family cannot carry the whole story.

Doc: `/llm/patterns/multi-chart-dashboard.md`

Use when:
- The prompt asks for overview plus breakdown plus detail
- A single chart would overload encodings
- Different chart families answer different sub-questions

## Linked Hover And Filter

Coordinate hover, legend filtering, and focus across multiple charts or panels.

Doc: `/llm/patterns/linked-hover-and-filter.md`

Use when:
- The prompt asks for synchronized hover or shared legend filtering
- One chart should highlight related data in another chart
- The experience is analytical rather than purely static

## Controller-Owned Layout Pattern

Use the controller to compute geometry first when the chart is fundamentally about layout.

Doc: `/llm/patterns/controller-owned-layout.md`

Use when:
- The chart needs algorithmic placement, not just axis scaling
- Node-link, flow, hierarchy, or diagram-like geometry is central
- Visual slots are just painting the computed layout

## Scorecard Composite Pattern

Build scorecard-like modules from chart parts plus direct Flitter primitives when no canned family fits.

Doc: `/llm/patterns/scorecard-composite.md`

Use when:
- The request sounds like ranked cards, thresholds, and hover detail
- Charts and dashboard modules must coexist tightly
- A canned family would force the wrong abstraction

## Radial KPI Composite

Combine donut, gauge, progress, and custom paint ideas into one radial KPI experience.

Doc: `/llm/patterns/radial-kpi-composite.md`

Use when:
- The prompt asks for multiple bounded metrics in a radial arrangement
- A simple donut or gauge is not enough on its own
- The center and ring composition matter as much as the metric values

## Novel Data Composite

Invent a new chart-like composition when the data story does not match any canonical family.

Doc: `/llm/patterns/novel-data-composite.md`

Use when:
- The prompt explicitly rejects standard chart-library screenshots
- Multiple encodings and panels belong to one coherent artifact
- The semantics are closer to an application surface than a single chart
