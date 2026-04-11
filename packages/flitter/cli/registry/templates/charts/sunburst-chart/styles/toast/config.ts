import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";
import { formatSunburstValue } from "../../base/format";

type ToastSunburstSharedConfig = Pick<
	ToastBaseConfig,
	"colors" | "font" | "title" | "legend" | "padding" | "animation" | "tooltip"
>;

export type SunburstChartConfig = ToastSunburstSharedConfig & {
	sunburst: {
		innerRadiusRatio: number;
		strokeColor: string;
		strokeWidth: number;
		hoverBorderColor: string;
		hoverBorderWidth: number;
		hoverShadowColor: string;
		dimOpacity: number;
	};
	dataLabel: {
		visible: boolean;
		minArcLength: number;
		minRingWidth: number;
		minFontSize: number;
		maxFontSize: number;
		color: string;
		secondaryColor: string;
		fontFamily?: string;
		fontWeight?: string;
		formatter: (args: {
			label: string;
			value: number;
			depth: number;
			path: string[];
			branchLabel: string;
		}) => {
			label: string;
			value?: string;
		};
	};
};

export const defaultToastConfig: SunburstChartConfig = {
	colors: defaultToastBaseConfig.colors,
	font: defaultToastBaseConfig.font,
	title: defaultToastBaseConfig.title,
	legend: {
		...defaultToastBaseConfig.legend,
		visible: false,
		position: "right-top",
	},
	padding: defaultToastBaseConfig.padding,
	animation: defaultToastBaseConfig.animation,
	tooltip: defaultToastBaseConfig.tooltip,
	sunburst: {
		innerRadiusRatio: 0.18,
		strokeColor: "transparent",
		strokeWidth: 0,
		hoverBorderColor: "white",
		hoverBorderWidth: 4,
		hoverShadowColor: "rgba(0,0,0,0.30)",
		dimOpacity: 1,
	},
	dataLabel: {
		visible: true,
		minArcLength: 24,
		minRingWidth: 20,
		minFontSize: 8,
		maxFontSize: 13,
		color: "white",
		secondaryColor: "rgba(255,255,255,0.86)",
		fontWeight: "700",
		formatter: ({ label, value }) => ({
			label,
			value: formatSunburstValue(value),
		}),
	},
};
