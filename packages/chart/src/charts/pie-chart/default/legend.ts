import type { PieChartCustom } from '../types';
import {
	Container,
	EdgeInsets,
	Padding,
	Row,
	MainAxisSize,
	SizedBox,
	Text,
	TextStyle,
	type Widget,
} from 'flitter-core';

const DEFAULT_COLORS = [
	'#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
	'#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac',
];

export function Legend(...[{ name, index }, { colors }]: Parameters<PieChartCustom['legend']>): Widget {
	const color = colors[index % colors.length] ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];
	return Padding({
		padding: EdgeInsets.only({ right: 10 }),
		child: Row({
			mainAxisSize: MainAxisSize.min,
			children: [
				Container({
					width: 12,
					height: 12,
					color,
				}),
				SizedBox({ width: 4 }),
				Text(name, {
					style: new TextStyle({
						fontSize: 12,
					}),
				}),
			],
		}),
	});
}
