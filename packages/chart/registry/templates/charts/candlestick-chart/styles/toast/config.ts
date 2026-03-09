import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";

export type CandlestickChartConfig = ToastBaseConfig & {
  candlestick: {
    upColor: string;
    downColor: string;
    wickColor: string;
  };
};

export const defaultToastConfig: CandlestickChartConfig = {
  ...defaultToastBaseConfig,
  legend: { ...defaultToastBaseConfig.legend, visible: false },
  candlestick: {
    upColor: "#22b07d",
    downColor: "#ef5743",
    wickColor: "#3a3a3a",
  },
};
