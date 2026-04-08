import type { ToastPieChartConfig } from "../../toast-pie-chart/style/config";
import { defaultToastConfig as defaultToastPieConfig } from "../../toast-pie-chart/style/config";
import type {
	DonutDataCenterFormatterArgs,
	DonutDataCenterFormatterResult,
	DonutDataCenterMode,
} from "../base/config";
import {
	clampRatio,
	resolveInnerRadiusRatioFromThicknessRatio,
} from "../base/config";

export type DonutChartConfig = ToastPieChartConfig & {
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

export const defaultToastConfig: DonutChartConfig = {
  ...defaultToastPieConfig,
  pie: { ...defaultToastPieConfig.pie, innerRadiusRatio: 0.6 },
  donut: {
    thicknessRatio: 0.4,
  },
  dataLabel: {
    ...defaultToastPieConfig.dataLabel,
    visible: false,
  },
  dataCenter: {
    visible: false,
    mode: "hovered-or-total",
    gap: 2,
    labelColor: "#9ca3af",
    labelFontSize: 11,
    labelFontWeight: "600",
    valueColor: "#111827",
    valueFontSize: 22,
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

export function normalizeDonutToastConfig(config: DonutChartConfig): DonutChartConfig {
  const thicknessRatio = clampRatio(config.donut.thicknessRatio, defaultToastConfig.donut.thicknessRatio);
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
