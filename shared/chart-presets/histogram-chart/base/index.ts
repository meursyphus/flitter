import {
	Axis,
	Container,
	Flex,
	Flexible,
	FractionallySizedBox,
	SizedBox,
	type Widget,
} from "flitterjs";
import { HistogramChart as HeadlessHistogramChart } from "@flitterjs/chart";
import type {
	HistogramAggregation,
	HistogramBin,
	HistogramChartContext,
	HistogramChartCustom,
	HistogramChartData,
	HistogramChartScale,
	HistogramChartTransform,
} from "@flitterjs/chart";
import * as Cartesian from "@flitterjs/chart";

export type {
	HistogramAggregation,
	HistogramBin,
	HistogramChartContext,
	HistogramChartCustom,
	HistogramChartData,
	HistogramChartScale,
	HistogramChartTransform,
} from "@flitterjs/chart";
export { HistogramChartController } from "@flitterjs/chart";

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

export function BarBox(
	...[{ bar, ratio, alignment }]: Parameters<HistogramChartCustom["barBox"]>
) {
	return Container({
		width: Infinity,
		height: Infinity,
		alignment,
		child: FractionallySizedBox({
			heightFactor: ratio,
			child: bar,
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
	barBox: BarBox,
	plot: (...args) => Cartesian.Plot(args[0]),
	grid: Grid,
	dataLabel: () => SizedBox.shrink(),
	tooltip: () => SizedBox.shrink(),
	tooltipArea: () => SizedBox.shrink(),
};

export function BaseHistogramChart<TConfig extends object = object>({
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
