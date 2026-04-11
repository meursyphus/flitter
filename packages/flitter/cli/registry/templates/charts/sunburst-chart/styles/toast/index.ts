import type { SunburstChartCustom } from "@headless/sunburst-chart/types";
import { deepMerge, type DeepPartial } from "@utils/index";
import { toastLegend, toastTitle, tooltipContent } from "@styles/toast";
import {
	toastPieLikeDataView,
	toastPieLikeTooltipArea,
} from "@styles/toast/polar-like";
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
		config: ctx.config,
	});
}

const toastCustom: Partial<SunburstChartCustom<SunburstChartConfig>> = {
	dataView: (args, context) => toastPieLikeDataView(args, context),
	segment: toastSegment,
	dataLabel: toastDataLabel,
	legend: (args, context) => toastLegend(args, context, { markerShape: "circle" }),
	title: (args, context) => toastTitle(args, context),
	tooltip: toastTooltip,
	tooltipArea: (args, context) => toastPieLikeTooltipArea(args, context),
};

export const styleConfig = {
	custom: toastCustom,
	createConfig: (config?: DeepPartial<SunburstChartConfig>): SunburstChartConfig =>
		deepMerge(defaultToastConfig, config),
};
