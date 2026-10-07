import {
  defaultSankeyAppearance,
  type SankeyAppearance,
} from "../../base/config";
import {
  type AgCartesianBaseConfig,
  defaultAgCartesianBaseConfig,
} from "@styles/ag";

type AgSankeySharedConfig = Pick<
  AgCartesianBaseConfig,
  "colors" | "font" | "title" | "subtitle" | "tooltip" | "padding"
>;

export type SankeyChartConfig = AgSankeySharedConfig & SankeyAppearance;

export const defaultAgConfig: SankeyChartConfig = {
  padding: defaultAgCartesianBaseConfig.padding,
  sankey: {
    ...defaultSankeyAppearance,
    labelColor: defaultAgCartesianBaseConfig.title.color,
    labelFontSize: defaultAgCartesianBaseConfig.font.size,
    outline: false,
  },
  colors: defaultAgCartesianBaseConfig.colors,
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  subtitle: defaultAgCartesianBaseConfig.subtitle,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
};
