import { ChangeNotifier } from "flitter-core";
import type { RadarChartCustom, RadarChartData, RadarChartScale, GetScaleFn } from "./types";

export class RadarChartController extends ChangeNotifier {
	#rawData: RadarChartData;
	#hiddenSeries: Set<string> = new Set();
	#hoveredRadar: { index: number; legend: string } | null = null;
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
				(d) => !this.#hiddenSeries.has(d.legend),
			),
		};
	}

	get legends(): string[] {
		return this.#rawData.datasets.map((d) => d.legend);
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

	// --- hover ---

	get hoveredRadar(): { index: number; legend: string } | null {
		return this.#hoveredRadar;
	}

	hoverRadar(index: number, legend: string): void {
		this.#hoveredRadar = { index, legend };
		this.notifyListeners();
	}

	unhoverRadar(): void {
		if (this.#hoveredRadar === null) return;
		this.#hoveredRadar = null;
		this.notifyListeners();
	}

	isRadarHovered(index: number, legend: string): boolean {
		return (
			this.#hoveredRadar?.index === index && this.#hoveredRadar?.legend === legend
		);
	}
}
