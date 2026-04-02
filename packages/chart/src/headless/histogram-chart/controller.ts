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
		const { values, bins: customBins, binCount } = this.#rawData;

		if (values.length === 0) {
			this.#bins = [];
		} else if (customBins && customBins.length > 0) {
			// Custom bin boundaries (AG-style tuples)
			const bins: HistogramBin[] = customBins.map(([lo, hi]) => ({
				min: lo,
				max: hi,
				count: 0,
				label: formatRangeLabel(lo, hi),
			}));

			for (const value of values) {
				for (let i = 0; i < bins.length; i++) {
					const bin = bins[i];
					const inBin =
						i === bins.length - 1
							? value >= bin.min && value <= bin.max
							: value >= bin.min && value < bin.max;
					if (inBin) {
						bin.count += 1;
						break;
					}
				}
			}

			this.#bins = bins;
		} else {
			// Auto-bin using Sturges' rule or explicit binCount
			const min = Math.min(...values);
			const max = Math.max(...values);
			const count = binCount ?? sturgesRule(values.length);
			const range = max - min || 1;
			const binWidth = range / count;
			const bins = Array.from({ length: count }, (_, index) => ({
				min: min + index * binWidth,
				max: index === count - 1 ? max : min + (index + 1) * binWidth,
				count: 0,
				label: "",
			}));

			for (const value of values) {
				const relative = (value - min) / range;
				const index = Math.min(count - 1, Math.floor(relative * count));
				bins[index].count += 1;
			}

			this.#bins = bins.map((bin) => ({
				...bin,
				label: formatRangeLabel(bin.min, bin.max),
			}));
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

	unhoverBin(index: number): void {
		if (this.#hoveredBin !== index) return;
		this.#hoveredBin = null;
		this.notifyListeners();
	}

	unhoverAllBins(): void {
		if (this.#hoveredBin === null) return;
		this.#hoveredBin = null;
		this.notifyListeners();
	}

	isBinHovered(index: number): boolean {
		return this.#hoveredBin === index;
	}
}
