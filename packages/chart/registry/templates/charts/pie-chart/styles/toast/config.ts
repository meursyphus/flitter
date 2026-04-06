import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";

export type ToastPieChartConfig = ToastBaseConfig & {
	pie: {
		strokeColor: string;
		strokeWidth: number;
		innerRadiusRatio: number;
	};
	radial: {
		visible: boolean;
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
		nameColor: string;
		formatter: (args: { index: number; name: string; value: number; percentage: number; angle: number }) => string;
	};
	radialTick: {
		length: number;
		color: string;
		strokeWidth: number;
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
	radial: {
		visible: false,
	},
	dataLabel: {
		visible: true,
		fontSize: 14,
		fontColor: "white",
		fontWeight: "bold",
		radiusRatio: 0.65,
		formatter: (args) => `${args.percentage.toFixed(1)}%`,
	},
	radialLabel: {
		fontSize: 12,
		fontColor: "#333333",
		fontWeight: "bold",
		nameColor: "#666666",
		formatter: (args) => String(args.value),
	},
	radialTick: {
		length: 16,
		color: "#999999",
		strokeWidth: 1,
	},
};
