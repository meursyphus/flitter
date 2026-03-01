import type { SankeyChartData, SankeyLayout, SankeyNodeLayout, SankeyLinkLayout } from "../types";

const DEFAULT_COLORS = [
  "#4e79a7", "#f28e2b", "#e15759", "#76b7b2",
  "#59a14f", "#edc948", "#b07aa1", "#ff9da7",
  "#9c755f", "#bab0ac",
];

const NODE_WIDTH_RATIO = 0.02;
const NODE_PADDING_RATIO = 0.03;

export function computeLayout(data: SankeyChartData): SankeyLayout {
  const { nodes: rawNodes, links: rawLinks } = data;

  // Build adjacency
  const outgoing = new Map<string, { target: string; value: number }[]>();
  const incoming = new Map<string, { source: string; value: number }[]>();

  for (const node of rawNodes) {
    outgoing.set(node.id, []);
    incoming.set(node.id, []);
  }

  for (const link of rawLinks) {
    outgoing.get(link.source)?.push({ target: link.target, value: link.value });
    incoming.get(link.target)?.push({ source: link.source, value: link.value });
  }

  // Assign columns using topological ordering (longest path from source)
  const columns = new Map<string, number>();
  const visited = new Set<string>();

  function assignColumn(id: string): number {
    if (columns.has(id)) return columns.get(id)!;
    if (visited.has(id)) return 0;
    visited.add(id);

    const inc = incoming.get(id) || [];
    if (inc.length === 0) {
      columns.set(id, 0);
      return 0;
    }

    let maxCol = 0;
    for (const { source } of inc) {
      maxCol = Math.max(maxCol, assignColumn(source) + 1);
    }
    columns.set(id, maxCol);
    return maxCol;
  }

  for (const node of rawNodes) {
    assignColumn(node.id);
  }

  const totalColumns = Math.max(...Array.from(columns.values())) + 1;

  // Compute node values (max of incoming/outgoing sum)
  const nodeValues = new Map<string, number>();
  for (const node of rawNodes) {
    const outSum = (outgoing.get(node.id) || []).reduce((s, l) => s + l.value, 0);
    const inSum = (incoming.get(node.id) || []).reduce((s, l) => s + l.value, 0);
    nodeValues.set(node.id, Math.max(outSum, inSum));
  }

  // Group nodes by column
  const columnGroups = new Map<number, string[]>();
  for (const [id, col] of columns) {
    if (!columnGroups.has(col)) columnGroups.set(col, []);
    columnGroups.get(col)!.push(id);
  }

  // Find max total value in any column for scaling
  let maxColumnValue = 0;
  for (const [, ids] of columnGroups) {
    const total = ids.reduce((s, id) => s + (nodeValues.get(id) || 0), 0);
    maxColumnValue = Math.max(maxColumnValue, total);
  }

  // Position nodes
  const nodeWidth = NODE_WIDTH_RATIO;
  const nodePadding = NODE_PADDING_RATIO;
  const colorMap = new Map<string, string>();
  rawNodes.forEach((n, i) => {
    colorMap.set(n.id, n.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]);
  });

  const nodeLayoutMap = new Map<string, SankeyNodeLayout>();
  const availableHeight = 1.0; // normalized

  for (let col = 0; col < totalColumns; col++) {
    const ids = columnGroups.get(col) || [];
    const colTotal = ids.reduce((s, id) => s + (nodeValues.get(id) || 0), 0);
    const totalPadding = nodePadding * (ids.length - 1);
    const scaleFactor = maxColumnValue > 0
      ? (availableHeight - totalPadding) / maxColumnValue
      : 0;

    const x = totalColumns > 1
      ? (col / (totalColumns - 1)) * (1 - nodeWidth)
      : (1 - nodeWidth) / 2;

    let currentY = (availableHeight - (colTotal * scaleFactor + totalPadding)) / 2;

    for (const id of ids) {
      const value = nodeValues.get(id) || 0;
      const h = value * scaleFactor;
      const node = rawNodes.find((n) => n.id === id)!;

      nodeLayoutMap.set(id, {
        id,
        label: node.label,
        color: colorMap.get(id)!,
        x,
        y: currentY,
        width: nodeWidth,
        height: h,
        column: col,
        totalValue: value,
      });

      currentY += h + nodePadding;
    }
  }

  // Position links - track cumulative offsets at source/target
  const sourceOffsets = new Map<string, number>();
  const targetOffsets = new Map<string, number>();
  for (const node of rawNodes) {
    sourceOffsets.set(node.id, 0);
    targetOffsets.set(node.id, 0);
  }

  const linkLayouts: SankeyLinkLayout[] = rawLinks.map((link) => {
    const sourceNode = nodeLayoutMap.get(link.source)!;
    const targetNode = nodeLayoutMap.get(link.target)!;

    const sourceOffset = sourceOffsets.get(link.source)!;
    const targetOffset = targetOffsets.get(link.target)!;

    const linkHeightAtSource =
      sourceNode.height * (link.value / sourceNode.totalValue);
    const linkHeightAtTarget =
      targetNode.height * (link.value / targetNode.totalValue);

    const result: SankeyLinkLayout = {
      source: link.source,
      target: link.target,
      value: link.value,
      sourceX: sourceNode.x + sourceNode.width,
      sourceY: sourceNode.y + sourceOffset,
      sourceHeight: linkHeightAtSource,
      targetX: targetNode.x,
      targetY: targetNode.y + targetOffset,
      targetHeight: linkHeightAtTarget,
      color: colorMap.get(link.source)!,
    };

    sourceOffsets.set(link.source, sourceOffset + linkHeightAtSource);
    targetOffsets.set(link.target, targetOffset + linkHeightAtTarget);

    return result;
  });

  const nodes = Array.from(nodeLayoutMap.values());

  return { nodes, links: linkLayouts, totalColumns };
}
