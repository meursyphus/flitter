import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_styles/toast/index";

type ToastTreemapSharedConfig = Pick<
	ToastBaseConfig,
	"colors" | "font" | "title" | "legend" | "padding" | "animation" | "tooltip"
>;

export type TreemapChartConfig = ToastTreemapSharedConfig & {
	treemap: {
		groupGap: number;
		nodeGap: number;
		dividerColor: string;
		groupTitle: {
			visible: boolean;
		};
		node: {
			minLabelWidth: number;
			minLabelHeight: number;
			labelColor: string;
			secondaryLabelColor: string;
			hoverBorderColor: string;
			hoverBorderWidth: number;
			hoverShadowColor: string;
			hoverScale: number;
		};
	};
};

export const defaultToastConfig: TreemapChartConfig = {
	colors: defaultToastBaseConfig.colors,
	font: defaultToastBaseConfig.font,
	title: defaultToastBaseConfig.title,
	legend: { ...defaultToastBaseConfig.legend, visible: false },
	padding: defaultToastBaseConfig.padding,
	animation: defaultToastBaseConfig.animation,
	tooltip: defaultToastBaseConfig.tooltip,
	treemap: {
		groupGap: 0,
		nodeGap: 0,
		dividerColor: "transparent",
		groupTitle: {
			visible: false,
		},
		node: {
			minLabelWidth: 72,
			minLabelHeight: 42,
			labelColor: "#ffffff",
			secondaryLabelColor: "rgba(255,255,255,0.86)",
			hoverBorderColor: "white",
			hoverBorderWidth: 4,
			hoverShadowColor: "rgba(0,0,0,0.3)",
			hoverScale: 1.02,
		},
	},
};
