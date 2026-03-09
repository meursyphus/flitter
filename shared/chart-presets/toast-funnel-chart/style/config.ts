import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_styles/toast/index";

type ToastFunnelSharedConfig = Pick<
  ToastBaseConfig,
  "font" | "title" | "tooltip" | "animation"
>;

export type FunnelChartConfig = ToastFunnelSharedConfig & {
  funnel: {
    stageHeight: number;
  };
};

export const defaultToastConfig: FunnelChartConfig = {
  font: defaultToastBaseConfig.font,
  title: defaultToastBaseConfig.title,
  tooltip: defaultToastBaseConfig.tooltip,
  animation: defaultToastBaseConfig.animation,
  funnel: {
    stageHeight: 40,
  },
};
