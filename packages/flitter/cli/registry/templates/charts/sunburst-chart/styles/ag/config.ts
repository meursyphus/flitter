import {
	type AgCartesianBaseConfig,
	defaultAgCartesianBaseConfig,
} from "@styles/ag";
import { formatSunburstValue } from "../base/format";

type AgSunburstSharedConfig = Pick<
	AgCartesianBaseConfig,
	"background" | "colors" | "font" | "title" | "subtitle" | "legend" | "padding" | "tooltip"
>;

export type SunburstChartConfig = AgSunburstSharedConfig & {
	sunburst: {
		innerRadiusRatio: number;
		strokeColor: string;
		strokeWidth: number;
		hoverStrokeWidth: number;
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

export const defaultAgConfig: SunburstChartConfig = {
	background: defaultAgCartesianBaseConfig.background,
	colors: defaultAgCartesianBaseConfig.colors,
	font: defaultAgCartesianBaseConfig.font,
	title: defaultAgCartesianBaseConfig.title,
	subtitle: defaultAgCartesianBaseConfig.subtitle,
	legend: {
		...defaultAgCartesianBaseConfig.legend,
		visible: false,
		position: "right-top",
	},
	padding: { top: 24, right: 24, bottom: 24, left: 24 },
	tooltip: defaultAgCartesianBaseConfig.tooltip,
	sunburst: {
		innerRadiusRatio: 0.18,
		strokeColor: "white",
		strokeWidth: 1,
		hoverStrokeWidth: 2,
		hoverShadowColor: "rgba(0,0,0,0.20)",
		dimOpacity: 0.32,
	},
	dataLabel: {
		visible: true,
		minArcLength: 22,
		minRingWidth: 18,
		minFontSize: 8,
		maxFontSize: 12,
		color: "white",
		secondaryColor: "rgba(255,255,255,0.82)",
		fontWeight: "600",
		formatter: ({ label, value }) => ({
			label,
			value: formatSunburstValue(value),
		}),
	},
};
