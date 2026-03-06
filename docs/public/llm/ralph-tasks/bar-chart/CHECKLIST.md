# Bar Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessBarChart exported from flitter-chart/headless
- [ ] All 19 slots typed and documented
- [ ] Controller has hoverBar/unhoverBar methods
- [ ] Controller has toggleSeries
- [ ] Controller has direction (vertical/horizontal)
- [ ] Controller has setSize

## Styled Layer
- [ ] Toast preset works with default config
- [ ] AG preset works
- [ ] Custom slot override works (partial override)
- [ ] bar.gap config applied correctly
- [ ] bar.cornerRadius config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Multi-series story renders
- [ ] Horizontal story renders
- [ ] Interactive story (hover/tooltip) works
- [ ] Custom slot override story exists
- [ ] Dense data story renders without overlap
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
