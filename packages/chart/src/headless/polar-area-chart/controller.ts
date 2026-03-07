import { ChangeNotifier } from "flitter-core";
import type { PolarAreaChartCustom, PolarAreaChartData } from "./types";

export class PolarAreaChartController extends ChangeNotifier {
	#rawData: PolarAreaChartData;
	#hiddenSeries: Set<string> = new Set();
	#hoveredIndex: number | null = null;
	#width = 0;
	#height = 0;

	custom!: PolarAreaChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: PolarAreaChartData;
		custom: PolarAreaChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.custom = custom;
		this.config = config;
	}

	set data(value: PolarAreaChartData) {
		this.#rawData = value;
		this.notifyListeners();
	}

	get data(): PolarAreaChartData {
		return {
			datasets: this.#rawData.datasets.filter(
				(dataset) => !this.#hiddenSeries.has(dataset.name),
			),
		};
	}

	get legends(): string[] {
		return this.#rawData.datasets.map((dataset) => dataset.name);
	}

	get maxValue(): number {
		return this.data.datasets.reduce(
			(max, dataset) => Math.max(max, dataset.value),
			0,
		);
	}

	get angleStep(): number {
		return this.data.datasets.length > 0 ? (Math.PI * 2) / this.data.datasets.length : 0;
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

	toggleSeries(name: string): void {
		if (this.#hiddenSeries.has(name)) {
			this.#hiddenSeries.delete(name);
		} else {
			this.#hiddenSeries.add(name);
		}
		this.notifyListeners();
	}

	isSeriesVisible(name: string): boolean {
		return !this.#hiddenSeries.has(name);
	}

	get hoveredIndex(): number | null {
		return this.#hoveredIndex;
	}

	hoverSector(index: number): void {
		this.#hoveredIndex = index;
		this.notifyListeners();
	}

	unhoverSector(): void {
		if (this.#hoveredIndex === null) return;
		this.#hoveredIndex = null;
		this.notifyListeners();
	}

	isSliceHovered(index: number): boolean {
		return this.#hoveredIndex === index;
	}
}
