# Testing Prompts

This file is internal.

Use these prompts to test whether an agent can read `llms.txt`, choose the right chart, and produce runnable Flitter chart code.

Canonical machine-readable metadata for the complex suite is also stored in:

- `/llm/evaluation-cases.json`

## How to use this file

For each prompt:

1. Give the agent `llms.txt`.
2. Give the prompt as the user request.
3. Check whether the generated code matches the expected chart family and repo conventions.
4. Refine the docs if the failure is systematic.

For the more complex cases below, compare with `Charts/LLMEvaluation` in Storybook after generation.

## Prompt 1

User prompt:

`Make a chart for monthly revenue by region from January to July. Use a friendly default style.`

Expected result:

- `BarChart`
- `style: "toast"`
- vertical orientation
- multi-series categorical data

Review points:

- Uses `labels` plus `datasets`
- Uses repo-local imports if editing Storybook
- Does not invent unsupported styling APIs

## Prompt 2

User prompt:

`Show quarterly profit and loss by product as a horizontal chart with negative bars.`

Expected result:

- `BarChart`
- `direction: "horizontal"`
- negative values preserved

## Prompt 3

User prompt:

`I want a stacked view of website traffic sources across the year.`

Expected result:

- `StackedAreaChart` if the request implies a trend over time
- `StackedBarChart` if the agent chooses category-by-category composition

Review points:

- The agent should explain the choice briefly or make the better default
- The chart should use stacking rather than grouped bars or multiple lines

## Prompt 4

User prompt:

`Make an executive dashboard chart for operating margin by business unit. Keep it muted and analytical.`

Expected result:

- `BarChart`
- `style: "ag"`

## Prompt 5

User prompt:

`Plot GDP per capita against life expectancy for several regions.`

Expected result:

- `ScatterChart`
- numeric `x` and `y`
- grouped datasets by legend

## Prompt 6

User prompt:

`Now use the same GDP and life expectancy data, but size each point by population.`

Expected result:

- `BubbleChart`
- data points contain `x`, `y`, `value`, and `label`

## Prompt 7

User prompt:

`Create a donut chart for browser usage share.`

Expected result:

- `PieChart`
- `config.pie.innerRadiusRatio > 0`

## Prompt 8

User prompt:

`Show a radar chart comparing three developer profiles across JavaScript, TypeScript, React, Node.js, CSS, GraphQL, Testing, and DevOps.`

Expected result:

- `RadarChart`
- shared `labels`
- multiple datasets

## Prompt 9

User prompt:

`Build a heatmap of average daily temperature by month and weekday.`

Expected result:

- `HeatmapChart`
- `xLabels`, `yLabels`, and matrix `values`

## Prompt 10

User prompt:

`The user only said "make me a soft pastel line chart for retention over 12 months" and gave no numbers.`

Expected result:

- `LineChart`
- `style: "toast"`
- a small illustrative dataset
- the code or explanation notes that the data is illustrative

## Prompt 11

User prompt:

`Take the nearest existing Storybook story and adapt it into an AG-style stacked bar chart for revenue contribution by region.`

Expected result:

- Starts from `StackedBarChart.ag.stories.tsx` or the nearest equivalent
- stays in repo-local import conventions

## Prompt 12

User prompt:

`Read the current branch, not main, then make a chart that matches the current Flitter chart conventions.`

Expected result:

- The agent checks the current branch context
- The agent follows the patterns from the current branch Storybook files

## Prompt 13

User prompt:

`Make an executive ranking chart for platform migration risk by business unit. The category names are long, so optimize readability, sort from highest risk to lowest, and use a muted dashboard style.`

Expected result:

- `BarChart`
- `style: "ag"`
- `direction: "horizontal"`
- long labels handled without forcing vertical bars

Reference story:

- `Charts/LLMEvaluation/ExecutiveRanking`

Reject if:

- the agent chooses a vertical bar chart despite the long labels
- the agent uses `toast`
- the agent turns this into a table, line chart, or pie chart

## Prompt 14

User prompt:

`Show quarterly profit contribution by product line as a stacked chart, including negative contributions where a product dragged performance down.`

Expected result:

- `StackedBarChart`
- negative values preserved
- stacking chosen instead of grouped bars

Reference story:

- `Charts/LLMEvaluation/NegativeContributionMix`

Reject if:

- the agent switches to grouped bars
- the agent switches to `WaterfallChart`
- negative values are removed or converted to absolute values

## Prompt 15

User prompt:

`Create a soft default chart showing how traffic source share changed month by month across the year as one continuous yearly trend.`

Expected result:

- `StackedAreaChart`
- `style: "toast"`
- composition over time rather than separate unrelated lines

Reference story:

- `Charts/LLMEvaluation/TrafficShareShift`

Reject if:

- the agent chooses `LineChart`
- the agent chooses `StackedBarChart`
- the chart no longer reads as a continuous trend over time

## Prompt 16

User prompt:

`Plot market opportunity as GDP per capita versus retention potential, and size each point by active account volume. Use a clean analytical look.`

Expected result:

- `BubbleChart`
- `style: "ag"`
- numeric `x`, `y`, and `value`

Reference story:

- `Charts/LLMEvaluation/MarketOpportunity`

Reject if:

- the agent chooses `ScatterChart`
- the agent omits bubble sizing data
- the agent uses `toast` without justification

## Prompt 17

User prompt:

`Build a heatmap of average response load by weekday and month. Months should run left to right, weekdays should run top to bottom, and the axes must not be flipped.`

Expected result:

- `HeatmapChart`
- `xLabels` for months
- `yLabels` for weekdays
- `values[y][x]` orientation preserved

Reference story:

- `Charts/LLMEvaluation/ResponseLoadHeatmap`

Reject if:

- `xLabels` and `yLabels` are swapped
- the matrix is transposed
- the result is a bar or line chart instead of a heatmap

## Prompt 18

User prompt:

`Compare three engineering team profiles across architecture, delivery, testing, DX, reliability, observability, security, and collaboration.`

Expected result:

- `RadarChart`
- shared labels across the three profiles
- no Cartesian substitution

Reference story:

- `Charts/LLMEvaluation/EngineeringProfileRadar`

Reject if:

- the agent chooses a Cartesian chart
- each profile does not share the same label set
- the output collapses the data into a single series

## Prompt 19

User prompt:

`Show traffic source share for this one quarter only.`

Expected result:

- `PieChart`
- single snapshot share

Reject if:

- the agent chooses `StackedAreaChart`
- the agent invents a time axis that the user did not ask for

## Prompt 20

User prompt:

`Show how traffic source share changed across the year.`

Expected result:

- `StackedAreaChart`
- share over time

Reject if:

- the agent chooses `PieChart`
- the agent collapses the yearly progression into a single snapshot

## Prompt 21

User prompt:

`Make a combo chart with revenue bars and margin as a line on a second axis.`

Expected result:

- the agent does not invent unsupported combo or dual-axis config
- the agent either chooses one supported chart family based on dominant intent or clearly notes the limitation

Reject if:

- the agent invents combo-chart APIs
- the agent invents dual-axis config

## Prompt 22

User prompt:

`Build a running bridge chart that shows how each factor increased or decreased operating profit from Q1 to Q2.`

Expected result:

- the agent recognizes waterfall semantics
- the agent does not pretend there is a supported first-path public `WaterfallChart` if that has not been verified on the current branch

Reject if:

- the agent confidently presents an unsupported public waterfall API as if it were verified
- the agent rewrites the request into a different chart without acknowledging the semantic mismatch

## Prompt 23

User prompt:

`Build a waterfall-style view that shows how each factor increased or decreased operating profit, but do it directly with flitter-ui primitives rather than relying on a prebuilt chart package.`

Expected result:

- the agent recognizes waterfall semantics
- the agent treats chart-package code as reference only
- the agent proposes or writes a direct-build cartesian structure with cumulative bars and connectors

Reject if:

- the agent insists on a packaged chart API as the only path
- the agent ignores cumulative semantics

## Prompt 24

User prompt:

`I need a sankey-like flow view for acquisition sources moving into product funnels and then into paid plans. We can build it manually if needed.`

Expected result:

- the agent recognizes a flow diagram / sankey structure
- the agent is willing to design from semantics even if headless support is incomplete
- the agent uses nodes, links, and positioned layout as the mental model

Reject if:

- the agent forces the request into bars or lines
- the agent claims strong packaged support without verification

## Prompt 25

User prompt:

`Create a custom scorecard-style visualization combining ranked bars, threshold markers, and hover details for each business unit.`

Expected result:

- the agent treats this as a composed custom visualization
- the agent breaks it into structure + interaction + complexity patterns
- the agent does not force a single named standard chart if that loses the semantics

Reject if:

- the agent collapses the request into a plain bar chart without thresholds or hover behavior
- the agent avoids the composed nature of the request

## Failure patterns to watch for

- Wrong import surface
- Wrong chart type for the data semantics
- Made-up config keys
- Forgetting `style` on cartesian charts
- Using docs snippets that disagree with Storybook
- Ignoring the current branch and copying stale patterns
- Flipping heatmap row and column orientation
- Choosing grouped charts when the prompt clearly implies stacking
- Failing to switch to horizontal bars for long category labels
