import { ChangeNotifier, GlobalKey } from "flitter-core";
import { defaultGetTreemapLayout } from "./layout";
import type {
	GetTreemapLayoutFn,
	GetTreemapLayoutOptionsFn,
	TreemapCustom,
	TreemapData,
	TreemapDataset,
	TreemapHoveredNode,
	TreemapLayout,
	TreemapLayoutItem,
	TreemapLayoutOptions,
	TreemapLayoutSize,
	TreemapLegacyData,
	TreemapNode,
	TreemapResolvedData,
	TreemapResolvedDataset,
	TreemapResolvedNode,
} from "./types";

function computeNodeValue(node: TreemapNode): number {
	const children = node.children ?? [];
	if (children.length > 0) {
		return children.reduce((sum, child) => sum + computeNodeValue(child), 0);
	}
	return Math.max(0, node.value ?? 0);
}

function normalizeNode(
	node: TreemapNode,
	path: number[],
	keyPrefix: string,
): TreemapResolvedNode {
	const children = (node.children ?? []).map((child, index) =>
		normalizeNode(child, [...path, index], keyPrefix),
	);

	return {
		key: `${keyPrefix}:${path.join(".")}`,
		path,
		label: node.label,
		secondaryLabel: node.secondaryLabel,
		value: children.length > 0 ? children.reduce((sum, child) => sum + child.value, 0) : Math.max(0, node.value ?? 0),
		children,
	};
}

function normalizeDataset(
	dataset: TreemapDataset,
	datasetIndex: number,
): TreemapResolvedDataset {
	const keyPrefix = `${datasetIndex}`;
	const children =
		(dataset.children ?? []).length > 0
			? (dataset.children ?? []).map((child, index) =>
					normalizeNode(child, [index], keyPrefix),
			  )
			: [
					normalizeNode(
						{
							label: dataset.legend,
							value: dataset.value ?? 0,
							secondaryLabel: dataset.secondaryLabel,
						},
						[0],
						keyPrefix,
					),
			  ];

	return {
		legend: dataset.legend,
		value: children.reduce((sum, child) => sum + child.value, 0),
		children,
	};
}

function normalizeData(
	data: TreemapData | TreemapLegacyData | null | undefined,
): TreemapResolvedData {
	if (data != null && Array.isArray((data as TreemapData).datasets)) {
		return {
			datasets: (data as TreemapData).datasets.map((dataset, index) =>
				normalizeDataset(dataset, index),
			),
		};
	}

	if (data != null && Array.isArray((data as TreemapLegacyData).nodes)) {
		return {
			datasets: [
				normalizeDataset({
					legend: "",
					children: (data as TreemapLegacyData).nodes,
				}, 0),
			],
		};
	}

	return { datasets: [] };
}

function resolveInitialHiddenSeries(data: TreemapData | TreemapLegacyData | null | undefined): Set<string> {
	if (data != null && Array.isArray((data as TreemapData).datasets)) {
		return new Set(
			(data as TreemapData).datasets
				.filter((dataset) => dataset.visible === false)
				.map((dataset) => dataset.legend),
		);
	}

	return new Set();
}

function reconcileHiddenSeries(
	hiddenSeries: ReadonlySet<string>,
	data: TreemapData | TreemapLegacyData | null | undefined,
): Set<string> {
	if (data == null || !Array.isArray((data as TreemapData).datasets)) {
		return new Set(hiddenSeries);
	}

	const datasets = (data as TreemapData).datasets;
	const available = new Set(datasets.map((dataset) => dataset.legend));
	const next = new Set([...hiddenSeries].filter((legend) => available.has(legend)));

	for (const dataset of datasets) {
		if (dataset.visible === false) {
			next.add(dataset.legend);
		}
	}

	return next;
}

function toLayoutItems(items: { value: number }[]): TreemapLayoutItem[] {
	return items.map((item, index) => ({
		value: item.value,
		index,
	}));
}

export class TreemapController extends ChangeNotifier {
	#rawData: TreemapResolvedData;
	#hiddenSeries: Set<string>;
	#hoveredNode:
		| (TreemapHoveredNode & {
				anchorKey: GlobalKey;
		  })
		| null = null;
	#width = 0;
	#height = 0;

	getLayout: GetTreemapLayoutFn;
	getLayoutOptions: GetTreemapLayoutOptionsFn | null;

	custom!: TreemapCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
		getLayout = defaultGetTreemapLayout,
		getLayoutOptions = null,
	}: {
		data: TreemapData | TreemapLegacyData;
		custom: TreemapCustom<any>;
		config?: any;
		getLayout?: GetTreemapLayoutFn;
		getLayoutOptions?: GetTreemapLayoutOptionsFn | null;
	}) {
		super();
		this.#rawData = normalizeData(data);
		this.#hiddenSeries = resolveInitialHiddenSeries(data);
		this.getLayout = getLayout;
		this.getLayoutOptions = getLayoutOptions;
		this.custom = custom;
		this.config = config;
	}

	set data(value: TreemapData | TreemapLegacyData) {
		this.#rawData = normalizeData(value);
		this.#hiddenSeries = reconcileHiddenSeries(this.#hiddenSeries, value);
		this.#hoveredNode = null;
		this.notifyListeners();
	}

	get data(): TreemapResolvedData {
		return {
			datasets: this.#rawData.datasets.filter(
				(dataset) => !this.#hiddenSeries.has(dataset.legend),
			),
		};
	}

	get rawData(): TreemapResolvedData {
		return this.#rawData;
	}

	get legends(): string[] {
		return this.#rawData.datasets.map((dataset) => dataset.legend);
	}

	get totalValue(): number {
		return this.data.datasets.reduce((sum, dataset) => sum + dataset.value, 0);
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

	getGroupValue(groupIndex: number): number {
		return this.data.datasets[groupIndex]?.value ?? 0;
	}

	getGroupNodes(groupIndex: number): TreemapResolvedNode[] {
		return this.data.datasets[groupIndex]?.children ?? [];
	}

	getGroupColor(groupIndex: number): string {
		return this.#resolveColor(groupIndex);
	}

	getNodeColor(groupIndex: number): string {
		return this.#resolveColor(groupIndex);
	}

	getGroupLayout(size: TreemapLayoutSize): TreemapLayout | null {
		return this.#resolveLayout(toLayoutItems(this.data.datasets), size);
	}

	getNodeLayout(
		nodes: TreemapResolvedNode[],
		size: TreemapLayoutSize,
	): TreemapLayout | null {
		return this.#resolveLayout(toLayoutItems(nodes), size);
	}

	#resolveLayout(
		items: TreemapLayoutItem[],
		size: TreemapLayoutSize,
		optionsOverride?: TreemapLayoutOptions,
	): TreemapLayout | null {
		if (items.length === 0 || size.width <= 0 || size.height <= 0) return null;
		const options = optionsOverride ?? this.getLayoutOptions?.(this) ?? {};
		return this.getLayout(items, size, options);
	}

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
		this.#hoveredNode = null;
		this.notifyListeners();
	}

	showSeries(name: string): void {
		if (!this.#hiddenSeries.has(name)) return;
		this.#hiddenSeries.delete(name);
		this.#hoveredNode = null;
		this.notifyListeners();
	}

	hideSeries(name: string): void {
		if (this.#hiddenSeries.has(name)) return;
		this.#hiddenSeries.add(name);
		this.#hoveredNode = null;
		this.notifyListeners();
	}

	showAllSeries(): void {
		if (this.#hiddenSeries.size === 0) return;
		this.#hiddenSeries.clear();
		this.#hoveredNode = null;
		this.notifyListeners();
	}

	get hoveredNode(): TreemapHoveredNode | null {
		if (this.#hoveredNode == null) return null;
		const { anchorKey: _anchorKey, ...hoveredNode } = this.#hoveredNode;
		return hoveredNode;
	}

	get hoveredNodeAnchorKey(): GlobalKey | null {
		return this.#hoveredNode?.anchorKey ?? null;
	}

	hoverNode(node: TreemapHoveredNode, anchorKey: GlobalKey): void {
		this.#hoveredNode = { ...node, anchorKey };
		this.notifyListeners();
	}

	unhoverNode(key: string): void {
		if (this.#hoveredNode == null) return;
		if (this.#hoveredNode.key !== key) return;
		this.#hoveredNode = null;
		this.notifyListeners();
	}

	unhoverAllNodes(): void {
		if (this.#hoveredNode == null) return;
		this.#hoveredNode = null;
		this.notifyListeners();
	}

	isNodeHovered(key: string): boolean {
		return this.#hoveredNode?.key === key;
	}

	isGroupHovered(groupIndex: number): boolean {
		return this.#hoveredNode?.groupIndex === groupIndex;
	}

	#resolveColor(groupIndex: number): string {
		const colors = this.config?.colors;
		if (Array.isArray(colors)) {
			return colors[groupIndex % colors.length] ?? "";
		}

		if (Array.isArray(colors?.fills)) {
			return colors.fills[groupIndex % colors.fills.length] ?? "";
		}

		return "";
	}
}
