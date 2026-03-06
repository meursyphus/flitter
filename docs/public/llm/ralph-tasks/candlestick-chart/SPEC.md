# Candlestick Chart — Spec

## Status
headless-only

## Purpose
Use a candlestick chart to display financial OHLC (Open, High, Low, Close) data for securities over time. Ideal for stock market analysis, trading dashboards, and any time-series data where the range and direction of price movement within each period matters.

## Data Shape
```typescript
type CandlestickChartData = {
  labels: string[];
  datasets: CandlestickChartDataPoint[];
  title?: string;
};

type CandlestickChartDataPoint = {
  open: number;
  high: number;
  low: number;
  close: number;
};

type CandlestickChartScale = {
  min: number;
  max: number;
  step: number;
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | `{ title, legends, plot }` | Root layout composing title, legends, and plot area |
| plot | `{ xAxis, yAxis, dataView, grid, axisCorner }` | Plot area container with axes and data |
| dataView | `{ candlesticks }` | Data region containing all candlestick elements |
| candlestick | `{ open, high, low, close, label, index }` | Individual candlestick (body + wicks) |
| dataLabel | `{ value, label, legend }` | Optional value label on/near candlestick |
| xAxis | `{ line, labels, tick }` | Full x-axis composition |
| yAxis | `{ line, labels, tick }` | Full y-axis composition |
| xAxisLabel | `{ name, index }` | Individual x-axis time/date label |
| yAxisLabel | `{ name, index }` | Individual y-axis price label |
| xAxisTick | -- | X-axis tick mark |
| yAxisTick | -- | Y-axis tick mark |
| xAxisLine | -- | X-axis baseline |
| yAxisLine | -- | Y-axis baseline |
| grid | `{ xLine, yLine }` | Grid container |
| gridXLine | -- | Vertical grid line |
| gridYLine | -- | Horizontal grid line |
| axisCorner | -- | Corner fill between axes |
| legend | `{ name, index }` | Legend item (Bullish/Bearish) |
| title | `{ name }` | Chart title |

**Total: 18 slots** (cartesian base + candlestick, dataLabel)

## Controller Methods
- `hoverCandlestick(index)` -- highlight a candlestick, show OHLC tooltip
- `unhoverCandlestick()` -- clear hover state
- `toggleSeries(legend)` -- show/hide a dataset
- `setSize(width, height)` -- update chart dimensions

## Style Presets Needed
- **toast**: bullish color (green), bearish color (red); body width and border; wick thickness; axes, grid, legend, title styling; hover effect (border or glow); dataLabel formatting

## UX Patterns
- Bullish/Bearish coloring: close > open = green (bullish), close < open = red (bearish); configurable colors
- Candlestick anatomy: vertical wick line from low to high, filled/hollow body from open to close
- OHLC tooltip: hover shows Open, High, Low, Close values plus the change amount/percentage
- Fixed legends: two items (Bullish, Bearish) similar to waterfall's fixed legends
- Date labels: x-axis labels are typically date/time strings with configurable formatting
- Animation: candlesticks grow from center outward on mount
- Volume overlay: optional secondary data display (can be added via custom dataView slot)

## Storybook Stories Required
- Basic (daily stock prices)
- Weekly data with many candles
- Mostly bullish trend
- Mostly bearish trend
- Hover interaction (OHLC tooltip)
- Custom bullish/bearish colors
