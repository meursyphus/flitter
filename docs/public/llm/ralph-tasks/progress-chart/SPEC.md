# Progress Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a progress/ring chart to display completion status as a circular indicator. Ideal for KPIs, loading states, goal tracking, and dashboard widgets where a single value's progress toward a target needs clear, compact visualization.

## Data Shape
```typescript
type ProgressChartData = {
  value: number;
  max?: number;    // default 100
  label?: string;
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (ring, title) |
| ring | value, max, fraction | Container for ring visualization |
| track | max, radius, strokeWidth | Background circle track |
| fill | value, fraction, startAngle, endAngle | Filled arc showing progress |
| valueLabel | value, max, fraction | Center text showing value/percentage |
| caption | label | Descriptive caption below value |
| title | text | Chart title |

## Controller Methods
- `setValue(value)` — update current value with animation
- `setMax(max)` — update the maximum value
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `track: { color: string, strokeWidth: number }, fill: { color: string, strokeWidth: number, lineCap: string }, valueLabel: { fontSize: number, color: string }`, title styling

## UX Patterns
- Animated fill: progress arc animates smoothly from current to new value
- Value display: center of ring shows current value, percentage, or custom label
- Track: faint background circle showing the unfilled portion
- Color thresholds: fill color can change based on value (e.g., red < 30%, yellow < 70%, green >= 70%)
- Multiple rings: can be nested for comparing multiple metrics
- Start angle: configurable start position (default: top, -90 degrees)
- Clockwise/counter-clockwise: configurable fill direction

## Storybook Stories Required
- Basic
- With percentage label
- Color thresholds
- Multiple nested rings
- Animated value change
- Custom slot override
