import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";

export type ToastPieChartConfig = ToastBaseConfig & {
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
		radiusRatio: number;
		formatter: (args: { index: number; name: string; value: number; percentage: number; startAngle: number; sweepAngle: number }) => string;
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
	dataLabel: {
		visible: true,
		fontSize: 14,
		fontColor: "white",
		fontWeight: "bold",
		radiusRatio: 0.65,
		formatter: (args) => `${args.percentage.toFixed(1)}%`,
	},
};
