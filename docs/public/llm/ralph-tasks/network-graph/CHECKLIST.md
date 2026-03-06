# Network Graph — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessNetworkGraph exported from flitter-chart/headless
- [ ] All 8 slots typed and documented
- [ ] Controller has hoverNode/unhoverNode methods
- [ ] Controller has hoverEdge/unhoverEdge methods
- [ ] Controller has dragNode/releaseNode methods
- [ ] Controller has toggleGroup
- [ ] Controller has setSize
- [ ] Controller has zoomTo
- [ ] Force simulation produces stable layout
- [ ] Node positions updated each simulation tick

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] node.colors config applied correctly
- [ ] node.minRadius/maxRadius config applied correctly
- [ ] edge.color config applied correctly
- [ ] edge.strokeWidth config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Grouped nodes story renders
- [ ] Weighted edges story renders
- [ ] Node drag interaction story works
- [ ] Zoom and pan story works
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Large graph story renders
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
