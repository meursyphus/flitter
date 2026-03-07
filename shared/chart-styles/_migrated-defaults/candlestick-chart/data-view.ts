import type { CandlestickChartCustom } from '../types';
import { Container, Flexible, Flex, Axis } from 'flitter-core';

export function DataView(...[{ candlesticks }]: Parameters<CandlestickChartCustom['dataView']>) {
	return Container({
		height: Infinity,
		width: Infinity,
		child: Flex({
			direction: Axis.horizontal,
			children: candlesticks.map((candlestick) =>
				Flexible({
					flex: 1,
					child: candlestick
				})
			)
		})
	});
}
