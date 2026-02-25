import type { BarChartCustom } from '../types';
import {
	Column,
	Container,
	CrossAxisAlignment,
	EdgeInsets,
	MainAxisAlignment,
	MainAxisSize,
	Row
} from 'flitter-core';

export function Layout(
	...[{ title, legends, plot }, { data, direction }]: Parameters<BarChartCustom['layout']>
) {
	const maxLabelLength = Math.max(...data.labels.map((label) => label.length));
	return Container({
		padding: EdgeInsets.only({
			left: 20 + (direction === 'horizontal' ? maxLabelLength * 3 : 0),
			bottom: 60,
			right: 10
		}),
		child: Column({
			crossAxisAlignment: CrossAxisAlignment.start,
			children: [
				Row({
					mainAxisAlignment: MainAxisAlignment.spaceBetween,
					crossAxisAlignment: CrossAxisAlignment.end,
					children: [
						title,
						Row({
							mainAxisAlignment: MainAxisAlignment.center,
							mainAxisSize: MainAxisSize.min,
							children: legends
						})
					]
				}),
				plot
			]
		})
	});
}
