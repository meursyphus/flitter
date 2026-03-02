import { type ToastBaseConfig, defaultToastBaseConfig } from "@shared/styles/toast";

export type ToastPieChartConfig = ToastBaseConfig & {
	pie: {
		strokeColor: string;
		strokeWidth: number;
		innerRadiusRatio: number;
	};
};

export const defaultToastConfig: ToastPieChartConfig = {
	...defaultToastBaseConfig,
	legend: { ...defaultToastBaseConfig.legend, position: "right-top" },
	padding: { top: 20, right: 20, bottom: 20, left: 20 },
	pie: {
		strokeColor: "white",
		strokeWidth: 2,
		innerRadiusRatio: 0,
	},
};
