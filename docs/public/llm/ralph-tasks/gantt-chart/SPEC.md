# Gantt Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a Gantt chart to visualize task scheduling and project timelines. Ideal for showing task durations, dependencies, progress, and group organization across a time axis.

## Data Shape
```typescript
type GanttChartData = {
  tasks: {
    name: string;
    start: Date;
    end: Date;
    progress?: number; // 0-1
    group?: string;
  }[];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (title, timeline, task rows) |
| timeline | timeScale, range | Time axis header area |
| timeAxis | scale, ticks | Time axis with date/time labels |
| timeAxisLabel | date, index | Individual time axis label |
| timeAxisTick | index | Time axis tick mark |
| taskRow | task, index | Row container for a single task |
| taskBar | task, index, scale | The rendered bar representing task duration |
| taskProgress | task, index, progress | Progress fill within task bar |
| taskLabel | task, index | Text label on/near task bar |
| milestone | task, index | Diamond/marker for zero-duration milestones |
| groupHeader | groupName, tasks | Group section header |
| gridLine | index | Vertical time grid line |
| legend | groups | Legend for task groups |
| title | text | Chart title |

## Controller Methods
- `hoverTask(taskIndex)` — highlight a task bar, show tooltip with details
- `unhoverTask()` — clear hover state
- `setTimeRange(start, end)` — zoom to a specific time range
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `taskBar: { height: number, cornerRadius: number, progressColor: string }`, timeline, grid, title styling

## UX Patterns
- Hover tooltip: shows task name, start/end dates, duration, and progress percentage
- Time zoom: setTimeRange allows focusing on a specific date range with animation
- Group collapsing: group headers can expand/collapse their task rows (future)
- Progress display: task bars show a filled portion representing completion percentage
- Milestone markers: zero-duration tasks render as diamond shapes on the timeline
- Scroll: horizontal scroll for long timelines, vertical scroll for many tasks

## Storybook Stories Required
- Basic
- With progress
- Grouped tasks
- With milestones
- Custom slot override
- With tooltip interaction
