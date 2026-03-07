import { ChangeNotifier } from "flitter-core";
import type {
	GanttChartCustom,
	GanttChartData,
	GanttChartScale,
	GanttTask,
} from "./types";

export class GanttChartController extends ChangeNotifier {
	#rawData: GanttChartData;
	#width = 0;
	#height = 0;
	#scale: GanttChartScale | null = null;
	#hoveredTask: number | null = null;

	custom!: GanttChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: GanttChartData;
		custom: GanttChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.custom = custom;
		this.config = config;
	}

	#recalculateScale(): void {
		if (this.#rawData.tasks.length === 0) {
			this.#scale = null;
			return;
		}

		const min = Math.min(...this.#rawData.tasks.map((task) => task.start));
		const max = Math.max(...this.#rawData.tasks.map((task) => task.end));
		const step = Math.max(1, (max - min || 1) / 5);
		this.#scale = { min, max, step };
	}

	set data(value: GanttChartData) {
		this.#rawData = value;
		this.#recalculateScale();
		this.notifyListeners();
	}

	get data(): GanttChartData {
		return this.#rawData;
	}

	get tasks(): GanttTask[] {
		return [...this.#rawData.tasks].sort((a, b) => a.start - b.start);
	}

	get groups(): string[] {
		return Array.from(
			new Set(this.tasks.map((task) => task.group).filter((group): group is string => !!group)),
		);
	}

	get scale(): GanttChartScale | null {
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
		this.#recalculateScale();
		this.notifyListeners();
	}

	get hoveredTask(): number | null {
		return this.#hoveredTask;
	}

	hoverTask(index: number): void {
		this.#hoveredTask = index;
		this.notifyListeners();
	}

	unhoverTask(): void {
		if (this.#hoveredTask === null) return;
		this.#hoveredTask = null;
		this.notifyListeners();
	}

	getRatio(value: number): number {
		if (this.#scale == null || this.#scale.max === this.#scale.min) return 0;
		return (value - this.#scale.min) / (this.#scale.max - this.#scale.min);
	}
}
