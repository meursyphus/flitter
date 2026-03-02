import type { PieChartCustom } from "@headless/pie-chart/types";
import type { ToastPieChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastPie } from "./parts/pie";
import {
	toastTitle,
	toastLegend,
} from "@shared/styles/toast";

export { type ToastPieChartConfig } from "./config";

const toastCustom: Partial<PieChartCustom<ToastPieChartConfig>> = {
	pie: toastPie,
	legend: (args, context) => toastLegend(args, context, { markerShape: "circle" }),
	title: toastTitle,
};

export const toastStyleConfig = {
	custom: toastCustom,
	createConfig: (config?: Partial<ToastPieChartConfig>): ToastPieChartConfig =>
		deepMerge(defaultToastConfig, config),
};
