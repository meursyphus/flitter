import type { RadarChartCustom } from "flitter-ui/chart";
import type { RadarChartContext } from "flitter-ui/chart";
import type { Widget } from "flitter-core";
import type { ToastRadarChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { toastRadar } from "./parts/radar";
import { toastPlot } from "./parts/plot";
import { toastTooltipArea } from "./parts/tooltip-area";
import { toastAngularAxisLine } from "./parts/angular-axis-line";
import { toastAngularAxisLabel } from "./parts/angular-axis-label";
import { toastRadialAxis } from "./parts/radial-axis";
import { toastRadialAxisLine } from "./parts/radial-axis-line";
import { toastRadialAxisLabel } from "./parts/radial-axis-label";
import {
	toastTitle,
	toastLegend,
	tooltipContent,
} from "../../_styles/toast/index";

export { type ToastRadarChartConfig } from "./config";

function toastTooltip(
	args: { label: string; items: { legend: string; color: string; value: number }[] },
	context: RadarChartContext<ToastRadarChartConfig>,
): Widget {
	return tooltipContent({ label: args.label, items: args.items, config: context.config });
}

const toastCustom: Partial<RadarChartCustom<ToastRadarChartConfig>> = {
	plot: toastPlot,
	radar: toastRadar,
	angularLine: toastAngularAxisLine,
	angularAxisLabel: toastAngularAxisLabel,
	radialAxis: toastRadialAxis,
	radialLine: toastRadialAxisLine,
	radialAxisLabel: toastRadialAxisLabel,
	tooltipArea: toastTooltipArea,
	tooltip: toastTooltip,
	legend: (args, context) => toastLegend(args, context, { markerShape: "circle" }),
	title: toastTitle,
};

export const toastStyleConfig = {
	custom: toastCustom,
	createConfig: (config?: DeepPartial<ToastRadarChartConfig>): ToastRadarChartConfig =>
		deepMerge(defaultToastConfig, config),
};
