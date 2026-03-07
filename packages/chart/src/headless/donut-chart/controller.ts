import { ChangeNotifier } from "flitter-core";
import type { DonutChartCustom, DonutChartData } from "./types";

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

export class DonutChartController extends ChangeNotifier {
	#rawData: DonutChartData;
	#hiddenSeries: Set<string> = new Set();
	#hoveredIndex: number | null = null;
	#width = 0;
	#height = 0;
	#innerRadiusRatio: number;

	custom!: DonutChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		innerRadiusRatio = 0.6,
		config = {},
	}: {
		data: DonutChartData;
		custom: DonutChartCustom<any>;
		innerRadiusRatio?: number;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.#innerRadiusRatio = clamp(innerRadiusRatio, 0.05, 0.95);
		this.custom = custom;
		this.config = config;
	}

	set data(value: DonutChartData) {
		this.#rawData = value;
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

	get innerRadiusRatio(): number {
		return this.#innerRadiusRatio;
	}

	set innerRadiusRatio(value: number) {
		const next = clamp(value, 0.05, 0.95);
		if (this.#innerRadiusRatio === next) return;
		this.#innerRadiusRatio = next;
		this.notifyListeners();
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
		this.notifyListeners();
	}

	showAllSeries(): void {
		if (this.#hiddenSeries.size === 0) return;
		this.#hiddenSeries.clear();
		this.notifyListeners();
	}

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
