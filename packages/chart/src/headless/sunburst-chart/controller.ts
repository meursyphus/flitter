import { ChangeNotifier } from "flitter-core";
import type {
	FlatSegment,
	SunburstChartData,
	SunburstChartNode,
	SunburstChartCustom,
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

function computeNodeValue(node: SunburstChartNode): number {
	if (node.children && node.children.length > 0) {
		return node.children.reduce((sum, child) => sum + computeNodeValue(child), 0);
	}
	return node.value ?? 0;
}

function flattenTree(root: SunburstChartNode): FlatSegment[] {
	const segments: FlatSegment[] = [];

	const traverse = (
		node: SunburstChartNode,
		depth: number,
		startAngle: number,
		endAngle: number,
		parentColor: string,
		colorIndex: number,
		path: string[],
	) => {
		const color =
			node.color ??
			(depth === 1 ? DEFAULT_COLORS[colorIndex % DEFAULT_COLORS.length] : parentColor);

		if (depth > 0) {
			segments.push({
				node,
				depth,
				startAngle,
				endAngle,
				color,
				path,
			});
		}

		const children = node.children ?? [];
		if (children.length === 0) return;

		const totalValue = children.reduce((sum, child) => sum + computeNodeValue(child), 0);
		if (totalValue === 0) return;

		let currentAngle = startAngle;
		children.forEach((child, index) => {
			const childValue = computeNodeValue(child);
			const childAngle = (childValue / totalValue) * (endAngle - startAngle);
			const childEnd = currentAngle + childAngle;

			traverse(
				child,
				depth + 1,
				currentAngle,
				childEnd,
				color,
				depth === 0 ? index : colorIndex,
				[...path, child.label],
			);

			currentAngle = childEnd;
		});
	};

	traverse(root, 0, 0, Math.PI * 2, DEFAULT_COLORS[0], 0, [root.label]);
	return segments;
}

export class SunburstChartController extends ChangeNotifier {
	#rawData: SunburstChartData;
	#segments: FlatSegment[];
	#width = 0;
	#height = 0;
	#hoveredSegment: FlatSegment | null = null;

	custom!: SunburstChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: SunburstChartData;
		custom: SunburstChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.#segments = flattenTree(data.root);
		this.custom = custom;
		this.config = config;
	}

	#recalculateSegments(): void {
		this.#segments = flattenTree(this.#rawData.root);
	}

	set data(value: SunburstChartData) {
		this.#rawData = value;
		this.#recalculateSegments();
		this.notifyListeners();
	}

	get data(): SunburstChartData {
		return this.#rawData;
	}

	get segments(): FlatSegment[] {
		return this.#segments;
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

	get hoveredSegment(): FlatSegment | null {
		return this.#hoveredSegment;
	}

	hoverSegment(segment: FlatSegment): void {
		this.#hoveredSegment = segment;
		this.notifyListeners();
	}

	unhoverSegment(): void {
		if (this.#hoveredSegment === null) return;
		this.#hoveredSegment = null;
		this.notifyListeners();
	}
}
