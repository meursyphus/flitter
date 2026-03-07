import { ChangeNotifier } from "flitter-core";
import type {
	ProgressChartCustom,
	ProgressChartData,
	ProgressSegment,
} from "./types";

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

export class ProgressChartController extends ChangeNotifier {
	#rawData: ProgressChartData;
	#width = 0;
	#height = 0;

	custom!: ProgressChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: ProgressChartData;
		custom: ProgressChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.custom = custom;
		this.config = config;
	}

	set data(value: ProgressChartData) {
		this.#rawData = value;
		this.notifyListeners();
	}

	get data(): ProgressChartData {
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

	get max(): number {
		if ("segments" in this.#rawData) {
			const total = this.#rawData.segments.reduce((sum, segment) => sum + segment.value, 0);
			return this.#rawData.max ?? total;
		}

		return this.#rawData.max ?? 100;
	}

	get totalValue(): number {
		if ("segments" in this.#rawData) {
			return this.#rawData.segments.reduce((sum, segment) => sum + segment.value, 0);
		}

		return this.#rawData.value;
	}

	get ratio(): number {
		return this.max > 0 ? clamp(this.totalValue / this.max, 0, 1) : 0;
	}

	get segments(): ProgressSegment[] {
		if ("segments" in this.#rawData) {
			return this.#rawData.segments.map((segment, index) => ({
				value: segment.value,
				ratio: this.max > 0 ? clamp(segment.value / this.max, 0, 1) : 0,
				index,
				label: segment.label,
				color: segment.color,
			}));
		}

		return [
			{
				value: this.#rawData.value,
				ratio: this.max > 0 ? clamp(this.#rawData.value / this.max, 0, 1) : 0,
				index: 0,
				label: this.#rawData.label ?? "",
			},
		];
	}
}
