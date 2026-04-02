import type { HeatmapCustom } from "flitter-ui/chart";
import type { ToastHeatmapChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { toastSegment } from "./parts/segment";
import { toastHeatmapLegend } from "./parts/legend";
import { toastTooltipArea } from "./parts/tooltip-area";
import { DataView } from "../base/data-view";
import {
	toastTitle,
	tooltipContent,
	cartesian,
} from "../../_styles/toast/index";
import type { HeatmapContext } from "flitter-ui/chart";
import type { Widget } from "flitter-core";
import { interpolateColor } from "./parts/segment";

export { type ToastHeatmapChartConfig } from "./config";

function toastTooltipContent(
	args: { label: string; items: { legend: string; color: string; value: number }[] },
	context: HeatmapContext<ToastHeatmapChartConfig>,
): Widget {
	const hoveredSegment = context.hoveredSegment;
	const item = args.items[0];
	if (hoveredSegment == null || item == null) {
		return tooltipContent({ label: args.label, items: args.items, config: context.config });
	}

	const { min, max } = context.scale;
	const range = max - min;
	const fraction = range === 0 ? 0.5 : (hoveredSegment.value - min) / range;
	const color = interpolateColor(context.config.heatmap.colorRange, fraction);
	return tooltipContent({
		label: `${hoveredSegment.xLabel}, ${hoveredSegment.yLabel}`,
		items: [{ legend: item.legend, color, value: hoveredSegment.value }],
		config: context.config,
	});
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
	tooltipArea: toastTooltipArea,
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
