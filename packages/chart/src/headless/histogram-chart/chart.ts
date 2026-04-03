import {
	Alignment,
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
	resolveOverlayRect,
	type CartesianScaffoldBehavior,
} from "@headless/_shared/cartesian-scaffold";
import { HistogramChartProvider } from "./provider";
import type { HistogramAggregation, HistogramBin } from "./types";

type HoveredBinRect = HistogramBin & {
	index: number;
	x: number;
	y: number;
	width: number;
	height: number;
};

function getAggregationLabel(aggregation: HistogramAggregation): string {
	switch (aggregation) {
		case "count":
			return "Count";
		case "density":
			return "Density";
		case "sum":
			return "Sum";
		case "mean":
			return "Mean";
		case "min":
			return "Min";
		case "max":
			return "Max";
	}
}

function formatScaleLabel(value: number): string {
	if (Number.isInteger(value)) return value.toString();

	const abs = Math.abs(value);
	if (abs >= 100) return value.toFixed(0);
	if (abs >= 10) return value.toFixed(1).replace(/\.0$/, "");
	if (abs >= 1) return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
	return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function getYAxisScaleLabels(scale: { min: number; max: number; step: number } | null) {
	if (scale == null) return [];

	const labels: string[] = [];
	for (let index = 0; index <= (scale.max - scale.min) / scale.step; index += 1) {
		labels.push(formatScaleLabel(scale.min + scale.step * index));
	}

	return labels;
}

function getXAxisBoundaryLabels(bins: HistogramBin[]): string[] {
	if (bins.length === 0) return [];

	return [bins[0].min, ...bins.map((bin) => bin.max)].map((value) =>
		formatScaleLabel(value),
	);
}

function getTooltipItems(
	bin: HistogramBin,
	aggregation: HistogramAggregation,
	color: string,
): { legend: string; color: string; value: number }[] {
	const items = [
		{
			legend: getAggregationLabel(aggregation),
			color,
			value: bin.value,
		},
	];

	if (aggregation !== "count") {
		items.push({
			legend: "Count",
			color: "#64748b",
			value: bin.count,
		});
	}

	return items;
}

class Bar extends StatefulWidget {
	bin: HistogramBin;
	index: number;

	constructor(props: { bin: HistogramBin; index: number }) {
		super(`${props.index}`);
		this.bin = props.bin;
		this.index = props.index;
	}

	createState() {
		return new BarState();
	}
}

class BarState extends State<Bar> {
	anchorKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		const { bin, index } = this.widget;
		const isHovered = ctx.isBinHovered(index);
		const scale = ctx.scale;
		const ratio =
			scale && scale.max > scale.min
				? (bin.value - scale.min) / (scale.max - scale.min)
				: 0;
		const bar = GestureDetector({
			key: this.anchorKey,
			cursor: "default",
			onMouseEnter: () => ctx.hoverBin(index, this.anchorKey),
			onMouseLeave: () => ctx.unhoverBin(index),
			child: ctx.custom.bar(
				{
					bin,
					index,
					isHovered,
				},
				ctx,
			),
		});

		return ctx.custom.barBox(
			{
				bar,
				bin,
				index,
				ratio: Math.max(0, Math.min(1, ratio)),
				alignment: Alignment.bottomCenter,
				isHovered,
			},
			ctx,
		);
	}
}

const behavior: CartesianScaffoldBehavior<
	ReturnType<typeof HistogramChartProvider.of>,
	HoveredBinRect
> = {
	of: (context) => HistogramChartProvider.of(context),
	buildLayout: (ctx, { title, plot }) => ctx.custom.layout({ title, plot }, ctx),
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
	getXAxisLabels: (ctx) => getXAxisBoundaryLabels(ctx.bins),
	getYAxisLabels: (ctx) => getYAxisScaleLabels(ctx.scale),
	shouldRenderDataView: (ctx) => ctx.scale != null,
	buildDataView: (ctx) =>
		GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverAllBins(),
			child: ctx.custom.dataView(
				{
					bars: ctx.bins.map(
						(bin, index) =>
							new Bar({
								bin,
								index,
							}),
					),
				},
				ctx,
			),
		}),
	tooltip: {
		resolveHovered: (ctx, overlayKey): HoveredBinRect | null => {
			const hoveredBin = ctx.hoveredBin;
			if (hoveredBin == null) return null;

			const bin = ctx.bins[hoveredBin.index];
			const rect = resolveOverlayRect(overlayKey, hoveredBin.anchorKey);
			if (bin == null || rect == null) return null;

			return {
				index: hoveredBin.index,
				...bin,
				...rect,
			};
		},
		buildTooltip: (ctx, hoveredBinRect) => {
			const colors =
				ctx.config?.colors?.fills ??
				ctx.config?.colors ??
				["#888"];
			const color = colors[0] ?? "#888";
			return ctx.custom.tooltip(
				{
					label: hoveredBinRect.label,
					items: getTooltipItems(hoveredBinRect, ctx.aggregation, color),
				},
				ctx,
			);
		},
		buildTooltipArea: (ctx, { tooltip, hovered }) =>
			ctx.custom.tooltipArea({ tooltip, hoveredBin: hovered }, ctx),
	},
};

export default class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return createCartesianChart(behavior);
	}
}
