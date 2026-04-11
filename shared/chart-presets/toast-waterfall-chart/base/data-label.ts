import type { WaterfallChartCustom } from '../types';
import { SizedBox } from 'flitter-ui';

export function DataLabel(..._args: Parameters<WaterfallChartCustom['dataLabel']>) {
	return SizedBox.shrink();
}
