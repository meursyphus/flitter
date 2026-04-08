import { ChangeNotifier, GlobalKey } from "flitter-core";
import type {
	FunnelChartCustom,
	FunnelChartData,
	FunnelChartDirection,
	FunnelChartHoveredStage,
	FunnelChartStageView,
} from "./types";

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

function resolvePalette(config: any): string[] {
	const colors = config?.colors;
	if (Array.isArray(colors) && colors.length > 0) {
		return colors.filter((color): color is string => typeof color === "string");
	}

	if (Array.isArray(colors?.fills) && colors.fills.length > 0) {
		return colors.fills.filter(
			(color: unknown): color is string => typeof color === "string",
		);
	}

	return DEFAULT_COLORS;
}

export class FunnelChartController extends ChangeNotifier {
	#rawData: FunnelChartData;
	#direction: FunnelChartDirection;
	#hoveredStage:
		| (FunnelChartHoveredStage & {
				anchorKey: GlobalKey;
		  })
		| null = null;
	#width = 0;
	#height = 0;

	custom!: FunnelChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		direction = "vertical",
		config = {},
	}: {
		data: FunnelChartData;
		custom: FunnelChartCustom<any>;
		direction?: FunnelChartDirection;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.#direction = direction;
		this.custom = custom;
		this.config = config;
	}

	set data(value: FunnelChartData) {
		this.#rawData = value;
		this.#hoveredStage = null;
		this.notifyListeners();
	}

	get data(): FunnelChartData {
		return this.#rawData;
	}

	get direction(): FunnelChartDirection {
		return this.#direction;
	}

	set direction(value: FunnelChartDirection) {
		if (this.#direction === value) return;
		this.#direction = value;
		this.notifyListeners();
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
		const palette = resolvePalette(this.config);

		return this.#rawData.stages.map((stage, index, stages) => {
			const previousValue = index > 0 ? stages[index - 1]?.value ?? null : null;
			const nextValue =
				index < stages.length - 1 ? stages[index + 1]?.value ?? null : null;
			return {
				...stage,
				index,
				color: stage.color ?? palette[index % palette.length] ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
				ratio: maxValue > 0 ? stage.value / maxValue : 0,
				percentage: firstValue > 0 ? (stage.value / firstValue) * 100 : 0,
				stepPercentage:
					previousValue != null && previousValue > 0
						? (stage.value / previousValue) * 100
						: null,
				previousValue,
				nextValue,
				previousRatio:
					previousValue != null && maxValue > 0 ? previousValue / maxValue : null,
				nextRatio:
					nextValue != null && maxValue > 0 ? nextValue / maxValue : null,
			};
		});
	}

	get hoveredStage(): FunnelChartHoveredStage | null {
		if (this.#hoveredStage == null) return null;
		const { anchorKey: _anchorKey, ...hoveredStage } = this.#hoveredStage;
		return hoveredStage;
	}

	get hoveredStageAnchorKey(): GlobalKey | null {
		return this.#hoveredStage?.anchorKey ?? null;
	}

	get hoveredIndex(): number | null {
		return this.#hoveredStage?.index ?? null;
	}

	hoverStage(index: number, anchorKey: GlobalKey): void {
		const stage = this.stages[index];
		if (stage == null) return;
		this.#hoveredStage = { ...stage, anchorKey };
		this.notifyListeners();
	}

	unhoverStage(index: number): void {
		if (this.#hoveredStage == null) return;
		if (this.#hoveredStage.index !== index) return;
		this.#hoveredStage = null;
		this.notifyListeners();
	}

	unhoverAllStages(): void {
		if (this.#hoveredStage == null) return;
		this.#hoveredStage = null;
		this.notifyListeners();
	}

	isStageHovered(index: number): boolean {
		return this.#hoveredStage?.index === index;
	}
}
