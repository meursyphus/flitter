import { ChangeNotifier, GlobalKey } from "flitter-core";
import { createTicks, normalizeCandles } from "./transform";
import type {
	CandlestickChartCandle,
	CandlestickChartCustom,
	CandlestickChartData,
	CandlestickChartScale,
	CandlestickChartTick,
	CandlestickChartTransform,
	CandlestickChartXValueType,
	GetScaleFn,
	GetScaleOptionsFn,
	GetTicksFn,
} from "./types";

export class CandlestickChartController extends ChangeNotifier {
	#rawData: CandlestickChartData;
	#transform: CandlestickChartTransform;
	#candles: CandlestickChartCandle[] = [];
	#xTicks: CandlestickChartTick[] = [];
	#xValueType: CandlestickChartXValueType = "string";
	#hoveredCandlestick: { index: number; anchorKey: GlobalKey } | null = null;
	#scale: CandlestickChartScale | null = null;
	#getScale: GetScaleFn;
	#getScaleOptions: GetScaleOptionsFn | null;
	#getTicks: GetTicksFn;
	#width = 0;
	#height = 0;

	custom!: CandlestickChartCustom<any>;
	config: any;

	constructor({
		data,
		transform = {},
		getScale,
		getScaleOptions = null,
		getTicks,
		custom,
		config = {},
	}: {
		data: CandlestickChartData;
		transform?: CandlestickChartTransform;
		getScale: GetScaleFn;
		getScaleOptions?: GetScaleOptionsFn | null;
		getTicks: GetTicksFn;
		custom: CandlestickChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.#transform = transform;
		this.#getScale = getScale;
		this.#getScaleOptions = getScaleOptions;
		this.#getTicks = getTicks;
		this.custom = custom;
		this.config = config;
		this.#recalculate();
	}

	#recalculate(): void {
		const { candles, xValueType } = normalizeCandles(this.#rawData, this.#transform);
		this.#candles = candles;
		this.#xValueType = xValueType;
		this.#xTicks = this.#getTicks(candles, xValueType, this.#transform, this.#width);
		if (candles.length === 0) {
			this.#scale = null;
			return;
		}

		const options = this.#getScaleOptions?.(this) ?? { roughStepCount: 10 };
		this.#scale = this.#getScale(candles, options);
	}

	set data(value: CandlestickChartData) {
		this.#rawData = value;
		this.#hoveredCandlestick = null;
		this.#recalculate();
		this.notifyListeners();
	}

	get data(): CandlestickChartData {
		return this.#rawData;
	}

	set transform(value: CandlestickChartTransform) {
		this.#transform = value;
		this.#hoveredCandlestick = null;
		this.#recalculate();
		this.notifyListeners();
	}

	get transform(): CandlestickChartTransform {
		return this.#transform;
	}

	get candles(): CandlestickChartCandle[] {
		return this.#candles;
	}

	get xTicks(): CandlestickChartTick[] {
		return this.#xTicks;
	}

	get xValueType(): CandlestickChartXValueType {
		return this.#xValueType;
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

	get scale(): CandlestickChartScale | null {
		return this.#scale;
	}

	get hoveredCandlestick(): { index: number; anchorKey: GlobalKey } | null {
		return this.#hoveredCandlestick;
	}

	hoverCandlestick(index: number, anchorKey: GlobalKey): void {
		this.#hoveredCandlestick = { index, anchorKey };
		this.notifyListeners();
	}

	unhoverCandlestick(index: number): void {
		if (this.#hoveredCandlestick?.index !== index) return;
		this.#hoveredCandlestick = null;
		this.notifyListeners();
	}

	unhoverAllCandlesticks(): void {
		if (this.#hoveredCandlestick == null) return;
		this.#hoveredCandlestick = null;
		this.notifyListeners();
	}

	isCandlestickHovered(index: number): boolean {
		return this.#hoveredCandlestick?.index === index;
	}
}
