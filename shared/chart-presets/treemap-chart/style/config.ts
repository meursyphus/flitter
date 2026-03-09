import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

type AgTreemapSharedConfig = Pick<
  AgCartesianBaseConfig,
  "font" | "title" | "tooltip"
>;

export type TreemapChartConfig = AgTreemapSharedConfig & {
  treemap: {
    padding: number;
  };
};

export const defaultAgConfig: TreemapChartConfig = {
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  treemap: {
    padding: 20,
  },
};
