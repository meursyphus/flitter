import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

type AgPieSharedConfig = Pick<
  AgCartesianBaseConfig,
  "background" | "colors" | "font" | "title" | "subtitle" | "legend" | "padding" | "tooltip"
>;

export type AgPieChartConfig = AgPieSharedConfig & {
  pie: {
    strokeColor: string;
    strokeWidth: number;
    innerRadiusRatio: number;
  };
  dataLabel: {
    visible: boolean;
    fontSize: number;
    fontColor: string;
    fontFamily?: string;
    fontWeight?: string;
    offset: number;
    lineColor: string;
    lineWidth: number;
    formatter: (args: { index: number; name: string; value: number; percentage: number; startAngle: number; sweepAngle: number }) => string;
  };
};

export const defaultAgConfig: AgPieChartConfig = {
  background: defaultAgCartesianBaseConfig.background,
  colors: defaultAgCartesianBaseConfig.colors,
  font: defaultAgCartesianBaseConfig.font,
  title: {
    ...defaultAgCartesianBaseConfig.title,
    alignment: "center" as const,
  },
  subtitle: defaultAgCartesianBaseConfig.subtitle,
  legend: { ...defaultAgCartesianBaseConfig.legend, visible: false, position: "right-top" },
  padding: { top: 40, right: 60, bottom: 40, left: 60 },
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  pie: {
    strokeColor: "white",
    strokeWidth: 2,
    innerRadiusRatio: 0,
  },
  dataLabel: {
    visible: true,
    fontSize: 16,
    fontColor: "#333333",
    offset: 20,
    lineColor: "#999999",
    lineWidth: 1,
    formatter: (args) => String(args.value),
  },
};
