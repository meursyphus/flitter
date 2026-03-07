import type { WaterfallChartCustom } from '../types';
import { SizedBox } from 'flitter-core';

export function DataLabel(..._args: Parameters<WaterfallChartCustom['dataLabel']>) {
	return SizedBox.shrink();
}
