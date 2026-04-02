import {
	StatelessWidget,
	StatefulWidget,
	State,
	GlobalKey,
	type Widget,
	type BuildContext,
	SizedBox,
	GestureDetector,
} from "flitter-core";
import {
	createCartesianChart,
	getScaleLabels,
	resolveOverlayRect,
	type CartesianScaffoldBehavior,
} from "@headless/_shared/cartesian-scaffold";
import { CandlestickChartProvider } from "./provider";

type HoveredCandlestickRect = {
	index: number;
	legend: string;
	label: string;
	open: number;
	high: number;
	low: number;
	close: number;
	x: number;
	y: number;
	width: number;
	height: number;
};

class Candlestick extends StatefulWidget {
	index: number;
	datasetIndex: number;

	constructor({
		index,
		datasetIndex,
	}: {
		index: number;
		datasetIndex: number;
	}) {
		super(`${datasetIndex}:${index}`);
		this.index = index;
		this.datasetIndex = datasetIndex;
	}

	createState() {
		return new CandlestickState();
	}
}

class CandlestickState extends State<Candlestick> {
	anchorKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		const dataset = ctx.data.datasets[this.widget.datasetIndex];
		const point = dataset.data[this.widget.index];
		const index = this.widget.index;
		const legend = dataset.legend;
		const isHovered = ctx.isCandlestickHovered(index, legend);
		return GestureDetector({
			cursor: "default",
			key: this.anchorKey,
			onMouseEnter: () => ctx.hoverCandlestick(index, legend, this.anchorKey),
			onMouseLeave: () => ctx.unhoverCandlestick(index, legend),
			child: ctx.custom.candlestick(
				{
					open: point.open,
					high: point.high,
					low: point.low,
					close: point.close,
					label: ctx.data.labels[this.widget.index],
					index,
					legend,
					datasetIndex: this.widget.datasetIndex,
					isHovered,
				},
				ctx,
			),
		});
	}
}

const behavior: CartesianScaffoldBehavior<
	ReturnType<typeof CandlestickChartProvider.of>,
	HoveredCandlestickRect
> = {
	of: (context) => CandlestickChartProvider.of(context),
	buildLayout: (ctx, { title, plot, legends }) =>
		ctx.custom.layout({ title, plot, legends }, ctx),
	buildPlot: (ctx, { xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }) =>
		ctx.custom.plot(
			{
				xAxis,
				yAxis,
				dataView,
				grid,
				axisCorner,
				tooltipArea: tooltipArea ?? SizedBox.shrink(),
			},
			ctx,
		),
	getLegends: (ctx) =>
		ctx.legends.map((name, index) => ({
			name,
			index,
			onClick: () => ctx.toggleSeries(name),
		})),
	buildLegend: (ctx, { name, index }) =>
		ctx.custom.legend({ name, index, isVisible: ctx.isSeriesVisible(name) }, ctx),
	getXAxisLabels: (ctx) => ctx.data.labels,
	getYAxisLabels: (ctx) => getScaleLabels(ctx.scale),
	shouldRenderDataView: (ctx) => ctx.scale != null,
	buildDataView: (ctx) =>
		GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverAllCandlesticks(),
			child: ctx.custom.dataView(
				{
					candlestickGroups: Array.from(
						{ length: ctx.data.labels.length },
						(_, index) => ({
							label: ctx.data.labels[index],
							index,
							candlesticks: ctx.data.datasets.map(
								(_, datasetIndex) => new Candlestick({ index, datasetIndex }),
							),
						}),
					),
				},
				ctx,
			),
		}),
	tooltip: {
		resolveHovered: (ctx, overlayKey): HoveredCandlestickRect | null => {
			const hoveredCandlestick = ctx.hoveredCandlestick;
			if (hoveredCandlestick == null) return null;

			const dataset = ctx.data.datasets.find(
				(d) => d.legend === hoveredCandlestick.legend,
			);
			const point = dataset?.data[hoveredCandlestick.index];
			const rect = resolveOverlayRect(overlayKey, hoveredCandlestick.anchorKey);
			if (point == null || rect == null) return null;

			return {
				index: hoveredCandlestick.index,
				legend: hoveredCandlestick.legend,
				label: ctx.data.labels[hoveredCandlestick.index] ?? "",
				open: point.open,
				high: point.high,
				low: point.low,
				close: point.close,
				...rect,
			};
		},
		buildTooltip: (ctx, hoveredCandlestickRect) => {
			const isUp = hoveredCandlestickRect.close >= hoveredCandlestickRect.open;
			const color = isUp
				? ctx.config.candlestick.upColor
				: ctx.config.candlestick.downColor;
			const wickColor = ctx.config.candlestick.wickColor;
			return ctx.custom.tooltip(
				{
					label: hoveredCandlestickRect.label,
					items: [
						{
							legend: `${hoveredCandlestickRect.legend} open`,
							color,
							value: hoveredCandlestickRect.open,
						},
						{
							legend: `${hoveredCandlestickRect.legend} high`,
							color: wickColor,
							value: hoveredCandlestickRect.high,
						},
						{
							legend: `${hoveredCandlestickRect.legend} low`,
							color: wickColor,
							value: hoveredCandlestickRect.low,
						},
						{
							legend: `${hoveredCandlestickRect.legend} close`,
							color,
							value: hoveredCandlestickRect.close,
						},
					],
				},
				ctx,
			);
		},
		buildTooltipArea: (ctx, { tooltip, hovered }) =>
			ctx.custom.tooltipArea({ tooltip, hoveredCandlestick: hovered }, ctx),
	},
};

export default class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return createCartesianChart(behavior);
	}
}
