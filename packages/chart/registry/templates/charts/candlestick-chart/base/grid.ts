import { CandlestickChartCustom } from "../types";
import {
	Align,
	Alignment,
	Column,
	MainAxisAlignment,
	Opacity,
	Stack,
	StackFit,
	SizedBox,
} from "flitter-core";

function alignmentForIndex(index: number, count: number): Alignment {
	if (count <= 0) return Alignment.center;
	const x = (index / count) * 2 - 1;
	return new Alignment({ x, y: 0 });
}

export function Grid(
	...[{ xLine, yLine }, ctx]: Parameters<CandlestickChartCustom["grid"]>
) {
	const yCount = ctx.scale == null ? 0 : (ctx.scale.max - ctx.scale.min) / ctx.scale.step;

	return Stack({
		fit: StackFit.expand,
		children: [
			Column({
				mainAxisAlignment: MainAxisAlignment.spaceBetween,
				children: Array.from({ length: yCount + 1 }, (_, index) =>
					index === yCount ? Opacity({ child: xLine, opacity: 0 }) : xLine,
				).flat(),
			}),
			SizedBox.expand(),
			...ctx.xTicks.map(({ index }) =>
				Align({
					alignment: alignmentForIndex(index, ctx.candles.length),
					child: yLine,
				}),
			),
		],
	});
}
