import { ChangeNotifier } from "flitter-core";
import type { RadarChartCustom, RadarChartData, RadarChartScale, GetScaleFn } from "./types";

export class RadarChartController extends ChangeNotifier {
	#rawData: RadarChartData;
	#hiddenSeries: Set<string> = new Set();
	#hoveredDataset: { index: number; name: string } | null = null;
	#scale: RadarChartScale | null = null;
	#getScale: GetScaleFn;
	#width: number = 0;
	#height: number = 0;

	// static config
	custom!: RadarChartCustom<any>;
	config: any;

	constructor({
		data,
		getScale,
		custom,
		config = {},
	}: {
		data: RadarChartData;
		getScale: GetScaleFn;
		custom: RadarChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.#getScale = getScale;
		this.custom = custom;
		this.config = config;
		this.#recalcScale();
	}

	// --- internal scale ---

	#recalcScale(): void {
		this.#scale = this.#getScale(this.data);
	}

	// --- data ---

	set data(value: RadarChartData) {
		this.#rawData = value;
		this.#recalcScale();
		this.notifyListeners();
	}

	get data(): RadarChartData {
		return {
			labels: this.#rawData.labels,
			datasets: this.#rawData.datasets.filter(
				(d) => !this.#hiddenSeries.has(d.name),
			),
		};
	}

	get legends(): string[] {
		return this.#rawData.datasets.map((d) => d.name);
	}

	// --- chart size ---

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

	// --- scale ---

	get scale(): RadarChartScale | null {
		return this.#scale;
	}

	// --- legend filter ---

	get hiddenSeries(): ReadonlySet<string> {
		return this.#hiddenSeries;
	}

	isSeriesVisible(name: string): boolean {
		return !this.#hiddenSeries.has(name);
	}

	toggleSeries(name: string): void {
		if (this.#hiddenSeries.has(name)) {
			this.#hiddenSeries.delete(name);
		} else {
			this.#hiddenSeries.add(name);
		}
		this.#recalcScale();
		this.notifyListeners();
	}

	showSeries(name: string): void {
		if (!this.#hiddenSeries.has(name)) return;
		this.#hiddenSeries.delete(name);
		this.#recalcScale();
		this.notifyListeners();
	}

	hideSeries(name: string): void {
		if (this.#hiddenSeries.has(name)) return;
		this.#hiddenSeries.add(name);
		this.#recalcScale();
		this.notifyListeners();
	}

	showAllSeries(): void {
		if (this.#hiddenSeries.size === 0) return;
		this.#hiddenSeries.clear();
		this.#recalcScale();
		this.notifyListeners();
	}

	// --- hover ---

	get hoveredDataset(): { index: number; name: string } | null {
		return this.#hoveredDataset;
	}

	hoverDataset(index: number, name: string): void {
		this.#hoveredDataset = { index, name };
		this.notifyListeners();
	}

	unhoverDataset(): void {
		if (this.#hoveredDataset === null) return;
		this.#hoveredDataset = null;
		this.notifyListeners();
	}

	isDatasetHovered(index: number, name: string): boolean {
		return (
			this.#hoveredDataset?.index === index && this.#hoveredDataset?.name === name
		);
	}
}
