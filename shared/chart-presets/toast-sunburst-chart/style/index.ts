import type { SunburstChartCustom } from "flitter-ui/chart";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { toastLegend, toastTitle, tooltipContent } from "../../_styles/toast/index";
import {
	toastPieLikeDataView,
	toastPieLikeTooltipArea,
} from "../../_styles/toast/polar-like";
import type { SunburstChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { toastDataLabel } from "./parts/data-label";
import { toastSegment } from "./parts/segment";

export { type SunburstChartConfig } from "./config";

function toastTooltip(
	...[args, ctx]: Parameters<SunburstChartCustom<SunburstChartConfig>["tooltip"]>
) {
	const color =
		ctx.config.colors[args.branchIndex % ctx.config.colors.length] ?? "";

	return tooltipContent({
		label: args.pathLabels.join(" / "),
		items: {
			legend: args.branchLabel,
			color,
			value: args.value,
		},
		config: ctx.config as any,
	});
}

const toastCustom: Partial<SunburstChartCustom<SunburstChartConfig>> = {
	dataView: (args, context) => toastPieLikeDataView(args as any, context as any),
	segment: toastSegment,
	dataLabel: toastDataLabel,
	legend: (args, context) => toastLegend(args, context as any, { markerShape: "circle" }),
	title: toastTitle as SunburstChartCustom<SunburstChartConfig>["title"],
	tooltip: toastTooltip,
	tooltipArea: (args, context) => toastPieLikeTooltipArea(args as any, context as any),
};

export const styleConfig = {
	custom: toastCustom,
	createConfig: (config?: DeepPartial<SunburstChartConfig>): SunburstChartConfig =>
		deepMerge(defaultToastConfig, config),
};
