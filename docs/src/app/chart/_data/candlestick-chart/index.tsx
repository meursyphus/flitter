import type { ChartModule } from "../types";

const basicCode = `import CandlestickChart from "./charts/candlestick-chart";
import Widget from "@flitterjs/react";

const chart = CandlestickChart({
  data: {
    rows: [
      { date: "2024-01", open: 42000, high: 45000, low: 40000, close: 44500 },
      { date: "2024-02", open: 44500, high: 48000, low: 43000, close: 47200 },
      { date: "2024-03", open: 47200, high: 50000, low: 46000, close: 49800 },
    ],
    xKey: "date",
  },
});

<Widget widget={chart} width={600} height={400} />`;

export const pages: ChartModule = [
  {
    slug: ["candlestick-chart"],
    title: "Candlestick Chart",
    description:
      "Visualize price movements with open, high, low, close data. Stock prices, crypto markets, commodity trading — see the full price action at a glance.",
    pageType: "overview",
    quickStartCode: basicCode,
  },
];
