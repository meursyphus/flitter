import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";

type ToastGanttSharedConfig = Pick<
  ToastBaseConfig,
  "font" | "title" | "tooltip" | "animation" | "colors"
>;

export type GanttChartConfig = ToastGanttSharedConfig & {
  gantt: {
    rowHeight: number;
    barHeight: number;
    milestoneColor: string;
  };
};

export const defaultToastConfig: GanttChartConfig = {
  font: defaultToastBaseConfig.font,
  title: defaultToastBaseConfig.title,
  tooltip: defaultToastBaseConfig.tooltip,
  animation: defaultToastBaseConfig.animation,
  colors: defaultToastBaseConfig.colors,
  gantt: {
    rowHeight: 36,
    barHeight: 18,
    milestoneColor: "#f2b544",
  },
};
