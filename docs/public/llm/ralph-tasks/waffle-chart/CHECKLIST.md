# Waffle Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessWaffleChart exported from flitter-chart/headless
- [ ] All 7 slots typed and documented
- [ ] Controller has hoverCategory/unhoverCategory methods
- [ ] Controller has toggleCategory
- [ ] Controller has setSize
- [ ] Controller has setGridSize
- [ ] Cell allocation correctly maps category values to grid cells

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] cell.size config applied correctly
- [ ] cell.gap config applied correctly
- [ ] cell.cornerRadius config applied correctly
- [ ] cell.colors config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Multi-category story renders
- [ ] Custom grid size story renders
- [ ] With labels story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
