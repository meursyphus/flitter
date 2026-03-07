import { ChangeNotifier } from "flitter-core";
import type { GaugeChartCustom, GaugeChartData, GaugeChartZone } from "./types";

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

export class GaugeChartController extends ChangeNotifier {
	#rawData: GaugeChartData;
	#width = 0;
	#height = 0;

	custom!: GaugeChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: GaugeChartData;
		custom: GaugeChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.custom = custom;
		this.config = config;
	}

	set data(value: GaugeChartData) {
		this.#rawData = value;
		this.notifyListeners();
	}

	get data(): GaugeChartData {
		return this.#rawData;
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

	get min(): number {
		return this.#rawData.min;
	}

	get max(): number {
		return this.#rawData.max;
	}

	get value(): number {
		return clamp(this.#rawData.value, this.min, this.max);
	}

	get zones(): GaugeChartZone[] {
		if (this.#rawData.zones && this.#rawData.zones.length > 0) {
			return this.#rawData.zones;
		}

		return [{ min: this.min, max: this.max, color: "#d7d7d7" }];
	}

	get ratio(): number {
		if (this.max === this.min) return 0;
		return (this.value - this.min) / (this.max - this.min);
	}

	angleForValue(value: number): number {
		const ratio = this.max === this.min ? 0 : (value - this.min) / (this.max - this.min);
		return Math.PI - clamp(ratio, 0, 1) * Math.PI;
	}

	setValue(value: number): void {
		if (this.#rawData.value === value) return;
		this.#rawData = {
			...this.#rawData,
			value,
		};
		this.notifyListeners();
	}
}
