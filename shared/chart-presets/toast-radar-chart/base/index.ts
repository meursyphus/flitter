import type { Widget } from "flitter-core";
import HeadlessRadarChart from "../../_flitter/headless/radar-chart";
import type { RadarChartCustom, RadarChartData, GetScaleFn } from "../../_flitter/headless/radar-chart";
import { Plot, DataView } from "./data-view";
import { Layout } from "./layout";
import { AngularAxis } from "./angular-axis";
import { RadialAxis } from "./radial-axis";

export type { RadarChartCustom, RadarChartData, RadarChartContext, RadarChartScale, RadarVertex } from "../../_flitter/headless/radar-chart";
export { RadarChartController } from "../../_flitter/headless/radar-chart";

const baseDefaults: Partial<RadarChartCustom> = {
	layout: Layout,
	plot: Plot,
	dataView: DataView,
	angularAxis: AngularAxis,
	radialAxis: RadialAxis,
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
