# Timeline Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a timeline chart to display events chronologically along a time axis. Ideal for historical timelines, project milestones, event logs, and any scenario where discrete events need to be shown in temporal context with optional grouping.

## Data Shape
```typescript
type TimelineChartData = {
  events: {
    date: Date;
    title: string;
    description?: string;
    group?: string;
  }[];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (timeline, legend, title) |
| timeline | events, timeScale | Container for the timeline axis and events |
| timeAxis | scale, ticks | Horizontal or vertical time axis |
| timeAxisLabel | date, index | Individual time axis label |
| timeAxisTick | index | Time axis tick mark |
| event | eventData, index, position | Container for one event |
| eventMarker | eventData, index | Dot/icon at the event position on the axis |
| eventLabel | title, description, date | Text content for an event |
| eventConnector | index, markerPos, labelPos | Line connecting marker to label |
| groupLane | groupName, events | Lane/swimlane for a group |
| legend | groups, toggleGroup | Interactive legend for groups |
| title | text | Chart title |

## Controller Methods
- `hoverEvent(eventIndex)` — highlight an event, show tooltip
- `unhoverEvent()` — clear hover state
- `setTimeRange(start, end)` — zoom to a specific date range
- `toggleGroup(group)` — show/hide a group of events
- `setSize(width, height)` — update chart dimensions
- `setOrientation(orientation)` — switch between horizontal and vertical

## Style Presets
- toast: `marker: { radius: number, colors: string[] }, connector: { strokeWidth: number, color: string }, label: { fontSize: number, maxWidth: number }`, axis, legend, title styling

## UX Patterns
- Event hover: highlights the event marker, connector, and label; shows tooltip with details
- Alternating labels: event labels alternate above/below (horizontal) or left/right (vertical) the axis to avoid overlap
- Time zoom: scrollable/zoomable time range for dense event data
- Group lanes: events grouped into swimlanes by group attribute
- Event clustering: nearby events can be clustered when zoomed out
- Orientation: horizontal (default) or vertical timeline
- Animation: events appear sequentially along the timeline on mount
- Scroll: horizontal/vertical scroll for long timelines

## Storybook Stories Required
- Basic
- Grouped events (swimlanes)
- Dense timeline (many events)
- Vertical orientation
- Custom slot override
- With tooltip interaction
- With zoom/scroll
