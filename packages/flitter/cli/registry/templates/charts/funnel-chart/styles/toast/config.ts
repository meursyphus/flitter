import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";
import {
  defaultFunnelAppearance,
  type FunnelAppearance,
} from "../../base/config";

export type FunnelChartConfig = Pick<
  ToastBaseConfig,
  "colors" | "font" | "title" | "legend" | "padding" | "tooltip" | "animation"
> &
  FunnelAppearance;

export const defaultConfig: FunnelChartConfig = {
  ...defaultToastBaseConfig,
  ...defaultFunnelAppearance,
  legend: { ...defaultToastBaseConfig.legend, visible: false },
  dataLabel: {
    ...defaultFunnelAppearance.dataLabel,
    color: defaultToastBaseConfig.legend.color,
    fontSize: defaultToastBaseConfig.font.size,
  },
};
