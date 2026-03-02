import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { ToastRadarChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastRadar } from "./parts/radar";
import { toastAngularAxisLine } from "./parts/angular-axis-line";
import { toastAngularAxisLabel } from "./parts/angular-axis-label";
import { toastRadialAxisLine } from "./parts/radial-axis-line";
import { toastRadialAxisLabel } from "./parts/radial-axis-label";
import {
	toastTitle,
	toastLegend,
} from "@styles/toast";

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
	createConfig: (config?: Partial<ToastRadarChartConfig>): ToastRadarChartConfig =>
		deepMerge(defaultToastConfig, config),
};
