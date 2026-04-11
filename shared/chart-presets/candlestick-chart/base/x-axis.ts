import type { CandlestickChartCustom } from "../types";
import {
	Align,
	Alignment,
	type BuildContext,
	Column,
	Container,
	CrossAxisAlignment,
	FractionalTranslation,
	GlobalKey,
	MainAxisSize,
	Offset,
	Positioned,
	State,
	StatefulWidget,
	Stack,
	StackFit,
	SizedBox,
	type Widget,
} from "flitter-ui";

type XAxisContext = Parameters<CandlestickChartCustom["xAxis"]>[1];

function alignmentForIndex(index: number, count: number): Alignment {
	if (count <= 0) return Alignment.center;
	const x = (index / count) * 2 - 1;
	return new Alignment({ x, y: 0 });
}

function ratioForLabel(
	startIndex: number,
	endIndex: number,
	count: number,
): number {
	if (count <= 0) return 0.5;
	const center = (startIndex + endIndex) / 2;
	return center / count;
}

function estimateLabelWidth(label: string, fontSize: number): number {
	const units = Array.from(label).reduce((total, char) => {
		if (char === " ") return total + 0.35;
		if (/[0-9A-Za-z]/.test(char)) return total + 0.62;
		return total + 0.9;
	}, 0);

	return Math.max(fontSize * (units + 0.75), fontSize * 2);
}

function shouldRenderLabel(
	startIndex: number,
	endIndex: number,
	label: string,
	count: number,
	width: number,
	fontSize: number,
): boolean {
	if (count <= 0 || endIndex <= startIndex) return false;
	if (width <= 0) return true;

	const labelWidth = estimateLabelWidth(label, fontSize);
	const intervalWidth = ((endIndex - startIndex) / count) * width;
	const centerX = ratioForLabel(startIndex, endIndex, count) * width;
	const edgePadding = Math.max(6, fontSize * 0.35);

	if (intervalWidth < labelWidth + edgePadding) return false;
	if (centerX - labelWidth / 2 < edgePadding) return false;
	if (centerX + labelWidth / 2 > width - edgePadding) return false;

	return true;
}

class _XAxisLabels extends StatefulWidget {
	ctx: XAxisContext;
	labelFontSize: number;

	constructor({
		ctx,
		labelFontSize,
	}: {
		ctx: XAxisContext;
		labelFontSize: number;
	}) {
		super();
		this.ctx = ctx;
		this.labelFontSize = labelFontSize;
	}

	createState() {
		return new _XAxisLabelsState();
	}
}

class _XAxisLabelsState extends State<_XAxisLabels> {
	areaKey = new GlobalKey();
	measuredWidth: number | null = null;
	scheduledMeasurement = false;

	private scheduleMeasurement(): void {
		if (this.scheduledMeasurement) return;
		this.scheduledMeasurement = true;
		this.element.scheduler.addPostFrameCallbacks(() => {
			this.scheduledMeasurement = false;
			if (this.areaKey.buildOwner == null) return;

			const areaRenderObject = this.areaKey.currentContext?.renderObject;
			if (areaRenderObject == null) return;

			const nextWidth = areaRenderObject.size.width;
			if (this.measuredWidth === nextWidth) return;

			this.setState(() => {
				this.measuredWidth = nextWidth;
			});
		});
	}

	override build(_context: BuildContext): Widget {
		const { ctx, labelFontSize } = this.widget;
		const width = this.measuredWidth;
		this.scheduleMeasurement();

		return Stack({
			key: this.areaKey,
			fit: StackFit.expand,
			clipped: true,
			children: [
				SizedBox.expand(),
				...(width == null
					? []
					: ctx.xTicks.flatMap(({ index, label }, tickIndex) => {
							const nextIndex =
								ctx.xTicks[tickIndex + 1]?.index ?? ctx.candles.length;
							if (
								!shouldRenderLabel(
									index,
									nextIndex,
									label,
									ctx.candles.length,
									width,
									labelFontSize,
								)
							) {
								return [];
							}

							return [
								Positioned({
									left: ratioForLabel(index, nextIndex, ctx.candles.length) * width,
									top: 0,
									child: FractionalTranslation({
										translation: new Offset({ x: -0.5, y: 0 }),
										child: ctx.custom.xAxisLabel(
											{ name: label, index },
											ctx,
										),
									}),
								}),
							];
						})),
			],
		});
	}
}

export function XAxis(
	...[{ line, tick }, ctx]: Parameters<CandlestickChartCustom["xAxis"]>
) {
	const labelGap = ctx.config?.axis?.label?.gap ?? 0;
	const labelFontSize = ctx.config?.axis?.label?.fontSize ?? 12;
	const labelHeight = Math.max(18, Math.ceil(labelFontSize * 1.4));
	const showTicks = ctx.config?.axis?.tick?.enabled !== false;
	const tickSize = showTicks ? (ctx.config?.axis?.tick?.size ?? 6) : 0;

	return Column({
		mainAxisSize: MainAxisSize.min,
		crossAxisAlignment: CrossAxisAlignment.start,
		children: [
			line,
			...(showTicks
				? [
						Container({
							width: Infinity,
							height: tickSize,
							child: Stack({
								fit: StackFit.expand,
								clipped: false,
								children: [
									SizedBox.expand(),
									...ctx.xTicks.map(({ index }) =>
										Align({
											alignment: alignmentForIndex(index, ctx.candles.length),
											child: tick,
										}),
									),
								],
							}),
						}),
				  ]
				: []),
			...(labelGap > 0 ? [SizedBox({ height: labelGap })] : []),
			Container({
				width: Infinity,
				height: labelHeight,
				child: new _XAxisLabels({ ctx, labelFontSize }),
			}),
		],
	});
}
