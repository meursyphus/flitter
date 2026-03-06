# Slope Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessSlopeChart exported from flitter-chart/headless
- [ ] All 10 slots typed and documented
- [ ] Controller has hoverLine/unhoverLine methods
- [ ] Controller has toggleDataset
- [ ] Controller has setSize
- [ ] Y-scale correctly maps values to vertical positions
- [ ] Labels positioned to avoid overlap

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] line.strokeWidth config applied correctly
- [ ] line.colors config applied correctly
- [ ] dot.radius config applied correctly
- [ ] label.fontSize config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Many datasets story renders
- [ ] Color-coded increase/decrease story renders
- [ ] With value labels story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
