import { ChangeNotifier } from "flitter-core";
import type { HeatmapCustom, HeatmapData, HeatmapScale } from "./types";

export class HeatmapController extends ChangeNotifier {
	#rawData: HeatmapData;
	#width: number = 0;
	#height: number = 0;
	#hoveredSegment: { value: number; xIndex: number; yIndex: number; xLabel: string; yLabel: string } | null = null;

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

	get hoveredSegment(): { value: number; xIndex: number; yIndex: number; xLabel: string; yLabel: string } | null {
		return this.#hoveredSegment;
	}

	hoverSegment(xIndex: number, yIndex: number): void {
		const value = this.#rawData.values[yIndex]?.[xIndex] ?? 0;
		const xLabel = this.#rawData.xLabels[xIndex] ?? `${xIndex}`;
		const yLabel = this.#rawData.yLabels[yIndex] ?? `${yIndex}`;
		this.#hoveredSegment = { value, xIndex, yIndex, xLabel, yLabel };
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
