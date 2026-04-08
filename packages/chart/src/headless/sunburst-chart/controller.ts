import { ChangeNotifier } from "flitter-core";
import type {
	FlatSegment,
	SunburstChartCustom,
	SunburstChartData,
	SunburstLegacyData,
	SunburstResolvedData,
	SunburstResolvedNode,
} from "./types";

function clampValue(value: number): number {
	return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function normalizeNode(
	node: {
		label: string;
		value: number;
		children?: {
			label: string;
			value: number;
			children?: any[];
		}[];
	},
	path: number[],
	branchIndex: number,
	branchLabel: string,
): SunburstResolvedNode {
	const children = Array.isArray(node.children)
		? node.children.map((child, index) =>
				normalizeNode(child, [...path, index], branchIndex, branchLabel),
			)
		: [];

	return {
		key: `${branchIndex}:${path.join(".")}`,
		path,
		label: node.label,
		value: clampValue(node.value),
		children,
		branchIndex,
		branchLabel,
	};
}

function normalizeData(
	data: SunburstChartData | SunburstLegacyData | null | undefined,
): SunburstResolvedData {
	let nodes: {
		label: string;
		value: number;
		children?: {
			label: string;
			value: number;
			children?: any[];
		}[];
	}[] = [];

	if (data != null && Array.isArray((data as SunburstChartData).nodes)) {
		nodes = (data as SunburstChartData).nodes;
	} else if (data != null && (data as SunburstLegacyData).root != null) {
		const root = (data as SunburstLegacyData).root;
		nodes =
			Array.isArray(root.children) && root.children.length > 0
				? root.children
				: [root];
	}

	return {
		nodes: nodes.map((node, index) =>
			normalizeNode(node, [index], index, node.label),
		),
	};
}

function flattenNodes(nodes: SunburstResolvedNode[]): FlatSegment[] {
	const totalValue = nodes.reduce((sum, node) => sum + node.value, 0);
	if (totalValue <= 0) return [];

	const segments: FlatSegment[] = [];
	let currentAngle = 0;

	const traverse = (
		node: SunburstResolvedNode,
		depth: number,
		startAngle: number,
		sweepAngle: number,
		pathLabels: string[],
	) => {
		if (node.value <= 0 || sweepAngle <= 0) return;

		const endAngle = startAngle + sweepAngle;
		segments.push({
			index: segments.length,
			key: node.key,
			path: node.path,
			pathLabels,
			label: node.label,
			value: node.value,
			depth,
			startAngle,
			sweepAngle,
			endAngle,
			branchIndex: node.branchIndex,
			branchLabel: node.branchLabel,
		});

		const childrenTotal = node.children.reduce((sum, child) => sum + child.value, 0);
		if (childrenTotal <= 0) return;

		let childAngle = startAngle;
		for (const child of node.children) {
			if (child.value <= 0) continue;
			const nextSweep = sweepAngle * (child.value / childrenTotal);
			traverse(child, depth + 1, childAngle, nextSweep, [...pathLabels, child.label]);
			childAngle += nextSweep;
		}
	};

	for (const node of nodes) {
		if (node.value <= 0) continue;
		const sweepAngle = (node.value / totalValue) * Math.PI * 2;
		traverse(node, 1, currentAngle, sweepAngle, [node.label]);
		currentAngle += sweepAngle;
	}

	return segments;
}

function reconcileHiddenBranchKeys(
	hiddenBranchKeys: ReadonlySet<string>,
	data: SunburstResolvedData,
): Set<string> {
	const available = new Set(data.nodes.map((node) => node.key));
	return new Set([...hiddenBranchKeys].filter((key) => available.has(key)));
}

export class SunburstChartController extends ChangeNotifier {
	#rawData: SunburstResolvedData;
	#segments: FlatSegment[] = [];
	#hiddenBranchKeys = new Set<string>();
	#hoveredSegmentKey: string | null = null;
	#width = 0;
	#height = 0;

	custom!: SunburstChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: SunburstChartData | SunburstLegacyData;
		custom: SunburstChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = normalizeData(data);
		this.custom = custom;
		this.config = config;
		this.#recalculateSegments();
	}

	#recalculateSegments(): void {
		this.#segments = flattenNodes(this.data.nodes);
	}

	set data(value: SunburstChartData | SunburstLegacyData) {
		this.#rawData = normalizeData(value);
		this.#hiddenBranchKeys = reconcileHiddenBranchKeys(this.#hiddenBranchKeys, this.#rawData);
		this.#hoveredSegmentKey = null;
		this.#recalculateSegments();
		this.notifyListeners();
	}

	get data(): SunburstResolvedData {
		return {
			nodes: this.#rawData.nodes.filter(
				(node) => !this.#hiddenBranchKeys.has(node.key),
			),
		};
	}

	get rawData(): SunburstResolvedData {
		return this.#rawData;
	}

	get segments(): FlatSegment[] {
		return this.#segments;
	}

	get legends(): string[] {
		return this.#rawData.nodes.map((node) => node.label);
	}

	get totalValue(): number {
		return this.data.nodes.reduce((sum, node) => sum + node.value, 0);
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

	isLegendVisible(index: number): boolean {
		const key = this.#rawData.nodes[index]?.key;
		return key != null ? !this.#hiddenBranchKeys.has(key) : false;
	}

	toggleLegend(index: number): void {
		const key = this.#rawData.nodes[index]?.key;
		if (key == null) return;

		if (this.#hiddenBranchKeys.has(key)) {
			this.#hiddenBranchKeys.delete(key);
		} else {
			this.#hiddenBranchKeys.add(key);
		}

		this.#hoveredSegmentKey = null;
		this.#recalculateSegments();
		this.notifyListeners();
	}

	get hoveredSegmentKey(): string | null {
		return this.#hoveredSegmentKey;
	}

	get hoveredSegment(): FlatSegment | null {
		if (this.#hoveredSegmentKey == null) return null;
		return this.#segments.find((segment) => segment.key === this.#hoveredSegmentKey) ?? null;
	}

	hoverSegment(key: string): void {
		if (this.#hoveredSegmentKey === key) return;
		this.#hoveredSegmentKey = key;
		this.notifyListeners();
	}

	unhoverSegment(key?: string): void {
		if (this.#hoveredSegmentKey == null) return;
		if (key != null && this.#hoveredSegmentKey !== key) return;
		this.#hoveredSegmentKey = null;
		this.notifyListeners();
	}

	unhoverAllSegments(): void {
		this.unhoverSegment();
	}

	isSegmentHovered(key: string): boolean {
		return this.#hoveredSegmentKey === key;
	}
}
