import type { BarChartCustom } from '../types';
import { Container } from 'flitter-core';

export function Bar(...[_, { direction }]: Parameters<BarChartCustom['bar']>) {
	return Container({
		width: direction === 'vertical' ? 5 : undefined,
		height: direction === 'horizontal' ? 5 : 100,
		color: 'black'
	});
}
