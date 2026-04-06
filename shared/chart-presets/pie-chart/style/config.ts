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
  radial: {
    visible: boolean;
    gap: number;
  };
  dataLabel: {
    visible: boolean;
    fontSize: number;
    fontColor: string;
    fontFamily?: string;
    fontWeight?: string;
    radiusRatio: number;
    formatter: (args: { index: number; name: string; value: number; percentage: number; startAngle: number; sweepAngle: number }) => string;
  };
  radialLabel: {
    fontSize: number;
    fontColor: string;
    fontFamily?: string;
    fontWeight?: string;
    formatter: (args: { index: number; name: string; value: number; percentage: number; angle: number }) => string;
  };
  radialTick: {
    length: number;
    color: string;
    strokeWidth: number;
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
  radial: {
    visible: false,
    gap: 6,
  },
  dataLabel: {
    visible: true,
    fontSize: 12,
    fontColor: "white",
    fontWeight: "bold",
    radiusRatio: 0.65,
    formatter: (args) => `${args.percentage.toFixed(1)}%`,
  },
  radialLabel: {
    fontSize: 12,
    fontColor: "#333333",
    fontWeight: "500",
    formatter: (args) => args.name,
  },
  radialTick: {
    length: 20,
    color: "#999999",
    strokeWidth: 1,
  },
};
