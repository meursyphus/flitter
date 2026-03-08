import type { Widget } from "flitter-core";
import { BaseRadarChart } from "./base";
import type { RadarChartCustom, RadarChartData } from "./base";
import type { DeepPartial } from "flitter-ui/chart";
import { toastStyleConfig, type ToastRadarChartConfig } from "./styles/toast";

export type { RadarChartCustom, RadarChartData, RadarChartContext, RadarChartScale, RadarVertex } from "./base";
export { RadarChartController } from "./base";
export { type ToastRadarChartConfig } from "./styles/toast";

function defaultGetScale(data: RadarChartData) {
	const allValues = data.datasets.flatMap((d) => d.values);
	const maxValue = allValues.length > 0 ? Math.max(...allValues) : 100;

	// Round up to a nice number
	const rawStep = maxValue / 5;
	const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
	const step = Math.ceil(rawStep / magnitude) * magnitude;
	const max = step * 5;

	return { min: 0, max, step };
}

export default function RadarChart({
	config,
	data,
	custom,
}: {
	config?: DeepPartial<ToastRadarChartConfig>;
	data: RadarChartData;
	custom?: Partial<RadarChartCustom<ToastRadarChartConfig>>;
}): Widget {
	return BaseRadarChart({
		data,
		getScale: defaultGetScale,
		config: toastStyleConfig.createConfig(config),
		custom: { ...toastStyleConfig.custom, ...custom },
	});
}
