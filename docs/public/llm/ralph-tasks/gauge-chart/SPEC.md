# Gauge Chart — Spec

## Status
headless-only

## Purpose
Use a gauge chart to display a single value within a defined range, resembling a speedometer or dial. Ideal for KPI dashboards, performance metrics, and any scenario where a value's position within a min-max range needs emphasis.

## Data Shape
```typescript
type GaugeChartData = {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  zones?: GaugeChartZone[];
};

type GaugeChartZone = {
  min: number;
  max: number;
  color: string;
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | `{ title, gauge, valueLabel }` | Root layout composing title, gauge arc, and value display |
| gauge | `{ needle, scale }` | Arc container with needle and scale markings |
| needle | `{ value, ratio }` | Pointer/needle indicating current value (ratio = 0..1) |
| valueLabel | `{ value, min, max }` | Numeric display of the current value |
| scale | `{ min, max, zones }` | Arc background with optional colored zones |
| title | `{ name }` | Chart title |

**Total: 6 slots**

## Controller Methods
- `setValue(value)` -- update the displayed value, triggers needle animation
- `setSize(width, height)` -- update chart dimensions

## Style Presets Needed
- **toast**: arc thickness and radius; needle style (color, length, width); zone colors; scale tick marks (count, length, color); valueLabel (fontSize, fontWeight, color, format); title styling; animation duration and curve

## UX Patterns
- Needle angle: maps value to angle within a 180-degree (or configurable) arc; ratio = (value - min) / (max - min)
- Zone coloring: arc segments are colored according to zones array (e.g., green/yellow/red for good/warning/danger)
- Animated needle: needle smoothly rotates to target angle on value change
- Value display: centered below or inside the arc, showing the numeric value
- Scale markings: optional tick marks and labels around the arc edge
- Default zones: if no zones provided, a single neutral-colored arc is shown

## Storybook Stories Required
- Basic (single value)
- With colored zones (green/yellow/red)
- Animated value change
- Custom min/max range
- Without title
- Multiple gauges side by side
