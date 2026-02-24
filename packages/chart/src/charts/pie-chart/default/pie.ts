import type { PieChartCustom } from '../types';
import {
	Center,
	AspectRatio,
	Stack,
	Positioned,
	type Widget,
} from 'flitter-core';

export function Pie(
	...[{ slices, dataLabels }]: Parameters<PieChartCustom['pie']>
): Widget {
	return Center({
		child: AspectRatio({
			aspectRatio: 1,
			child: Stack({
				children: [
					...slices.map((slice) =>
						Positioned({
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							child: slice,
						}),
					),
				],
			}),
		}),
	});
}
