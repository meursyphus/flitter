# Chart Selection

Use this file when the user describes a chart in plain language and you need to pick the right API.

## Quick chart chooser

| User intent | Pick | Why |
| --- | --- | --- |
| Compare values across categories | `BarChart` | Best for category-to-value comparison |
| Compare composition inside each category | `StackedBarChart` | Shows part-to-whole per category |
| Show a trend over ordered labels or time | `LineChart` | Best for trend reading |
| Show a trend with filled volume | `AreaChart` | Adds magnitude emphasis |
| Show cumulative composition over time | `StackedAreaChart` | Best for stacked trend shares |
| Show relation between two numeric variables | `ScatterChart` | X and Y are both numeric |
| Show relation between three numeric variables | `BubbleChart` | X, Y, and bubble size |
| Show a single part-to-whole breakdown | `PieChart` | Best for a single categorical share |
| Show multi-axis profile on a shared scale | `RadarChart` | Good for strengths, scores, profiles |
| Show intensity across a row-column grid | `HeatmapChart` | Best for matrices and calendars |

## Style chooser

| User language | Style |
| --- | --- |
| no preference | `toast` |
| soft, colorful, playful, demo | `toast` |
| dashboard, enterprise, AG-like, muted | `ag` |

`PieChart`, `RadarChart`, and `HeatmapChart` currently use toast-style surfaces only.

## Orientation chooser

Use `direction: "horizontal"` for bar-based charts when:

- category labels are long
- ranking is the main message
- the prompt explicitly says horizontal

Use `direction: "vertical"` otherwise.

## If the user does not know the chart name

Translate the request into these heuristics:

- "monthly sales by region" -> `BarChart` or `LineChart`
- "share of traffic sources by month" -> `StackedAreaChart` or `StackedBarChart`
- "profit and loss by quarter" -> `BarChart` with negative values
- "GDP vs life expectancy" -> `ScatterChart`
- "GDP vs life expectancy sized by population" -> `BubbleChart`
- "browser share" -> `PieChart`
- "team skill radar" -> `RadarChart`
- "weekday by month intensity" -> `HeatmapChart`

## High-risk disambiguations

- "ranking" should usually bias to horizontal `BarChart`
- "share over time" should bias to `StackedAreaChart`, not `PieChart`
- "contribution mix" should bias to `StackedBarChart`, not grouped bars
- "size by population" should bias to `BubbleChart`, not `ScatterChart`
- "profile across dimensions" should bias to `RadarChart`, not multiple bars
- "matrix" or "heat" should bias to `HeatmapChart`, not bar grids

## Fallback rules

- If there is one categorical dimension and one metric, start with `BarChart`.
- If there is an ordered sequence and the message is about change, start with `LineChart`.
- If there are two numeric axes, start with `ScatterChart`.
- If there are two categorical axes and the message is about magnitude or intensity, start with `HeatmapChart`.
- If the prompt says "stacked", use the stacked variant instead of inventing grouping logic.
