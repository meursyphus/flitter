import type { WaterfallChartData, WaterfallChartScale } from '../types';
import { getScale as cartesianGetScale } from '@shared/cartesian/index';

export function getScale(data: WaterfallChartData): {
	scale: WaterfallChartScale;
	cumulativeValues: number[];
} {
	const totalsMap = new Map<number, { totalType: string }>();
	for (const t of data.totals ?? []) {
		totalsMap.set(t.index, t);
	}

	const cumulativeValues: number[] = [];
	let cumulative = 0;

	for (let i = 0; i < data.values.length; i++) {
		const totalInfo = totalsMap.get(i);
		if (totalInfo) {
			cumulativeValues.push(data.values[i]);
			if (totalInfo.totalType === 'total') {
				cumulative = data.values[i];
			}
		} else {
			cumulative += data.values[i];
			cumulativeValues.push(cumulative);
		}
	}

	const allValues = [...cumulativeValues];
	// Also include the base of each bar (cumulative before that bar's value)
	let runningTotal = 0;
	for (let i = 0; i < data.values.length; i++) {
		const totalInfo = totalsMap.get(i);
		if (totalInfo) {
			allValues.push(0); // total/subtotal bars start from 0
			if (totalInfo.totalType === 'total') {
				runningTotal = data.values[i];
			}
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
