import type { HoveredPieSlice, PieChartCustom } from "flitter-ui/chart";
import type { ToastPieChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { toastSlice } from "./parts/slice";
import { toastDataView } from "./parts/data-view";
import { toastDataLabel } from "./parts/data-label";
import { toastRadialLabel } from "./parts/radial-label";
import { toastRadialTick } from "./parts/radial-tick";
import { toastTooltipArea } from "./parts/tooltip-area";
import {
	toastTitle,
	toastLegend,
	tooltipContent,
} from "../../_styles/toast/index";

export { type ToastPieChartConfig } from "./config";

const toastCustom: Partial<PieChartCustom<ToastPieChartConfig>> = {
	slice: toastSlice,
	dataView: toastDataView,
	dataLabel: toastDataLabel,
	radialLabel: toastRadialLabel,
	radialTick: toastRadialTick,
	legend: (args, context) => toastLegend(args, context, { markerShape: "circle" }),
	title: toastTitle,
	tooltip: (args, context) => toastTooltip(args, context),
	tooltipArea: toastTooltipArea,
};

export const toastStyleConfig = {
	custom: toastCustom,
	createConfig: (config?: DeepPartial<ToastPieChartConfig>): ToastPieChartConfig =>
		deepMerge(defaultToastConfig, config),
};

function toastTooltip(
	args: HoveredPieSlice,
	context: { config: ToastPieChartConfig; legends: string[] },
) {
	const colorIndex = context.legends.indexOf(args.name);
	const color =
		context.config.colors[
			(colorIndex >= 0 ? colorIndex : args.index) % context.config.colors.length
		];

	return tooltipContent({
		label: args.name,
		items: {
			legend: args.name,
			color,
			value: args.value,
		},
		config: context.config,
	});
}
