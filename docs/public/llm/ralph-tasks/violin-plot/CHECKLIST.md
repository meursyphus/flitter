# Violin Plot — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessViolinPlot exported from flitter-chart/headless
- [ ] All 17 slots typed and documented
- [ ] Controller has hoverViolin/unhoverViolin methods
- [ ] Controller has toggleSeries
- [ ] Controller has setSize
- [ ] Density path correctly mirrored on both sides
- [ ] Median and quartile positions calculated correctly

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] violin.colors config applied correctly
- [ ] violin.opacity config applied correctly
- [ ] median.color config applied correctly
- [ ] quartiles.color config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Multi-series comparison story renders
- [ ] With box plot overlay story renders
- [ ] Statistics tooltip story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
