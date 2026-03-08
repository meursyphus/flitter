# Chart UX Baseline TODO

## Goal

Bring every chart preset up to the same practical UX floor as the strongest existing AG/Toast presets.

Primary references:

- Strong local baselines:
  - `bar-chart`
  - `stacked-bar-chart`
  - `line-chart`
  - `area-chart`
  - `scatter-chart`
  - `bubble-chart`
  - `stacked-area-chart`
  - `heatmap-chart`
- AG Charts interaction/layout references:
  - tooltips
  - legend toggles
  - overlays
  - restrained hover emphasis

## UX Checklist

- [x] Hover feedback exists on the primary drawable surface
- [x] Tooltip exists where the chart has a meaningful datum target
- [x] Legend toggles series when controller visibility APIs exist
- [x] Title / legend / plot spacing is stable and does not collapse awkwardly
- [x] Hover emphasis dims or lifts without destroying readability
- [x] Default colors and shell styling are coherent across presets
- [ ] No-data / all-series-hidden overlays are standardized
- [ ] Keyboard / non-pointer affordances are defined
- [ ] Geometry-accurate hit testing exists for every non-cartesian custom shape

## Status By Chart

- [x] `bar-chart`
- [x] `stacked-bar-chart`
- [x] `line-chart`
- [x] `area-chart`
- [x] `scatter-chart`
- [x] `bubble-chart`
- [x] `stacked-area-chart`
- [x] `heatmap-chart`
- [x] `pie-chart`
- [x] `donut-chart`
- [x] `polar-area-chart`
- [x] `box-plot-chart`
- [x] `candlestick-chart`
- [x] `combo-chart`
- [x] `funnel-chart`
- [x] `gantt-chart`
- [x] `gauge-chart`
- [x] `histogram-chart`
- [x] `network-chart`
- [x] `progress-chart`
- [x] `radar-chart`
- [x] `treemap-chart`
- [x] `waterfall-chart`
- [~] `sankey-chart`
  - Node hover/tooltip is in place
  - Link-level hover / tooltip / focus remains to be added
- [x] `sunburst-chart`

## Remaining Hard Problems

- [ ] Sankey link hit testing and tooltip placement that follows curved ribbons
- [ ] Shared overlay component for:
  - no data
  - all hidden series
  - unsupported interaction state
- [ ] Docs/LLM generated text still assumes old style-arg language in some prose examples and should move fully to concrete preset naming

## Rule For Next Passes

- Do not accept “renders” as done.
- A chart is only “done” when hover target, tooltip story, legend behavior, and shell layout are intentionally designed.
- For non-cartesian charts, geometry hit testing is the bar for “fully done”, not rectangular bounding-box hover.
