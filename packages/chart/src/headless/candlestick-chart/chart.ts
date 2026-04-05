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
import { CandlestickChartProvider } from "./provider";
import type {
	CandlestickChartCandle,
	CandlestickChartGeometry,
} from "./types";

type HoveredCandlestickRect = {
	index: number;
	candle: CandlestickChartCandle;
	x: number;
	y: number;
	width: number;
	height: number;
};

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

function computeBoxAlignment(
	highRatio: number,
	lowRatio: number,
): Alignment {
	const factor = highRatio - lowRatio;
	const denominator = 1 - factor;
	if (denominator <= 0) return Alignment.center;

	return new Alignment({
		x: 0,
		y: (2 * (1 - highRatio)) / denominator - 1,
	});
}

function resolveGeometry(
	candle: CandlestickChartCandle,
	scale: { min: number; max: number } | null,
): CandlestickChartGeometry | null {
	if (scale == null) return null;

	const totalRange = scale.max - scale.min || 1;
	const highRatio = clamp((candle.high - scale.min) / totalRange, 0, 1);
	const lowRatio = clamp((candle.low - scale.min) / totalRange, 0, 1);
	const boxHeightFactor = Math.max(highRatio - lowRatio, 0.002);
	const wickRange = candle.high - candle.low || 1;
	const bodyTop = Math.max(candle.open, candle.close);
	const bodyBottom = Math.min(candle.open, candle.close);
	const topWickRatio = clamp((candle.high - bodyTop) / wickRange, 0, 1);
	const rawBodyRatio = clamp((bodyTop - bodyBottom) / wickRange, 0, 1);
	const bottomWickRatio = clamp((bodyBottom - candle.low) / wickRange, 0, 1);
	const bodyRatio = rawBodyRatio > 0 ? rawBodyRatio : 0.06;
	const segmentTotal = topWickRatio + bodyRatio + bottomWickRatio || 1;

	return {
		boxAlignment: computeBoxAlignment(highRatio, lowRatio),
		boxHeightFactor,
		topWickRatio: topWickRatio / segmentTotal,
		bodyRatio: bodyRatio / segmentTotal,
		bottomWickRatio: bottomWickRatio / segmentTotal,
	};
}

function formatPrice(value: number): string {
	const abs = Math.abs(value);
	const fractionDigits = abs >= 1_000 ? 0 : abs >= 1 ? 3 : 4;
	return value.toLocaleString("en-US", {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	});
}

function formatSignedPrice(value: number): string {
	const sign = value > 0 ? "+" : value < 0 ? "-" : "";
	return `${sign}$${formatPrice(Math.abs(value))}`;
}

function formatChangeRate(value: number | null): string {
	if (value == null) return "n/a";
	const percent = Math.abs(value * 100).toFixed(1);
	const sign = value > 0 ? "+" : value < 0 ? "-" : "";
	return `${sign}${percent}%`;
}

class CandlestickBox extends StatefulWidget {
	candle: CandlestickChartCandle;
	index: number;

	constructor({
		candle,
		index,
	}: {
		candle: CandlestickChartCandle;
		index: number;
	}) {
		super(`${index}`);
		this.candle = candle;
		this.index = index;
	}

	createState() {
		return new CandlestickBoxState();
	}
}

class CandlestickBoxState extends State<CandlestickBox> {
	anchorKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		const { candle, index } = this.widget;
		const isHovered = ctx.isCandlestickHovered(index);
		const geometry = resolveGeometry(candle, ctx.scale);
		if (geometry == null) return SizedBox.shrink();

		const candlestick = ctx.custom.candlestick(
			{
				candle,
				geometry,
				index,
				isHovered,
			},
			ctx,
		);

		return GestureDetector({
			key: this.anchorKey,
			cursor: "default",
			onMouseEnter: () => ctx.hoverCandlestick(index, this.anchorKey),
			onMouseLeave: () => ctx.unhoverCandlestick(index),
			child: ctx.custom.candlestickBox(
				{
					candlestick,
					candle,
					geometry,
					index,
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
	buildLayout: (ctx, { title, plot }) =>
		ctx.custom.layout({ title, plot, legends: [] }, ctx),
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
	getXAxisLabels: () => [],
	getYAxisLabels: (ctx) => getScaleLabels(ctx.scale),
	shouldRenderDataView: (ctx) => ctx.scale != null,
	buildDataView: (ctx) =>
		GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverAllCandlesticks(),
			child: ctx.custom.dataView(
				{
					candlesticks: ctx.candles.map(
						(candle, index) => new CandlestickBox({ candle, index }),
					),
				},
				ctx,
			),
		}),
	tooltip: {
		resolveHovered: (ctx, overlayKey): HoveredCandlestickRect | null => {
			const hoveredCandlestick = ctx.hoveredCandlestick;
			if (hoveredCandlestick == null) return null;

			const candle = ctx.candles[hoveredCandlestick.index];
			const rect = resolveOverlayRect(overlayKey, hoveredCandlestick.anchorKey);
			if (candle == null || rect == null) return null;

			return {
				index: hoveredCandlestick.index,
				candle,
				...rect,
			};
		},
		buildTooltip: (ctx, hoveredCandlestickRect) => {
			const { candle } = hoveredCandlestickRect;
			const candleColor = candle.isUp
				? ctx.config.candlestick.upColor
				: candle.isDown
					? ctx.config.candlestick.downColor
					: ctx.config.candlestick.wickColor;
			return ctx.custom.tooltip(
				{
					label: candle.label,
					items: [
						{
							legend: "Open",
							color: candleColor,
							value: `$${formatPrice(candle.open)}`,
						},
						{
							legend: "High",
							color: ctx.config.candlestick.wickColor,
							value: `$${formatPrice(candle.high)}`,
						},
						{
							legend: "Low",
							color: ctx.config.candlestick.wickColor,
							value: `$${formatPrice(candle.low)}`,
						},
						{
							legend: "Close",
							color: candleColor,
							value: `$${formatPrice(candle.close)}`,
						},
						{
							legend: "Change",
							color: candleColor,
							value: `${formatSignedPrice(candle.change)} (${formatChangeRate(candle.changeRate)})`,
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
