import { ChangeNotifier } from "flitter-core";
import type { FunnelChartCustom, FunnelChartData, FunnelChartStageView } from "./types";

const DEFAULT_COLORS = [
	"#4e79a7",
	"#f28e2b",
	"#e15759",
	"#76b7b2",
	"#59a14f",
	"#edc948",
	"#b07aa1",
	"#ff9da7",
	"#9c755f",
	"#bab0ac",
];

export class FunnelChartController extends ChangeNotifier {
	#rawData: FunnelChartData;
	#hoveredIndex: number | null = null;
	#width = 0;
	#height = 0;

	custom!: FunnelChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: FunnelChartData;
		custom: FunnelChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.custom = custom;
		this.config = config;
	}

	set data(value: FunnelChartData) {
		this.#rawData = value;
		this.notifyListeners();
	}

	get data(): FunnelChartData {
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

	get maxValue(): number {
		return this.#rawData.stages.reduce(
			(max, stage) => Math.max(max, stage.value),
			0,
		);
	}

	get stages(): FunnelChartStageView[] {
		const firstValue = this.#rawData.stages[0]?.value ?? 0;
		const maxValue = this.maxValue;

		return this.#rawData.stages.map((stage, index) => ({
			...stage,
			index,
			color: stage.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
			ratio: maxValue > 0 ? stage.value / maxValue : 0,
			percentage: firstValue > 0 ? (stage.value / firstValue) * 100 : 0,
		}));
	}

	get hoveredIndex(): number | null {
		return this.#hoveredIndex;
	}

	hoverStage(index: number): void {
		this.#hoveredIndex = index;
		this.notifyListeners();
	}

	unhoverStage(): void {
		if (this.#hoveredIndex === null) return;
		this.#hoveredIndex = null;
		this.notifyListeners();
	}

	isStageHovered(index: number): boolean {
		return this.#hoveredIndex === index;
	}
}
