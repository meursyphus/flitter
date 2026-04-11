import { ChangeNotifier, GlobalKey } from "flitter-core";
import { refineScale } from "@shared/utils/scale";
import type {
	HistogramAggregation,
	HistogramBin,
	HistogramChartCustom,
	HistogramChartData,
	HistogramChartRowData,
	HistogramChartScale,
	HistogramChartTransform,
} from "./types";

type HistogramPoint = {
	xValue: number;
	yValue: number;
};

type MutableHistogramBin = {
	min: number;
	max: number;
	label: string;
	count: number;
	sum: number;
	minValue: number | null;
	maxValue: number | null;
	value: number;
	density: number;
	mean: number | null;
};

function sturgesRule(count: number): number {
	return Math.max(1, Math.ceil(Math.log2(Math.max(count, 1)) + 1));
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function formatRangeValue(value: number): string {
	if (Number.isInteger(value)) return value.toString();

	const abs = Math.abs(value);
	if (abs >= 100) return value.toFixed(0);
	if (abs >= 10) return value.toFixed(1).replace(/\.0$/, "");
	return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function formatRangeLabel(min: number, max: number): string {
	return `${formatRangeValue(min)}-${formatRangeValue(max)}`;
}

function resolveAggregation(
	transform: HistogramChartTransform,
): HistogramAggregation {
	return transform.aggregation ?? "count";
}

function resolvePoints(
	data: HistogramChartData,
	aggregation: HistogramAggregation,
): HistogramPoint[] {
	if ("values" in data) {
		return data.values
			.filter(isFiniteNumber)
			.map((value) => ({ xValue: value, yValue: value }));
	}

	return (data as HistogramChartRowData).rows.flatMap((row) => {
		const xRaw = row[data.xKey];
		if (!isFiniteNumber(xRaw)) return [];

		if (aggregation === "count" || aggregation === "density") {
			return [{ xValue: xRaw, yValue: xRaw }];
		}

		const yKey = data.yKey ?? data.xKey;
		const yRaw = row[yKey];
		if (!isFiniteNumber(yRaw)) return [];

		return [{ xValue: xRaw, yValue: yRaw }];
	});
}

function createMutableBins(
	points: HistogramPoint[],
	transform: HistogramChartTransform,
): MutableHistogramBin[] {
	const { binCount, bins: customBins } = transform;

	if (points.length === 0) return [];

	if (binCount != null && binCount > 0) {
		const rawMin = Math.min(...points.map((point) => point.xValue));
		const rawMax = Math.max(...points.map((point) => point.xValue));
		const padding = rawMin === rawMax ? (Math.abs(rawMin) || 1) * 0.5 : 0;
		const min = rawMin - padding;
		const max = rawMax + padding;
		const count = Math.max(1, Math.floor(binCount));
		const width = (max - min) / count || 1;

		return Array.from({ length: count }, (_, index) => {
			const lo = min + index * width;
			const hi = index === count - 1 ? max : min + (index + 1) * width;

			return {
				min: lo,
				max: hi,
				count: 0,
				sum: 0,
				minValue: null,
				maxValue: null,
				value: 0,
				density: 0,
				mean: null,
				label: formatRangeLabel(lo, hi),
			};
		});
	}

	if (customBins != null && customBins.length > 0) {
		return customBins.map(([lo, hi]) => ({
			min: lo,
			max: hi,
			count: 0,
			sum: 0,
			minValue: null,
			maxValue: null,
			value: 0,
			density: 0,
			mean: null,
			label: formatRangeLabel(lo, hi),
		}));
	}

	const rawMin = Math.min(...points.map((point) => point.xValue));
	const rawMax = Math.max(...points.map((point) => point.xValue));
	const padding = rawMin === rawMax ? (Math.abs(rawMin) || 1) * 0.5 : 0;
	const min = rawMin - padding;
	const max = rawMax + padding;
	const count = sturgesRule(points.length);
	const width = (max - min) / count || 1;

	return Array.from({ length: count }, (_, index) => {
		const lo = min + index * width;
		const hi = index === count - 1 ? max : min + (index + 1) * width;

		return {
			min: lo,
			max: hi,
			count: 0,
			sum: 0,
			minValue: null,
			maxValue: null,
			value: 0,
			density: 0,
			mean: null,
			label: formatRangeLabel(lo, hi),
		};
	});
}

function assignPointsToBins(
	points: HistogramPoint[],
	bins: MutableHistogramBin[],
): void {
	for (const point of points) {
		for (let index = 0; index < bins.length; index += 1) {
			const bin = bins[index];
			const inBin =
				index === bins.length - 1
					? point.xValue >= bin.min && point.xValue <= bin.max
					: point.xValue >= bin.min && point.xValue < bin.max;

			if (!inBin) continue;

			bin.count += 1;
			bin.sum += point.yValue;
			bin.minValue =
				bin.minValue == null ? point.yValue : Math.min(bin.minValue, point.yValue);
			bin.maxValue =
				bin.maxValue == null ? point.yValue : Math.max(bin.maxValue, point.yValue);
			break;
		}
	}
}

function finalizeBins(
	bins: MutableHistogramBin[],
	aggregation: HistogramAggregation,
): HistogramBin[] {
	return bins.map((bin) => {
		const width = Math.max(bin.max - bin.min, Number.EPSILON);
		const mean = bin.count > 0 ? bin.sum / bin.count : null;
		const density = bin.count / width;

		let value = 0;
		switch (aggregation) {
			case "count":
				value = bin.count;
				break;
			case "density":
				value = density;
				break;
			case "sum":
				value = bin.sum;
				break;
			case "mean":
				value = mean ?? 0;
				break;
			case "min":
				value = bin.minValue ?? 0;
				break;
			case "max":
				value = bin.maxValue ?? 0;
				break;
		}

		return {
			min: bin.min,
			max: bin.max,
			label: bin.label,
			count: bin.count,
			value,
			density,
			sum: bin.sum,
			mean,
			minValue: bin.minValue,
			maxValue: bin.maxValue,
		};
	});
}

function getScaleValueRange(
	bins: HistogramBin[],
	aggregation: HistogramAggregation,
): { min: number; max: number } {
	if (bins.length === 0) return { min: 0, max: 0 };
	if (aggregation === "count" || aggregation === "density") {
		return {
			min: 0,
			max: bins.reduce((max, bin) => Math.max(max, bin.value), 0),
		};
	}

	const values = bins.map((bin) => bin.value);
	return {
		min: Math.min(0, ...values),
		max: Math.max(0, ...values),
	};
}

export class HistogramChartController extends ChangeNotifier {
	#rawData: HistogramChartData;
	#transform: HistogramChartTransform;
	#bins: HistogramBin[] = [];
	#scale: HistogramChartScale | null = null;
	#width = 0;
	#height = 0;
	#hoveredBin: { index: number; anchorKey: GlobalKey } | null = null;

	custom!: HistogramChartCustom<any>;
	config: any;

	constructor({
		data,
		transform = {},
		custom,
		config = {},
	}: {
		data: HistogramChartData;
		transform?: HistogramChartTransform;
		custom: HistogramChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.#transform = transform;
		this.custom = custom;
		this.config = config;
		this.#recalculate();
	}

	#recalculate(): void {
		const aggregation = resolveAggregation(this.#transform);
		const points = resolvePoints(this.#rawData, aggregation);
		const bins = createMutableBins(points, this.#transform);
		assignPointsToBins(points, bins);
		this.#bins = finalizeBins(bins, aggregation);

		if (this.#bins.length === 0) {
			this.#scale = null;
			return;
		}

		const { min, max } = getScaleValueRange(this.#bins, aggregation);
		const range = max - min || Math.abs(max || min) || 1;
		this.#scale = refineScale({
			min,
			max,
			step: range / 5,
		});
	}

	set data(value: HistogramChartData) {
		this.#rawData = value;
		this.#hoveredBin = null;
		this.#recalculate();
		this.notifyListeners();
	}

	get data(): HistogramChartData {
		return this.#rawData;
	}

	set transform(value: HistogramChartTransform) {
		this.#transform = value;
		this.#hoveredBin = null;
		this.#recalculate();
		this.notifyListeners();
	}

	get transform(): HistogramChartTransform {
		return this.#transform;
	}

	get aggregation(): HistogramAggregation {
		return resolveAggregation(this.#transform);
	}

	get bins(): HistogramBin[] {
		return this.#bins;
	}

	get scale(): HistogramChartScale | null {
		return this.#scale;
	}

	get width(): number {
		return this.#width;
	}

	get height(): number {
		return this.#height;
	}

	setSize(width: number, height: number): void {
		if (this.#width === width && this.#height === height) return;
		this.#width = width;
		this.#height = height;
		this.notifyListeners();
	}

	get hoveredBin(): { index: number; anchorKey: GlobalKey } | null {
		return this.#hoveredBin;
	}

	hoverBin(index: number, anchorKey: GlobalKey): void {
		this.#hoveredBin = { index, anchorKey };
		this.notifyListeners();
	}

	unhoverBin(index: number): void {
		if (this.#hoveredBin?.index !== index) return;
		this.#hoveredBin = null;
		this.notifyListeners();
	}

	unhoverAllBins(): void {
		if (this.#hoveredBin == null) return;
		this.#hoveredBin = null;
		this.notifyListeners();
	}

	isBinHovered(index: number): boolean {
		return this.#hoveredBin?.index === index;
	}
}
