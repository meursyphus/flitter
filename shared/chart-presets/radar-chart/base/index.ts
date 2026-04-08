import { SizedBox, type Widget } from "flitter-core";
import { RadarChart as HeadlessRadarChart } from "flitter-ui/chart";
import type { RadarChartCustom, RadarChartData, RadarChartGetScaleFn as GetScaleFn } from "flitter-ui/chart";
import { DataView } from "./data-view";
import { Layout } from "./layout";
import { Plot } from "./plot";
import { RadialAxis } from "./radial-axis";
import { Web } from "./web";

export type {
	RadarChartCustom,
	RadarChartData,
	RadarChartContext,
	RadarChartScale,
	HoveredRadar,
	HoveredRadarPoint,
	AngularItem,
	RadialLabelItem,
	RadarVertex,
	RadarChartGetScaleFn as GetScaleFn,
} from "flitter-ui/chart";
export { RadarChartController } from "flitter-ui/chart";

const baseDefaults: Partial<RadarChartCustom<any>> = {
	layout: Layout as RadarChartCustom<any>["layout"],
	plot: Plot,
	dataView: DataView,
	radialAxis: RadialAxis,
	web: Web,
	radialAxisLabel: () => SizedBox.shrink(),
	tooltip: () => SizedBox.shrink(),
	tooltipArea: () => SizedBox.shrink(),
};

function defaultGetScale(data: RadarChartData) {
	const allValues = data.datasets.flatMap((d) => d.values);
	const maxValue = allValues.length > 0 ? Math.max(...allValues) : 100;

	const rawStep = maxValue / 5;
	const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
	const step = Math.ceil(rawStep / magnitude) * magnitude;
	const max = step * 5;

	return { min: 0, max, step };
}

export function BaseRadarChart<TConfig extends object = {}>({
	custom,
	getScale = defaultGetScale,
	...rest
}: {
	custom: Partial<RadarChartCustom<TConfig>>;
	data: RadarChartData;
	getScale?: GetScaleFn;
	config?: TConfig;
}): Widget {
	return HeadlessRadarChart({
		...rest,
		getScale,
		custom: { ...baseDefaults, ...custom } as RadarChartCustom<TConfig>,
	});
}
