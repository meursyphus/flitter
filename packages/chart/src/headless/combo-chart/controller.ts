import { ChangeNotifier } from "flitter-core";
import { refineScale } from "@shared/utils/scale";
import type {
	ComboAxisScale,
	ComboChartCustom,
	ComboChartData,
	ComboChartScale,
	ComboDataset,
} from "./types";

function buildScale(values: number[]): ComboAxisScale {
	const min = Math.min(...values);
	const max = Math.max(...values);
	const roughMin = min > 0 ? 0 : min;
	const roughMax = max < 0 ? 0 : max;
	return refineScale({
		min: roughMin,
		max: roughMax,
		step: (roughMax - roughMin || 1) / 10,
	});
}

export class ComboChartController extends ChangeNotifier {
	#rawData: ComboChartData;
	#scale: ComboChartScale | null = null;
	#hiddenSeries: Set<string> = new Set();
	#width = 0;
	#height = 0;

	custom!: ComboChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: ComboChartData;
		custom: ComboChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.custom = custom;
		this.config = config;
	}

	#recalculateScale(): void {
		const visible = this.data.datasets;
		if (visible.length === 0) {
			this.#scale = null;
			return;
		}

		const primaryValues = visible
			.filter((dataset) => (dataset.yAxisId ?? "primary") === "primary")
			.flatMap((dataset) => dataset.values);
		const secondaryValues = visible
			.filter((dataset) => dataset.yAxisId === "secondary")
			.flatMap((dataset) => dataset.values);

		this.#scale = {
			primary: buildScale(primaryValues.length > 0 ? primaryValues : [0]),
			secondary:
				secondaryValues.length > 0 ? buildScale(secondaryValues) : undefined,
		};
	}

	set data(value: ComboChartData) {
		this.#rawData = value;
		this.#recalculateScale();
		this.notifyListeners();
	}

	get data(): ComboChartData {
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

	get scale(): ComboChartScale | null {
		return this.#scale;
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
		this.#recalculateScale();
		this.notifyListeners();
	}

	toggleSeries(legend: string): void {
		if (this.#hiddenSeries.has(legend)) {
			this.#hiddenSeries.delete(legend);
		} else {
			this.#hiddenSeries.add(legend);
		}
		this.#recalculateScale();
		this.notifyListeners();
	}

	get bars(): ComboDataset[] {
		return this.data.datasets.filter((dataset) => dataset.type === "bar");
	}

	get lines(): ComboDataset[] {
		return this.data.datasets.filter((dataset) => dataset.type === "line");
	}

	get areas(): ComboDataset[] {
		return this.data.datasets.filter((dataset) => dataset.type === "area");
	}
}
