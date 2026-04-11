import { ChangeNotifier, GlobalKey } from "flitter-core";
import type {
	HeatmapCustom,
	HeatmapData,
	HeatmapHoveredSegment,
	HeatmapScale,
} from "./types";

export class HeatmapController extends ChangeNotifier {
	#rawData: HeatmapData;
	#width: number = 0;
	#height: number = 0;
	#hoveredSegment:
		| (HeatmapHoveredSegment & { anchorKey: GlobalKey })
		| null = null;

	// static config
	custom!: HeatmapCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: HeatmapData;
		custom: HeatmapCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.custom = custom;
		this.config = config;
	}

	// --- data ---

	set data(value: HeatmapData) {
		this.#rawData = value;
		this.notifyListeners();
	}

	get data(): HeatmapData {
		return this.#rawData;
	}

	// --- scale ---

	get scale(): HeatmapScale {
		const flat = this.#rawData.values.flat();
		return {
			min: flat.length > 0 ? Math.min(...flat) : 0,
			max: flat.length > 0 ? Math.max(...flat) : 0,
		};
	}

	// --- hover ---

	get hoveredSegment(): HeatmapHoveredSegment | null {
		if (this.#hoveredSegment == null) return null;
		const { anchorKey: _anchorKey, ...hoveredSegment } = this.#hoveredSegment;
		return hoveredSegment;
	}

	get hoveredSegmentAnchorKey(): GlobalKey | null {
		return this.#hoveredSegment?.anchorKey ?? null;
	}

	hoverSegment(xIndex: number, yIndex: number, anchorKey: GlobalKey): void {
		const value = this.#rawData.values[yIndex]?.[xIndex] ?? 0;
		const xLabel = this.#rawData.xLabels[xIndex] ?? `${xIndex}`;
		const yLabel = this.#rawData.yLabels[yIndex] ?? `${yIndex}`;
		this.#hoveredSegment = { value, xIndex, yIndex, xLabel, yLabel, anchorKey };
		this.notifyListeners();
	}

	unhoverSegment(xIndex: number, yIndex: number): void {
		if (this.#hoveredSegment === null) return;
		if (this.#hoveredSegment.xIndex !== xIndex || this.#hoveredSegment.yIndex !== yIndex) return;
		this.#hoveredSegment = null;
		this.notifyListeners();
	}

	unhoverAllSegments(): void {
		if (this.#hoveredSegment === null) return;
		this.#hoveredSegment = null;
		this.notifyListeners();
	}

	isSegmentHovered(xIndex: number, yIndex: number): boolean {
		return (
			this.#hoveredSegment?.xIndex === xIndex && this.#hoveredSegment?.yIndex === yIndex
		);
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
}
