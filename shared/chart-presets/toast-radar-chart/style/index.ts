import type { RadarChartCustom } from "flitter-ui/chart";
import type { ToastRadarChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { toastRadar } from "./parts/radar";
import { toastAngularAxisLine } from "./parts/angular-axis-line";
import { toastAngularAxisLabel } from "./parts/angular-axis-label";
import { toastRadialAxisLine } from "./parts/radial-axis-line";
import { toastRadialAxisLabel } from "./parts/radial-axis-label";
import {
	toastTitle,
	toastLegend,
} from "../../_styles/toast/index";

export { type ToastRadarChartConfig } from "./config";

const toastCustom: Partial<RadarChartCustom<ToastRadarChartConfig>> = {
	radar: toastRadar,
	angularAxisLine: toastAngularAxisLine,
	angularAxisLabel: toastAngularAxisLabel,
	radialAxisLine: toastRadialAxisLine,
	radialAxisLabel: toastRadialAxisLabel,
	legend: (args, context) => toastLegend(args, context, { markerShape: "circle" }),
	title: toastTitle,
};

export const toastStyleConfig = {
	custom: toastCustom,
	createConfig: (config?: DeepPartial<ToastRadarChartConfig>): ToastRadarChartConfig =>
		deepMerge(defaultToastConfig, config),
};
