# Polar Area Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessPolarAreaChart exported from flitter-chart/headless
- [ ] All 8 slots typed and documented
- [ ] Controller has hoverSector/unhoverSector methods
- [ ] Controller has toggleDataset
- [ ] Controller has setSize
- [ ] Equal angular slicing correctly computed (360/N)
- [ ] Radius correctly maps values to radial scale

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] sector.colors config applied correctly
- [ ] sector.strokeColor config applied correctly
- [ ] sector.opacity config applied correctly
- [ ] grid.color config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Many categories story renders
- [ ] With grid labels story renders
- [ ] With category labels story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
