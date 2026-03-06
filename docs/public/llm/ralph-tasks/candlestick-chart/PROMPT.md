# Ralph Prompt — Candlestick Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart has a complete headless implementation in `packages/chart/src/headless/_todo/candlestick-chart/`. Your task is to:

1. **Move it out of _todo** to `headless/candlestick-chart/` and export from `headless/index.ts`
2. **Create the styled layer** following the bar-chart pattern (cartesian):
   - `charts/candlestick-chart/index.ts` -- `CandlestickChart()` factory function
   - `charts/candlestick-chart/base/index.ts` -- structural defaults for all 18 slots
   - `charts/candlestick-chart/styles/toast/index.ts` -- `toastStyleConfig` (custom + createConfig + getScaleOptions)
   - `charts/candlestick-chart/styles/toast/config.ts` -- `ToastCandlestickChartConfig` extending `ToastBaseConfig`
   - `charts/candlestick-chart/styles/toast/parts/` -- candlestick.ts (body + wicks), dataLabel.ts
3. **Create storybook stories** in `dev/chart-storybook/src/stories/`:
   - Basic, Many candles, Bullish trend, Bearish trend, Hover OHLC, Custom colors
4. **Export from package** -- add to `charts/index.ts` and `src/index.ts`

## Key Implementation Details
- 18 headless slots (cartesian base 14 + candlestick, dataLabel, legend, title)
- Cartesian chart: uses shared cartesian axes, grid, and layout -- similar to bar-chart
- Candlestick anatomy: vertical wick line from low to high, colored body from open to close
- Bullish (close > open): green body (#22c55e); Bearish (close < open): red body (#ef4444)
- Candlestick slot receives `{ open, high, low, close, label, index }`
- DataLabel slot receives `{ value, label, legend }` -- optional, typically not shown by default
- OHLC tooltip: hover shows Open, High, Low, Close values
- Scale computed from min(all lows) to max(all highs)
- X-axis labels are date/time strings from `data.labels`
- `data.datasets` is a flat array of `{ open, high, low, close }` (one per label), not grouped by legend

## Context Files
- Spec: `docs/public/llm/ralph-tasks/candlestick-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/candlestick-chart/CHECKLIST.md`
- Headless source: `packages/chart/src/headless/_todo/candlestick-chart/`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`
- Shared toast components: `packages/chart/src/styles/toast/`
- Shared cartesian components: `packages/chart/src/shared/cartesian/`

## Convention
Follow the bar-chart pattern for cartesian charts. The headless layer already has:
- `types.ts` -- CandlestickChartCustom (18 slots), CandlestickChartDataPoint, CandlestickChartData, CandlestickChartScale
- `chart.ts` -- Full component tree (Layout, Plot, DataView, Candlesticks, Axes, Grid)
- `provider.ts` -- CandlestickChartConfigProvider
- `default/` -- Default implementations for all structural slots
- `index.ts` -- Entry point

Your job is to wire styled rendering to each slot. Reuse `@styles/toast/` cartesian components for axes, grid, legend, title. Create chart-specific parts for candlestick (body rectangle + wick lines with bullish/bearish coloring) and dataLabel.

## Completion
Check all items in CHECKLIST.md.
Output `<promise>CANDLESTICK_CHART COMPLETE</promise>` when done.
