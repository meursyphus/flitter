import type { CandlestickChartCustom } from "../types";
import {
	Axis,
	Container,
	Flex,
	Flexible,
} from "flitter-core";

export function DataView(
	...[{ candlesticks }]: Parameters<CandlestickChartCustom["dataView"]>
) {
	return Container({
		width: Infinity,
		height: Infinity,
		child: Flex({
			direction: Axis.horizontal,
			children: candlesticks.map((candlestick) =>
				Flexible({
					flex: 1,
					child: candlestick,
				}),
			),
		}),
	});
}
