import type { CandlestickChartCustom } from "../types";
import {
	Align,
	Alignment,
	Column,
	Container,
	CrossAxisAlignment,
	MainAxisSize,
	Stack,
	StackFit,
	SizedBox,
} from "flitter-ui";

function alignmentForIndex(index: number, count: number): Alignment {
	if (count <= 0) return Alignment.center;
	const x = (index / count) * 2 - 1;
	return new Alignment({ x, y: 0 });
}

function alignmentForLabel(
	startIndex: number,
	endIndex: number,
	count: number,
): Alignment {
	if (count <= 0) return Alignment.center;
	const center = (startIndex + endIndex) / 2;
	const x = (center / count) * 2 - 1;
	return new Alignment({ x, y: 0 });
}

export function XAxis(
	...[{ line, tick }, ctx]: Parameters<CandlestickChartCustom["xAxis"]>
) {
	const labelGap = ctx.config?.axis?.label?.gap ?? 0;
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
				height: 18,
				child: Stack({
					fit: StackFit.expand,
					clipped: false,
					children: [
						SizedBox.expand(),
						...ctx.xTicks.map(({ index, label }, tickIndex) => {
							const nextIndex =
								ctx.xTicks[tickIndex + 1]?.index ?? ctx.candles.length;

							return Align({
								alignment: alignmentForLabel(index, nextIndex, ctx.candles.length),
								child: ctx.custom.xAxisLabel(
									{ name: label, index },
									ctx,
								),
							});
						}),
					],
				}),
			}),
		],
	});
}
