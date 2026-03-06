# Area Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessAreaChart exported from flitter-chart/headless (reuses line-chart headless)
- [ ] All slots typed and documented
- [ ] Controller has hoverPoint/unhoverPoint methods
- [ ] Controller has toggleSeries
- [ ] Spline interpolation logic is correct (cubic bezier)

## Styled Layer
- [ ] Toast preset works with default config
- [ ] AG preset works
- [ ] Custom slot override works (partial override)
- [ ] area.strokeWidth config applied correctly
- [ ] area.opacity config applied correctly
- [ ] area.spline config toggles between linear and curved paths
- [ ] Filled region renders between line and baseline

## Storybook
- [ ] Basic story renders
- [ ] Multi-series story renders
- [ ] Spline story renders with curves
- [ ] Interactive story (hover/tooltip) works
- [ ] Custom slot override story exists
- [ ] Dense data story renders without overlap
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
