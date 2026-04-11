import { refineScale } from "@shared/utils/scale";
import type {
	GetScaleFn,
	WaterfallBarType,
	WaterfallChartData,
	WaterfallChartDatum,
	WaterfallChartRow,
	WaterfallChartScale,
	WaterfallChartScaleOptions,
	WaterfallTotal,
} from "./types";

function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function formatCategory(value: unknown): string {
	if (value instanceof Date) {
		return value.toISOString().slice(0, 10);
	}
	return String(value ?? "");
}

function buildSummaryLabel(total: WaterfallTotal): string {
	return total.axisLabel ?? (total.totalType === "total" ? "Total" : "Subtotal");
}

export function normalizeWaterfallData<
	TRow extends WaterfallChartRow = WaterfallChartRow,
>(data: WaterfallChartData<TRow>): WaterfallChartDatum<TRow>[] {
	const totalsByIndex = new Map<number, WaterfallTotal[]>();
	for (const total of data.totals ?? []) {
		const list = totalsByIndex.get(total.index) ?? [];
		list.push(total);
		totalsByIndex.set(total.index, list);
	}

	const items: WaterfallChartDatum<TRow>[] = [];
	let runningTotal = 0;
	let checkpointTotal = 0;

	for (let rowIndex = 0; rowIndex < data.rows.length; rowIndex += 1) {
		const row = data.rows[rowIndex];
		const value = row[data.yKey];
		if (!isFiniteNumber(value)) continue;

		const start = runningTotal;
		runningTotal += value;
		const type: WaterfallBarType = value >= 0 ? "increase" : "decrease";

		items.push({
			row,
			label: formatCategory(row[data.xKey]),
			value,
			cumulative: runningTotal,
			start,
			end: runningTotal,
			type,
			sourceIndex: rowIndex,
		});

		for (const total of totalsByIndex.get(rowIndex) ?? []) {
			const summaryValue =
				total.totalType === "total"
					? runningTotal
					: runningTotal - checkpointTotal;

			items.push({
				row: null,
				label: buildSummaryLabel(total),
				value: summaryValue,
				cumulative: runningTotal,
				start: 0,
				end: summaryValue,
				type: total.totalType,
				sourceIndex: rowIndex,
			});

			checkpointTotal = runningTotal;
		}
	}

	return items;
}

export const getScale: GetScaleFn = (
	items,
	{ roughStepCount = 10 }: WaterfallChartScaleOptions = {},
): WaterfallChartScale => {
	if (items.length === 0) {
		return { min: 0, max: 0, step: 1 };
	}

	let min = Infinity;
	let max = -Infinity;

	for (const item of items) {
		min = Math.min(min, item.start, item.end);
		max = Math.max(max, item.start, item.end);
	}

	const roughMin = min > 0 ? 0 : min;
	const roughMax = max < 0 ? 0 : max;

	return refineScale({
		min: roughMin,
		max: roughMax,
		step: (roughMax - roughMin || 1) / roughStepCount,
	});
};
