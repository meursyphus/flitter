import { ChangeNotifier } from "flitter-core";
import { refineScale } from "@shared/utils/scale";
import type {
	HistogramBin,
	HistogramChartCustom,
	HistogramChartData,
	HistogramChartScale,
} from "./types";

function sturgesRule(count: number): number {
	return Math.max(1, Math.ceil(Math.log2(Math.max(count, 1)) + 1));
}

function formatRangeLabel(min: number, max: number): string {
	return `${min.toFixed(1)}-${max.toFixed(1)}`;
}

export class HistogramChartController extends ChangeNotifier {
	#rawData: HistogramChartData;
	#bins: HistogramBin[] = [];
	#scale: HistogramChartScale | null = null;
	#width = 0;
	#height = 0;
	#hoveredBin: number | null = null;

	custom!: HistogramChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: HistogramChartData;
		custom: HistogramChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.custom = custom;
		this.config = config;
	}

	#recalculate(): void {
		if ("bins" in this.#rawData) {
			this.#bins = this.#rawData.bins.map((bin) => ({
				...bin,
				label: formatRangeLabel(bin.min, bin.max),
			}));
		} else {
			const values = this.#rawData.values;
			if (values.length === 0) {
				this.#bins = [];
			} else {
				const min = Math.min(...values);
				const max = Math.max(...values);
				const count = this.#rawData.binCount ?? sturgesRule(values.length);
				const range = max - min || 1;
				const binWidth = range / count;
				const bins = Array.from({ length: count }, (_, index) => ({
					min: min + index * binWidth,
					max: index === count - 1 ? max : min + (index + 1) * binWidth,
					count: 0,
					label: "",
				}));

				values.forEach((value) => {
					const relative = (value - min) / range;
					const index = Math.min(count - 1, Math.floor(relative * count));
					bins[index].count += 1;
				});

				this.#bins = bins.map((bin) => ({
					...bin,
					label: formatRangeLabel(bin.min, bin.max),
				}));
			}
		}

		const maxCount = this.#bins.reduce((max, bin) => Math.max(max, bin.count), 0);
		this.#scale =
			this.#bins.length === 0
				? null
				: refineScale({
						min: 0,
						max: maxCount,
						step: Math.max(1, maxCount / 5),
				  });
	}

	set data(value: HistogramChartData) {
		this.#rawData = value;
		this.#recalculate();
		this.notifyListeners();
	}

	get data(): HistogramChartData {
		return this.#rawData;
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
		this.#recalculate();
		this.notifyListeners();
	}

	get hoveredBin(): number | null {
		return this.#hoveredBin;
	}

	hoverBin(index: number): void {
		this.#hoveredBin = index;
		this.notifyListeners();
	}

	unhoverBin(): void {
		if (this.#hoveredBin === null) return;
		this.#hoveredBin = null;
		this.notifyListeners();
	}
}
