import type { AgPieChartConfig } from "../../../pie-chart/styles/ag/config";
import { defaultAgConfig as defaultAgPieConfig } from "../../../pie-chart/styles/ag/config";
import type {
	DonutDataCenterFormatterArgs,
	DonutDataCenterFormatterResult,
	DonutDataCenterMode,
} from "../base/config";
import {
	clampRatio,
	resolveInnerRadiusRatioFromThicknessRatio,
} from "../base/config";

export type DonutChartConfig = AgPieChartConfig & {
  donut: {
    thicknessRatio: number;
  };
  dataCenter: {
    visible: boolean;
    mode: DonutDataCenterMode;
    gap: number;
    labelColor: string;
    labelFontSize: number;
    labelFontFamily?: string;
    labelFontWeight?: string;
    valueColor: string;
    valueFontSize: number;
    valueFontFamily?: string;
    valueFontWeight?: string;
    formatter: (args: DonutDataCenterFormatterArgs) => DonutDataCenterFormatterResult;
  };
};

export const defaultAgConfig: DonutChartConfig = {
  ...defaultAgPieConfig,
  legend: { ...defaultAgPieConfig.legend, visible: true, position: "bottom" },
  pie: { ...defaultAgPieConfig.pie, innerRadiusRatio: 0.6 },
  donut: {
    thicknessRatio: 0.4,
  },
  radial: {
    ...defaultAgPieConfig.radial,
    visible: true,
  },
  dataLabel: {
    ...defaultAgPieConfig.dataLabel,
    visible: false,
  },
  dataCenter: {
    visible: false,
    mode: "hovered-or-total",
    gap: 4,
    labelColor: "#6b7280",
    labelFontSize: 12,
    labelFontWeight: "500",
    valueColor: defaultAgPieConfig.title.color,
    valueFontSize: 24,
    valueFontWeight: "700",
    formatter: ({ total, hoveredSegment, mode }) => {
      const useHovered = hoveredSegment != null && mode !== "total";
      return {
        label: useHovered ? hoveredSegment?.name : "Total",
        value: String(useHovered ? hoveredSegment?.value ?? total : total),
      };
    },
  },
};

export function normalizeDonutAgConfig(config: DonutChartConfig): DonutChartConfig {
  const thicknessRatio = clampRatio(config.donut.thicknessRatio, defaultAgConfig.donut.thicknessRatio);
  return {
    ...config,
    donut: {
      ...config.donut,
      thicknessRatio,
    },
    pie: {
      ...config.pie,
      innerRadiusRatio: resolveInnerRadiusRatioFromThicknessRatio(thicknessRatio),
    },
  };
}
