# Chord Diagram — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessChordDiagram exported from flitter-chart/headless
- [ ] All 8 slots typed and documented
- [ ] Controller has hoverArc/unhoverArc methods
- [ ] Controller has hoverRibbon/unhoverRibbon methods
- [ ] Controller has toggleEntity
- [ ] Controller has setSize
- [ ] Chord layout correctly computes arc angles from matrix row sums
- [ ] Ribbon paths correctly connect source and target arcs

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] arc.padAngle config applied correctly
- [ ] arc.colors config applied correctly
- [ ] ribbon.opacity config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Large matrix story renders
- [ ] Custom colors story renders
- [ ] With value labels story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
