import type { Widget } from "flitter-core";
import { BasePieChart } from "./base";
import type { PieChartCustom, PieChartData } from "./base";
import { toastStyleConfig, type ToastPieChartConfig } from "./styles/toast";

export type { PieChartCustom, PieChartData, PieChartContext } from "./base";
export { PieChartController } from "./base";
export { type ToastPieChartConfig } from "./styles/toast";

export default function PieChart({
	config,
	data,
	custom,
}: {
	config?: Partial<ToastPieChartConfig>;
	data: PieChartData;
	custom?: Partial<PieChartCustom<ToastPieChartConfig>>;
}): Widget {
	return BasePieChart({
		data,
		config: toastStyleConfig.createConfig(config),
		custom: { ...toastStyleConfig.custom, ...custom },
	});
}
