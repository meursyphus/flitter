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
		this.#hoveredIndex = null;
		this.notifyListeners();
	}

	get data(): PieChartData {
		return {
			datasets: this.#rawData.datasets.filter(
				(d) => !this.#hiddenSeries.has(d.name),
			),
		};
	}

	get legends(): string[] {
		return this.#rawData.datasets.map((d) => d.name);
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

	showSeries(name: string): void {
		if (!this.#hiddenSeries.has(name)) return;
		this.#hiddenSeries.delete(name);
		this.#hoveredIndex = null;
		this.notifyListeners();
	}

	hideSeries(name: string): void {
		if (this.#hiddenSeries.has(name)) return;
		this.#hiddenSeries.add(name);
		this.#hoveredIndex = null;
		this.notifyListeners();
	}

	showAllSeries(): void {
		if (this.#hiddenSeries.size === 0) return;
		this.#hiddenSeries.clear();
		this.#hoveredIndex = null;
		this.notifyListeners();
	}

	// --- 호버 ---

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
