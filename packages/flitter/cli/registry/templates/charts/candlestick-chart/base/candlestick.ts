import type { CandlestickChartCustom } from "../types";
import {
	BoxDecoration,
	Border,
	Container,
	Column,
	CrossAxisAlignment,
	Expanded,
	MainAxisAlignment,
	SizedBox,
} from "flitter-core";

export function Candlestick(
	...[{ candle, geometry }, ctx]: Parameters<CandlestickChartCustom["candlestick"]>
) {
	const color = candle.isUp
		? "#4CAF50"
		: candle.isDown
			? "#F44336"
			: "#64748b";
	const wickColor = "#334155";

	return SizedBox.expand({
		child: Column({
			mainAxisAlignment: MainAxisAlignment.end,
			crossAxisAlignment: CrossAxisAlignment.center,
			children: [
				Expanded({
					flex: Math.max(geometry.topWickRatio, 0.001),
					child: Container({
						width: 1,
						color: wickColor,
					}),
				}),
				Expanded({
					flex: Math.max(geometry.bodyRatio, 0.001),
					child: Container({
						width: Infinity,
						decoration: new BoxDecoration({
							color,
							border: Border.all({ color: wickColor, width: 1 }),
						}),
					}),
				}),
				Expanded({
					flex: Math.max(geometry.bottomWickRatio, 0.001),
					child: Container({
						width: 1,
						color: wickColor,
					}),
				}),
			],
		}),
	});
}
