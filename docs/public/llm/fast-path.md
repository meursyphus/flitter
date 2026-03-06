# Fast Path

Use this file when the user gives intent and you need to get to a runnable chart quickly.

## Default operating mode

Do not start by importing a ready-made chart package.

Do this instead:

1. Infer the chart family from the user's intent.
2. Infer the interaction requirements.
3. Infer the complexity patterns.
4. Translate that into a `flitter-ui` structure.
5. Read the nearest `packages/chart` files for logic and layout reference.
6. Rebuild the pattern with `flitter-ui` primitives.
7. Replace only the data, labels, scale math, and visual tokens you need.
6. Validate in Storybook.

If the request goes beyond preset knobs, stop and choose the right deeper lever:

- `config`
- `custom`
- `getScale` or `getScaleOptions`

## Intent to chart in one pass

| If the user means... | Pick this |
| --- | --- |
| compare categories | `BarChart` |
| compare categories with long labels or ranking | `BarChart` + `direction: "horizontal"` |
| contribution mix by category | `StackedBarChart` |
| trend over months or time | `LineChart` |
| filled trend | `AreaChart` |
| share over time | `StackedAreaChart` |
| x vs y numeric relationship | `ScatterChart` |
| x vs y with size by third metric | `BubbleChart` |
| one snapshot of share | `PieChart` |
| profile across repeated attributes | `RadarChart` |
| intensity across row and column categories | `HeatmapChart` |

## Tone to style in one pass

| If the user says... | Use |
| --- | --- |
| default, soft, pastel, friendly, product demo | `toast` |
| analytical, executive, dashboard, enterprise, AG-like, muted | `ag` |

If style is not specified, use `toast`.

## Nearest story map

| Need | Copy from |
| --- | --- |
| Toast bar | `dev/chart-storybook/src/stories/BarChart.stories.tsx` |
| AG bar | `dev/chart-storybook/src/stories/BarChart.ag.stories.tsx` |
| Toast stacked bar | `dev/chart-storybook/src/stories/StackedBarChart.stories.tsx` |
| AG stacked bar | `dev/chart-storybook/src/stories/StackedBarChart.ag.stories.tsx` |
| Toast line | `dev/chart-storybook/src/stories/LineChart.stories.tsx` |
| AG line | `dev/chart-storybook/src/stories/LineChart.ag.stories.tsx` |
| Toast area | `dev/chart-storybook/src/stories/AreaChart.stories.tsx` |
| AG area | `dev/chart-storybook/src/stories/AreaChart.ag.stories.tsx` |
| Toast stacked area | `dev/chart-storybook/src/stories/StackedAreaChart.stories.tsx` |
| AG stacked area | `dev/chart-storybook/src/stories/StackedAreaChart.ag.stories.tsx` |
| Toast scatter | `dev/chart-storybook/src/stories/ScatterChart.stories.tsx` |
| AG scatter | `dev/chart-storybook/src/stories/ScatterChart.ag.stories.tsx` |
| Toast bubble | `dev/chart-storybook/src/stories/BubbleChart.stories.tsx` |
| AG bubble | `dev/chart-storybook/src/stories/BubbleChart.ag.stories.tsx` |
| Pie | `dev/chart-storybook/src/stories/PieChart.stories.tsx` |
| Radar | `dev/chart-storybook/src/stories/RadarChart.stories.tsx` |
| Heatmap | `dev/chart-storybook/src/stories/HeatmapChart.stories.tsx` |

These are logic references, not the intended final import surface.

## Minimal code recipe

```tsx
import Widget from "@flitterjs/react";
import {
  Container,
  Row,
  Column,
  Stack,
  Positioned,
  Text,
  CustomPaint,
  LayoutBuilder,
} from "flitter-ui";
```

### Build by translating the nearest chart pattern into primitives

- keep the outer `<Widget ... />`
- extract the layout idea from `packages/chart`
- rebuild it with `flitter-ui` primitives
- keep data, scale, axes, legend, tooltip, and drawing as explicit code

## Data fallback rule

If the user gives no numbers:

- make a small illustrative dataset
- keep it realistic but simple
- label it as illustrative in the explanation or story name

## Do not slow yourself down with unnecessary questions

If the intent is clear enough, proceed.

Examples:

- "make a muted executive ranking chart" -> AG horizontal bar
- "show how source mix changed over the year" -> toast stacked area
- "compare team profiles" -> radar

## Final self-check before you stop

- Is the chart family right for the intent?
- Is the style right for the tone?
- Did you copy the nearest story instead of inventing structure?
- Is the data shape valid for that chart?
- Did you avoid made-up config keys?
