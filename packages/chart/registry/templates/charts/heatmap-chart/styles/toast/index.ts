import type { HeatmapCustom } from "@headless/heatmap-chart/types";
import type { ToastHeatmapChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { toastSegment } from "./parts/segment";
import { toastHeatmapLegend } from "./parts/legend";
import { DataView } from "../../base/data-view";
import {
	toastTitle,
	tooltipContent,
	cartesian,
} from "@styles/toast";
import type { HeatmapContext } from "@headless/heatmap-chart/types";
import type { Widget } from "flitter-core";

export { type ToastHeatmapChartConfig } from "./config";

function toastTooltipContent(
	args: { label: string; items: { legend: string; color: string; value: number }[] },
	context: HeatmapContext<ToastHeatmapChartConfig>,
): Widget {
	return tooltipContent({ label: args.label, items: args.items, config: context.config });
}

const toastCustom: Partial<HeatmapCustom<ToastHeatmapChartConfig>> = {
	layout: (args, ctx) =>
		cartesian.toastLayout(
			{ title: args.title, legends: [args.legend], plot: args.plot },
			ctx,
		),
	dataView: DataView,
	segment: toastSegment,
	legend: toastHeatmapLegend,
	title: toastTitle,
	tooltip: toastTooltipContent,
	axisCorner: cartesian.toastAxisCorner,
	xAxisLabel: cartesian.toastXAxisLabel,
	yAxisLabel: cartesian.toastYAxisLabel,
	xAxisTick: cartesian.toastXAxisTick,
	yAxisTick: cartesian.toastYAxisTick,
	xAxisLine: cartesian.toastXAxisLine,
	yAxisLine: cartesian.toastYAxisLine,
	xAxis: (args, context) =>
		cartesian.toastXAxis(args, { type: "label" }, context),
	yAxis: (args, context) =>
		cartesian.toastYAxis(args, { type: "label" }, context),
};

export const toastStyleConfig = {
	custom: toastCustom,
	createConfig: (config?: DeepPartial<ToastHeatmapChartConfig>): ToastHeatmapChartConfig =>
		deepMerge(defaultToastConfig, config),
};
