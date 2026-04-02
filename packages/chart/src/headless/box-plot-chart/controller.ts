import { ChangeNotifier, GlobalKey } from "flitter-core";
import type {
	BoxPlotChartCustom,
	BoxPlotChartData,
	BoxPlotChartDirection,
	BoxPlotChartScale,
	GetScaleFn,
	GetScaleOptionsFn,
} from "./types";

type HoveredBoxPlot = {
	index: number;
	legend: string;
	kind: "boxPlot" | "outlier";
	value?: number;
	anchorKey: GlobalKey;
};

export class BoxPlotChartController extends ChangeNotifier {
	#rawData: BoxPlotChartData;
	#direction: BoxPlotChartDirection;
	#hiddenSeries: Set<string> = new Set();
	#hoveredBoxPlot: HoveredBoxPlot | null = null;
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
		this.#hoveredBoxPlot = null;
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
		this.#hoveredBoxPlot = null;
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
		this.#hoveredBoxPlot = null;
		this.#recalcScale();
		this.notifyListeners();
	}

	showSeries(legend: string): void {
		if (!this.#hiddenSeries.has(legend)) return;
		this.#hiddenSeries.delete(legend);
		this.#hoveredBoxPlot = null;
		this.#recalcScale();
		this.notifyListeners();
	}

	hideSeries(legend: string): void {
		if (this.#hiddenSeries.has(legend)) return;
		this.#hiddenSeries.add(legend);
		this.#hoveredBoxPlot = null;
		this.#recalcScale();
		this.notifyListeners();
	}

	showAllSeries(): void {
		if (this.#hiddenSeries.size === 0) return;
		this.#hiddenSeries.clear();
		this.#hoveredBoxPlot = null;
		this.#recalcScale();
		this.notifyListeners();
	}

	get hoveredBoxPlot(): HoveredBoxPlot | null {
		return this.#hoveredBoxPlot;
	}

	hoverBoxPlot(
		index: number,
		legend: string,
		detail: { kind?: HoveredBoxPlot["kind"]; value?: number; anchorKey: GlobalKey },
	): void {
		const next: HoveredBoxPlot = {
			index,
			legend,
			kind: detail.kind ?? "boxPlot",
			value: detail.value,
			anchorKey: detail.anchorKey,
		};
		if (
			this.#hoveredBoxPlot?.index === next.index &&
			this.#hoveredBoxPlot?.legend === next.legend &&
			this.#hoveredBoxPlot?.kind === next.kind &&
			this.#hoveredBoxPlot?.value === next.value &&
			this.#hoveredBoxPlot?.anchorKey === next.anchorKey
		) {
			return;
		}
		this.#hoveredBoxPlot = next;
		this.notifyListeners();
	}

	unhoverBoxPlot(match?: Partial<HoveredBoxPlot>): void {
		if (this.#hoveredBoxPlot === null) return;
		if (match != null) {
			if (
				match.index != null &&
				this.#hoveredBoxPlot.index !== match.index
			) {
				return;
			}
			if (
				match.legend != null &&
				this.#hoveredBoxPlot.legend !== match.legend
			) {
				return;
			}
			if (
				match.kind != null &&
				this.#hoveredBoxPlot.kind !== match.kind
			) {
				return;
			}
			if (
				match.value != null &&
				this.#hoveredBoxPlot.value !== match.value
			) {
				return;
			}
		}
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
