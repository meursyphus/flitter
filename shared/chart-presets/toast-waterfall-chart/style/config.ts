import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_shared/toast/index";

export type WaterfallChartConfig = ToastBaseConfig & {
  waterfall: {
    barGap: number;
    positiveName: string;
    negativeName: string;
    totalName: string;
    valueFormatter: (value: number, type: "increase" | "decrease" | "total" | "subtotal") => string;
    line: {
      enabled: boolean;
      color: string;
      width: number;
      dash: number[];
    };
    dataLabel: {
      visible: boolean;
      fontSize: number;
      color: string;
      fontFamily?: string;
    };
  };
};

const semanticToastColors = ["#1aa3f0", "#f2b544", "#22b07d"];

export const defaultToastConfig: WaterfallChartConfig = {
  ...defaultToastBaseConfig,
  colors: semanticToastColors,
  waterfall: {
    barGap: 10,
    positiveName: "Increase",
    negativeName: "Decrease",
    totalName: "Total",
    valueFormatter: (value) => value.toLocaleString("en-US"),
    line: {
      enabled: true,
      color: "rgba(0,0,0,0.18)",
      width: 1.5,
      dash: [],
    },
    dataLabel: {
      visible: false,
      fontSize: 11,
      color: "#333333",
    },
  },
};
