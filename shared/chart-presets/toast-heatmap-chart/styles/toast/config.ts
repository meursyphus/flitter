import { type ToastBaseConfig, defaultToastBaseConfig } from "../../../toast-base/index";

export type ToastHeatmapChartConfig = ToastBaseConfig & {
	heatmap: {
		colorRange: [string, string, string];
		segment: { gap: number };
	};
};

export const defaultToastConfig: ToastHeatmapChartConfig = {
	...defaultToastBaseConfig,
	legend: { ...defaultToastBaseConfig.legend, position: "bottom" },
	padding: { top: 30, right: 20, bottom: 20, left: 60 },
	heatmap: {
		colorRange: ["#FDE68A", "#F97316", "#B91C1C"],
		segment: { gap: 0 },
	},
};
