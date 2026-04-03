import { Axis, Container, Flex, Flexible, SizedBox, type Widget } from "flitter-core";
import { HistogramChart as HeadlessHistogramChart } from "flitter-ui/chart";
import type {
	HistogramAggregation,
	HistogramBin,
	HistogramChartContext,
	HistogramChartCustom,
	HistogramChartData,
	HistogramChartScale,
	HistogramChartTransform,
} from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";

export type {
	HistogramAggregation,
	HistogramBin,
	HistogramChartContext,
	HistogramChartCustom,
	HistogramChartData,
	HistogramChartScale,
	HistogramChartTransform,
} from "flitter-ui/chart";
export { HistogramChartController } from "flitter-ui/chart";

export function DataView(
	...[{ bars }]: Parameters<HistogramChartCustom["dataView"]>
) {
	return Container({
		height: Infinity,
		width: Infinity,
		child: Flex({
			direction: Axis.horizontal,
			children: bars.map((bar) =>
				Flexible({
					flex: 1,
					child: bar,
				}),
			),
		}),
	});
}

export function Grid(
	...[{ xLine, yLine }, ctx]: Parameters<HistogramChartCustom["grid"]>
) {
	const scale = ctx.scale;
	return Cartesian.Grid({
		xLine,
		yLine,
		x: ctx.bins.length,
		y: scale ? (scale.max - scale.min) / scale.step : 0,
	});
}

const baseDefaults: Partial<HistogramChartCustom> = {
	dataView: DataView,
	plot: (...args) => Cartesian.Plot(args[0]),
	grid: Grid,
	dataLabel: () => SizedBox.shrink(),
	tooltip: () => SizedBox.shrink(),
	tooltipArea: () => SizedBox.shrink(),
};

export function BaseHistogramChart<TConfig = {}>({
	custom,
	...rest
}: {
	custom: Partial<HistogramChartCustom<TConfig>>;
	data: HistogramChartData;
	transform?: HistogramChartTransform;
	config?: TConfig;
}): Widget {
	return HeadlessHistogramChart({
		...rest,
		custom: { ...baseDefaults, ...custom } as HistogramChartCustom<TConfig>,
	});
}
