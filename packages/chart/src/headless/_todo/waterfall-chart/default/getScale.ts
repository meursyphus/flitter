import type { WaterfallChartData, WaterfallChartScale } from '../types';
import { getScale as cartesianGetScale } from '@shared/cartesian/index';

export function getScale(data: WaterfallChartData): {
	scale: WaterfallChartScale;
	cumulativeValues: number[];
} {
	const totalIndices = new Set(data.totalIndices ?? []);
	const cumulativeValues: number[] = [];
	let cumulative = 0;

	for (let i = 0; i < data.values.length; i++) {
		if (totalIndices.has(i)) {
			cumulativeValues.push(data.values[i]);
			cumulative = data.values[i];
		} else {
			cumulative += data.values[i];
			cumulativeValues.push(cumulative);
		}
	}

	const allValues = [...cumulativeValues];
	// Also include the base of each bar (cumulative before that bar's value)
	let runningTotal = 0;
	for (let i = 0; i < data.values.length; i++) {
		if (totalIndices.has(i)) {
			allValues.push(0); // total bars start from 0
			runningTotal = data.values[i];
		} else {
			allValues.push(runningTotal);
			runningTotal += data.values[i];
		}
	}

	const scale = cartesianGetScale({
		datasets: [{ legend: 'waterfall', values: allValues }]
	});

	return { scale, cumulativeValues };
}
