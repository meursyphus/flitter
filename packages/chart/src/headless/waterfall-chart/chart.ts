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
import { WaterfallChartProvider } from "./provider";
import type { WaterfallBarType } from "./types";

const TYPE_LABEL: Record<WaterfallBarType, string> = {
	increase: "Increase",
	decrease: "Decrease",
	total: "Total",
	subtotal: "Subtotal",
};

type HoveredWaterfallBarRect = {
	index: number;
	label: string;
	value: number;
	cumulative: number;
	type: WaterfallBarType;
	x: number;
	y: number;
	width: number;
	height: number;
};

class Bar extends StatefulWidget {
	value: number;
	cumulative: number;
	index: number;
	label: string;
	type: WaterfallBarType;

	constructor({
		value,
		cumulative,
		index,
		label,
		type,
	}: {
		value: number;
		cumulative: number;
		index: number;
		label: string;
		type: WaterfallBarType;
	}) {
		super(`${index}`);
		this.value = value;
		this.cumulative = cumulative;
		this.index = index;
		this.label = label;
		this.type = type;
	}

	createState() {
		return new BarState();
	}
}

class BarState extends State<Bar> {
	anchorKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		const { index, value, cumulative, label, type } = this.widget;
		const isHovered = ctx.isBarHovered(index);
		return GestureDetector({
			cursor: "default",
			key: this.anchorKey,
			onMouseEnter: () => ctx.hoverBar(index, this.anchorKey),
			onMouseLeave: () => ctx.unhoverBar(index),
			child: ctx.custom.bar(
				{
					value,
					cumulative,
					index,
					label,
					type,
					isHovered,
				},
				ctx,
			),
		});
	}
}

class Connector extends StatelessWidget {
	#fromCumulative: number;
	#toCumulative: number;
	#index: number;

	constructor({
		fromCumulative,
		toCumulative,
		index,
	}: {
		fromCumulative: number;
		toCumulative: number;
		index: number;
	}) {
		super();
		this.#fromCumulative = fromCumulative;
		this.#toCumulative = toCumulative;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.connector(
			{
				fromCumulative: this.#fromCumulative,
				toCumulative: this.#toCumulative,
				index: this.#index,
			},
			ctx,
		);
	}
}

const behavior: CartesianScaffoldBehavior<
	ReturnType<typeof WaterfallChartProvider.of>,
	HoveredWaterfallBarRect
> = {
	of: (context) => WaterfallChartProvider.of(context),
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
	getLegends: () => [
		{ name: "Increase", index: 0 },
		{ name: "Decrease", index: 1 },
		{ name: "Total", index: 2 },
	],
	buildLegend: (ctx, { name, index }) =>
		ctx.custom.legend({ name, index, isVisible: true }, ctx),
	getXAxisLabels: (ctx) => ctx.data.labels,
	getYAxisLabels: (ctx) => getScaleLabels(ctx.scale),
	shouldRenderDataView: (ctx) => ctx.scale != null,
	buildDataView: (ctx) => {
		const bars = ctx.data.values.map(
			(value, index) =>
				new Bar({
					value,
					cumulative: ctx.cumulativeValues[index],
					index,
					label: ctx.data.labels[index],
					type: ctx.types[index],
				}),
		);

		const connectors: Widget[] = [];
		for (let index = 0; index < ctx.data.values.length - 1; index++) {
			connectors.push(
				new Connector({
					fromCumulative: ctx.cumulativeValues[index],
					toCumulative: ctx.cumulativeValues[index + 1],
					index,
				}),
			);
		}

		return GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverAllBars(),
			child: ctx.custom.dataView({ bars, connectors }, ctx),
		});
	},
	tooltip: {
		resolveHovered: (ctx, overlayKey): HoveredWaterfallBarRect | null => {
			const hoveredBar = ctx.hoveredBar;
			if (hoveredBar == null) return null;

			const rect = resolveOverlayRect(overlayKey, hoveredBar.anchorKey);
			const index = hoveredBar.index;
			if (rect == null) return null;

			return {
				index,
				label: ctx.data.labels[index] ?? "",
				value: ctx.data.values[index] ?? 0,
				cumulative: ctx.cumulativeValues[index] ?? 0,
				type: ctx.types[index],
				...rect,
			};
		},
		buildTooltip: (ctx, hoveredBarRect) => {
			const palette =
				ctx.config?.colors?.fills ??
				ctx.config?.colors ??
				["#888"];
			const color =
				palette[
					hoveredBarRect.type === "increase"
						? 0
						: hoveredBarRect.type === "decrease"
							? 1
							: 2
				] ??
				palette[0] ??
				"#888";
			return ctx.custom.tooltip(
				{
					label: hoveredBarRect.label,
					items: [
						{
							legend: TYPE_LABEL[hoveredBarRect.type],
							color,
							value: hoveredBarRect.value,
						},
						{
							legend: "Cumulative",
							color: ctx.config.axis.color,
							value: hoveredBarRect.cumulative,
						},
					],
				},
				ctx,
			);
		},
		buildTooltipArea: (ctx, { tooltip, hovered }) =>
			ctx.custom.tooltipArea({ tooltip, hoveredBar: hovered }, ctx),
	},
};

export default class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return createCartesianChart(behavior);
	}
}
