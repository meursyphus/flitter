import { ChangeNotifier } from "flitter-core";
import type { TreemapCustom, TreemapData, TreemapLayout } from "./types";
import { squarify } from "./squarify";

export class TreemapController extends ChangeNotifier {
	#rawData: TreemapData;
	#hiddenSeries: Set<string> = new Set();
	#hoveredIndex: number | null = null;
	#width: number = 0;
	#height: number = 0;
	#layouts: TreemapLayout[] = [];

	// static config
	custom!: TreemapCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: TreemapData;
		custom: TreemapCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.custom = custom;
		this.config = config;
	}

	// --- data ---

	set data(value: TreemapData) {
		this.#rawData = value;
		this.#recalculateLayouts();
		this.notifyListeners();
	}

	get data(): TreemapData {
		return this.#rawData;
	}

	get visibleData(): TreemapData {
		return {
			nodes: this.#rawData.nodes.filter(
				(n) => !this.#hiddenSeries.has(n.label),
			),
		};
	}

	get legends(): string[] {
		return this.#rawData.nodes.map((n) => n.label);
	}

	// --- 차트 크기 ---

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
		this.#recalculateLayouts();
		this.notifyListeners();
	}

	// --- layouts ---

	get layouts(): TreemapLayout[] {
		return this.#layouts;
	}

	#recalculateLayouts(): void {
		const visible = this.visibleData;
		if (this.#width === 0 || this.#height === 0 || visible.nodes.length === 0) {
			this.#layouts = [];
			return;
		}

		const nodesWithIndex = visible.nodes.map((n, i) => ({
			value: n.value,
			index: i,
		}));

		this.#layouts = squarify(nodesWithIndex, this.#width, this.#height);
	}

	// --- 레전드 필터 ---

	get hiddenSeries(): ReadonlySet<string> {
		return this.#hiddenSeries;
	}

	isSeriesVisible(name: string): boolean {
		return !this.#hiddenSeries.has(name);
	}

	toggleSeries(name: string): void {
		if (this.#hiddenSeries.has(name)) {
			this.#hiddenSeries.delete(name);
		} else {
			this.#hiddenSeries.add(name);
		}
		this.#recalculateLayouts();
		this.notifyListeners();
	}

	showSeries(name: string): void {
		if (!this.#hiddenSeries.has(name)) return;
		this.#hiddenSeries.delete(name);
		this.#recalculateLayouts();
		this.notifyListeners();
	}

	hideSeries(name: string): void {
		if (this.#hiddenSeries.has(name)) return;
		this.#hiddenSeries.add(name);
		this.#recalculateLayouts();
		this.notifyListeners();
	}

	showAllSeries(): void {
		if (this.#hiddenSeries.size === 0) return;
		this.#hiddenSeries.clear();
		this.#recalculateLayouts();
		this.notifyListeners();
	}

	// --- 호버 ---

	get hoveredIndex(): number | null {
		return this.#hoveredIndex;
	}

	hoverNode(index: number): void {
		this.#hoveredIndex = index;
		this.notifyListeners();
	}

	unhoverNode(): void {
		if (this.#hoveredIndex === null) return;
		this.#hoveredIndex = null;
		this.notifyListeners();
	}

	isNodeHovered(index: number): boolean {
		return this.#hoveredIndex === index;
	}
}
