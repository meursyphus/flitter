import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

type AgTreemapSharedConfig = Pick<
	AgCartesianBaseConfig,
	"colors" | "font" | "title" | "subtitle" | "tooltip" | "legend" | "padding"
>;

export type TreemapChartConfig = AgTreemapSharedConfig & {
	treemap: {
		groupGap: number;
		nodeGap: number;
		groupTitle: {
			visible: boolean;
			fontSize: number;
			color: string;
			gap: number;
			padding: { horizontal: number; vertical: number };
		};
		node: {
			minLabelWidth: number;
			minLabelHeight: number;
			dimOpacity: number;
			labelColor: string;
			secondaryLabelColor: string;
			hoverShadowColor: string;
		};
	};
};

export const defaultAgConfig: TreemapChartConfig = {
	colors: defaultAgCartesianBaseConfig.colors,
	font: defaultAgCartesianBaseConfig.font,
	title: defaultAgCartesianBaseConfig.title,
	subtitle: defaultAgCartesianBaseConfig.subtitle,
	tooltip: defaultAgCartesianBaseConfig.tooltip,
	legend: { ...defaultAgCartesianBaseConfig.legend, visible: false },
	padding: defaultAgCartesianBaseConfig.padding,
	treemap: {
		groupGap: 8,
		nodeGap: 1,
		groupTitle: {
			visible: true,
			fontSize: 12,
			color: "#2f3a46",
			gap: 6,
			padding: { horizontal: 0, vertical: 0 },
		},
		node: {
			minLabelWidth: 72,
			minLabelHeight: 42,
			dimOpacity: 0.38,
			labelColor: "#ffffff",
			secondaryLabelColor: "rgba(255,255,255,0.84)",
			hoverShadowColor: "rgba(0,0,0,0.10)",
		},
	},
};
