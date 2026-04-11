import type { CandlestickChartCustom } from "../types";
import {
	Alignment,
	Container,
	FractionallySizedBox,
} from "flitter-ui";

export function CandlestickBox(
	...[{ candlestick, geometry }]: Parameters<CandlestickChartCustom["candlestickBox"]>
) {
	return Container({
		width: Infinity,
		height: Infinity,
		child: FractionallySizedBox({
			alignment: geometry.boxAlignment,
			heightFactor: geometry.boxHeightFactor,
			child: Container({
				alignment: Alignment.center,
				child: FractionallySizedBox({
					widthFactor: 0.72,
					child: candlestick,
				}),
			}),
		}),
	});
}
