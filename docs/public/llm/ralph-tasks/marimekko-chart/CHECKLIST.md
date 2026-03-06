# Marimekko Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessMarimekkoChart exported from flitter-chart/headless
- [ ] All 13 slots typed and documented
- [ ] Controller has hoverSegment/unhoverSegment methods
- [ ] Controller has toggleSegment
- [ ] Controller has setSize
- [ ] Column widths correctly proportional to category width values
- [ ] Segments correctly stack to 100% within each column

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] segment.colors config applied correctly
- [ ] segment.gap config applied correctly
- [ ] column.gap config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Many categories story renders
- [ ] With segment labels story renders
- [ ] Percentage display story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
