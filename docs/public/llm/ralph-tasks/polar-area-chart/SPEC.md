# Polar Area Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a polar area chart (rose chart / Nightingale chart) to compare values using sectors with equal angles but variable radii. Ideal for comparing magnitudes across categories where the circular layout adds visual emphasis, and as an alternative to pie charts that avoids misleading angle perception.

## Data Shape
```typescript
type PolarAreaChartData = {
  datasets: {
    name: string;
    value: number;
  }[];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (polarArea, legend, title) |
| polarArea | sectors, scales | Circular plot area |
| sector | index, name, value, startAngle, endAngle, radius | Individual sector with variable radius |
| radialGrid | level, radius | Concentric circular grid line |
| radialGridLabel | value, level | Value label on radial grid |
| angularLabel | name, angle, index | Category label at sector midpoint |
| legend | datasets, toggleDataset | Interactive legend |
| title | text | Chart title |

## Controller Methods
- `hoverSector(index)` — highlight a sector, show tooltip
- `unhoverSector()` — clear hover state
- `toggleDataset(name)` — show/hide a sector
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `sector: { colors: string[], strokeColor: string, strokeWidth: number, opacity: number }, grid: { color: string, count: number }`, legend, title styling

## UX Patterns
- Hover tooltip: shows category name, value, and percentage of total
- Equal angles: all sectors have the same angular width (360/N degrees)
- Variable radius: sector radius proportional to value — larger values extend further
- Radial grid: concentric circles at regular intervals for value reference
- Legend filtering: toggling a dataset removes its sector and redistributes angles equally
- Animation: sectors grow from zero radius to final radius on mount
- Sector highlighting: hovered sector slightly extends outward (explode effect)

## Storybook Stories Required
- Basic
- Many categories
- With grid labels
- With category labels
- Custom slot override
- With tooltip interaction
