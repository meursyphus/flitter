import type { PieChartCustom } from '../types';
import { SizedBox, type Widget } from 'flitter-core';

export function DataLabel(...[_args]: Parameters<PieChartCustom['dataLabel']>): Widget {
	return SizedBox.shrink();
}
