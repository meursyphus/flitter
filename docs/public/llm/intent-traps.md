# Intent Traps

Use this file when the user's wording is plausible but ambiguous.

The goal is to infer the intended chart without forcing unnecessary follow-up questions.

## Common trap words

### "ranking"

Usually means:

- `BarChart`
- often `direction: "horizontal"`

Especially true when:

- labels are long
- the user says top, bottom, highest, lowest, ranked

Do not default to:

- pie
- table
- line

## "contribution"

This splits in two directions.

### If the user means part-to-whole by category or quarter

Use:

- `StackedBarChart`
- or `StackedAreaChart` if the wording is explicitly about continuous change over time

### If the user truly means a running increase/decrease bridge

That points toward waterfall semantics, which are not in the current first-path public chart set.

Fallback:

- if the real message is composition, use `StackedBarChart`
- if the real message is cumulative trend, use `StackedAreaChart`
- if the user explicitly requires true waterfall behavior, do not fake it as a supported public chart

## "share"

This also splits in two directions.

### Single snapshot share

Use:

- `PieChart`

### Share changing over time

Use:

- `StackedAreaChart`

Do not collapse a time-based share request into one pie chart.

## "trend"

Usually means:

- `LineChart`

But if the user emphasizes volume or filled area, use:

- `AreaChart`

If the user emphasizes composition over time, use:

- `StackedAreaChart`

## "relationship"

Usually means:

- `ScatterChart`

If the user adds "size by", "weight by", or "bubble by", upgrade to:

- `BubbleChart`

## "profile", "capability", "skill map", "scorecard across dimensions"

Usually means:

- `RadarChart`

Especially when:

- the same label set repeats across multiple series

Do not flatten this into bars unless the user explicitly wants ranking instead of profile shape.

## "heat", "intensity", "matrix", "weekday by month", "hour by day"

Usually means:

- `HeatmapChart`

Key requirement:

- think in `xLabels`, `yLabels`, and `values[y][x]`

## Unsupported-request fallbacks

### Combo chart

Not a first-path public chart in the current branch.

Fallback rule:

- choose the dominant intent and use one supported chart family
- if comparison across categories dominates, use `BarChart`
- if trend dominates, use `LineChart`

### Dual-axis chart

Not a first-path public chart in the current branch.

Fallback rule:

- choose the primary metric and one chart family
- do not invent secondary-axis config

### Treemap, sankey, sunburst, gauge, candlestick, waterfall, box plot

These are not the first supported public path for current chart generation.

Fallback rule:

- if a nearby supported chart can preserve the user's core message, use it
- otherwise say the requested chart is not in the supported first path on the current branch

## Ask-vs-assume rule

Assume when:

- the wording strongly points to one supported chart family
- the style can be inferred from the tone

Ask only when:

- two supported chart families are equally plausible
- choosing wrong would materially change the meaning

Examples worth asking about:

- a prompt that could equally mean `PieChart` or `StackedAreaChart` because time context is missing
- a prompt that says "contribution" but actually sounds like a true waterfall bridge
