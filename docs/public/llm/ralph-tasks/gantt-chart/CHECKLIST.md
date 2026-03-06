# Gantt Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessGanttChart exported from flitter-chart/headless
- [ ] All 14 slots typed and documented
- [ ] Controller has hoverTask/unhoverTask methods
- [ ] Controller has setTimeRange
- [ ] Controller has setSize
- [ ] Time scale correctly maps Date objects to pixel positions
- [ ] Task rows correctly positioned vertically

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] taskBar.height config applied correctly
- [ ] taskBar.cornerRadius config applied correctly
- [ ] taskBar.progressColor config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] With progress story renders
- [ ] Grouped tasks story renders
- [ ] With milestones story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
