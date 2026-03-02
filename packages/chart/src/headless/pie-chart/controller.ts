import { ChangeNotifier } from "flitter-core";
import type { PieChartCustom, PieChartData } from "./types";

export class PieChartController extends ChangeNotifier {
	#rawData: PieChartData;
	#hiddenSeries: Set<string> = new Set();
	#hoveredIndex: number | null = null;
	#width: number = 0;
	#height: number = 0;

	// static config
	custom!: PieChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: PieChartData;
		custom: PieChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.custom = custom;
		this.config = config;
	}

	// --- data ---

	set data(value: PieChartData) {
		this.#rawData = value;
		this.notifyListeners();
	}

	get data(): PieChartData {
		const visibleIndices: number[] = [];
		this.#rawData.labels.forEach((label, i) => {
			if (!this.#hiddenSeries.has(label)) {
				visibleIndices.push(i);
			}
		});
		return {
			labels: visibleIndices.map((i) => this.#rawData.labels[i]),
			values: visibleIndices.map((i) => this.#rawData.values[i]),
		};
	}

	get legends(): string[] {
		return this.#rawData.labels;
	}

	// --- 차트 크기 ---

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

	// --- 레전드 필터 ---

	get hiddenSeries(): ReadonlySet<string> {
		return this.#hiddenSeries;
	}

	isSeriesVisible(label: string): boolean {
		return !this.#hiddenSeries.has(label);
	}

	toggleSeries(label: string): void {
		if (this.#hiddenSeries.has(label)) {
			this.#hiddenSeries.delete(label);
		} else {
			this.#hiddenSeries.add(label);
		}
		this.notifyListeners();
	}

	showSeries(label: string): void {
		if (!this.#hiddenSeries.has(label)) return;
		this.#hiddenSeries.delete(label);
		this.notifyListeners();
	}

	hideSeries(label: string): void {
		if (this.#hiddenSeries.has(label)) return;
		this.#hiddenSeries.add(label);
		this.notifyListeners();
	}

	showAllSeries(): void {
		if (this.#hiddenSeries.size === 0) return;
		this.#hiddenSeries.clear();
		this.notifyListeners();
	}

	// --- 호버 ---

	get hoveredIndex(): number | null {
		return this.#hoveredIndex;
	}

	hoverSlice(index: number): void {
		this.#hoveredIndex = index;
		this.notifyListeners();
	}

	unhoverSlice(): void {
		if (this.#hoveredIndex === null) return;
		this.#hoveredIndex = null;
		this.notifyListeners();
	}

	isSliceHovered(index: number): boolean {
		return this.#hoveredIndex === index;
	}
}
