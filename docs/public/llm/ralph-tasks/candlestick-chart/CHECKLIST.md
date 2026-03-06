# Candlestick Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve (no broken `@headless/`, `@shared/`, `@styles/` paths)

## Headless (move from _todo)
- [ ] `headless/_todo/candlestick-chart/` moved to `headless/candlestick-chart/`
- [ ] HeadlessCandlestickChart exported from `headless/index.ts`
- [ ] All 18 slots typed in `types.ts`
- [ ] Provider works via `Provider.of(context)`
- [ ] `chart.ts` builds full component tree (Layout, Plot, DataView, Candlesticks, Axes, Grid)
- [ ] Scale computed from min(low) to max(high) across all data points
- [ ] Candlestick correctly determines bullish (close > open) vs bearish (close < open)
- [ ] Default files in `default/` render structural placeholders for all slots

## Styled Layer (new)
- [ ] `charts/candlestick-chart/` directory created
- [ ] `charts/candlestick-chart/index.ts` exports `CandlestickChart()` factory function
- [ ] `charts/candlestick-chart/base/index.ts` provides structural defaults for all 18 slots
- [ ] `charts/candlestick-chart/styles/toast/index.ts` exports `toastStyleConfig`
- [ ] `charts/candlestick-chart/styles/toast/config.ts` defines `ToastCandlestickChartConfig` extending `ToastBaseConfig`
- [ ] `charts/candlestick-chart/styles/toast/parts/` has candlestick, dataLabel parts
- [ ] Toast preset works with default config (no user config required)
- [ ] Custom slot override works (partial override merges correctly)
- [ ] Bullish candles render green, bearish candles render red
- [ ] Wick lines extend from body to high/low values

## Export
- [ ] CandlestickChart added to `charts/index.ts`
- [ ] CandlestickChart added to `src/index.ts`

## Storybook
- [ ] Basic story renders (daily stock prices)
- [ ] Weekly data with many candles story renders
- [ ] Mostly bullish trend story renders
- [ ] Mostly bearish trend story renders
- [ ] Hover interaction story works (OHLC tooltip)
- [ ] Custom bullish/bearish colors story renders
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
