import type { Widget } from "flitter-core";
import HeadlessRadarChart from "@headless/radar-chart";
import type { RadarChartCustom, RadarChartData, GetScaleFn } from "@headless/radar-chart/types";
import { Series } from "./series";
import { Layout } from "./layout";

export type { RadarChartCustom, RadarChartData, RadarChartContext, RadarChartScale, RadarVertex } from "@headless/radar-chart/types";
export { RadarChartController } from "@headless/radar-chart/controller";

const baseDefaults: Partial<RadarChartCustom> = {
	layout: Layout,
	series: Series,
};

export function BaseRadarChart<TConfig = {}>({
	custom,
	getScale,
	...rest
}: {
	custom: Partial<RadarChartCustom<TConfig>>;
	data: RadarChartData;
	getScale: GetScaleFn;
	config?: TConfig;
}): Widget {
	return HeadlessRadarChart({
		...rest,
		getScale,
		custom: { ...baseDefaults, ...custom } as RadarChartCustom<TConfig>,
	});
}
