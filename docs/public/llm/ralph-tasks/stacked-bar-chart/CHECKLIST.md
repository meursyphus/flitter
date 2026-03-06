# Stacked Bar Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessStackedBarChart exported from flitter-chart/headless
- [ ] All 19 slots typed and documented
- [ ] Controller has hoverBar/unhoverBar methods
- [ ] Controller has toggleSeries
- [ ] Controller has direction (vertical/horizontal)
- [ ] Controller has setSize
- [ ] stackedGetScale correctly sums values per category for y-axis domain

## Styled Layer
- [ ] Toast preset works with default config
- [ ] AG preset works
- [ ] Custom slot override works (partial override)
- [ ] bar.gap defaults to 0 (no gap between stacked segments)
- [ ] bar.cornerRadius config applied correctly
- [ ] Negative values render below baseline

## Storybook
- [ ] Basic story renders
- [ ] Multi-series story renders
- [ ] Horizontal story renders
- [ ] Interactive story (hover/tooltip) works
- [ ] Custom slot override story exists
- [ ] Dense data story renders without overlap
- [ ] Negative values story renders correctly
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
