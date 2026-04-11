import { ChangeNotifier, GlobalKey } from "flitter-core";
import type {
  SankeyChartCustom,
  SankeyChartData,
  SankeyLayout,
  SankeyLinkLayout,
  SankeyNodeLayout,
  SankeyRibbon,
} from "./types";
import { resolveRibbonAnchorRect } from "./geometry";

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

const NODE_WIDTH_RATIO = 0.02;
const NODE_PADDING_RATIO = 0.03;

function resolveColors(colors: unknown): string[] {
  if (Array.isArray(colors)) return colors;
  if (colors == null || typeof colors !== "object") return [];

  const fills = Reflect.get(colors, "fills");
  if (Array.isArray(fills)) {
    return fills.filter((fill): fill is string => typeof fill === "string");
  }
  return [];
}

function createRibbon(sourceNode: SankeyNodeLayout, targetNode: SankeyNodeLayout, args: {
  sourceTop: number;
  sourceBottom: number;
  targetTop: number;
  targetBottom: number;
}): SankeyRibbon {
  return {
    startTop: {
      x: sourceNode.x + sourceNode.width,
      y: args.sourceTop,
    },
    startBottom: {
      x: sourceNode.x + sourceNode.width,
      y: args.sourceBottom,
    },
    endTop: {
      x: targetNode.x,
      y: args.targetTop,
    },
    endBottom: {
      x: targetNode.x,
      y: args.targetBottom,
    },
  };
}

function computeLayout(data: SankeyChartData, colors: string[]): SankeyLayout {
  const palette = colors.length > 0 ? colors : DEFAULT_COLORS;

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
  const visiting = new Set<string>();

  const assignColumn = (id: string): number => {
    if (columns.has(id)) return columns.get(id)!;
    if (visiting.has(id)) return 0;
    visiting.add(id);

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

    let currentTop = (1 - (columnTotal * scaleFactor + totalPadding)) / 2;

    for (const id of ids) {
      const totalValue = nodeValues.get(id) ?? 0;
      const height = totalValue * scaleFactor;

      nodeLayoutMap.set(id, {
        id,
        label: id,
        color: colorMap.get(id)!,
        x,
        width: NODE_WIDTH_RATIO,
        top: currentTop,
        height,
        column,
        totalValue,
      });

      currentTop += height + NODE_PADDING_RATIO;
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
      sourceNode.totalValue > 0
        ? sourceNode.height * (link.value / sourceNode.totalValue)
        : 0;
    const targetHeight =
      targetNode.totalValue > 0
        ? targetNode.height * (link.value / targetNode.totalValue)
        : 0;

    const sourceTop = sourceNode.top + sourceOffset;
    const sourceBottom = sourceTop + sourceHeight;
    const targetTop = targetNode.top + targetOffset;
    const targetBottom = targetTop + targetHeight;
    const ribbon = createRibbon(sourceNode, targetNode, {
      sourceTop,
      sourceBottom,
      targetTop,
      targetBottom,
    });
    const anchorRect = resolveRibbonAnchorRect(ribbon);

    sourceOffsets.set(link.from, sourceOffset + sourceHeight);
    targetOffsets.set(link.to, targetOffset + targetHeight);

    return {
      source: link.from,
      target: link.to,
      value: link.value,
      color: colorMap.get(link.from)!,
      anchorX: anchorRect.x,
      anchorY: anchorRect.y,
      anchorWidth: anchorRect.width,
      anchorHeight: anchorRect.height,
      ...ribbon,
    };
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
  #config: any;
  #hoveredNode:
    | {
        id: string;
        anchorKey: GlobalKey;
      }
    | null = null;
  #hoveredLink:
    | {
        source: string;
        target: string;
        anchorKey: GlobalKey;
      }
    | null = null;

  custom!: SankeyChartCustom<any>;

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
    this.#config = config;
    this.#layout = computeLayout(data, resolveColors(config.colors));
    this.custom = custom;
  }

  get config(): any {
    return this.#config;
  }

  get data(): SankeyChartData {
    return this.#rawData;
  }

  get layout(): SankeyLayout {
    return this.#layout;
  }

  get hoveredNodeId(): string | null {
    return this.#hoveredNode?.id ?? null;
  }

  get hoveredLink(): { source: string; target: string } | null {
    return this.#hoveredLink == null
      ? null
      : {
          source: this.#hoveredLink.source,
          target: this.#hoveredLink.target,
        };
  }

  get hoveredNodeAnchorKey(): GlobalKey | null {
    return this.#hoveredNode?.anchorKey ?? null;
  }

  get hoveredLinkAnchorKey(): GlobalKey | null {
    return this.#hoveredLink?.anchorKey ?? null;
  }

  get hoveredNode(): SankeyNodeLayout | null {
    const hoveredNode = this.#hoveredNode;
    return hoveredNode == null
      ? null
      : this.#layout.nodes.find((node) => node.id === hoveredNode.id) ?? null;
  }

  get hoveredLinkLayout(): SankeyLinkLayout | null {
    if (this.#hoveredLink == null) return null;
    return (
      this.#layout.links.find(
        (link) =>
          link.source === this.#hoveredLink!.source &&
          link.target === this.#hoveredLink!.target,
      ) ?? null
    );
  }

  update({
    data,
    custom,
    config = {},
  }: {
    data: SankeyChartData;
    custom: SankeyChartCustom<any>;
    config?: any;
  }): void {
    let shouldNotify = false;
    let shouldRecalculate = false;

    if (this.#rawData !== data) {
      this.#rawData = data;
      shouldRecalculate = true;
      shouldNotify = true;
    }

    if (this.#config !== config) {
      this.#config = config;
      shouldRecalculate = true;
      shouldNotify = true;
    }

    if (this.custom !== custom) {
      this.custom = custom;
      shouldNotify = true;
    }

    if (shouldRecalculate) {
      this.#layout = computeLayout(this.#rawData, resolveColors(this.#config.colors));
      this.#pruneHoverState();
    }

    if (shouldNotify) {
      this.notifyListeners();
    }
  }

  hoverNode(id: string, anchorKey: GlobalKey): void {
    if (this.#hoveredNode?.id === id && this.#hoveredLink == null) {
      this.#hoveredNode = { id, anchorKey };
      return;
    }
    this.#hoveredNode = { id, anchorKey };
    this.#hoveredLink = null;
    this.notifyListeners();
  }

  unhoverNode(id?: string): void {
    if (this.#hoveredNode == null) return;
    if (id != null && this.#hoveredNode.id !== id) return;
    this.#hoveredNode = null;
    this.notifyListeners();
  }

  hoverLink(source: string, target: string, anchorKey: GlobalKey): void {
    if (
      this.#hoveredLink?.source === source &&
      this.#hoveredLink?.target === target &&
      this.#hoveredNode == null
    ) {
      this.#hoveredLink = { source, target, anchorKey };
      return;
    }
    this.#hoveredNode = null;
    this.#hoveredLink = { source, target, anchorKey };
    this.notifyListeners();
  }

  unhoverLink(source?: string, target?: string): void {
    if (this.#hoveredLink == null) return;
    if (
      source != null &&
      target != null &&
      (this.#hoveredLink.source !== source || this.#hoveredLink.target !== target)
    ) {
      return;
    }
    this.#hoveredLink = null;
    this.notifyListeners();
  }

  unhoverAll(): void {
    if (this.#hoveredNode == null && this.#hoveredLink == null) return;
    this.#hoveredNode = null;
    this.#hoveredLink = null;
    this.notifyListeners();
  }

  isNodeActive(id: string): boolean {
    if (this.#hoveredNode != null) return this.#hoveredNode.id === id;
    if (this.#hoveredLink != null) {
      return this.#hoveredLink.source === id || this.#hoveredLink.target === id;
    }
    return false;
  }

  isNodeDimmed(id: string): boolean {
    if (this.#hoveredNode != null) return this.#hoveredNode.id !== id;
    if (this.#hoveredLink != null) {
      return this.#hoveredLink.source !== id && this.#hoveredLink.target !== id;
    }
    return false;
  }

  isLinkHovered(source: string, target: string): boolean {
    return (
      this.#hoveredLink?.source === source && this.#hoveredLink?.target === target
    );
  }

  isLinkActive(source: string, target: string): boolean {
    if (this.#hoveredLink != null) {
      return this.#hoveredLink.source === source && this.#hoveredLink.target === target;
    }
    if (this.#hoveredNode != null) {
      return source === this.#hoveredNode.id || target === this.#hoveredNode.id;
    }
    return false;
  }

  isLinkDimmed(source: string, target: string): boolean {
    if (this.#hoveredLink != null) {
      return this.#hoveredLink.source !== source || this.#hoveredLink.target !== target;
    }
    if (this.#hoveredNode != null) {
      return source !== this.#hoveredNode.id && target !== this.#hoveredNode.id;
    }
    return false;
  }

  #pruneHoverState(): void {
    if (
      this.#hoveredNode != null &&
      !this.#layout.nodes.some((node) => node.id === this.#hoveredNode!.id)
    ) {
      this.#hoveredNode = null;
    }

    if (
      this.#hoveredLink != null &&
      !this.#layout.links.some(
        (link) =>
          link.source === this.#hoveredLink!.source &&
          link.target === this.#hoveredLink!.target,
      )
    ) {
      this.#hoveredLink = null;
    }
  }
}
