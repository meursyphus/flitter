import { ChangeNotifier } from "flitter-core";
import type { DonutChartCustom, DonutChartData } from "./types";

export class DonutChartController extends ChangeNotifier {
	#rawData: DonutChartData;
	#hiddenSeries: Set<string> = new Set();
	#hoveredIndex: number | null = null;
	#width = 0;
	#height = 0;

	custom!: DonutChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: DonutChartData;
		custom: DonutChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.custom = custom;
		this.config = config;
	}

	set data(value: DonutChartData) {
		this.#rawData = value;
		this.#hoveredIndex = null;
		this.notifyListeners();
	}

	get data(): DonutChartData {
		return {
			datasets: this.#rawData.datasets.filter(
				(dataset) => !this.#hiddenSeries.has(dataset.name),
			),
		};
	}

	get legends(): string[] {
		return this.#rawData.datasets.map((dataset) => dataset.name);
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
		this.#hoveredIndex = null;
		this.notifyListeners();
	}

	showAllSeries(): void {
		if (this.#hiddenSeries.size === 0) return;
		this.#hiddenSeries.clear();
		this.#hoveredIndex = null;
		this.notifyListeners();
	}

	get hoveredIndex(): number | null {
		return this.#hoveredIndex;
	}

	hoverSegment(index: number): void {
		if (this.#hoveredIndex === index) return;
		this.#hoveredIndex = index;
		this.notifyListeners();
	}

	unhoverSegment(index?: number): void {
		if (this.#hoveredIndex === null) return;
		if (index != null && this.#hoveredIndex !== index) return;
		this.#hoveredIndex = null;
		this.notifyListeners();
	}

	unhoverAllSegments(): void {
		this.unhoverSegment();
	}

	isSegmentHovered(index: number): boolean {
		return this.#hoveredIndex === index;
	}
}
