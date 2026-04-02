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
import { BoxPlotChartProvider } from "./provider";
import type { BoxPlotDataPoint } from "./types";

type HoveredBoxPlotRect = {
	index: number;
	legend: string;
	label: string;
	kind: "boxPlot" | "outlier";
	value?: number;
	x: number;
	y: number;
	width: number;
	height: number;
};

class BoxPlotGroup extends StatelessWidget {
	#dataPoints: BoxPlotDataPoint[];
	#index: number;

	constructor({ dataPoints, index }: { dataPoints: BoxPlotDataPoint[]; index: number }) {
		super();
		this.#dataPoints = dataPoints;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);

		return ctx.custom.boxPlotGroup(
			{
				index: this.#index,
				label: ctx.data.labels[this.#index],
				dataPoints: this.#dataPoints,
				boxPlots: this.#dataPoints.map(
					(dataPoint, datasetIndex) => ({
						boxPlot: new BoxPlot({
							dataPoint,
							index: this.#index,
							legend: ctx.data.datasets[datasetIndex].legend,
							label: ctx.data.labels[this.#index],
							datasetIndex,
						}),
						outliers: (dataPoint.outliers ?? []).map(
							(value, outlierIndex) =>
								new Outlier({
									value,
									outlierIndex,
									index: this.#index,
									legend: ctx.data.datasets[datasetIndex].legend,
									label: ctx.data.labels[this.#index],
									datasetIndex,
								}),
						),
					}),
				),
			},
			ctx,
		);
	}
}

class BoxPlot extends StatefulWidget {
	dataPoint: BoxPlotDataPoint;
	index: number;
	legend: string;
	label: string;
	datasetIndex: number;

	constructor({
		dataPoint,
		index,
		legend,
		label,
		datasetIndex,
	}: {
		dataPoint: BoxPlotDataPoint;
		index: number;
		legend: string;
		label: string;
		datasetIndex: number;
	}) {
		super(`${datasetIndex}:${index}:boxPlot`);
		this.dataPoint = dataPoint;
		this.index = index;
		this.legend = legend;
		this.label = label;
		this.datasetIndex = datasetIndex;
	}

	createState() {
		return new BoxPlotState();
	}
}

class BoxPlotState extends State<BoxPlot> {
	anchorKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
		const { index, legend, dataPoint, label, datasetIndex } = this.widget;
		const isHovered = ctx.isBoxPlotHovered(index, legend);
		return GestureDetector({
			key: this.anchorKey,
			cursor: "default",
			onMouseEnter: () =>
				ctx.hoverBoxPlot(index, legend, {
					kind: "boxPlot",
					anchorKey: this.anchorKey,
				}),
			onMouseLeave: () =>
				ctx.unhoverBoxPlot({ index, legend, kind: "boxPlot" }),
			child: ctx.custom.boxPlot(
				{
					dataPoint,
					index,
					legend,
					label,
					datasetIndex,
					isHovered,
				},
				ctx,
			),
		});
	}
}

class Outlier extends StatefulWidget {
	value: number;
	outlierIndex: number;
	index: number;
	legend: string;
	label: string;
	datasetIndex: number;

	constructor(props: {
		value: number;
		outlierIndex: number;
		index: number;
		legend: string;
		label: string;
		datasetIndex: number;
	}) {
		super(`${props.datasetIndex}:${props.index}:outlier:${props.outlierIndex}`);
		this.value = props.value;
		this.outlierIndex = props.outlierIndex;
		this.index = props.index;
		this.legend = props.legend;
		this.label = props.label;
		this.datasetIndex = props.datasetIndex;
	}

	createState() {
		return new OutlierState();
	}
}

class OutlierState extends State<Outlier> {
	anchorKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
		const { index, legend, value, label, outlierIndex, datasetIndex } = this.widget;
		const isHovered = ctx.isBoxPlotHovered(index, legend);
		return GestureDetector({
			key: this.anchorKey,
			cursor: "default",
			onMouseEnter: () =>
				ctx.hoverBoxPlot(index, legend, {
					kind: "outlier",
					value,
					anchorKey: this.anchorKey,
				}),
			onMouseLeave: () =>
				ctx.unhoverBoxPlot({
					index,
					legend,
					kind: "outlier",
					value,
				}),
			child: ctx.custom.outlier(
				{
					value,
					outlierIndex,
					index,
					legend,
					label,
					datasetIndex,
					isHovered,
				},
				ctx,
			),
		});
	}
}

const behavior: CartesianScaffoldBehavior<
	ReturnType<typeof BoxPlotChartProvider.of>,
	HoveredBoxPlotRect
> = {
	of: (context) => BoxPlotChartProvider.of(context),
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
	getXAxisLabels: (ctx) =>
		ctx.direction === "vertical" ? ctx.data.labels : getScaleLabels(ctx.scale),
	getYAxisLabels: (ctx) =>
		ctx.direction === "vertical" ? getScaleLabels(ctx.scale) : ctx.data.labels,
	shouldRenderDataView: (ctx) => ctx.scale != null,
	buildDataView: (ctx) =>
		GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverBoxPlot(),
			child: ctx.custom.dataView(
				{
					boxPlotGroups: Array.from(
						{ length: ctx.data.labels.length },
						(_, index) =>
							new BoxPlotGroup({
								dataPoints: ctx.data.datasets.map(({ data }) => data[index]),
								index,
							}),
					),
				},
				ctx,
			),
		}),
	tooltip: {
		resolveHovered: (ctx, overlayKey): HoveredBoxPlotRect | null => {
			const hoveredBoxPlot = ctx.hoveredBoxPlot;
			if (hoveredBoxPlot == null) return null;

			const rect = resolveOverlayRect(overlayKey, hoveredBoxPlot.anchorKey);
			if (rect == null) return null;

			return {
				index: hoveredBoxPlot.index,
				legend: hoveredBoxPlot.legend,
				label: ctx.data.labels[hoveredBoxPlot.index] ?? "",
				kind: hoveredBoxPlot.kind,
				value: hoveredBoxPlot.value,
				...rect,
			};
		},
		buildTooltip: (ctx, hoveredBoxPlotRect) => {
			const fills =
				ctx.config?.colors?.fills ??
				ctx.config?.colors ??
				["#888"];
			const legendIndex = ctx.legends.indexOf(hoveredBoxPlotRect.legend);
			const color = fills[legendIndex % fills.length] ?? "#888";

			if (hoveredBoxPlotRect.kind === "outlier" && hoveredBoxPlotRect.value != null) {
				return ctx.custom.tooltip(
					{
						label: hoveredBoxPlotRect.label,
						items: [
							{
								legend: `${hoveredBoxPlotRect.legend} outlier`,
								color,
								value: hoveredBoxPlotRect.value,
							},
						],
					},
					ctx,
				);
			}

			const dataset = ctx.data.datasets.find(
				(d) => d.legend === hoveredBoxPlotRect.legend,
			);
			const point = dataset?.data[hoveredBoxPlotRect.index];
			if (point == null) return null;

			return ctx.custom.tooltip(
				{
					label: hoveredBoxPlotRect.label,
					items: [
						{ legend: `${hoveredBoxPlotRect.legend} min`, color: "#333", value: point.min },
						{ legend: `${hoveredBoxPlotRect.legend} q1`, color, value: point.q1 },
						{
							legend: `${hoveredBoxPlotRect.legend} median`,
							color: "#E74C3C",
							value: point.median,
						},
						{ legend: `${hoveredBoxPlotRect.legend} q3`, color, value: point.q3 },
						{ legend: `${hoveredBoxPlotRect.legend} max`, color: "#333", value: point.max },
					],
				},
				ctx,
			);
		},
		buildTooltipArea: (ctx, { tooltip, hovered }) =>
			ctx.custom.tooltipArea({ tooltip, hoveredBoxPlot: hovered }, ctx),
	},
};

export default class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return createCartesianChart(behavior);
	}
}
