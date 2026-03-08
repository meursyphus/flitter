import type { PieChartCustom } from "../../../_flitter/headless/pie-chart";
import type { ToastPieChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "../../../_flitter/shared/utils/index";
import { toastSlice } from "./parts/slice";
import { toastDataView } from "./parts/data-view";
import {
	toastTitle,
	toastLegend,
} from "../../../toast-base/index";

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
