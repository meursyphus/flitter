import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";

type ToastFunnelSharedConfig = Pick<
  ToastBaseConfig,
  "font" | "title" | "tooltip" | "animation" | "padding" | "colors"
>;

export type FunnelChartConfig = ToastFunnelSharedConfig & {
  funnel: {
    connectorSize: number;
    minSegmentRatio: number;
    labelGap: number;
    labelColumnWidth: number;
    labelBandSize: number;
    segmentRadius: number;
    dimOpacity: number;
  };
};

export const defaultToastConfig: FunnelChartConfig = {
  colors: defaultToastBaseConfig.colors,
  font: defaultToastBaseConfig.font,
  title: defaultToastBaseConfig.title,
  tooltip: defaultToastBaseConfig.tooltip,
  animation: defaultToastBaseConfig.animation,
  padding: defaultToastBaseConfig.padding,
  funnel: {
    connectorSize: 22,
    minSegmentRatio: 0.18,
    labelGap: 10,
    labelColumnWidth: 150,
    labelBandSize: 42,
    segmentRadius: 6,
    dimOpacity: 0.28,
  },
};
