import { GestureDetector } from "flitter-core";
import type { HeatmapCustom } from "@headless/heatmap-chart/types";
import type { ToastHeatmapChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastSegment } from "./parts/segment";
import { toastHeatmapLegend } from "./parts/legend";
import { DataView } from "../../base/data-view";
import {
	toastTitle,
	cartesian,
} from "@styles/toast";

export { type ToastHeatmapChartConfig } from "./config";

const toastCustom: Partial<HeatmapCustom<ToastHeatmapChartConfig>> = {
	layout: (args, ctx) =>
		cartesian.toastLayout(
			{ title: args.title, legends: [args.legend], plot: args.plot },
			ctx,
		),
	dataView: (args, ctx) =>
		GestureDetector({
			onMouseLeave: () => ctx.setHovered(null),
			child: DataView(args, ctx),
		}),
	segment: toastSegment,
	legend: toastHeatmapLegend,
	title: toastTitle,
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
	createConfig: (config?: Partial<ToastHeatmapChartConfig>): ToastHeatmapChartConfig =>
		deepMerge(defaultToastConfig, config),
};
