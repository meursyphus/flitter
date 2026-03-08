# Flitter Chart LLM Pack

Use this pack when an agent needs to implement or customize charts in this repository with as little hidden context as possible.

Generated: 2026-03-07

## What This Pack Covers

- Full chart family map across preset and base-wrapper charts
- Headless-native chart types with source-of-truth paths
- Novel composition patterns for requests that do not fit a canned chart family
- Core Flitter widget and API knowledge required to leave preset land safely
- A reader-vs-critic evaluation loop with reusable cases

## Build Order

1. Read `/llm/chart.md`.
2. Choose the nearest chart brief under `/llm/chart/<slug>.md`.
3. If no canonical family fits, move to `/llm/patterns.md`.
4. If the plan needs custom composition, read `/llm/core/concepts.md` and `/llm/core/widget-catalog.md`.
5. Use the scaffold tool to materialize a local starter bundle before coding.

## Surface Types

### Preset Charts

These have stronger ready-made defaults and are the first stop for common chart requests.

- `bar-chart`: Compare discrete categories with grouped or directional bars. Styles: toast, ag.
- `stacked-bar-chart`: Compare totals while preserving contribution by series inside each category. Styles: toast, ag.
- `line-chart`: Show continuous trends, comparisons over time, and line-based overlays. Styles: toast, ag.
- `area-chart`: Trend chart where filled magnitude and cumulative visual weight matter. Styles: toast, ag.
- `stacked-area-chart`: Show total trend over time while preserving how each series contributes. Styles: toast, ag.
- `scatter-chart`: Plot correlation, spread, clusters, and outliers across two numeric axes. Styles: toast, ag.
- `bubble-chart`: Scatter chart with a third numeric value encoded by bubble size. Styles: toast, ag.
- `pie-chart`: Show simple part-to-whole breakdowns with a small number of slices. Styles: toast.
- `radar-chart`: Compare multivariate profiles across shared radial axes. Styles: toast.
- `heatmap-chart`: Show matrix patterns by mapping numeric intensity onto a cell grid. Styles: toast.

### Base-Wrapper Charts

These still have a `chart-presets` entry point, but they behave more like structural wrappers around headless logic than polished theme presets.

- `box-plot-chart`: Show distribution through quartiles, whiskers, and optional outliers.
- `candlestick-chart`: Represent open-high-low-close movement for each interval.
- `combo-chart`: Combine bars, lines, and areas, optionally with primary and secondary axes.
- `donut-chart`: Part-to-whole chart with center content and an inner radius.
- `funnel-chart`: Show sequential stage dropoff and conversion through a funnel.
- `gantt-chart`: Visualize tasks across time with optional dependencies and progress.
- `gauge-chart`: Display a single KPI against a bounded range and optional zones.
- `histogram-chart`: Show numeric distribution by bins rather than individual raw points.
- `network-chart`: Render nodes and edges with controller-owned spatial layout.
- `polar-area-chart`: Use equal-angle sectors with radial magnitude rather than slice angle for value.
- `progress-chart`: Linear progress track for a single value or segmented completion state.
- `sankey-chart`: Show weighted flow between stages with controller-owned layout.
- `sunburst-chart`: Display hierarchical composition as concentric radial segments.
- `treemap-chart`: Represent proportional rectangles in a dense area-based map.
- `waterfall-chart`: Show cumulative change through increases, decreases, and totals.

## Styles

### Toast Style (`toast`)

Pastel palette, soft motion, and strong out-of-the-box defaults.

Use when: Use when the prompt wants something expressive, product-facing, or presentation-friendly without writing a custom renderer first.

- Good default title, legend, and animation behavior
- Easy first pass for most dashboard and marketing charts
- Strong preset surface in shared/chart-presets

### AG Style (`ag`)

Muted business dashboard look with restrained motion and denser layout.

Use when: Use when the request sounds operational, enterprise, financial, or needs a calmer presentation surface.

- Better fit for business dashboards and dense comparison views
- More conservative defaults for titles, legend, and grid
- Useful when the user says AG-like, dashboard, or analyst-facing

## Core Rules

- Start with `chart-presets` before using headless controllers directly.
- Treat fully themed presets and base wrappers differently.
- Only use direct Flitter primitives when the request clearly exceeds canonical chart families.
- Do not invent missing style systems or unsupported props.
- Ask clarifying questions only when chart choice, scale semantics, or layout semantics would materially change the implementation.

## Novel Pattern Escalation

Use `/llm/patterns.md` when:

- one chart cannot carry the story,
- the prompt explicitly rejects a standard chart look,
- multiple views need linked interaction,
- the result is closer to an application surface than a single chart.

## Core Knowledge Escalation

Use `/llm/core/concepts.md` and `/llm/core/widget-catalog.md` when:

- you need layout composition beyond a single chart shell,
- you need controller/provider state coordination,
- you need animation or custom paint for bespoke geometry,
- you are building a novel chart composite instead of using one existing family.

## Source Map

- Presets and base wrappers: `shared/chart-presets`
- Headless logic: `packages/chart/src/headless`
- Chart docs data: `docs/src/app/chart/_data`
- Flitter primitives: `packages/core/src`
- Generated mirror: `docs/llm/generated`
- Public pack output: `docs/public/llm`

## Tooling

- `/llm/chart-registry.json`: machine-readable registry for charts, patterns, widgets, and concepts
- `/llm/scaffold-guide.md`: how to use the shadcn-like starter tool
- `pnpm llm:kit list`: inspect installable chart/pattern/widget starters
- `pnpm llm:kit scaffold <slug> --output tmp/<slug>`: materialize a starter bundle
- `pnpm llm:playground:dev`: open the separate reader-vs-critic validation UI
