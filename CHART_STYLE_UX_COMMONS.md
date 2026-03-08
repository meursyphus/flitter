# Dual-Style Chart UX Commonalities

Scope:

- `BarChart`
- `StackedBarChart`
- `LineChart`
- `AreaChart`
- `StackedAreaChart`
- `ScatterChart`
- `BubbleChart`

Compared implementations:

- AG: `shared/chart-presets/{bar-chart,stacked-bar-chart,line-chart,area-chart,stacked-area-chart,scatter-chart,bubble-chart}`
- Toast: `shared/chart-presets/{toast-bar-chart,toast-stacked-bar-chart,toast-line-chart,toast-area-chart,toast-stacked-area-chart,toast-scatter-chart,toast-bubble-chart}`
- Shared bases: `shared/chart-presets/ag-base/*`, `shared/chart-presets/toast-base/*`

This is not a visual design review. It is a code-level UX extraction: what both style systems are trying to make the user feel and do, and where they already share the same behavior contract.

## Executive Summary

The dual-style charts already share one strong UX contract:

- the same chart families map to the same headless interaction model
- the same outer shell exists in both styles: title, legend, plot, axes, grid, tooltip
- the same series identity model exists in both styles: color by legend index, toggle by legend name
- the same data-semantics exist in both styles: bars can switch vertical/horizontal, line/area can switch spline, bubble size comes from value, scatter/bubble are true XY charts
- the same tooltip intent exists in both styles: hover a semantic datum, reveal labeled series info near that datum

The biggest differences are not data semantics. They are presentation strategy:

- AG is context-driven, analytic, low-motion, cross-series dimming, mouse-follow or nearest-point hover.
- Toast is widget-local, animated, anchored tooltip placement, direct highlight with border/shadow.

So the repo does not have two unrelated UX systems. It has one shared chart UX contract with two different presentation dialects.

## Shared UX Invariants

### 1. Same slot architecture

Across all seven families, both styles override the same conceptual slots:

- `layout`
- `title`
- `legend`
- axis primitives
- `dataView`
- one family-specific series primitive

Examples:

- bar/stacked-bar: `bar`, `dataView`
- line/area/stacked-area: `line`, `dataView`
- scatter: `scatter`
- bubble: `bubble`

This matters because the user-facing UX surface is structurally consistent before styling diverges.

### 2. Same shell composition

Both style systems provide the same outer chart shell:

- title can be top or bottom
- title alignment can be `start`, `center`, `end`
- legend can be `top`, `bottom`, or right-side variants
- plot always expands to fill remaining space
- outer padding comes from config

Both `agLayout` and `toastLayout` do almost the same structural work. The main difference is that AG adds a white background and subtitle support, while Toast keeps the shell lighter.

### 3. Same legend interaction contract

Both styles implement legends as active controls, not passive labels.

- legend items are color-indexed from series order
- clicking a legend toggles series visibility
- hidden legend items dim to `opacity: 0.4`
- scatter/bubble switch to circular legend markers in both styles

This is one of the clearest shared UX rules in the codebase.

### 4. Same adaptive scale-density idea

Both styles derive axis density from available axis length:

- AG: ~`160px` per tick step target
- Toast: ~`80px` per tick step target

The numbers differ, but the UX idea is identical:

- longer axis => more ticks
- shorter axis => fewer ticks
- never collapse below a usable floor

### 5. Same semantic axis routing

Both styles route axis meaning from chart semantics rather than hard-coded orientation.

- `BarChart` / `StackedBarChart`:
  - vertical: x = label, y = value
  - horizontal: x = value, y = label
- `LineChart` / `AreaChart` / `StackedAreaChart`:
  - x and y are treated as value-oriented chart axes
- `ScatterChart` / `BubbleChart`:
  - both axes are numeric/value axes

This is an important shared UX contract: the user gets the same semantic chart behavior regardless of style.

### 6. Same baseline defaults for family behavior

There are several matching defaults across AG and Toast:

- `BarChart`: `gap: 1`
- `StackedBarChart`: `gap: 0`
- `LineChart`: `strokeWidth: 2`, `spline: false`
- `AreaChart`: `strokeWidth: 2`, `spline: false`, non-zero fill opacity
- `StackedAreaChart`: `strokeWidth: 2`, `spline: false`, stronger fill opacity than plain area
- `ScatterChart`: `size: 10`, `strokeWidth: 2`
- `BubbleChart`: opacity-based fill, min/max radius scaling from data value

The visuals differ, but the interaction posture is aligned: same density, same feature flags, same expected chart behavior.

### 7. Same tooltip enablement model

Both styles gate tooltips by config:

- tooltip can be disabled at config level
- tooltip rendering uses unclipped overlays / high z-index
- tooltip content is tied to semantic chart state, not raw mouse text

Both styles treat tooltip as first-class chart UX, not optional decoration.

## Family-Level Common UX

## Bar And Stacked Bar

Shared UX:

- both support vertical and horizontal modes
- both support negative-value baselines
- both expose per-bar hover feedback
- both expose per-bar tooltip content with `label + legend + value`
- both swap label/value axis roles when direction changes
- both use the same grouped flex layout for bar columns/rows
- both keep stacked bars gapless by default

Shared product implication:

- users can change direction without learning a new chart
- users can inspect individual segments/bars directly
- stacked and unstacked bars feel like the same family, not separate products

Style-specific implementation difference:

- AG dims sibling series globally on hover
- Toast highlights the hovered bar locally with white border + shadow
- Toast animates growth from the value baseline via `AnimatedDataView` and `AnimatedFractionallySizedBox`
- AG is mostly static and relies on the mouse-following tooltip overlay for movement

## Line And Area

Shared UX:

- both support spline vs straight-line rendering
- both compute hover by nearest semantic point, not raw x bucket only
- both reveal point-anchored tooltip information
- both map series color by legend order
- both use line/area opacity and stroke as the main series identity cue
- area charts in both styles keep the same line-on-fill composition

Shared product implication:

- users can switch between line and area without losing interaction familiarity
- spline is a style/reading mode, not a different UX model
- hover always resolves to a meaningful data point

Style-specific implementation difference:

- AG dims non-hovered series to `0.3`
- Toast keeps the line visible and shows an explicit hovered dot + anchored tooltip
- Toast animates line/area value changes by tweening values and scale
- AG uses nearest-point overlays and tooltip fade/position animation only

## Stacked Area

Shared UX:

- still behaves like the line/area family
- uses stacked geometry while keeping raw datum inspection
- hover resolves to a meaningful stack point at a given index
- tooltip content is still keyed by series color and label

Shared product implication:

- stacked area is still readable as a trend chart, not just a filled shape
- users can inspect series contribution without losing x-position context

Important divergence:

- AG resolves one hovered stacked point and shows that series' raw value
- Toast treats the hovered x-column as the primary interaction target and shows all series values for that column, with a guide line and dots for every stacked layer

So the intent is shared, but Toast is more column-centric while AG is more series-point-centric.

## Scatter And Bubble

Shared UX:

- both are true XY charts
- both use circular legend markers
- both use nearest-geometry hover rather than rectangular hit testing
- both map series color by legend order
- bubble radius comes from the value scale in both styles
- hover is designed around inspecting individual points/bubbles, not aggregate columns

Shared product implication:

- users are meant to read exact positioned observations
- series identity matters as much as coordinate position
- bubble is treated as scatter + third variable, not a separate UX family

Style-specific implementation difference:

- AG uses controller/context hover state plus nearest-point scanning across the full plot
- Toast wraps each point/bubble with its own hoverable widget and local hit target
- Toast scatter varies marker shape by series (`circle`, `star`, `square`, `triangle`)
- AG scatter uses circle markers only

Important divergence:

- AG scatter/bubble tooltip payload is simpler and closer to generic series/value reporting
- Toast scatter/bubble tooltip is custom XY-oriented and explicitly surfaces coordinate pairs

## Cross-Style UX Patterns That Are Already Reusable

These are strong candidates for being treated as explicit product rules instead of accidental duplication.

### 1. Shell rules

- title/legend/plot composition
- top/bottom/right legend placement
- title alignment semantics
- padding-driven outer layout

### 2. Legend rules

- legend click toggles series visibility
- hidden series dim
- marker shape can be family-specific, but behavior is shared

### 3. Axis-density rules

- chart size should influence tick density
- bar direction should influence which axis is categorical vs numeric

### 4. Hover rules

- hover should target a semantic datum
- tooltip should appear near the datum, not in a disconnected fixed area
- hover should create focus, either by dimming siblings or by explicit highlight styling

### 5. Family feature rules

- bars: direction-aware, baseline-aware
- lines/areas: spline-aware, point-hover-aware
- scatter/bubble: nearest-point hover, numeric XY semantics
- bubbles: size scale should remain readable under hover

## AG vs Toast Character Summary

### AG style

Behavioral character:

- analytical
- low-motion
- cross-series comparison oriented
- mouse-follow / nearest-point overlay based

Typical cues:

- white chart background
- subtitle support
- cursor-following tooltip for bars
- nearest-point tooltip overlays for line-like and point-like charts
- sibling dimming during hover
- tooltip position/opacity transition is the main built-in motion cue
- series marks themselves are mostly static on mount/update
- subdued, charting-library-style defaults

### Toast style

Behavioral character:

- presentation-forward
- animation-heavy
- local element emphasis
- anchored tooltip placement based on element bounds

Typical cues:

- mount/update animations for bars, lines, areas, scatter, bubble
- white-border + shadow hover treatment
- inline dot/bubble highlight on hover
- tooltip placement logic that tries left/right fallback around the hovered element
- checkbox-style legend affordance for series toggling

## Toast Shared Interaction Grammar

This is the clearest shared Toast UX language across the seven dual-style charts.

### 1. Hover makes the datum feel lifted

Toast repeatedly uses the same visual idea:

- hovered datum gets a white outline
- hovered datum gets a shadow
- hovered datum is rendered as the visually dominant layer
- tooltip is attached right next to that hovered datum

This creates a "lifted above the chart" feeling rather than an "everything else dims" feeling.

Examples:

- bars and stacked bars add white border + shadow, and stacked bars explicitly raise the hovered bar with local `zIndex`
- scatter points add a thicker outline of the same shape
- bubbles re-render at full opacity with white border + shadow
- line/area hover materializes a focused dot and anchors tooltip from that dot

So Toast hover is not mostly about global comparison. It is about making the hovered datum feel physically surfaced.

### 2. Legend UI is deliberately shared

Toast legend is not rebuilt per chart. The design language is shared from `toast-base/legend.ts`.

Common rules:

- same text treatment
- same spacing rhythm
- same visibility toggle behavior
- same hidden-state dimming
- same shared marker grammar

The marker changes by family, but the component behavior is shared:

- default cartesian series use the checkbox-like affordance
- scatter/bubble switch the marker to a circle while keeping the same interaction contract

This is an important design-system signal: the legend is already a reusable Toast UI primitive, not just chart-local code.

Important nuance:

- legend behavior is shared across AG and Toast
- legend implementation reuse is style-base scoped, not globally unified
- in practice that means `ag-base/legend.ts` and `toast-base/legend.ts` express the same contract with different visual grammar

### 3. Tooltip tries to find the right place, not a fixed place

Toast tooltips are usually placed by local geometry helpers that inspect the hovered element against plot bounds.

Shared behavior:

- prefer placing tooltip to the right when space exists
- fall back to the left when needed
- switch top/bottom alignment depending on vertical room
- apply side-specific padding so tooltip does not collide with the datum
- keep tooltip on a high overlay layer

This is why Toast tooltips feel attached and "well placed" instead of merely shown.

For the user, the practical effect is:

- the tooltip appears where the eye already is
- it avoids covering the hovered mark when possible
- it still feels consistent across bar, scatter, bubble, line, and area families

### 4. Motion is part of the UX contract

Toast consistently treats change as something the chart should animate through.

Shared motion patterns:

- bars and stacked bars reveal from the zero baseline
- lines and areas tween shape and scale when values change
- scatter and bubble points can mount with scale animation
- line/area hover dots and tooltips appear as an interaction layer on top of the static plot

This means Toast is not just "same chart with different colors". It is a more explicitly animated reading mode.

### 5. Toast prefers local emphasis over global dimming

AG often answers hover with series-wide dimming.
Toast usually answers hover with local emphasis:

- highlight this mark
- keep neighbors mostly intact
- surface a tooltip right here
- use animation or outline to make the focus obvious

That gives Toast a more tactile UX:

- hover feels like touching a specific mark
- not like switching the whole chart into comparison mode

### 6. The repeated Toast recipe

Across these seven families, the repeated Toast recipe is:

1. keep a shared title / legend / cartesian shell
2. animate the data entrance or update
3. detect hover locally at the datum or x-column level
4. raise the hovered state visually with outline/shadow/dot
5. place tooltip in the nearest sensible slot
6. keep the tooltip and highlight above the plot with overlay layering

That recipe is already strong enough to be treated as an explicit Toast chart UX standard.

## Practical Takeaways

If the goal is to unify the storybook and registry language, the code already supports a clear message:

- there is one shared UX model for dual-style charts
- AG and Toast are two presentation layers over that model
- most divergence is in motion and hover presentation, not in chart semantics

If the goal is to refactor, the strongest common UX abstractions are:

- chart shell layout
- legend interaction contract
- adaptive scale option policy
- semantic hover resolution
- tooltip payload contract per chart family

The current codebase is already much closer to "shared UX with style-specific rendering" than to "two separate chart systems".

## Notable Exceptions Worth Calling Out

These are the main places where the UX contract is not fully aligned yet:

- `StackedAreaChart`: AG shows one hovered series value, Toast shows all values for the hovered x-column
- `ScatterChart` / `BubbleChart`: Toast tooltip is XY-first, AG tooltip is closer to generic label/value reporting
- bar-family hover emphasis:
  - AG prefers global dimming
  - Toast prefers local bordered highlight

These are not necessarily bugs, but they are the clearest points where "same chart, different style" currently becomes "slightly different reading model".

## TODO: Charts To Strengthen

- [ ] `StackedAreaChart`
  - Decide whether AG should keep single-series hovered tooltip or move toward Toast's x-column multi-series readout.
  - If the divergence is intentional, document it explicitly as a style difference rather than leaving it implicit.
- [ ] `ScatterChart`
  - Align tooltip semantics between AG and Toast so both read more clearly as XY charts.
  - Decide whether AG should stay generic label/value oriented or surface x/y more explicitly.
- [ ] `BubbleChart`
  - Align tooltip semantics between AG and Toast.
  - Decide whether bubble tooltips should expose only coordinates, or coordinates plus the bubble-size metric.
  - Re-check hover readability when bubbles overlap heavily.
- [ ] `LineChart`
  - Decide whether AG should remain tooltip-only on hover or expose an explicit hover point marker like Toast.
  - Keep the decision consistent with the "AG = static, analytic" character if no change is desired.
- [ ] `AreaChart`
  - Same question as line: keep AG hover minimal, or add surfaced point affordance.
  - Re-check whether the current shared UX story is obvious enough from stories alone.
- [ ] `BarChart`
  - Re-check hover layering and tooltip placement around negative bars and horizontal bars.
  - Keep Toast's "lifted local hover" and AG's "static global dimming" as an intentional contrast.
- [ ] `StackedBarChart`
  - Re-check overlap/layering behavior in dense stacks.
  - Make sure the lifted hovered segment remains legible when many segments are tightly packed.

## TODO: Storybook Stories To Add

- [ ] `BarChart` / `BarChart.ag`
  - `LegendToggle`
  - `TooltipDisabled`
  - `DenseCategories`
  - `PositiveNegativeHorizontal`
- [ ] `StackedBarChart` / `StackedBarChart.ag`
  - `LegendToggle`
  - `TooltipDisabled`
  - `DenseCategories`
  - `MixedSigns`
- [ ] `LineChart` / `LineChart.ag`
  - `LegendToggle`
  - `DenseSeries`
  - `TooltipDisabled`
  - `LiveUpdate`
- [ ] `AreaChart` / `AreaChart.ag`
  - `LegendToggle`
  - `DenseSeries`
  - `TooltipDisabled`
  - `LiveUpdate`
- [ ] `StackedAreaChart` / `StackedAreaChart.ag`
  - `LegendToggle`
  - `ManySeries`
  - `ColumnHover`
  - `TooltipModelComparison`
- [ ] `ScatterChart` / `ScatterChart.ag`
  - `Quadrants`
  - `DenseClusters`
  - `LegendToggle`
  - `TooltipPayload`
- [ ] `BubbleChart` / `BubbleChart.ag`
  - `WideRadiusRange`
  - `OverlappingBubbles`
  - `LegendToggle`
  - `TooltipPayload`
- [ ] Cross-style parity stories
  - Add one explicit `AgVsToast` or `StyleParity` story pattern per dual-style family if Storybook taxonomy allows it.

## TODO: Broader Visualization Coverage

This is the backlog for expanding beyond the current dual-style chart families.

### 1. Advanced Cartesian Patterns

- [ ] Dual-axis charts
  - bar + line with left/right y-axis
  - area + line with mixed units
  - scatter + fitted trend line with secondary scale
- [ ] Multi-axis charts
  - top + bottom x-axis variants
  - mirrored y-axis variants
  - quadrant / crosshair reference axes
- [ ] Mixed-scale charts
  - linear + log axis combinations
  - band + numeric axis combinations
  - time + categorical hybrid layouts
- [ ] Range / interval charts
  - range area
  - confidence band
  - high-low range bar
  - error bar overlay
- [ ] Statistical overlays
  - trend line
  - moving average
  - regression line
  - percentile / benchmark reference line
- [ ] Dense-axis cases
  - rotated tick labels
  - abbreviated tick labels
  - scrollable / clipped long category axes
  - smart label skipping rules

### 2. More Data Models

- [ ] Time series variations
  - irregular intervals
  - missing-data gaps
  - forecast vs actual
  - trailing-window live updates
- [ ] Financial patterns
  - OHLC variants
  - volume-under-price composites
  - indicator overlays
- [ ] Distribution charts
  - violin plot
  - ridgeline plot
  - density curve
  - beeswarm / jitter plot
- [ ] Ranking / comparison charts
  - lollipop chart
  - dumbbell chart
  - slope chart
  - bump chart
- [ ] Part-to-whole extensions
  - waffle chart
  - marimekko / mosaic chart
  - radial bar chart
  - nested donut variants

### 3. Hierarchy / Flow / Graph / Spatial

- [ ] Hierarchy
  - icicle chart
  - circle packing
  - partition variants
  - collapsible hierarchy examples
- [ ] Flow
  - alluvial diagram
  - chord diagram
  - arc diagram
  - dependency / pipeline variants beyond Sankey
- [ ] Network
  - force-directed variants
  - radial network
  - clustered network
  - DAG / layered graph
- [ ] Spatial / geospatial
  - choropleth map
  - symbol map
  - hexbin map
  - route / path / flow map

### 4. Composite And Dashboard Patterns

- [ ] Small multiples
  - faceted line
  - faceted bar
  - faceted scatter
- [ ] Coordinated views
  - overview + detail
  - chart + table
  - chart + KPI cards
  - linked multi-chart dashboard
- [ ] Comparison composites
  - actual vs target dashboard
  - before/after dashboard
  - regional drilldown dashboard
- [ ] Narrative composites
  - annotated story chart
  - step-by-step reveal chart
  - scrollytelling-ready chart states

### 5. Interaction Backlog

- [ ] Zoom / pan behaviors
- [ ] Brush / selection behaviors
- [ ] Lasso / rectangular selection for scatter-like charts
- [ ] Crosshair / guide line systems
- [ ] Sticky tooltip modes
- [ ] Keyboard accessibility states for legend and datapoints
- [ ] Touch/mobile hover alternatives
- [ ] Drilldown / expand / collapse patterns

### 6. Annotation And Reference Systems

- [ ] Reference line
- [ ] Reference band
- [ ] event marker / milestone marker
- [ ] max/min callout
- [ ] last-value label
- [ ] threshold coloring
- [ ] target marker / benchmark marker
- [ ] direct labeling mode instead of legend

### 7. Storybook Coverage Backlog

- [ ] Add one “stress” story per chart family
  - many categories
  - many series
  - long labels
  - negative values
  - missing values
- [ ] Add one “interaction” story per chart family
  - legend toggle
  - tooltip disabled
  - dense hover case
  - mobile-ish container size
- [ ] Add one “real-world” story per chart family
  - business
  - scientific
  - product analytics
  - operational / infra
- [ ] Add one “layout edge case” story per chart family
  - very narrow
  - very short
  - right legend
  - long title / subtitle

### 8. Reference Curation From D3

- [ ] Build a D3 reference capture board
  - chart name
  - screenshot
  - interaction notes
  - reusable UX idea
  - Flitter equivalent / missing feature
- [ ] Capture screenshots for canonical examples across:
  - cartesian
  - statistical
  - radial
  - hierarchy
  - flow
  - graph
  - geo
  - dashboard / narrative
- [ ] For each captured D3 example, classify:
  - chart family
  - layout pattern
  - hover / selection model
  - animation model
  - annotation model
  - whether it belongs in headless, preset, or pattern docs
- [ ] Build a “missing from Flitter” reference list from those captures
- [ ] Build a “worth copying exactly” list for especially strong UX patterns

### 9. Taxonomy And Documentation

- [ ] Define the master chart taxonomy used by docs / storybook / registry
  - comparison
  - trend
  - distribution
  - relationship
  - composition
  - hierarchy
  - flow
  - spatial
  - dashboard / narrative
- [ ] Mark each chart as:
  - preset chart
  - base-wrapper chart
  - pattern / composite
  - not yet supported
- [ ] Add “recommended when / avoid when” guidance for each family
- [ ] Add “closest D3 reference examples” per family

### 10. Decision Backlog

- [ ] Decide how far “style parity” should go
  - every chart in both AG and Toast
  - or only a curated subset
- [ ] Decide whether advanced charts should start as:
  - headless-first
  - preset-first
  - pattern-doc-first
- [ ] Decide whether Storybook should organize by:
  - chart family
  - style
  - task/use case
  - or a hybrid taxonomy

## TODO: Recommended Execution Order

If the intent is "do all of it", this is the sane order.
Do not run every backlog item in parallel. Clear one phase, then move on.

## Current Scope Lock

For now, stop the expansion backlog here:

- only finish charts that already exist in `packages/chart/src/headless`
- do not start new chart families yet
- do not start geo / advanced statistical / narrative / composite expansion yet

Current headless inventory:

- `bar-chart`
- `box-plot-chart`
- `bubble-chart`
- `candlestick-chart`
- `combo-chart`
- `donut-chart`
- `funnel-chart`
- `gantt-chart`
- `gauge-chart`
- `heatmap-chart`
- `histogram-chart`
- `line-chart`
- `network-chart`
- `pie-chart`
- `polar-area-chart`
- `progress-chart`
- `radar-chart`
- `sankey-chart`
- `scatter-chart`
- `sunburst-chart`
- `treemap-chart`
- `waterfall-chart`

Working rule:

- finish quality, interaction, story coverage, and screenshot validation for these 22 first
- only after that decide whether to expand the chart inventory

### Phase 0. Lock The Working Loop

- [ ] Finalize the implementation/render/screenshot loop
- [ ] Finalize where reference screenshots live
- [ ] Finalize where latest Flitter screenshots live
- [ ] Finalize pass/fail review criteria
- [ ] Make sure Storybook is the default regression surface

Exit condition:

- [ ] Every chart change can be validated through the same repeatable loop

### Phase 1. Stabilize Current Dual-Style Families

Target families:

- [ ] `BarChart`
- [ ] `StackedBarChart`
- [ ] `LineChart`
- [ ] `AreaChart`
- [ ] `StackedAreaChart`
- [ ] `ScatterChart`
- [ ] `BubbleChart`

For each family:

- [ ] align UX expectations between AG and Toast where that mismatch is not intentional
- [ ] add missing interaction stories
- [ ] add stress stories
- [ ] capture screenshots for AG and Toast
- [ ] compare against internal targets / references
- [ ] iterate until both styles feel intentionally differentiated, not accidentally inconsistent

Exit condition:

- [ ] The seven dual-style families are the gold standard for quality

### Phase 2. Strengthen Existing Single-Style Charts

Target families:

- [ ] `PieChart`
- [ ] `DonutChart`
- [ ] `PolarAreaChart`
- [ ] `RadarChart`
- [ ] `HeatmapChart`
- [ ] `BoxPlotChart`
- [ ] `CandlestickChart`
- [ ] `ComboChart`
- [ ] `FunnelChart`
- [ ] `GanttChart`
- [ ] `GaugeChart`
- [ ] `HistogramChart`
- [ ] `NetworkChart`
- [ ] `ProgressChart`
- [ ] `SankeyChart`
- [ ] `SunburstChart`
- [ ] `TreemapChart`
- [ ] `WaterfallChart`

For each family:

- [ ] confirm chart grammar
- [ ] confirm tooltip / legend / annotation model
- [ ] add real stories and edge-case stories
- [ ] capture screenshots
- [ ] iterate until reference quality is acceptable

Exit condition:

- [ ] Existing chart inventory has consistent quality, not just broad coverage

### Phase 3. Fill The Biggest Missing Cartesian Gaps

Add first:

- [ ] dual-axis charts
- [ ] error bars / range / confidence visuals
- [ ] trend / benchmark overlays
- [ ] financial overlays
- [ ] ranking comparison patterns

Reason:

- these expand usefulness fastest without exploding the taxonomy too early

Exit condition:

- [ ] Flitter can cover most serious cartesian/product analytics asks

Status:

- deferred until the existing 22 headless charts are complete

### Phase 4. Add Statistical / Distribution Coverage

Add next:

- [ ] violin
- [ ] density
- [ ] beeswarm
- [ ] ridgeline
- [ ] stronger histogram variants

Exit condition:

- [ ] Flitter can answer more than "business dashboard" chart requests

Status:

- deferred until the existing 22 headless charts are complete

### Phase 5. Expand Hierarchy / Flow / Graph / Spatial

Add next:

- [ ] icicle
- [ ] circle packing
- [ ] alluvial
- [ ] chord
- [ ] arc diagram
- [ ] DAG / layered graph
- [ ] geo maps

Exit condition:

- [ ] coverage extends beyond canonical dashboards into broader visualization territory

Status:

- deferred until the existing 22 headless charts are complete

### Phase 6. Add Composite / Narrative Systems

Add next:

- [ ] small multiples
- [ ] coordinated dashboards
- [ ] overview + detail
- [ ] narrative / annotated chart patterns
- [ ] scrollytelling-ready states

Exit condition:

- [ ] docs can recommend multi-view and narrative solutions, not only isolated chart widgets

Status:

- deferred until the existing 22 headless charts are complete

### Phase 7. D3 Reference Sweep

After the core inventory is stable:

- [ ] build the D3 screenshot/reference board
- [ ] classify examples by family and interaction model
- [ ] mark which ones are already covered
- [ ] mark which ones are missing
- [ ] create follow-up backlog from the uncovered high-value patterns

Reason:

- if done too early, the reference board becomes infinite before the core system is stable

Exit condition:

- [ ] D3 references are being used to sharpen a real system, not to create an unbounded wish list

Status:

- still useful now for comparison material, but do not let it expand the implementation scope yet

### Phase 8. Taxonomy / Docs / Registry Cleanup

Last:

- [ ] unify docs taxonomy
- [ ] unify Storybook taxonomy
- [ ] unify registry naming and capability labels
- [ ] mark preset/base-wrapper/pattern boundaries clearly

Exit condition:

- [ ] the implementation surface and the documentation surface describe the same system

## TODO: Implementation Validation Loop

This should become the default execution loop for every new chart, variant, or visualization pattern.

### Per-chart loop

- [ ] Implement the chart or visualization
- [ ] Add or update the Storybook story
- [ ] Render the chart locally and confirm it actually mounts
- [ ] Capture screenshot(s) from the rendered result
- [ ] Compare against the intended reference
  - D3 example
  - product mock
  - internal target screenshot
- [ ] Identify the gap
  - geometry
  - layout
  - hover behavior
  - tooltip placement
  - legend behavior
  - motion
  - typography / spacing / density
- [ ] Patch the implementation
- [ ] Re-render
- [ ] Re-capture screenshot
- [ ] Repeat until the rendered result is visually and behaviorally acceptable

### Definition of done

- [ ] The chart renders without obvious layout breakage
- [ ] Hover / tooltip / legend behavior works in the intended interaction model
- [ ] Motion, if present, feels intentional rather than incidental
- [ ] The result matches the reference closely enough in structure and reading experience
- [ ] A screenshot exists for review
- [ ] The corresponding Storybook story remains as the regression surface

### Tooling backlog for the loop

- [ ] Add a lightweight screenshot capture workflow for `chart-storybook`
- [ ] Add a place to store reference screenshots
- [ ] Add a place to store latest Flitter screenshots
- [ ] Add a simple comparison checklist per chart
- [ ] Add a “needs another loop” status to the backlog when screenshot parity is not yet good enough

### Program-level rule

- [ ] Keep iterating until every targeted chart family has:
  - an implemented chart
  - a renderable Storybook story
  - a screenshot checked against a reference
  - an explicit pass/fail judgment
- [ ] Do not treat “implemented” as done until render and screenshot review also pass
