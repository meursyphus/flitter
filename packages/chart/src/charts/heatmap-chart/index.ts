import type { Widget } from "flitter-core";
import { BaseHeatmapChart } from "./base";
import type { HeatmapCustom, HeatmapData } from "./base";
import { toastStyleConfig, type ToastHeatmapChartConfig } from "./styles/toast";

export type { HeatmapCustom, HeatmapData, HeatmapContext } from "./base";
export { HeatmapController } from "./base";
export { type ToastHeatmapChartConfig } from "./styles/toast";

export default function HeatmapChart({
	config,
	data,
	custom,
}: {
	config?: Partial<ToastHeatmapChartConfig>;
	data: HeatmapData;
	custom?: Partial<HeatmapCustom<ToastHeatmapChartConfig>>;
}): Widget {
	return BaseHeatmapChart({
		data,
		config: toastStyleConfig.createConfig(config),
		custom: { ...toastStyleConfig.custom, ...custom },
	});
}
