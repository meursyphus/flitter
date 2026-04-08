import { ChangeNotifier } from "flitter-core";
import type {
	HoveredRadar,
	HoveredRadarPoint,
	RadarChartCustom,
	RadarChartData,
	RadarChartScale,
	RadarVertex,
	GetScaleFn,
} from "./types";
import { computeRadarVertices, getRadarAnchorPoint } from "./geometry";

export class RadarChartController<TConfig extends object = {}> extends ChangeNotifier {
	#rawData: RadarChartData;
	#hiddenSeries: Set<string> = new Set();
	#hoveredRadar: HoveredRadar | null = null;
	#hoveredPoint: HoveredRadarPoint | null = null;
	#scale: RadarChartScale | null = null;
	#getScale: GetScaleFn;
	#width: number = 0;
	#height: number = 0;
	#plotWidth: number = 0;
	#plotHeight: number = 0;

	// static config
	custom!: RadarChartCustom<TConfig>;
	config: TConfig;

	constructor({
		data,
		getScale,
		custom,
		config = {} as TConfig,
	}: {
		data: RadarChartData;
		getScale: GetScaleFn;
		custom: RadarChartCustom<TConfig>;
		config?: TConfig;
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
		this.#normalizeHoveredRadar();
		this.#normalizeHoveredPoint();
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

	get plotWidth(): number {
		return this.#plotWidth;
	}

	get plotHeight(): number {
		return this.#plotHeight;
	}

	setPlotSize(width: number, height: number): void {
		if (this.#plotWidth === width && this.#plotHeight === height) return;
		this.#plotWidth = width;
		this.#plotHeight = height;
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
		this.#normalizeHoveredRadar();
		this.#normalizeHoveredPoint();
		this.notifyListeners();
	}

	showSeries(legend: string): void {
		if (!this.#hiddenSeries.has(legend)) return;
		this.#hiddenSeries.delete(legend);
		this.#recalcScale();
		this.#normalizeHoveredRadar();
		this.#normalizeHoveredPoint();
		this.notifyListeners();
	}

	hideSeries(legend: string): void {
		if (this.#hiddenSeries.has(legend)) return;
		this.#hiddenSeries.add(legend);
		this.#recalcScale();
		this.#normalizeHoveredRadar();
		this.#normalizeHoveredPoint();
		this.notifyListeners();
	}

	showAllSeries(): void {
		if (this.#hiddenSeries.size === 0) return;
		this.#hiddenSeries.clear();
		this.#recalcScale();
		this.#normalizeHoveredRadar();
		this.#normalizeHoveredPoint();
		this.notifyListeners();
	}

	// --- hover ---

	get hoveredRadar(): HoveredRadar | null {
		return this.#hoveredRadar;
	}

	get hoveredPoint(): HoveredRadarPoint | null {
		return this.#hoveredPoint;
	}

	hoverRadar(index: number, legend: string): void {
		if (this.#hoveredRadar?.index === index && this.#hoveredRadar.legend === legend) {
			return;
		}
		this.#hoveredRadar = { index, legend };
		this.notifyListeners();
	}

	unhoverRadar(index: number, legend: string): void {
		if (this.#hoveredRadar === null) return;
		if (this.#hoveredRadar.index !== index || this.#hoveredRadar.legend !== legend) return;
		this.#hoveredRadar = null;
		this.notifyListeners();
	}

	unhoverAllRadars(): void {
		if (this.#hoveredRadar === null) return;
		this.#hoveredRadar = null;
		this.notifyListeners();
	}

	hoverPoint(index: number, legend: string, pointIndex: number): void {
		if (
			this.#hoveredPoint?.index === index &&
			this.#hoveredPoint.legend === legend &&
			this.#hoveredPoint.pointIndex === pointIndex
		) {
			return;
		}
		this.#hoveredPoint = { index, legend, pointIndex };
		this.notifyListeners();
	}

	unhoverPoint(index: number, legend: string, pointIndex: number): void {
		if (this.#hoveredPoint === null) return;
		if (
			this.#hoveredPoint.index !== index ||
			this.#hoveredPoint.legend !== legend ||
			this.#hoveredPoint.pointIndex !== pointIndex
		) {
			return;
		}
		this.#hoveredPoint = null;
		this.notifyListeners();
	}

	unhoverAllPoints(): void {
		if (this.#hoveredPoint === null) return;
		this.#hoveredPoint = null;
		this.notifyListeners();
	}

	isPointHovered(index: number, legend: string, pointIndex: number): boolean {
		return (
			this.#hoveredPoint?.index === index &&
			this.#hoveredPoint?.legend === legend &&
			this.#hoveredPoint?.pointIndex === pointIndex
		);
	}

	isRadarHovered(index: number, legend: string): boolean {
		return (
			this.#hoveredRadar?.index === index && this.#hoveredRadar?.legend === legend
		);
	}

	getRadarVertices(index: number, legend: string): RadarVertex[] | null {
		const scale = this.#scale;
		if (scale == null) return null;

		const dataset = this.data.datasets[index];
		if (dataset == null || dataset.legend !== legend) return null;

		return computeRadarVertices(
			dataset.values,
			this.data.labels,
			scale.max,
		);
	}

	getRadarAnchorPosition(index: number, legend: string): { x: number; y: number } | null {
		if (this.#plotWidth <= 0 || this.#plotHeight <= 0) return null;

		const vertices = this.getRadarVertices(index, legend);
		if (vertices == null) return null;

		return getRadarAnchorPoint(vertices, this.#plotWidth, this.#plotHeight);
	}

	getRadarPoint(index: number, legend: string, pointIndex: number): RadarVertex | null {
		const vertices = this.getRadarVertices(index, legend);
		if (vertices == null || pointIndex < 0 || pointIndex >= vertices.length) return null;
		return vertices[pointIndex] ?? null;
	}

	getRadarPointPosition(index: number, legend: string, pointIndex: number): { x: number; y: number } | null {
		if (this.#plotWidth <= 0 || this.#plotHeight <= 0) return null;

		const vertex = this.getRadarPoint(index, legend, pointIndex);
		if (vertex == null) return null;

		return {
			x: vertex.nx * this.#plotWidth,
			y: vertex.ny * this.#plotHeight,
		};
	}

	#normalizeHoveredRadar(): void {
		if (this.#hoveredRadar == null) return;

		const visibleIndex = this.data.datasets.findIndex(
			(dataset) => dataset.legend === this.#hoveredRadar?.legend,
		);

		if (visibleIndex < 0) {
			this.#hoveredRadar = null;
			return;
		}

		this.#hoveredRadar = {
			index: visibleIndex,
			legend: this.#hoveredRadar.legend,
		};
	}

	#normalizeHoveredPoint(): void {
		if (this.#hoveredPoint == null) return;

		const visibleIndex = this.data.datasets.findIndex(
			(dataset) => dataset.legend === this.#hoveredPoint?.legend,
		);

		if (visibleIndex < 0) {
			this.#hoveredPoint = null;
			return;
		}

		const dataset = this.data.datasets[visibleIndex];
		if (dataset == null || this.#hoveredPoint.pointIndex >= dataset.values.length) {
			this.#hoveredPoint = null;
			return;
		}

		this.#hoveredPoint = {
			index: visibleIndex,
			legend: this.#hoveredPoint.legend,
			pointIndex: this.#hoveredPoint.pointIndex,
		};
	}
}
