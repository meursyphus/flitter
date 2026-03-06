# Funnel Chart — Spec

## Status
headless-only

## Purpose
Use a funnel chart to visualize sequential stages of a process, showing progressive reduction or conversion rates. Ideal for sales pipelines, user acquisition funnels, and any workflow where drop-off between stages matters.

## Data Shape
```typescript
type FunnelChartData = {
  stages: { label: string; value: number; color?: string }[];
  title?: string;
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | `{ title, legends, funnel }` | Root layout composing title, legends, and funnel area |
| funnel | `{ stages }` | Container for all stage shapes |
| stage | `{ index, label, value, ratio, color, stageLabel, dataLabel }` | Individual trapezoid/funnel segment |
| stageLabel | `{ label, index }` | Text label for a stage (e.g., "Awareness") |
| dataLabel | `{ value, percentage, label, index }` | Numeric label showing value and/or conversion rate |
| legend | `{ label, color, index }` | Legend item for each stage |
| title | `{ name }` | Chart title |

**Total: 7 slots**

## Controller Methods
- `hoverStage(index)` -- highlight a stage, show tooltip
- `unhoverStage()` -- clear hover state
- `setSize(width, height)` -- update chart dimensions

## Style Presets Needed
- **toast**: default color palette; stage shape (gap between stages, border radius); stageLabel (fontSize, color, position); dataLabel (fontSize, color, format showing value and percentage); legend, title styling; hover effect (opacity or scale)

## UX Patterns
- Tapering shape: each stage is a trapezoid that narrows from top to bottom, with width proportional to its value relative to the first stage
- Ratio/percentage: each stage displays its value and the conversion rate from the previous stage
- Default color palette: stages get sequential colors if not provided in data
- Stage hover: highlights the hovered stage, shows tooltip with value and conversion rate
- Label positioning: stage labels appear to the left or inside, data labels appear to the right or inside
- Animation: stages animate in sequentially from top to bottom

## Storybook Stories Required
- Basic (sales funnel)
- Custom colors
- With percentage labels
- Hover interaction
- Many stages (8+)
- Equal-value stages (rectangular funnel)
