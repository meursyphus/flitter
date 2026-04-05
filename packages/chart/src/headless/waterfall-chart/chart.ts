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
	getScaleLabels,
	resolveOverlayRect,
	type CartesianScaffoldBehavior,
} from "@headless/_shared/cartesian-scaffold";
import { WaterfallChartProvider } from "./provider";
import type {
	WaterfallBarGeometry,
	WaterfallBarType,
	WaterfallChartDatum,
} from "./types";

type HoveredWaterfallBarRect = {
	index: number;
	item: WaterfallChartDatum;
	x: number;
	y: number;
	width: number;
	height: number;
};

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

function computeBoxAlignment(
	maxRatio: number,
	minRatio: number,
): Alignment {
	const factor = maxRatio - minRatio;
	const denominator = 1 - factor;
	if (denominator <= 0) return Alignment.center;

	return new Alignment({
		x: 0,
		y: (2 * (1 - maxRatio)) / denominator - 1,
	});
}

function resolveGeometry(
	item: WaterfallChartDatum,
	scale: { min: number; max: number } | null,
): WaterfallBarGeometry | null {
	if (scale == null) return null;
	const totalRange = scale.max - scale.min || 1;
	const minValue = Math.min(item.start, item.end);
	const maxValue = Math.max(item.start, item.end);
	const minRatio = clamp((minValue - scale.min) / totalRange, 0, 1);
	const maxRatio = clamp((maxValue - scale.min) / totalRange, 0, 1);

	return {
		boxAlignment: computeBoxAlignment(maxRatio, minRatio),
		boxHeightFactor: Math.max(maxRatio - minRatio, 0.002),
	};
}

function formatSignedNumber(value: number): string {
	const sign = value > 0 ? "+" : value < 0 ? "-" : "";
	return `${sign}${Math.abs(value).toLocaleString("en-US")}`;
}

function isSummary(item: WaterfallChartDatum): boolean {
	return item.type === "total" || item.type === "subtotal";
}

function typeLabel(ctx: ReturnType<typeof WaterfallChartProvider.of>, item: WaterfallChartDatum): string {
	if (item.type === "increase") return ctx.config.waterfall.positiveName;
	if (item.type === "decrease") return ctx.config.waterfall.negativeName;
	if (item.type === "total") return ctx.config.waterfall.totalName;
	return "Subtotal";
}

class BarBox extends StatefulWidget {
	item: WaterfallChartDatum;
	index: number;

	constructor({
		item,
		index,
	}: {
		item: WaterfallChartDatum;
		index: number;
	}) {
		super(`${index}`);
		this.item = item;
		this.index = index;
	}

	createState() {
		return new BarBoxState();
	}
}

class BarBoxState extends State<BarBox> {
	anchorKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		const { item, index } = this.widget;
		const isHovered = ctx.isBarHovered(index);
		const geometry = resolveGeometry(item, ctx.scale);
		if (geometry == null) return SizedBox.shrink();

		const bar = ctx.custom.bar(
			{
				item,
				index,
				isHovered,
			},
			ctx,
		);

		return GestureDetector({
			cursor: "default",
			key: this.anchorKey,
			onMouseEnter: () => ctx.hoverBar(index, this.anchorKey),
			onMouseLeave: () => ctx.unhoverBar(index),
			child: ctx.custom.barBox(
				{
					bar,
					item,
					geometry,
					index,
					isHovered,
				},
				ctx,
			),
		});
	}
}

class Connector extends StatelessWidget {
	#from: WaterfallChartDatum;
	#to: WaterfallChartDatum;
	#index: number;

	constructor({
		from,
		to,
		index,
	}: {
		from: WaterfallChartDatum;
		to: WaterfallChartDatum;
		index: number;
	}) {
		super();
		this.#from = from;
		this.#to = to;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.connector(
			{
				from: this.#from,
				to: this.#to,
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
	getLegends: (ctx) => [
		{ name: ctx.config.waterfall.positiveName, index: 0 },
		{ name: ctx.config.waterfall.negativeName, index: 1 },
	],
	buildLegend: (ctx, { name, index }) =>
		ctx.custom.legend({ name, index, isVisible: true }, ctx),
	getXAxisLabels: (ctx) => ctx.items.map((item) => item.label),
	getYAxisLabels: (ctx) => getScaleLabels(ctx.scale),
	shouldRenderDataView: (ctx) => ctx.scale != null,
	buildDataView: (ctx) => {
		const bars = ctx.items.map(
			(item, index) =>
				new BarBox({
					item,
					index,
				}),
		);

		const connectors: Widget[] = [];
		for (let index = 0; index < ctx.items.length - 1; index += 1) {
			const from = ctx.items[index];
			const to = ctx.items[index + 1];
			if (isSummary(from) || isSummary(to)) continue;
			connectors.push(new Connector({ from, to, index }));
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
			const item = ctx.items[hoveredBar.index];
			if (rect == null || item == null) return null;

			return {
				index: hoveredBar.index,
				item,
				...rect,
			};
		},
		buildTooltip: (ctx, hoveredBarRect) => {
			const item = hoveredBarRect.item;
			const color =
				item.type === "increase"
					? ctx.config.colors.fills?.[0] ?? ctx.config.colors?.[0] ?? "#4a90e2"
					: item.type === "decrease"
						? ctx.config.colors.fills?.[1] ?? ctx.config.colors?.[1] ?? "#ff6b6b"
						: ctx.config.colors.fills?.[2] ?? ctx.config.colors?.[2] ?? "#404066";
			return ctx.custom.tooltip(
				{
					label: item.label,
					items: [
						{
							legend: typeLabel(ctx, item),
							color,
							value: ctx.config.waterfall.valueFormatter(item.value, item.type),
						},
						{
							legend: "Start",
							color: ctx.config.axis.color,
							value: ctx.config.waterfall.valueFormatter(item.start, item.type),
						},
						{
							legend: "End",
							color: ctx.config.axis.color,
							value: ctx.config.waterfall.valueFormatter(item.end, item.type),
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
