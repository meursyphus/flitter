# User Prompt Cookbook

This file is internal.

These are example ways to ask for charts so the agent can turn intent into a direct `flitter-ui` chart build.

## How prompts should be phrased

A strong prompt usually includes:

- what should be compared
- whether the data is categorical, time-based, matrix-like, hierarchical, or flow-like
- any important interaction
- any important visual tone
- whether the data is real, attached, or should be mocked

## Short prompt templates

### Category comparison

`Make a chart comparing [metric] across [categories]. Use a [soft / analytical / playful / executive] look.`

Example:

`Make a chart comparing monthly revenue across regions. Use a soft product-demo look.`

### Ranking

`Show a ranking of [items] by [metric]. The labels are [short / long].`

Example:

`Show a ranking of business units by migration risk. The labels are long.`

### Trend

`Show how [metric] changed over [time range].`

Example:

`Show how retention changed over 12 months.`

### Share over time

`Show how the share of [parts] changed across [time range].`

Example:

`Show how traffic source share changed across the year.`

### Relationship

`Plot [metric x] against [metric y] for [entities].`

Example:

`Plot GDP per capita against life expectancy for several regions.`

### Relationship plus size

`Plot [x] against [y], and size each mark by [z].`

Example:

`Plot revenue quality against retention, and size each mark by account volume.`

### Matrix / heatmap

`Build a heatmap of [metric] by [x dimension] and [y dimension].`

Example:

`Build a heatmap of average response load by weekday and month.`

### Profile comparison

`Compare [profiles] across [shared dimensions].`

Example:

`Compare three engineering team profiles across architecture, delivery, testing, DX, reliability, observability, security, and collaboration.`

### Custom composed visualization

`Build a custom visualization for [goal]. It should include [marks or subviews], plus [interaction].`

Example:

`Build a custom scorecard visualization for business unit performance. It should include ranked bars, threshold markers, and hover details.`

### Flow or hierarchy

`Build a [flow / hierarchy] view for [entities and transitions]. If no standard chart fits, build it directly.`

Example:

`Build a flow view for acquisition sources moving into funnels and then into paid plans. If no standard chart fits, build it directly.`

## Strong prompt add-ons

Prompts can add any of these:

- `Use my attached data exactly.`
- `Mock the data if I did not provide numbers.`
- `Make hover tooltips important.`
- `Make the labels readable even if they are long.`
- `Optimize for dashboard readability.`
- `Do not use a canned chart package. Build it directly.`
- `If no standard chart fits, design a custom one from the semantics.`

## Minimal prompt examples

These are intentionally short but still useful:

- `Make a soft bar chart for quarterly revenue by region.`
- `Show a muted executive ranking chart for platform risk by business unit.`
- `Show traffic source share over time.`
- `Plot GDP vs life expectancy and size by population.`
- `Build a weekday-by-month heatmap for response load.`
- `Compare team profiles across eight skills.`

## Better prompt examples

- `Use my attached CSV. Compare quarterly revenue across regions, keep negative values if they exist, and make the labels readable on desktop.`
- `Build a dashboard-style ranking chart for migration risk by business unit. The unit names are long and hover details matter.`
- `Show how traffic source share changed over the year as a continuous trend, not as a snapshot.`
- `Create a custom scorecard view with ranked bars, threshold markers, and hover details for each business unit.`

## What users do not need to say

Prompts usually do not need to specify:

- a precise chart library API
- exact widget names
- the internal chart-package structure

The agent should infer that from the docs and build the chart directly with `flitter-ui`.
