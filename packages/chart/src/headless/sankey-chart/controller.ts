import { ChangeNotifier } from "flitter-core";
import type {
	SankeyChartCustom,
	SankeyChartData,
	SankeyLayout,
	SankeyLinkLayout,
	SankeyNodeLayout,
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

function resolveColors(colors: unknown): string[] {
	if (Array.isArray(colors)) return colors;
	if (colors && typeof colors === "object" && "fills" in (colors as any)) {
		return (colors as { fills: string[] }).fills;
	}
	return [];
}

const NODE_WIDTH_RATIO = 0.02;
const NODE_PADDING_RATIO = 0.03;

function computeLayout(data: SankeyChartData, colors: string[]): SankeyLayout {
	const palette = colors.length > 0 ? colors : DEFAULT_COLORS;

	// Infer unique nodes from flat data, preserving insertion order
	const nodeIdSet = new Set<string>();
	for (const link of data) {
		nodeIdSet.add(link.from);
		nodeIdSet.add(link.to);
	}
	const nodeIds = Array.from(nodeIdSet);

	const outgoing = new Map<string, { target: string; value: number }[]>();
	const incoming = new Map<string, { source: string; value: number }[]>();

	for (const id of nodeIds) {
		outgoing.set(id, []);
		incoming.set(id, []);
	}

	for (const link of data) {
		outgoing.get(link.from)?.push({ target: link.to, value: link.value });
		incoming.get(link.to)?.push({ source: link.from, value: link.value });
	}

	const columns = new Map<string, number>();
	const visited = new Set<string>();

	const assignColumn = (id: string): number => {
		if (columns.has(id)) return columns.get(id)!;
		if (visited.has(id)) return 0;
		visited.add(id);

		const parents = incoming.get(id) ?? [];
		if (parents.length === 0) {
			columns.set(id, 0);
			return 0;
		}

		let maxColumn = 0;
		for (const { source } of parents) {
			maxColumn = Math.max(maxColumn, assignColumn(source) + 1);
		}
		columns.set(id, maxColumn);
		return maxColumn;
	};

	for (const id of nodeIds) {
		assignColumn(id);
	}

	const totalColumns = Math.max(0, ...Array.from(columns.values())) + 1;
	const nodeValues = new Map<string, number>();

	for (const id of nodeIds) {
		const outgoingTotal = (outgoing.get(id) ?? []).reduce(
			(sum, link) => sum + link.value,
			0,
		);
		const incomingTotal = (incoming.get(id) ?? []).reduce(
			(sum, link) => sum + link.value,
			0,
		);
		nodeValues.set(id, Math.max(outgoingTotal, incomingTotal));
	}

	const columnGroups = new Map<number, string[]>();
	for (const [id, column] of columns) {
		if (!columnGroups.has(column)) columnGroups.set(column, []);
		columnGroups.get(column)!.push(id);
	}

	let maxColumnValue = 0;
	for (const ids of columnGroups.values()) {
		const total = ids.reduce((sum, id) => sum + (nodeValues.get(id) ?? 0), 0);
		maxColumnValue = Math.max(maxColumnValue, total);
	}

	const nodeLayoutMap = new Map<string, SankeyNodeLayout>();
	const colorMap = new Map<string, string>();

	nodeIds.forEach((id, index) => {
		colorMap.set(id, palette[index % palette.length]);
	});

	for (let column = 0; column < totalColumns; column++) {
		const ids = columnGroups.get(column) ?? [];
		const columnTotal = ids.reduce((sum, id) => sum + (nodeValues.get(id) ?? 0), 0);
		const totalPadding = NODE_PADDING_RATIO * Math.max(0, ids.length - 1);
		const scaleFactor =
			maxColumnValue > 0 ? (1 - totalPadding) / maxColumnValue : 0;
		const x =
			totalColumns > 1
				? (column / (totalColumns - 1)) * (1 - NODE_WIDTH_RATIO)
				: (1 - NODE_WIDTH_RATIO) / 2;

		let currentY = (1 - (columnTotal * scaleFactor + totalPadding)) / 2;

		for (const id of ids) {
			const totalValue = nodeValues.get(id) ?? 0;
			const height = totalValue * scaleFactor;

			nodeLayoutMap.set(id, {
				id,
				label: id,
				color: colorMap.get(id)!,
				x,
				y: currentY,
				width: NODE_WIDTH_RATIO,
				height,
				column,
				totalValue,
			});

			currentY += height + NODE_PADDING_RATIO;
		}
	}

	const sourceOffsets = new Map<string, number>();
	const targetOffsets = new Map<string, number>();

	for (const id of nodeIds) {
		sourceOffsets.set(id, 0);
		targetOffsets.set(id, 0);
	}

	const linkLayouts: SankeyLinkLayout[] = data.map((link) => {
		const sourceNode = nodeLayoutMap.get(link.from)!;
		const targetNode = nodeLayoutMap.get(link.to)!;
		const sourceOffset = sourceOffsets.get(link.from)!;
		const targetOffset = targetOffsets.get(link.to)!;
		const sourceHeight =
			sourceNode.totalValue > 0 ? sourceNode.height * (link.value / sourceNode.totalValue) : 0;
		const targetHeight =
			targetNode.totalValue > 0 ? targetNode.height * (link.value / targetNode.totalValue) : 0;

		const layout: SankeyLinkLayout = {
			source: link.from,
			target: link.to,
			value: link.value,
			sourceX: sourceNode.x + sourceNode.width,
			sourceY: sourceNode.y + sourceOffset,
			sourceHeight,
			targetX: targetNode.x,
			targetY: targetNode.y + targetOffset,
			targetHeight,
			color: colorMap.get(link.from)!,
		};

		sourceOffsets.set(link.from, sourceOffset + sourceHeight);
		targetOffsets.set(link.to, targetOffset + targetHeight);
		return layout;
	});

	return {
		nodes: Array.from(nodeLayoutMap.values()),
		links: linkLayouts,
		totalColumns,
	};
}

export class SankeyChartController extends ChangeNotifier {
	#rawData: SankeyChartData;
	#layout: SankeyLayout;
	#width = 0;
	#height = 0;
	#hoveredNodeId: string | null = null;
	#hoveredLink: { source: string; target: string } | null = null;

	custom!: SankeyChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: SankeyChartData;
		custom: SankeyChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.#layout = computeLayout(data, resolveColors(config.colors));
		this.custom = custom;
		this.config = config;
	}

	#recalculateLayout(): void {
		this.#layout = computeLayout(this.#rawData, resolveColors(this.config.colors));
	}

	set data(value: SankeyChartData) {
		this.#rawData = value;
		this.#recalculateLayout();
		this.notifyListeners();
	}

	get data(): SankeyChartData {
		return this.#rawData;
	}

	get layout(): SankeyLayout {
		return this.#layout;
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
		this.#recalculateLayout();
		this.notifyListeners();
	}

	get hoveredNodeId(): string | null {
		return this.#hoveredNodeId;
	}

	get hoveredLink(): { source: string; target: string } | null {
		return this.#hoveredLink;
	}

	hoverNode(id: string): void {
		this.#hoveredNodeId = id;
		this.notifyListeners();
	}

	unhoverNode(): void {
		if (this.#hoveredNodeId === null) return;
		this.#hoveredNodeId = null;
		this.notifyListeners();
	}

	hoverLink(source: string, target: string): void {
		this.#hoveredLink = { source, target };
		this.notifyListeners();
	}

	unhoverLink(): void {
		if (this.#hoveredLink === null) return;
		this.#hoveredLink = null;
		this.notifyListeners();
	}
}
