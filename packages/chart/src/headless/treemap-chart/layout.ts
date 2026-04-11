import type {
	GetTreemapLayoutFn,
	TreemapLayout,
	TreemapLayoutItem,
	TreemapLayoutOptions,
	TreemapLayoutSize,
} from "./types";

type SquarifyNode = TreemapLayoutItem & {
	value: number;
	index: number;
};

function createLeaf(index: number): TreemapLayout {
	return { kind: "leaf", index };
}

function createBranch(
	direction: "row" | "column",
	children: { flex: number; node: TreemapLayout | null }[],
): TreemapLayout | null {
	const resolvedChildren = children
		.filter((child) => child.node != null && child.flex > 0)
		.map((child) => ({
			flex: child.flex,
			node: child.node as TreemapLayout,
		}));

	if (resolvedChildren.length === 0) return null;
	if (resolvedChildren.length === 1) return resolvedChildren[0].node;

	return {
		kind: "branch",
		direction,
		children: resolvedChildren,
	};
}

function sliceTreemapLayout(
	items: TreemapLayoutItem[],
	orientation: "vertical" | "horizontal",
): TreemapLayout | null {
	if (items.length === 0) return null;
	if (items.length === 1) return createLeaf(items[0].index);

	return createBranch(
		orientation === "vertical" ? "row" : "column",
		items.map((item) => ({
			flex: Math.max(0, item.value),
			node: createLeaf(item.index),
		})),
	);
}

function worst(row: SquarifyNode[], w: number, totalArea: number): number {
	const rowArea = row.reduce((sum, node) => sum + node.value, 0);
	const scaledRow = row.map((node) => (node.value / totalArea) * w * w);
	const scaledRowArea = (rowArea / totalArea) * w * w;

	if (scaledRow.length === 0 || scaledRowArea === 0) return Infinity;

	const maxVal = Math.max(...scaledRow);
	const minVal = Math.min(...scaledRow);
	const s2 = scaledRowArea * scaledRowArea;

	return Math.max((w * w * maxVal) / s2, s2 / (w * w * minVal));
}

function squarifyRecursive(
	items: SquarifyNode[],
	size: TreemapLayoutSize,
): TreemapLayout | null {
	if (items.length === 0) return null;
	if (items.length === 1) return createLeaf(items[0].index);
	if (size.width <= 0 || size.height <= 0) return null;

	const totalValue = items.reduce((sum, node) => sum + node.value, 0);
	if (totalValue <= 0) return null;

	const w = Math.min(size.width, size.height);
	const isHorizontalSpace = size.width >= size.height;
	const row: SquarifyNode[] = [items[0]];
	let currentWorst = worst(row, w, totalValue);
	let cursor = 1;

	while (cursor < items.length) {
		const candidate = [...row, items[cursor]];
		const candidateWorst = worst(candidate, w, totalValue);
		if (candidateWorst > currentWorst) break;
		row.push(items[cursor]);
		currentWorst = candidateWorst;
		cursor++;
	}

	const rowArea = row.reduce((sum, node) => sum + node.value, 0);
	const remainingItems = items.slice(cursor);
	const remainingValue = totalValue - rowArea;
	const rowTree = createBranch(
		isHorizontalSpace ? "column" : "row",
		row.map((node) => ({
			flex: node.value,
			node: createLeaf(node.index),
		})),
	);

	if (remainingItems.length === 0) {
		return rowTree;
	}

	const rowFraction = totalValue > 0 ? rowArea / totalValue : 0;
	const remainingTree = squarifyRecursive(
		remainingItems,
		isHorizontalSpace
			? {
					width: size.width - size.width * rowFraction,
					height: size.height,
			  }
			: {
					width: size.width,
					height: size.height - size.height * rowFraction,
			  },
	);

	return createBranch(
		isHorizontalSpace ? "row" : "column",
		[
			{ flex: rowArea, node: rowTree },
			{ flex: remainingValue, node: remainingTree },
		],
	);
}

export const squarifyTreemapLayout: GetTreemapLayoutFn = (
	items,
	size,
	options = {},
) => {
	if (options.mode === "slice-vertical") {
		return sliceTreemapLayout(items, "vertical");
	}

	if (options.mode === "slice-horizontal") {
		return sliceTreemapLayout(items, "horizontal");
	}

	const normalized = items
		.map((item) => ({
			...item,
			value: Math.max(0, item.value),
		}))
		.filter((item) => item.value > 0);

	if (normalized.length === 0) return null;

	const ordered = options.preserveOrder
		? normalized
		: [...normalized].sort((a, b) => b.value - a.value);

	return squarifyRecursive(ordered, size);
};

export const defaultGetTreemapLayout = (
	items: TreemapLayoutItem[],
	size: TreemapLayoutSize,
	options?: TreemapLayoutOptions,
): TreemapLayout | null => squarifyTreemapLayout(items, size, options);
