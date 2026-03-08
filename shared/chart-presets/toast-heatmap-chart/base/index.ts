import type { Widget } from "flitter-core";
import { SizedBox } from "flitter-core";
import HeadlessHeatmapChart from "../../_flitter/headless/heatmap-chart";
import type {
	HeatmapCustom,
	HeatmapData,
} from "../../_flitter/headless/heatmap-chart";
import * as Cartesian from "../../_flitter/shared/cartesian/index";
import { DataView } from "./data-view";

export type { HeatmapCustom, HeatmapData, HeatmapScale, HeatmapContext } from "../../_flitter/headless/heatmap-chart";
export { HeatmapController } from "../../_flitter/headless/heatmap-chart";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<HeatmapCustom> = {
	dataView: DataView,
	plot: (...args) =>
		Cartesian.Plot({
			xAxis: args[0].xAxis,
			yAxis: args[0].yAxis,
			dataView: args[0].dataView,
			grid: SizedBox.shrink(),
			axisCorner: args[0].axisCorner,
		}),
};

export function BaseHeatmapChart<TConfig = {}>({
	custom,
	...rest
}: {
	custom: Partial<HeatmapCustom<TConfig>>;
	data: HeatmapData;
	config?: TConfig;
}): Widget {
	return HeadlessHeatmapChart({
		...rest,
		custom: { ...baseDefaults, ...custom } as HeatmapCustom<TConfig>,
	});
}
