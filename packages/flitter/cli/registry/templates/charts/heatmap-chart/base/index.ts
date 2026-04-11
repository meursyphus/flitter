import type { Widget } from "flitter-core";
import { SizedBox } from "flitter-core";
import HeadlessHeatmapChart from "@headless/heatmap-chart";
import type {
	HeatmapCustom,
	HeatmapData,
} from "@headless/heatmap-chart/types";
import * as Cartesian from "@shared/cartesian/index";
import { DataView } from "./data-view";

export type { HeatmapCustom, HeatmapData, HeatmapScale, HeatmapContext } from "@headless/heatmap-chart/types";
export { HeatmapController } from "@headless/heatmap-chart/controller";

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
			tooltipArea: args[0].tooltipArea,
		}),
	tooltip: () => SizedBox.shrink(),
	tooltipArea: () => SizedBox.shrink(),
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
