# Bullet Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a bullet chart to display a single quantitative measure against a target and qualitative ranges (e.g., poor, satisfactory, good). Ideal for dashboard KPIs, gauges, and compact performance indicators as a replacement for gauges and meters.

## Data Shape
```typescript
type BulletChartData = {
  actual: number;
  target: number;
  ranges: number[]; // qualitative ranges, e.g. [60, 80, 100]
  label: string;
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (label, bullet, title) |
| bullet | data, scale | Container for the bullet visualization |
| range | rangeIndex, value, scale | Qualitative range background band |
| actualBar | actual, scale | The bar representing the actual value |
| targetMarker | target, scale | Line/marker showing the target value |
| quantityLabel | actual, target | Text showing the actual/target values |
| label | text | Descriptive label for the metric |
| title | text | Chart title |

## Controller Methods
- `hoverBullet()` — highlight the bullet, show tooltip with actual vs target
- `unhoverBullet()` — clear hover state
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `actualBar: { color: string, height: number }, targetMarker: { color: string, width: number }, ranges: { colors: string[] }`, label, title styling

## UX Patterns
- Hover tooltip: shows actual value, target value, and percentage of target achieved
- Range shading: qualitative ranges rendered as background bands with decreasing opacity
- Compact layout: designed to be narrow and stackable for dashboard use
- Animation: actual bar animates from zero to value on mount
- Horizontal orientation by default; vertical as option

## Storybook Stories Required
- Basic
- Multiple bullets (stacked)
- Custom ranges and colors
- With value labels
- Custom slot override
- With tooltip interaction
