import { ChangeNotifier } from "flitter-core";
import type {
	CandlestickChartCustom,
	CandlestickChartData,
	CandlestickChartScale,
	GetScaleFn,
	GetScaleOptionsFn,
} from "./types";

export class CandlestickChartController extends ChangeNotifier {
	#rawData: CandlestickChartData;
	#hiddenSeries: Set<string> = new Set();
	#hoveredCandlestick: { index: number; legend: string } | null = null;
	#scale: CandlestickChartScale | null = null;
	#getScale: GetScaleFn;
	#getScaleOptions: GetScaleOptionsFn | null;
	#width = 0;
	#height = 0;

	custom!: CandlestickChartCustom<any>;
	config: any;

	constructor({
		data,
		getScale,
		getScaleOptions = null,
		custom,
		config = {},
	}: {
		data: CandlestickChartData;
		getScale: GetScaleFn;
		getScaleOptions?: GetScaleOptionsFn | null;
		custom: CandlestickChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.#getScale = getScale;
		this.#getScaleOptions = getScaleOptions;
		this.custom = custom;
		this.config = config;
	}

	#recalcScale(): void {
		const options = this.#getScaleOptions?.(this) ?? { roughStepCount: 10 };
		this.#scale = this.#getScale(this.data, options);
	}

	set data(value: CandlestickChartData) {
		this.#rawData = value;
		this.#recalcScale();
		this.notifyListeners();
	}

	get data(): CandlestickChartData {
		return {
			labels: this.#rawData.labels,
			datasets: this.#rawData.datasets.filter(
				(dataset) => !this.#hiddenSeries.has(dataset.legend),
			),
		};
	}

	get legends(): string[] {
		return this.#rawData.datasets.map((dataset) => dataset.legend);
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
		this.#recalcScale();
		this.notifyListeners();
	}

	get scale(): CandlestickChartScale | null {
		return this.#scale;
	}

	get hiddenSeries(): ReadonlySet<string> {
		return this.#hiddenSeries;
	}

	isSeriesVisible(legend: string): boolean {
		return !this.#hiddenSeries.has(legend);
	}

	toggleSeries(legend: string): void {
		if (this.#hiddenSeries.has(legend)) {
			this.#hiddenSeries.delete(legend);
		} else {
			this.#hiddenSeries.add(legend);
		}
		this.#recalcScale();
		this.notifyListeners();
	}

	showSeries(legend: string): void {
		if (!this.#hiddenSeries.has(legend)) return;
		this.#hiddenSeries.delete(legend);
		this.#recalcScale();
		this.notifyListeners();
	}

	hideSeries(legend: string): void {
		if (this.#hiddenSeries.has(legend)) return;
		this.#hiddenSeries.add(legend);
		this.#recalcScale();
		this.notifyListeners();
	}

	showAllSeries(): void {
		if (this.#hiddenSeries.size === 0) return;
		this.#hiddenSeries.clear();
		this.#recalcScale();
		this.notifyListeners();
	}

	get hoveredCandlestick(): { index: number; legend: string } | null {
		return this.#hoveredCandlestick;
	}

	hoverCandlestick(index: number, legend: string): void {
		this.#hoveredCandlestick = { index, legend };
		this.notifyListeners();
	}

	unhoverCandlestick(): void {
		if (this.#hoveredCandlestick === null) return;
		this.#hoveredCandlestick = null;
		this.notifyListeners();
	}

	isCandlestickHovered(index: number, legend: string): boolean {
		return (
			this.#hoveredCandlestick?.index === index &&
			this.#hoveredCandlestick?.legend === legend
		);
	}
}
