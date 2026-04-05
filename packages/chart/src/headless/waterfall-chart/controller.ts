import { ChangeNotifier, GlobalKey } from "flitter-core";
import { getScale, normalizeWaterfallData } from "./transform";
import type {
	GetScaleFn,
	GetScaleOptionsFn,
	WaterfallChartCustom,
	WaterfallChartData,
	WaterfallChartDatum,
	WaterfallChartScale,
} from "./types";

export class WaterfallChartController extends ChangeNotifier {
	#rawData: WaterfallChartData;
	#items: WaterfallChartDatum[] = [];
	#scale: WaterfallChartScale | null = null;
	#getScale: GetScaleFn;
	#getScaleOptions: GetScaleOptionsFn | null;
	#width = 0;
	#height = 0;
	#hoveredBar: { index: number; anchorKey: GlobalKey } | null = null;

	custom!: WaterfallChartCustom<any>;
	config: any;

	constructor({
		data,
		getScale: scaleFn = getScale,
		getScaleOptions = null,
		custom,
		config = {},
	}: {
		data: WaterfallChartData;
		getScale?: GetScaleFn;
		getScaleOptions?: GetScaleOptionsFn | null;
		custom: WaterfallChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.#getScale = scaleFn;
		this.#getScaleOptions = getScaleOptions;
		this.custom = custom;
		this.config = config;
		this.#recalculate();
	}

	#recalculate(): void {
		this.#items = normalizeWaterfallData(this.#rawData);
		if (this.#items.length === 0) {
			this.#scale = null;
			return;
		}

		const options = this.#getScaleOptions?.(this) ?? { roughStepCount: 10 };
		this.#scale = this.#getScale(this.#items, options);
	}

	set data(value: WaterfallChartData) {
		this.#rawData = value;
		this.#hoveredBar = null;
		this.#recalculate();
		this.notifyListeners();
	}

	get data(): WaterfallChartData {
		return this.#rawData;
	}

	get items(): WaterfallChartDatum[] {
		return this.#items;
	}

	get scale(): WaterfallChartScale | null {
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
		this.#recalculate();
		this.notifyListeners();
	}

	get hoveredBar(): { index: number; anchorKey: GlobalKey } | null {
		return this.#hoveredBar;
	}

	hoverBar(index: number, anchorKey: GlobalKey): void {
		this.#hoveredBar = { index, anchorKey };
		this.notifyListeners();
	}

	unhoverBar(index?: number): void {
		if (this.#hoveredBar == null) return;
		if (index != null && this.#hoveredBar.index !== index) return;
		this.#hoveredBar = null;
		this.notifyListeners();
	}

	unhoverAllBars(): void {
		if (this.#hoveredBar == null) return;
		this.#hoveredBar = null;
		this.notifyListeners();
	}

	isBarHovered(index: number): boolean {
		return this.#hoveredBar?.index === index;
	}
}
