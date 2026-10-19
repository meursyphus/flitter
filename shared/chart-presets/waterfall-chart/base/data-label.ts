import type { WaterfallChartCustom } from '../types';
import { SizedBox } from 'flitterjs';

export function DataLabel(..._args: Parameters<WaterfallChartCustom['dataLabel']>) {
	return SizedBox.shrink();
}
