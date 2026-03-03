import { ChangeNotifier } from "flitter-core";
import type { HeatmapCustom, HeatmapData, HeatmapScale } from "./types";

export type HeatmapHoverInfo = {
	value: number;
	xIndex: number;
	yIndex: number;
	xLabel: string;
	yLabel: string;
} | null;

export class HeatmapController extends ChangeNotifier {
	#rawData: HeatmapData;
	#width: number = 0;
	#height: number = 0;
	#hovered: HeatmapHoverInfo = null;
	#hoverListeners: Set<() => void> = new Set();

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

	// --- hover (separate listener to avoid full tree rebuild) ---

	get hovered(): HeatmapHoverInfo {
		return this.#hovered;
	}

	setHovered(info: HeatmapHoverInfo): void {
		if (
			this.#hovered?.xIndex === info?.xIndex &&
			this.#hovered?.yIndex === info?.yIndex
		)
			return;
		this.#hovered = info;
		for (const fn of this.#hoverListeners) fn();
	}

	addHoverListener(fn: () => void): void {
		this.#hoverListeners.add(fn);
	}

	removeHoverListener(fn: () => void): void {
		this.#hoverListeners.delete(fn);
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
