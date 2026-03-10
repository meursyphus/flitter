import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

type AgGanttSharedConfig = Pick<
  AgCartesianBaseConfig,
  "font" | "title" | "tooltip" | "colors"
>;

export type GanttChartConfig = AgGanttSharedConfig & {
  gantt: {
    rowHeight: number;
    barHeight: number;
    milestoneColor: string;
    dependencyColor: string;
  };
};

export const defaultAgConfig: GanttChartConfig = {
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  colors: defaultAgCartesianBaseConfig.colors,
  gantt: {
    rowHeight: 36,
    barHeight: 18,
    milestoneColor: "#ffb840",
    dependencyColor: "#c4ccd7",
  },
};
