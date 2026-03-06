# Lollipop Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessLollipopChart exported from flitter-chart/headless
- [ ] All 21 slots typed and documented
- [ ] Controller has hoverLollipop/unhoverLollipop methods
- [ ] Controller has toggleSeries
- [ ] Controller has direction (vertical/horizontal)
- [ ] Controller has setSize
- [ ] Stem correctly extends from baseline to value position
- [ ] Dot positioned at value end of stem

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] stem.strokeWidth config applied correctly
- [ ] stem.color config applied correctly
- [ ] dot.radius config applied correctly
- [ ] dot.color config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Multi-series story renders
- [ ] Horizontal story renders
- [ ] With data labels story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Dense data story renders without overlap
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
