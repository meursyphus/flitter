import type { Widget } from "flitter-ui";
import { SizedBox } from "flitter-ui";
import { HeatmapChart as HeadlessHeatmapChart } from "flitter-ui/chart";
import type {
	HeatmapCustom,
	HeatmapData,
} from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { DataView } from "./data-view";

export type { HeatmapCustom, HeatmapData, HeatmapScale, HeatmapContext } from "flitter-ui/chart";
export { HeatmapController } from "flitter-ui/chart";

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

export function BaseHeatmapChart<TConfig extends object = object>({
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
