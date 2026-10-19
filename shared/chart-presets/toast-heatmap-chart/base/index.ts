import type { Widget } from "flitterjs";
import { SizedBox } from "flitterjs";
import { HeatmapChart as HeadlessHeatmapChart } from "@flitterjs/chart";
import type {
	HeatmapCustom,
	HeatmapData,
} from "@flitterjs/chart";
import * as Cartesian from "@flitterjs/chart";
import { DataView } from "./data-view";

export type { HeatmapCustom, HeatmapData, HeatmapScale, HeatmapContext } from "@flitterjs/chart";
export { HeatmapController } from "@flitterjs/chart";

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
