import { ChangeNotifier } from "flitter-core";
import { refineScale } from "@shared/utils/scale";
import type {
	WaterfallBarType,
	WaterfallChartCustom,
	WaterfallChartData,
	WaterfallChartScale,
	WaterfallTotal,
} from "./types";

function buildScale(values: number[]): WaterfallChartScale {
	let min = Infinity;
	let max = -Infinity;

	for (const value of values) {
		min = Math.min(min, value);
		max = Math.max(max, value);
	}

	const roughMin = min > 0 ? 0 : min;
	const roughMax = max < 0 ? 0 : max;

	return refineScale({
		min: roughMin,
		max: roughMax,
		step: (roughMax - roughMin || 1) / 10,
	});
}

export class WaterfallChartController extends ChangeNotifier {
	#rawData: WaterfallChartData;
	#scale: WaterfallChartScale | null = null;
	#cumulativeValues: number[] = [];
	#types: WaterfallBarType[] = [];
	#width = 0;
	#height = 0;
	#hoveredBar: number | null = null;

	custom!: WaterfallChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: WaterfallChartData;
		custom: WaterfallChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.custom = custom;
		this.config = config;
	}

	#recalculate(): void {
		const totalsMap = new Map<number, WaterfallTotal>();
		for (const t of this.#rawData.totals ?? []) {
			totalsMap.set(t.index, t);
		}

		const cumulativeValues: number[] = [];
		const types: WaterfallBarType[] = [];
		const scaleValues: number[] = [];
		let runningTotal = 0;

		for (let index = 0; index < this.#rawData.values.length; index++) {
			const value = this.#rawData.values[index];
			const totalInfo = totalsMap.get(index);
			const type: WaterfallBarType = totalInfo
				? totalInfo.totalType
				: value >= 0
					? "increase"
					: "decrease";

			types.push(type);

			if (totalInfo) {
				cumulativeValues.push(value);
				scaleValues.push(0, value);
				if (totalInfo.totalType === "total") {
					runningTotal = value;
				}
				// subtotal: don't reset runningTotal
			} else {
				const start = runningTotal;
				runningTotal += value;
				cumulativeValues.push(runningTotal);
				scaleValues.push(start, runningTotal);
			}
		}

		this.#types = types;
		this.#cumulativeValues = cumulativeValues;
		this.#scale = scaleValues.length > 0 ? buildScale(scaleValues) : null;
	}

	set data(value: WaterfallChartData) {
		this.#rawData = value;
		this.#recalculate();
		this.notifyListeners();
	}

	get data(): WaterfallChartData {
		return this.#rawData;
	}

	get scale(): WaterfallChartScale | null {
		return this.#scale;
	}

	get cumulativeValues(): number[] {
		return this.#cumulativeValues;
	}

	get types(): WaterfallBarType[] {
		return this.#types;
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
		this.#recalculate();
		this.notifyListeners();
	}

	get hoveredBar(): number | null {
		return this.#hoveredBar;
	}

	hoverBar(index: number): void {
		this.#hoveredBar = index;
		this.notifyListeners();
	}

	unhoverBar(): void {
		if (this.#hoveredBar === null) return;
		this.#hoveredBar = null;
		this.notifyListeners();
	}

	isBarHovered(index: number): boolean {
		return this.#hoveredBar === index;
	}
}
