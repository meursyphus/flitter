import type { PieChartCustom } from '../types';
import {
	Column,
	Container,
	CrossAxisAlignment,
	EdgeInsets,
	Expanded,
	MainAxisAlignment,
	MainAxisSize,
	Row,
} from 'flitter-core';

export function Layout(
	...[{ title, legends, pie }]: Parameters<PieChartCustom['layout']>
) {
	return Container({
		padding: EdgeInsets.all(20),
		child: Column({
			crossAxisAlignment: CrossAxisAlignment.center,
			children: [
				title,
				Expanded({ child: pie }),
				Row({
					mainAxisAlignment: MainAxisAlignment.center,
					mainAxisSize: MainAxisSize.min,
					children: legends,
				}),
			],
		}),
	});
}
