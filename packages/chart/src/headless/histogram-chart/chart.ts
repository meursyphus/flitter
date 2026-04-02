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
import { HistogramChartProvider } from "./provider";

type HoveredBinRect = {
	index: number;
	binMin: number;
	binMax: number;
	count: number;
	label: string;
	x: number;
	y: number;
	width: number;
	height: number;
};

class Bar extends StatefulWidget {
	binMin: number;
	binMax: number;
	count: number;
	index: number;

	constructor(props: { binMin: number; binMax: number; count: number; index: number }) {
		super(`${props.index}`);
		this.binMin = props.binMin;
		this.binMax = props.binMax;
		this.count = props.count;
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
		const { index, binMin, binMax, count } = this.widget;
		const isHovered = ctx.isBinHovered(index);
		return GestureDetector({
			key: this.anchorKey,
			cursor: "default",
			onMouseEnter: () => ctx.hoverBin(index, this.anchorKey),
			onMouseLeave: () => ctx.unhoverBin(index),
			child: ctx.custom.bar(
				{
					binMin,
					binMax,
					count,
					index,
					isHovered,
				},
				ctx,
			),
		});
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
	getXAxisLabels: (ctx) => ctx.bins.map((bin) => bin.label),
	getYAxisLabels: (ctx) => getScaleLabels(ctx.scale),
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
								binMin: bin.min,
								binMax: bin.max,
								count: bin.count,
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
				binMin: bin.min,
				binMax: bin.max,
				count: bin.count,
				label: `${bin.min.toFixed(1)} - ${bin.max.toFixed(1)}`,
				...rect,
			};
		},
		buildTooltip: (ctx, hoveredBinRect) => {
			const colors =
				ctx.config?.colors?.fills ??
				ctx.config?.colors ??
				["#888"];
			return ctx.custom.tooltip(
				{
					label: hoveredBinRect.label,
					items: [
						{
							legend: "Count",
							color: colors[0] ?? "#888",
							value: hoveredBinRect.count,
						},
					],
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
