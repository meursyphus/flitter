import {
  defaultSankeyAppearance,
  type SankeyAppearance,
} from "../../base/config";
import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";

type ToastSankeySharedConfig = Pick<
  ToastBaseConfig,
  "colors" | "font" | "title" | "tooltip" | "animation" | "padding"
>;

export type SankeyChartConfig = ToastSankeySharedConfig & SankeyAppearance;

export const defaultToastConfig: SankeyChartConfig = {
  padding: defaultToastBaseConfig.padding,
  sankey: {
    ...defaultSankeyAppearance,
    labelColor: defaultToastBaseConfig.title.color,
    labelFontSize: defaultToastBaseConfig.font.size,
    outline: true,
  },
  colors: defaultToastBaseConfig.colors,
  font: defaultToastBaseConfig.font,
  title: defaultToastBaseConfig.title,
  tooltip: defaultToastBaseConfig.tooltip,
  animation: defaultToastBaseConfig.animation,
};
