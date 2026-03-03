import type { PieChartCustom } from "@headless/pie-chart/types";
import type { ToastPieChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { toastSlice } from "./parts/slice";
import { toastDataView } from "./parts/data-view";
import {
	toastTitle,
	toastLegend,
} from "@styles/toast";

export { type ToastPieChartConfig } from "./config";

const toastCustom: Partial<PieChartCustom<ToastPieChartConfig>> = {
	slice: toastSlice,
	dataView: toastDataView,
	legend: (args, context) => toastLegend(args, context, { markerShape: "circle" }),
	title: toastTitle,
};

export const toastStyleConfig = {
	custom: toastCustom,
	createConfig: (config?: DeepPartial<ToastPieChartConfig>): ToastPieChartConfig =>
		deepMerge(defaultToastConfig, config),
};
