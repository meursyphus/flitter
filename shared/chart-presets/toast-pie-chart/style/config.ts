import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_shared/toast/index";

export type ToastPieChartConfig = ToastBaseConfig & {
	pie: {
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

export const defaultToastConfig: ToastPieChartConfig = {
	...defaultToastBaseConfig,
	legend: { ...defaultToastBaseConfig.legend, position: "right-top" },
	padding: { top: 20, right: 20, bottom: 20, left: 20 },
	pie: {
		innerRadiusRatio: 0,
	},
	radial: {
		visible: false,
		gap: 8,
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
		fontSize: 13,
		fontColor: "#333333",
		fontWeight: "600",
		formatter: (args) => args.name,
	},
	radialTick: {
		length: 18,
		color: "#999999",
		strokeWidth: 1,
	},
};
