# Stacked Area Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessStackedAreaChart exported from flitter-chart/headless (reuses line-chart headless with stackedGetScale)
- [ ] All slots typed and documented
- [ ] Controller has hoverPoint/unhoverPoint methods
- [ ] Controller has toggleSeries
- [ ] stackedGetScale correctly computes cumulative sums for y-axis domain
- [ ] Cumulative path computation is correct (each area starts where the previous one ends)

## Styled Layer
- [ ] Toast preset works with default config
- [ ] AG preset works
- [ ] Custom slot override works (partial override)
- [ ] area.opacity defaults to 0.6 (toast) / 0.7 (ag)
- [ ] area.strokeWidth config applied correctly
- [ ] area.spline config toggles between linear and curved paths
- [ ] Areas are stacked correctly (no gaps, no overlaps beyond fill)

## Storybook
- [ ] Basic story renders
- [ ] Multi-series story renders with visible stacking
- [ ] Spline story renders with curves
- [ ] Interactive story (hover/tooltip) works
- [ ] Custom slot override story exists
- [ ] Dense data story renders without overlap
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
