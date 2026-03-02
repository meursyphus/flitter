import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { ToastRadarChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastDataset } from "./parts/dataset";
import { toastGrid } from "./parts/grid";
import { toastAxisLabel } from "./parts/axis-label";
import {
	toastTitle,
	toastLegend,
} from "@shared/styles/toast";

export { type ToastRadarChartConfig } from "./config";

const toastCustom: Partial<RadarChartCustom<ToastRadarChartConfig>> = {
	dataset: toastDataset,
	grid: toastGrid,
	axisLabel: toastAxisLabel,
	legend: (args, context) => toastLegend(args, context, { markerShape: "circle" }),
	title: toastTitle,
};

export const toastStyleConfig = {
	custom: toastCustom,
	createConfig: (config?: Partial<ToastRadarChartConfig>): ToastRadarChartConfig =>
		deepMerge(defaultToastConfig, config),
};
