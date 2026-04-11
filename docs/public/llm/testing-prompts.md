# Testing Prompts

Generated: 2026-04-08

Use these prompts to test a first-read agent against the pack.

## Regional revenue with negatives and orientation choice

Build a chart comparing monthly revenue delta across North America, Europe, and APAC for Jan to Jun. Some categories are negative and the PM is not sure whether horizontal or vertical reads better.

Pack links:
- `/llm/chart.md`
- `/llm/chart/bar-chart.md`

Success criteria:
- Chooses grouped bar instead of stacked or line
- Uses preset config first and only escalates if the user asks for unusual bar rendering
- Flags the orientation ambiguity before coding blindly

## Contribution by business line across quarters

Show quarterly revenue as one total per quarter, but make the contribution of Product, Services, and Support visible inside each bar.

Pack links:
- `/llm/chart.md`
- `/llm/chart/stacked-bar-chart.md`

Success criteria:
- Chooses stacked bar instead of grouped bar
- Calls out percent-stack ambiguity if not specified
- Keeps the solution in chart-presets unless stack semantics become custom

## Lead and activation trend comparison

Plot weekly leads and activations so product can compare trajectory and divergence over the last eight weeks.

Pack links:
- `/llm/chart.md`
- `/llm/chart/line-chart.md`

Success criteria:
- Chooses line rather than scatter or area by default
- Keeps the plan in preset land unless custom overlays are requested
- Explains what would force a combo or area chart instead

## Trend plus magnitude without overfitting to a line

We need a chart for weekly traffic and activated users. The VP wants the trend to feel substantial, not just thin lines, but still needs to compare both series over time.

Pack links:
- `/llm/chart.md`
- `/llm/chart/area-chart.md`

Success criteria:
- Frames area vs line as a deliberate choice instead of guessing
- Keeps the solution in preset space unless overlays or custom bands are requested
- Names what additional information would force a different chart family

## Acquisition composition over time

Show the weekly total acquisition trend while preserving how Organic, Paid, and Referral contribute over time.

Pack links:
- `/llm/chart.md`
- `/llm/chart/stacked-area-chart.md`

Success criteria:
- Chooses stacked area instead of overlapping area
- Calls out percent-stack ambiguity
- Uses preset surface before escalating

## Correlation and outlier detection

Plot marketing spend against pipeline generated for each campaign so we can see clusters and obvious outliers.

Pack links:
- `/llm/chart.md`
- `/llm/chart/scatter-chart.md`

Success criteria:
- Chooses scatter rather than line
- Calls out point label density
- Keeps the plan in preset land unless overlays become custom

## Three-variable opportunity matrix

Plot opportunities by expected impact, implementation complexity, and pipeline value. Each opportunity should be individually readable and the bubble size should mean something real, not decoration.

Pack links:
- `/llm/chart.md`
- `/llm/chart/bubble-chart.md`

Success criteria:
- Chooses bubble instead of plain scatter
- Calls out size semantics and overlap risk
- Uses preset first, then identifies overlap as a headless escape hatch if needed

## Simple traffic share composition

Show the share of traffic coming from Desktop, Mobile, and Tablet in a single composition snapshot.

Pack links:
- `/llm/chart.md`
- `/llm/chart/pie-chart.md`

Success criteria:
- Chooses pie only for a small slice count
- Calls out label and slice-count constraints
- Stays inside preset surface unless composition becomes novel

## Capability profile comparison

Compare the current capability profile of two products across Speed, Quality, Adoption, Reliability, and Cost.

Pack links:
- `/llm/chart.md`
- `/llm/chart/radar-chart.md`

Success criteria:
- Chooses radar only for shared profile dimensions
- Calls out scale choice
- Avoids pretending radar is good for exact comparison-heavy tasks

## Support load matrix with scale ambiguity

Make a support volume heatmap with weekday on the y-axis, hour bucket on the x-axis, and a color legend that operations can trust week over week.

Pack links:
- `/llm/chart.md`
- `/llm/chart/heatmap-chart.md`

Success criteria:
- Chooses heatmap quickly
- Flags the fixed-vs-derived legend scale question
- Does not hand-wave missing data semantics

## Distribution comparison by cohort

Compare response-time distribution for the Control and Experiment cohorts, including median, quartiles, and visible outliers.

Pack links:
- `/llm/chart.md`
- `/llm/chart/box-plot-chart.md`

Success criteria:
- Chooses box plot instead of bar or line
- Recognizes this is a base-wrapper chart, not a branded preset path
- Calls out outlier visibility and statistical input assumptions

## OHLC price movement by day

Render daily OHLC movement for one stock and make sure rising and falling sessions are visually distinct.

Pack links:
- `/llm/chart.md`
- `/llm/chart/candlestick-chart.md`

Success criteria:
- Chooses candlestick instead of line
- Treats finance semantics as primary
- Does not pretend a fully themed preset exists

## Completion split with center KPI

Show Completed, In Progress, and Blocked as a donut with the total number of tasks in the center.

Pack links:
- `/llm/chart.md`
- `/llm/chart/donut-chart.md`

Success criteria:
- Chooses donut instead of plain pie because center content matters
- Uses the centerContent slot explicitly
- Keeps the chart in the base wrapper unless center behavior becomes composite

## Signup conversion funnel

Show the drop from Visited to Signed Up to Activated to Paid. The PM wants to see where the biggest conversion loss happens.

Pack links:
- `/llm/chart.md`
- `/llm/chart/funnel-chart.md`

Success criteria:
- Chooses funnel rather than sankey or bar
- Treats stage ordering as fixed
- Calls out conversion labeling needs

## Continuous latency distribution

Show the distribution of API latency so we can see whether values cluster or spread out.

Pack links:
- `/llm/chart.md`
- `/llm/chart/histogram-chart.md`

Success criteria:
- Chooses histogram rather than bar
- Treats binning as a first-class question
- Recognizes this is a base-wrapper chart

## Weighted stage-to-stage flow

Visualize how users flow from Visit to Sign Up to Paid, with weighted links showing where volume moves.

Pack links:
- `/llm/chart.md`
- `/llm/chart/sankey-chart.md`

Success criteria:
- Chooses sankey rather than funnel or network
- Recognizes controller-owned layout
- Uses the base wrapper before diving into custom geometry

## Hierarchical revenue composition

Show revenue contribution by business line and product family in a radial hierarchy.

Pack links:
- `/llm/chart.md`
- `/llm/chart/sunburst-chart.md`

Success criteria:
- Chooses sunburst for radial hierarchy
- Calls out label-density risk
- Treats it as a base-wrapper chart, not a themed preset

## Dense composition rectangle map

Show revenue contribution by segment as proportionally sized rectangles with labels inside where possible.

Pack links:
- `/llm/chart.md`
- `/llm/chart/treemap-chart.md`

Success criteria:
- Chooses treemap rather than pie or sunburst for dense area comparison
- Calls out label-density risk
- Does not invent unsupported deep hierarchy semantics silently

## Bridge from start to finish value

Show how we move from starting ARR to ending ARR through upsell, churn, and expansion.

Pack links:
- `/llm/chart.md`
- `/llm/chart/waterfall-chart.md`

Success criteria:
- Chooses waterfall rather than signed bar chart
- Treats total indices as explicit semantics
- Uses the base wrapper and its dedicated bar/connector slots

## Novel ranked scorecard that is not a canned chart

We want ranked business units with score bars, target markers, and a hover detail panel. It should feel like a composite scorecard, not a standard chart library screenshot.

Pack links:
- `/llm/chart.md`
- `/llm/patterns/scorecard-composite.md`

Success criteria:
- Rejects the temptation to force the prompt into an incorrect canned chart
- Explains why headless or direct primitive composition is the right move
- Names reusable chart ideas without pretending a direct preset exists

## Executive dashboard with overview and drilldown

Build an executive dashboard with top-line revenue trend, current pipeline composition, and a region comparison panel. One chart cannot carry the whole story.

Pack links:
- `/llm/chart.md`
- `/llm/patterns/multi-chart-dashboard.md`

Success criteria:
- Splits the story into multiple charts instead of one overloaded combo chart
- Uses layout primitives intentionally
- Calls out shared state only if interaction is actually needed

## Linked hover across charts

When I hover a campaign in the scatter plot, I want the same campaign highlighted in the bar comparison and detail panel.

Pack links:
- `/llm/chart.md`
- `/llm/patterns/linked-hover-and-filter.md`

Success criteria:
- Moves shared interaction into controller/provider state
- Does not fake linked behavior with isolated local state
- Uses direct composition only where necessary

## Radial KPI composite

Create a radial KPI module with an overall completion donut, an inner status label, and threshold arcs around it for health.

Pack links:
- `/llm/chart.md`
- `/llm/patterns/radial-kpi-composite.md`

Success criteria:
- Uses donut plus custom threshold arcs without pretending one canned chart solves everything
- Separates radial layers semantically
- Escalates to custom composition only where needed

## Novel data composite beyond existing families

We need a chart-like artifact that combines ranked cards, trend sparklines, and threshold badges for each business unit.

Pack links:
- `/llm/chart.md`
- `/llm/patterns/novel-data-composite.md`

Success criteria:
- Decomposes the request into chart and non-chart subparts
- Does not invent a fake single chart family
- Uses direct Flitter composition deliberately
