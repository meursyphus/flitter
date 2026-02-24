import type { CandlestickChartCustom } from '../types';
import {
	Alignment,
	Container,
	Column,
	Expanded,
	FractionallySizedBox,
	MainAxisAlignment,
	CrossAxisAlignment,
} from 'flitter-core';

export function Candlestick(
	...[{ open, high, low, close }, { scale }]: Parameters<CandlestickChartCustom['candlestick']>
) {
	const total = scale.max - scale.min;
	const isUp = close >= open;
	const color = isUp ? '#4CAF50' : '#F44336';
	const wickColor = '#333333';

	const bodyTop = Math.max(open, close);
	const bodyBottom = Math.min(open, close);

	const topWickRatio = (high - bodyTop) / total;
	const bodyRatio = (bodyTop - bodyBottom) / total || 0.002;
	const bottomWickRatio = (bodyBottom - low) / total;
	const belowRatio = (low - scale.min) / total;
	const aboveRatio = (scale.max - high) / total;

	return Container({
		width: Infinity,
		height: Infinity,
		alignment: Alignment.center,
		child: FractionallySizedBox({
			widthFactor: 0.6,
			child: Column({
				mainAxisAlignment: MainAxisAlignment.end,
				crossAxisAlignment: CrossAxisAlignment.center,
				children: [
					// Space above high
					...(aboveRatio > 0
						? [Expanded({ flex: Math.max(aboveRatio, 0.001), child: Container({}) })]
						: []),
					// Upper wick
					...(topWickRatio > 0
						? [
								Expanded({
									flex: Math.max(topWickRatio, 0.001),
									child: Container({
										width: 1,
										color: wickColor,
									}),
								}),
						  ]
						: []),
					// Body
					Expanded({
						flex: Math.max(bodyRatio, 0.001),
						child: Container({
							width: Infinity,
							color,
						}),
					}),
					// Lower wick
					...(bottomWickRatio > 0
						? [
								Expanded({
									flex: Math.max(bottomWickRatio, 0.001),
									child: Container({
										width: 1,
										color: wickColor,
									}),
								}),
						  ]
						: []),
					// Space below low
					...(belowRatio > 0
						? [Expanded({ flex: Math.max(belowRatio, 0.001), child: Container({}) })]
						: []),
				],
			}),
		}),
	});
}
