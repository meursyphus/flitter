import type { WaterfallChartCustom } from '../types';
import { Container } from 'flitter-core';

export function Connector(
	...[_args, _config]: Parameters<WaterfallChartCustom['connector']>
) {
	// Connectors are rendered as part of the series layout
	// This is a placeholder; the actual line is drawn in the series
	return Container({ width: 0, height: 0 });
}
