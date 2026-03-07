import { ChangeNotifier } from "flitter-core";
import type {
	BoxPlotChartCustom,
	BoxPlotChartData,
	BoxPlotChartDirection,
	BoxPlotChartScale,
	GetScaleFn,
	GetScaleOptionsFn,
} from "./types";

export class BoxPlotChartController extends ChangeNotifier {
	#rawData: BoxPlotChartData;
	#direction: BoxPlotChartDirection;
	#hiddenSeries: Set<string> = new Set();
	#hoveredBoxPlot: { index: number; legend: string } | null = null;
	#scale: BoxPlotChartScale | null = null;
	#getScale: GetScaleFn;
	#getScaleOptions: GetScaleOptionsFn | null;
	#width = 0;
	#height = 0;

	custom!: BoxPlotChartCustom<any>;
	config: any;

	constructor({
		data,
		getScale,
		getScaleOptions = null,
		direction = "vertical",
		custom,
		config = {},
	}: {
		data: BoxPlotChartData;
		getScale: GetScaleFn;
		getScaleOptions?: GetScaleOptionsFn | null;
		direction?: BoxPlotChartDirection;
		custom: BoxPlotChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.#getScale = getScale;
		this.#getScaleOptions = getScaleOptions;
		this.#direction = direction;
		this.custom = custom;
		this.config = config;
	}

	#recalcScale(): void {
		const options = this.#getScaleOptions?.(this) ?? { roughStepCount: 10 };
		this.#scale = this.#getScale(this.data, options);
	}

	set data(value: BoxPlotChartData) {
		this.#rawData = value;
		this.#recalcScale();
		this.notifyListeners();
	}

	get data(): BoxPlotChartData {
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

	get direction(): BoxPlotChartDirection {
		return this.#direction;
	}

	set direction(value: BoxPlotChartDirection) {
		if (this.#direction === value) return;
		this.#direction = value;
		this.#recalcScale();
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
		this.#recalcScale();
		this.notifyListeners();
	}

	get scale(): BoxPlotChartScale | null {
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

	get hoveredBoxPlot(): { index: number; legend: string } | null {
		return this.#hoveredBoxPlot;
	}

	hoverBoxPlot(index: number, legend: string): void {
		this.#hoveredBoxPlot = { index, legend };
		this.notifyListeners();
	}

	unhoverBoxPlot(): void {
		if (this.#hoveredBoxPlot === null) return;
		this.#hoveredBoxPlot = null;
		this.notifyListeners();
	}

	isBoxPlotHovered(index: number, legend: string): boolean {
		return (
			this.#hoveredBoxPlot?.index === index &&
			this.#hoveredBoxPlot?.legend === legend
		);
	}
}
