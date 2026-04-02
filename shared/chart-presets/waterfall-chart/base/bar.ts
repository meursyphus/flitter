import type { WaterfallBarType, WaterfallChartCustom } from '../types';
import {
	Alignment,
	BoxDecoration,
	Border,
	BoxShadow,
	Container,
	FractionallySizedBox,
	EdgeInsets,
	Padding,
	SizedBox,
} from 'flitter-core';

const COLORS: Record<WaterfallBarType, string> = {
	increase: '#4CAF50',
	decrease: '#F44336',
	total: '#2196F3',
	subtotal: '#2196F3',
};

export function Bar(
	...[{ value, cumulative, type, isHovered }, { scale }]: Parameters<WaterfallChartCustom['bar']>
) {
	if (scale == null) return SizedBox.shrink();
	const total = scale.max - scale.min;
	const absValue = Math.abs(type === 'total' ? cumulative : value);
	const heightRatio = absValue / total;

	// Calculate the bottom offset for floating bar positioning
	let barBase: number;
	if (type === 'total') {
		barBase = 0;
	} else if (value >= 0) {
		barBase = cumulative - value;
	} else {
		barBase = cumulative;
	}

	const bottomRatio = (barBase - scale.min) / total;

	return Container({
		width: Infinity,
		height: Infinity,
		alignment: Alignment.bottomCenter,
		child: FractionallySizedBox({
			heightFactor: bottomRatio + heightRatio,
			alignment: Alignment.bottomCenter,
			child: Container({
				alignment: Alignment.topCenter,
				child: FractionallySizedBox({
					heightFactor: heightRatio / (bottomRatio + heightRatio),
					alignment: Alignment.topCenter,
					child: Padding({
						padding: EdgeInsets.symmetric({ horizontal: 4 }),
						child: Container({
							width: Infinity,
							height: Infinity,
							decoration: new BoxDecoration({
								color: COLORS[type],
								border:
									isHovered
										? Border.all({ color: 'white', width: 3, strokeAlign: 1 })
										: undefined,
								boxShadow: isHovered
									? [new BoxShadow({ color: 'rgba(0,0,0,0.18)', blurRadius: 12 })]
									: undefined,
							}),
						}),
					}),
				}),
			}),
		}),
	});
}
