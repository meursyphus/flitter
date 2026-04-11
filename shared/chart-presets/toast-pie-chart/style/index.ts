import type { HoveredPieChartSegment, PieChartCustom } from "flitter-ui/chart";
import type { ToastPieChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import {
	toastPieLikeDataLabel,
	toastPieLikeDataView,
	toastPieLikeRadialLabel,
	toastPieLikeRadialTick,
	toastPieLikeSegment,
	toastPieLikeTooltip,
	toastPieLikeTooltipArea,
} from "../../_shared/toast/polar-like";
import {
	toastTitle,
	toastLegend,
} from "../../_shared/toast/index";

export { type ToastPieChartConfig } from "./config";

const toastCustom: Partial<PieChartCustom<ToastPieChartConfig>> = {
	segment: (args, context) => toastPieLikeSegment(args, context),
	dataView: ({ segments }, context) => toastPieLikeDataView({ segments }, context),
	dataLabel: (args, context) => toastPieLikeDataLabel(args, context),
	radialLabel: (args, context) => toastPieLikeRadialLabel(args, context),
	radialTick: (args, context) => toastPieLikeRadialTick(args, context),
	legend: (args, context) => toastLegend(args, context, { markerShape: "circle" }),
	title: toastTitle,
	tooltip: (args, context) => toastTooltip(args, context),
	tooltipArea: ({ tooltip, hoveredSegment }, context) =>
		toastPieLikeTooltipArea({ tooltip, hoveredSegment }, context),
};

export const toastStyleConfig = {
	custom: toastCustom,
	createConfig: (config?: DeepPartial<ToastPieChartConfig>): ToastPieChartConfig =>
		deepMerge(defaultToastConfig, config),
};

function toastTooltip(
	args: HoveredPieChartSegment,
	context: { config: ToastPieChartConfig; legends: string[] },
) {
	return toastPieLikeTooltip(args, context);
}
