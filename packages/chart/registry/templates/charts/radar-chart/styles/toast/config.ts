import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";

export type ToastRadarChartConfig = ToastBaseConfig & {
	radar: {
		fillOpacity: number;
		strokeWidth: number;
		gridColor: string;
		gridWidth: number;
		axisColor: string;
		axisWidth: number;
		/** Margin around the radar plot area for axis labels */
		labelMargin: number;
		/** Chip behind the radial (value) tick labels */
		tickLabelBackground: string;
		tickLabelBorderColor: string;
	};
};

export const defaultToastConfig: ToastRadarChartConfig = {
	...defaultToastBaseConfig,
	legend: { ...defaultToastBaseConfig.legend, position: "right-top" },
	padding: { top: 20, right: 20, bottom: 20, left: 20 },
	radar: {
		fillOpacity: 0.3,
		strokeWidth: 2,
		gridColor: "rgba(0, 0, 0, 0.1)",
		gridWidth: 1,
		axisColor: "rgba(0, 0, 0, 0.1)",
		axisWidth: 1,
		labelMargin: 5,
		tickLabelBackground: "#f3f4f6",
		tickLabelBorderColor: "rgba(0, 0, 0, 0.08)",
	},
};
