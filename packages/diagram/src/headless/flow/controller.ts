import {
  AnimationController,
  ChangeNotifier,
  type GlobalKey,
  Matrix4,
  type RenderObject,
  TransformationController,
  eventPosition,
} from "flitter-core";
import {
  type CoordinateExtent,
  type Dimensions,
  type Rect,
  type Viewport,
  type XYPosition,
  calcAutoPan,
  clamp,
  clampPosition,
  clampViewportToExtent,
  distance,
  easeInOutCubic,
  flowToPanePosition,
  getBoundsOfRects,
  getOverlappingArea,
  getViewportForBounds,
  handleCenter,
  infiniteExtent,
  lerp,
  oppositePosition,
  paneToFlowPosition,
  rectContains,
  rectFromPoints,
  rectSidePoint,
  snapPosition,
} from "../../shared/geometry";
import { type EdgePathResult, getEdgePathByType } from "../../shared/edges";
import {
  type Connection,
  type EdgeChange,
  type NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  getConnectedEdges,
  getEdgeId,
  getIncomers,
  getOutgoers,
  reconnectEdge as reconnectEdgeHelper,
} from "../../shared/changes";
import { type LayoutAlgorithm, type LayoutOptions, computeHierarchicalLayout } from "../../shared/layout";
import { createId, isMacOs } from "../../shared/utils";
import type {
  ConnectionState,
  EdgeEndpoints,
  EdgeType,
  FitViewOptions,
  FlowCallbacks,
  FlowCustom,
  FlowEdge,
  FlowNode,
  FlowOptions,
  FlowPanel,
  FlowProps,
  HandleSpec,
  HandleType,
  KeyCode,
  LayoutConfig,
  NodeResizeOptions,
  NodeToolbarBuilder,
  NodeType,
  ResizeControlPosition,
  ResizeParams,
  ResolvedHandle,
} from "./types";

export const DEFAULT_FLOW_OPTIONS: FlowOptions = {
  minZoom: 0.5,
  maxZoom: 2,
  zoomOnScroll: true,
  zoomOnPinch: true,
  panOnScroll: false,
  panOnScrollSpeed: 0.5,
  zoomOnDoubleClick: true,
  panOnDrag: true,
  selectionOnDrag: false,
  selectionMode: "full",
  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,
  selectNodesOnDrag: true,
  nodeDragThreshold: 1,
  snapToGrid: false,
  snapGrid: [15, 15],
  connectionMode: "strict",
  connectionRadius: 20,
  connectOnClick: true,
  autoPanOnNodeDrag: true,
  autoPanOnConnect: true,
  autoPanSpeed: 15,
  elevateNodesOnSelect: true,
  elevateEdgesOnSelect: false,
  deleteKeyCode: ["Backspace", "Delete"],
  multiSelectionKeyCode: isMacOs() ? "Meta" : "Control",
  selectionKeyCode: "Shift",
  panActivationKeyCode: "Space",
  zoomActivationKeyCode: isMacOs() ? "Meta" : "Control",
  nodeExtent: infiniteExtent,
  translateExtent: infiniteExtent,
  edgesReconnectable: true,
  reconnectRadius: 10,
  nodesResizable: false,
  nodeResizeOptions: { minWidth: 10, minHeight: 10 },
  handleSize: 6,
  edgeInteractionWidth: 20,
  defaultEdgeOptions: {},
  isValidConnection: () => true,
  connectionLineType: "default",
};

type DragState = {
  nodeId: string;
  startPane: XYPosition;
  startFlow: XYPosition;
  lastPane: XYPosition;
  lastEvent: MouseEvent;
  started: boolean;
  items: Map<string, { start: XYPosition }>;
};

type MeasureEntry = { id: string; width: number; height: number };

type ResizeState = {
  nodeId: string;
  position: ResizeControlPosition;
  startFlow: XYPosition;
  startRect: Rect;
  lastParams: ResizeParams;
};

function keyNameOf(event: KeyboardEvent): string {
  if (event.key === " " || event.code === "Space") return "Space";
  return event.key;
}

function toKeyList(code: KeyCode): string[] {
  if (code == null) return [];
  return Array.isArray(code) ? code : [code];
}

function isInputTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  if (!element || typeof element.tagName !== "string") return false;
  const tag = element.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || element.isContentEditable === true;
}

function modifierMatches(event: MouseEvent, code: string): boolean | null {
  switch (code) {
    case "Meta":
      return event.metaKey;
    case "Control":
      return event.ctrlKey;
    case "Shift":
      return event.shiftKey;
    case "Alt":
      return event.altKey;
    default:
      return null;
  }
}

/**
 * Headless engine state for a node diagram. Owns nodes, edges, the viewport
 * transformation, selection, drag and connection gestures, and the public
 * API that mirrors React Flow's `useReactFlow` instance.
 */
export class FlowController extends ChangeNotifier {
  #nodes: FlowNode[] = [];
  #edges: FlowEdge[] = [];
  #nodeLookup = new Map<string, FlowNode>();
  #edgeLookup = new Map<string, FlowEdge>();
  #propsNodes: FlowNode[] | undefined;
  #propsEdges: FlowEdge[] | undefined;
  #options: FlowOptions = { ...DEFAULT_FLOW_OPTIONS };
  #callbacks: FlowCallbacks = {};
  #fitViewOnInit = false;
  #fitViewOptions: FitViewOptions = {};
  #layoutConfig: LayoutConfig | null = null;
  #layoutPending = false;
  #viewportInitialized = false;

  /** Static configuration provided by the style layer. */
  custom!: FlowCustom<any>;
  config: object = {};
  nodeTypes: Record<string, NodeType<any>> = {};
  edgeTypes: Record<string, EdgeType<any>> = {};
  panels: FlowPanel[] = [];

  readonly transformation: TransformationController;
  #ownsTransformation: boolean;
  #paneKey: GlobalKey | null = null;
  #paneSize: Dimensions = { width: 0, height: 0 };

  #nodeSignals = new Map<string, ChangeNotifier>();
  #edgeSignals = new Map<string, ChangeNotifier>();
  /** Fires on every connection-gesture change (start, move, snap, end). */
  readonly connectionSignal = new ChangeNotifier();
  #styleVersion = 0;

  #hoveredNodeId: string | null = null;
  #hoveredEdgeId: string | null = null;
  #drag: DragState | null = null;
  #resize: ResizeState | null = null;
  #connection: ConnectionState | null = null;
  nodeToolbar: NodeToolbarBuilder<any> | null = null;
  #selectionBox: { start: XYPosition; current: XYPosition } | null = null;
  #keysHeld = new Set<string>();
  #pointerInside = false;
  #interactive = true;
  #pointerMoved = false;
  #lastClick: { key: string; time: number; x: number; y: number } | null = null;
  #lastPanePoint: XYPosition = { x: 0, y: 0 };
  #animation: AnimationController | null = null;
  #autoPanFrame: number | null = null;
  #selectionSnapshot = "";
  #disposed = false;

  constructor({ transformationController }: { transformationController?: TransformationController } = {}) {
    super();
    this.transformation = transformationController ?? new TransformationController();
    this.#ownsTransformation = transformationController == null;
    this.transformation.addListener(this.#handleTransformChange);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle (used by the Flow widget)
  // ---------------------------------------------------------------------------

  /** Push widget props into the controller. Never notifies: a build is already in progress. */
  configure(props: FlowProps<any>): void {
    const {
      nodes,
      edges,
      custom,
      config,
      nodeTypes,
      edgeTypes,
      defaultViewport,
      fitView,
      fitViewOptions,
      layout,
      panels,
      nodeToolbar,
      controller: _controller,
      key: _key,
      ...rest
    } = props;
    this.nodeToolbar = nodeToolbar ?? null;
    this.custom = custom;
    this.config = config ?? {};
    this.nodeTypes = nodeTypes ?? {};
    this.edgeTypes = edgeTypes ?? {};
    this.panels = panels ?? [];
    // Any prop change may affect how nodes/edges look; cached widgets rebuild.
    this.#styleVersion += 1;

    const options: FlowOptions = { ...DEFAULT_FLOW_OPTIONS };
    const callbacks: FlowCallbacks = {};
    for (const [key, value] of Object.entries(rest)) {
      if (key in DEFAULT_FLOW_OPTIONS) {
        if (value !== undefined) (options as Record<string, unknown>)[key] = value;
      } else if (key.startsWith("on") && typeof value === "function") {
        (callbacks as Record<string, unknown>)[key] = value;
      }
    }
    this.#options = options;
    this.#callbacks = callbacks;
    this.#fitViewOptions = fitViewOptions ?? {};
    if (fitView && !this.#viewportInitialized) this.#fitViewOnInit = true;
    const nextLayout: LayoutConfig | null = layout ? ("compute" in layout ? { algorithm: layout } : layout) : null;
    if (nextLayout && (nextLayout.algorithm !== this.#layoutConfig?.algorithm) && !this.#viewportInitialized) {
      this.#layoutPending = nextLayout.runOn !== "manual";
    }
    this.#layoutConfig = nextLayout;

    if (nodes !== this.#propsNodes) {
      this.#propsNodes = nodes;
      if (nodes) this.#replaceNodes(nodes);
    }
    if (edges !== this.#propsEdges) {
      this.#propsEdges = edges;
      if (edges) this.#replaceEdges(edges);
    }
    if (!this.#viewportInitialized) {
      this.#viewportInitialized = true;
      if (defaultViewport) this.#setMatrix(this.#clampViewport(defaultViewport));
    }
  }

  attachPane(key: GlobalKey): void {
    this.#paneKey = key;
  }

  /** Called from layout; never notifies synchronously. */
  setPaneSize(width: number, height: number): void {
    if (!Number.isFinite(width) || !Number.isFinite(height)) return;
    const hadSize = this.#paneSize.width > 0 && this.#paneSize.height > 0;
    this.#paneSize = { width, height };
    // translateExtent could not be applied to defaultViewport before the pane
    // was measured; enforce it once, outside the build/layout pass.
    if (!hadSize && width > 0 && height > 0 && this.#options.translateExtent !== infiniteExtent) {
      const schedule = typeof queueMicrotask === "function" ? queueMicrotask : (fn: () => void) => void Promise.resolve().then(fn);
      schedule(() => {
        if (this.#disposed) return;
        const current = this.viewport;
        const clamped = this.#clampViewport(current);
        if (clamped.x !== current.x || clamped.y !== current.y || clamped.zoom !== current.zoom) {
          this.#setMatrix(clamped);
        }
      });
    }
  }

  get paneSize(): Dimensions {
    return this.#paneSize;
  }

  /**
   * Per-node change signal. Node widgets subscribe to their own node so a
   * drag or hover rebuilds one node instead of the whole scene.
   */
  nodeSignal(id: string): ChangeNotifier {
    let signal = this.#nodeSignals.get(id);
    if (!signal) {
      signal = new ChangeNotifier();
      this.#nodeSignals.set(id, signal);
    }
    return signal;
  }

  /** Per-edge change signal (selection, hover, replacement). */
  edgeSignal(id: string): ChangeNotifier {
    let signal = this.#edgeSignals.get(id);
    if (!signal) {
      signal = new ChangeNotifier();
      this.#edgeSignals.set(id, signal);
    }
    return signal;
  }

  /** Bumped whenever props that affect every node/edge change (custom, types, options). */
  get styleVersion(): number {
    return this.#styleVersion;
  }

  get options(): Readonly<FlowOptions> {
    return this.#options;
  }

  /** Node sizes reported by the scene after layout (post-frame). */
  setNodeDimensions(entries: MeasureEntry[]): void {
    if (this.#disposed) return;
    const changes: NodeChange<FlowNode>[] = [];
    for (const entry of entries) {
      const node = this.#nodeLookup.get(entry.id);
      if (!node) continue;
      const measured = node.measured;
      if (
        measured &&
        Math.abs(measured.width - entry.width) < 0.5 &&
        Math.abs(measured.height - entry.height) < 0.5
      ) {
        continue;
      }
      changes.push({
        type: "dimensions",
        id: entry.id,
        dimensions: { width: entry.width, height: entry.height },
      });
    }
    if (changes.length > 0) this.#applyNodeChanges(changes);
    this.#afterMeasure();
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#stopAnimation();
    this.#stopAutoPan();
    this.transformation.removeListener(this.#handleTransformChange);
    if (this.#ownsTransformation) this.transformation.dispose();
  }

  // ---------------------------------------------------------------------------
  // Nodes & edges
  // ---------------------------------------------------------------------------

  get nodes(): FlowNode[] {
    return this.#nodes;
  }

  get edges(): FlowEdge[] {
    return this.#edges;
  }

  getNodes(): FlowNode[] {
    return this.#nodes;
  }

  getEdges(): FlowEdge[] {
    return this.#edges;
  }

  getNode(id: string): FlowNode | undefined {
    return this.#nodeLookup.get(id);
  }

  getEdge(id: string): FlowEdge | undefined {
    return this.#edgeLookup.get(id);
  }

  setNodes(nodes: FlowNode[] | ((nodes: FlowNode[]) => FlowNode[])): void {
    this.#replaceNodes(typeof nodes === "function" ? nodes(this.#nodes) : nodes);
    this.#emitSelectionChange();
    this.#notifyAllNodes();
    this.notifyListeners();
  }

  setEdges(edges: FlowEdge[] | ((edges: FlowEdge[]) => FlowEdge[])): void {
    this.#replaceEdges(typeof edges === "function" ? edges(this.#edges) : edges);
    this.#emitSelectionChange();
    this.#notifyAllEdges();
    this.notifyListeners();
  }

  addNodes(nodes: FlowNode | FlowNode[]): void {
    const list = Array.isArray(nodes) ? nodes : [nodes];
    this.#applyNodeChanges(list.map((item) => ({ type: "add", item }) as NodeChange<FlowNode>));
  }

  addEdges(edges: (Partial<FlowEdge> & Connection) | FlowEdge | (Partial<FlowEdge> & Connection)[] | FlowEdge[]): void {
    const list = (Array.isArray(edges) ? edges : [edges]) as (Partial<FlowEdge> & Connection)[];
    const changes: EdgeChange<FlowEdge>[] = [];
    let current = this.#edges;
    for (const params of list) {
      const next = addEdge({ ...this.#options.defaultEdgeOptions, ...params } as FlowEdge, current);
      if (next === current) continue;
      changes.push({ type: "add", item: next[next.length - 1] });
      current = next;
    }
    if (changes.length) this.#applyEdgeChanges(changes);
  }

  updateNode(
    id: string,
    update: Partial<FlowNode> | ((node: FlowNode) => Partial<FlowNode>),
    options: { replace?: boolean } = {},
  ): void {
    const node = this.#nodeLookup.get(id);
    if (!node) return;
    const patch = typeof update === "function" ? update(node) : update;
    const item = (options.replace ? { ...patch, id } : { ...node, ...patch, id }) as FlowNode;
    this.#applyNodeChanges([{ type: "replace", id, item }]);
  }

  updateNodeData(id: string, data: Record<string, unknown> | ((node: FlowNode) => Record<string, unknown>), options: { replace?: boolean } = {}): void {
    const node = this.#nodeLookup.get(id);
    if (!node) return;
    const next = typeof data === "function" ? data(node) : data;
    this.updateNode(id, { data: options.replace ? next : { ...(node.data as object), ...next } });
  }

  updateEdge(
    id: string,
    update: Partial<FlowEdge> | ((edge: FlowEdge) => Partial<FlowEdge>),
    options: { replace?: boolean } = {},
  ): void {
    const edge = this.#edgeLookup.get(id);
    if (!edge) return;
    const patch = typeof update === "function" ? update(edge) : update;
    const item = (options.replace ? { ...patch, id } : { ...edge, ...patch, id }) as FlowEdge;
    this.#applyEdgeChanges([{ type: "replace", id, item }]);
  }

  updateEdgeData(id: string, data: Record<string, unknown> | ((edge: FlowEdge) => Record<string, unknown>), options: { replace?: boolean } = {}): void {
    const edge = this.#edgeLookup.get(id);
    if (!edge) return;
    const next = typeof data === "function" ? data(edge) : data;
    this.updateEdge(id, { data: options.replace ? next : { ...(edge.data as object), ...next } });
  }

  async deleteElements({
    nodes = [],
    edges = [],
  }: {
    nodes?: (FlowNode | { id: string })[];
    edges?: (FlowEdge | { id: string })[];
  }): Promise<{ deletedNodes: FlowNode[]; deletedEdges: FlowEdge[] }> {
    const nodeIds = new Set<string>();
    const queue = nodes.map((n) => n.id);
    while (queue.length) {
      const id = queue.shift()!;
      if (nodeIds.has(id)) continue;
      const node = this.#nodeLookup.get(id);
      if (!node || node.deletable === false) continue;
      nodeIds.add(id);
      for (const child of this.#nodes) if (child.parentId === id) queue.push(child.id);
    }
    const nodesToDelete = this.#nodes.filter((n) => nodeIds.has(n.id));
    const edgeIds = new Set(edges.map((e) => e.id));
    for (const edge of getConnectedEdges(nodesToDelete, this.#edges)) edgeIds.add(edge.id);
    let edgesToDelete = this.#edges.filter((e) => edgeIds.has(e.id) && e.deletable !== false);
    let finalNodes = nodesToDelete;
    if (this.#callbacks.onBeforeDelete) {
      const result = await this.#callbacks.onBeforeDelete({ nodes: finalNodes, edges: edgesToDelete });
      if (result === false) return { deletedNodes: [], deletedEdges: [] };
      if (typeof result === "object") {
        finalNodes = result.nodes;
        edgesToDelete = result.edges;
      }
    }
    if (finalNodes.length === 0 && edgesToDelete.length === 0) return { deletedNodes: [], deletedEdges: [] };
    if (edgesToDelete.length) {
      this.#applyEdgeChanges(edgesToDelete.map((e) => ({ type: "remove", id: e.id }) as EdgeChange<FlowEdge>), { silent: true });
    }
    if (finalNodes.length) {
      this.#applyNodeChanges(finalNodes.map((n) => ({ type: "remove", id: n.id }) as NodeChange<FlowNode>), { silent: true });
    }
    if (edgesToDelete.length) this.#callbacks.onEdgesDelete?.(edgesToDelete);
    if (finalNodes.length) this.#callbacks.onNodesDelete?.(finalNodes);
    this.#callbacks.onDelete?.({ nodes: finalNodes, edges: edgesToDelete });
    this.#emitSelectionChange();
    this.notifyListeners();
    return { deletedNodes: finalNodes, deletedEdges: edgesToDelete };
  }

  getIncomers(node: FlowNode | { id: string }): FlowNode[] {
    return getIncomers(node, this.#nodes, this.#edges);
  }

  getOutgoers(node: FlowNode | { id: string }): FlowNode[] {
    return getOutgoers(node, this.#nodes, this.#edges);
  }

  getConnectedEdges(nodes: (FlowNode | { id: string })[]): FlowEdge[] {
    return getConnectedEdges(nodes, this.#edges);
  }

  toObject(): { nodes: FlowNode[]; edges: FlowEdge[]; viewport: Viewport } {
    return {
      nodes: this.#nodes.map((n) => ({ ...n })),
      edges: this.#edges.map((e) => ({ ...e })),
      viewport: this.viewport,
    };
  }

  // ---------------------------------------------------------------------------
  // Selection
  // ---------------------------------------------------------------------------

  getSelectedNodes(): FlowNode[] {
    return this.#nodes.filter((n) => n.selected);
  }

  getSelectedEdges(): FlowEdge[] {
    return this.#edges.filter((e) => e.selected);
  }

  selectNodes(ids: string[], { additive = false }: { additive?: boolean } = {}): void {
    const nodeIds = new Set(additive ? [...this.getSelectedNodes().map((n) => n.id), ...ids] : ids);
    const edgeIds = new Set(additive ? this.getSelectedEdges().map((e) => e.id) : []);
    this.#setSelection(nodeIds, edgeIds);
  }

  selectEdges(ids: string[], { additive = false }: { additive?: boolean } = {}): void {
    const edgeIds = new Set(additive ? [...this.getSelectedEdges().map((e) => e.id), ...ids] : ids);
    const nodeIds = new Set(additive ? this.getSelectedNodes().map((n) => n.id) : []);
    this.#setSelection(nodeIds, edgeIds);
  }

  clearSelection(): void {
    this.#setSelection(new Set(), new Set());
  }

  // ---------------------------------------------------------------------------
  // Viewport
  // ---------------------------------------------------------------------------

  get viewport(): Viewport {
    const s = this.transformation.value.storage;
    return { x: s[12], y: s[13], zoom: s[0] || 1 };
  }

  getViewport(): Viewport {
    return this.viewport;
  }

  getZoom(): number {
    return this.viewport.zoom;
  }

  setViewport(viewport: Partial<Viewport>, options: { duration?: number } = {}): Promise<void> {
    return this.#applyViewport(this.#clampViewport({ ...this.viewport, ...viewport }), options.duration ?? 0);
  }

  panBy(delta: XYPosition): boolean {
    if (delta.x === 0 && delta.y === 0) return false;
    const current = this.viewport;
    void this.setViewport({ x: current.x + delta.x, y: current.y + delta.y });
    return true;
  }

  zoomIn(options: { duration?: number } = {}): Promise<void> {
    return this.#scaleAt(this.#paneCenter(), 1.2, options.duration ?? 0);
  }

  zoomOut(options: { duration?: number } = {}): Promise<void> {
    return this.#scaleAt(this.#paneCenter(), 1 / 1.2, options.duration ?? 0);
  }

  zoomTo(zoom: number, options: { duration?: number } = {}): Promise<void> {
    const current = this.viewport.zoom;
    return this.#scaleAt(this.#paneCenter(), zoom / current, options.duration ?? 0);
  }

  /** Zoom around a point given in pane pixels. */
  zoomAt(point: XYPosition, ratio: number, options: { duration?: number } = {}): Promise<void> {
    return this.#scaleAt(point, ratio, options.duration ?? 0);
  }

  fitView(options: FitViewOptions = {}): Promise<boolean> {
    const ids = options.nodes ? new Set(options.nodes.map((n) => n.id)) : null;
    const rects: Rect[] = [];
    for (const node of this.#nodes) {
      if (ids && !ids.has(node.id)) continue;
      if (node.hidden && !options.includeHiddenNodes) continue;
      const rect = this.getNodeRect(node);
      if (rect) rects.push(rect);
    }
    if (rects.length === 0 || this.#paneSize.width === 0 || this.#paneSize.height === 0) {
      return Promise.resolve(false);
    }
    return this.fitBounds(getBoundsOfRects(rects), options).then(() => true);
  }

  fitBounds(
    bounds: Rect,
    options: { padding?: number; duration?: number; minZoom?: number; maxZoom?: number } = {},
  ): Promise<void> {
    const viewport = getViewportForBounds(
      bounds,
      this.#paneSize.width,
      this.#paneSize.height,
      options.minZoom ?? this.#options.minZoom,
      options.maxZoom ?? this.#options.maxZoom,
      options.padding ?? 0.1,
    );
    return this.#applyViewport(viewport, options.duration ?? 0);
  }

  setCenter(x: number, y: number, options: { zoom?: number; duration?: number } = {}): Promise<void> {
    const zoom = clamp(options.zoom ?? this.#options.maxZoom, this.#options.minZoom, this.#options.maxZoom);
    return this.#applyViewport(
      {
        x: this.#paneSize.width / 2 - x * zoom,
        y: this.#paneSize.height / 2 - y * zoom,
        zoom,
      },
      options.duration ?? 0,
    );
  }

  /** Client (screen) coordinates -> flow coordinates. */
  screenToFlowPosition(point: XYPosition, options: { snapToGrid?: boolean } = {}): XYPosition {
    const pane = this.#clientToPane(point);
    const snap = options.snapToGrid ?? this.#options.snapToGrid;
    return paneToFlowPosition(pane, this.viewport, snap, this.#options.snapGrid);
  }

  /** Flow coordinates -> client (screen) coordinates. */
  flowToScreenPosition(point: XYPosition): XYPosition {
    const pane = flowToPanePosition(point, this.viewport);
    const render = this.#paneRenderObject();
    if (!render) return pane;
    const context = render.renderOwner.renderContext;
    const rect = context.view.getBoundingClientRect();
    const global = render.localToGlobal();
    const { scale, translation } = context.viewPort;
    return {
      x: rect.left + (global.x + pane.x + translation.x) * scale,
      y: rect.top + (global.y + pane.y + translation.y) * scale,
    };
  }

  /** Pane pixel -> flow coordinates. */
  paneToFlowPosition(point: XYPosition, snapToGrid = false): XYPosition {
    return paneToFlowPosition(point, this.viewport, snapToGrid, this.#options.snapGrid);
  }

  /** Flow coordinates -> pane pixel. */
  flowToPanePosition(point: XYPosition): XYPosition {
    return flowToPanePosition(point, this.viewport);
  }

  /** Visible region of the flow plane in flow coordinates. */
  getViewportRect(): Rect {
    const v = this.viewport;
    return {
      x: -v.x / v.zoom,
      y: -v.y / v.zoom,
      width: this.#paneSize.width / v.zoom,
      height: this.#paneSize.height / v.zoom,
    };
  }

  // ---------------------------------------------------------------------------
  // Geometry
  // ---------------------------------------------------------------------------

  getNodePositionAbsolute(node: FlowNode): XYPosition {
    let position = node.position;
    let parentId = node.parentId;
    let guard = 0;
    while (parentId && guard++ < 64) {
      const parent = this.#nodeLookup.get(parentId);
      if (!parent) break;
      position = { x: position.x + parent.position.x, y: position.y + parent.position.y };
      parentId = parent.parentId;
    }
    return position;
  }

  getNodeDimensions(node: FlowNode): Dimensions | null {
    if (node.width != null && node.height != null) return { width: node.width, height: node.height };
    return node.measured ?? null;
  }

  /** Absolute rect of a node, or null until it has been measured. */
  getNodeRect(nodeOrId: FlowNode | string): Rect | null {
    const node = typeof nodeOrId === "string" ? this.#nodeLookup.get(nodeOrId) : nodeOrId;
    if (!node) return null;
    const dimensions = this.getNodeDimensions(node);
    if (!dimensions) return null;
    return { ...this.getNodePositionAbsolute(node), ...dimensions };
  }

  getNodesBounds(nodes?: (FlowNode | { id: string } | string)[]): Rect {
    const list = nodes
      ? nodes.map((n) => (typeof n === "string" ? this.#nodeLookup.get(n) : this.#nodeLookup.get(n.id)))
      : this.#nodes;
    const rects: Rect[] = [];
    for (const node of list) {
      if (!node || node.hidden) continue;
      const rect = this.getNodeRect(node);
      if (rect) rects.push(rect);
    }
    return getBoundsOfRects(rects);
  }

  getIntersectingNodes(target: FlowNode | { id: string } | Rect, partially = true, nodes?: FlowNode[]): FlowNode[] {
    const isRect = "width" in target && "x" in target;
    const rect = isRect ? (target as Rect) : this.getNodeRect((target as { id: string }).id);
    if (!rect) return [];
    const targetId = isRect ? null : (target as { id: string }).id;
    return (nodes ?? this.#nodes).filter((node) => {
      if (node.id === targetId || node.hidden) return false;
      const nodeRect = this.getNodeRect(node);
      if (!nodeRect) return false;
      const overlap = getOverlappingArea(rect, nodeRect);
      if (partially) return overlap > 0;
      return overlap >= nodeRect.width * nodeRect.height;
    });
  }

  isNodeIntersecting(target: FlowNode | { id: string } | Rect, area: Rect, partially = true): boolean {
    const rect = "width" in target && "x" in target ? (target as Rect) : this.getNodeRect((target as { id: string }).id);
    if (!rect) return false;
    const overlap = getOverlappingArea(rect, area);
    return partially ? overlap > 0 : overlap >= rect.width * rect.height;
  }

  /** Handle specs declared for a node (node > node type > style default). */
  getHandleSpecs(node: FlowNode): HandleSpec[] {
    if (node.handles) return node.handles;
    const type = this.nodeTypes[node.type ?? "default"] ?? this.nodeTypes.default;
    if (type && typeof type !== "function" && type.handles) {
      return typeof type.handles === "function" ? type.handles(node) : type.handles;
    }
    return this.custom?.defaultHandles?.(node, this as any) ?? [];
  }

  /** Handles with absolute geometry; empty until the node is measured. */
  getNodeHandles(nodeOrId: FlowNode | string): ResolvedHandle[] {
    const node = typeof nodeOrId === "string" ? this.#nodeLookup.get(nodeOrId) : nodeOrId;
    if (!node) return [];
    const rect = this.getNodeRect(node);
    if (!rect) return [];
    return this.getHandleSpecs(node).map((spec) => this.resolveHandle(node, rect, spec));
  }

  getHandle(nodeId: string, type: HandleType, handleId?: string | null): ResolvedHandle | null {
    const handles = this.getNodeHandles(nodeId);
    const strict = this.#options.connectionMode === "strict";
    const pool = strict ? handles.filter((h) => h.type === type) : handles;
    if (handleId) {
      return (
        pool.find((h) => h.id === handleId && h.type === type) ??
        pool.find((h) => h.id === handleId) ??
        null
      );
    }
    return pool.find((h) => h.type === type) ?? pool[0] ?? null;
  }

  /** Point where an edge attaches to a handle (React Flow's getHandlePosition). */
  getHandleEndpoint(handle: ResolvedHandle): XYPosition {
    switch (handle.position) {
      case "top":
        return { x: handle.x, y: handle.y - handle.height / 2 };
      case "right":
        return { x: handle.x + handle.width / 2, y: handle.y };
      case "bottom":
        return { x: handle.x, y: handle.y + handle.height / 2 };
      case "left":
        return { x: handle.x - handle.width / 2, y: handle.y };
    }
  }

  /** Source/target anchors of an edge, or null while either node is unmeasured. */
  getEdgeEndpoints(edge: FlowEdge): EdgeEndpoints | null {
    const sourceNode = this.#nodeLookup.get(edge.source);
    const targetNode = this.#nodeLookup.get(edge.target);
    if (!sourceNode || !targetNode || sourceNode.hidden || targetNode.hidden) return null;
    const sourceRect = this.getNodeRect(sourceNode);
    const targetRect = this.getNodeRect(targetNode);
    if (!sourceRect || !targetRect) return null;
    const sourceHandle = this.getHandle(edge.source, "source", edge.sourceHandle);
    const targetHandle = this.getHandle(edge.target, "target", edge.targetHandle);
    const sourcePosition = sourceHandle?.position ?? sourceNode.sourcePosition ?? "bottom";
    const targetPosition = targetHandle?.position ?? targetNode.targetPosition ?? "top";
    const source = sourceHandle ? this.getHandleEndpoint(sourceHandle) : rectSidePoint(sourceRect, sourcePosition);
    const target = targetHandle ? this.getHandleEndpoint(targetHandle) : rectSidePoint(targetRect, targetPosition);
    return {
      sourceX: source.x,
      sourceY: source.y,
      targetX: target.x,
      targetY: target.y,
      sourcePosition,
      targetPosition,
      sourceHandle,
      targetHandle,
    };
  }

  getEdgePath(edge: FlowEdge, endpoints: EdgeEndpoints): EdgePathResult {
    const type = edge.type ?? "default";
    const definition = this.edgeTypes[type];
    const params = {
      sourceX: endpoints.sourceX,
      sourceY: endpoints.sourceY,
      sourcePosition: endpoints.sourcePosition,
      targetX: endpoints.targetX,
      targetY: endpoints.targetY,
      targetPosition: endpoints.targetPosition,
    };
    if (definition && typeof definition !== "function" && definition.getPath) {
      return definition.getPath(params, edge);
    }
    if (this.custom?.edgePath) return this.custom.edgePath({ edge, params, type }, this as any);
    return getEdgePathByType(type, params, edge.pathOptions);
  }

  getConnectionLinePath(connection: ConnectionState): EdgePathResult {
    const params = {
      sourceX: connection.from.x,
      sourceY: connection.from.y,
      sourcePosition: connection.fromPosition,
      targetX: connection.to.x,
      targetY: connection.to.y,
      targetPosition: connection.toPosition,
    };
    const type = this.#options.connectionLineType;
    if (this.custom?.edgePath) return this.custom.edgePath({ edge: null, params, type }, this as any);
    return getEdgePathByType(type, params);
  }

  /** Nodes to render, bottom to top. */
  getVisibleNodes(): FlowNode[] {
    const nodes = this.#nodes.filter((n) => !n.hidden);
    const zIndex = new Map<string, number>();
    const zOf = (node: FlowNode, depth = 0): number => {
      const cached = zIndex.get(node.id);
      if (cached != null) return cached;
      let z = (node.zIndex ?? 0) + (node.selected && this.#options.elevateNodesOnSelect ? 1000 : 0);
      if (node.parentId && depth < 64) {
        const parent = this.#nodeLookup.get(node.parentId);
        if (parent) z = Math.max(z, zOf(parent, depth + 1) + 1);
      }
      zIndex.set(node.id, z);
      return z;
    };
    return nodes
      .map((node, index) => ({ node, index, z: zOf(node) }))
      .sort((a, b) => a.z - b.z || a.index - b.index)
      .map((entry) => entry.node);
  }

  getNodeZIndex(node: FlowNode): number {
    return (node.zIndex ?? 0) + (node.selected && this.#options.elevateNodesOnSelect ? 1000 : 0);
  }

  /** Edges to render, bottom to top. */
  getVisibleEdges(): FlowEdge[] {
    const edges = this.#edges.filter((e) => {
      if (e.hidden) return false;
      const s = this.#nodeLookup.get(e.source);
      const t = this.#nodeLookup.get(e.target);
      return !!s && !!t && !s.hidden && !t.hidden;
    });
    return edges
      .map((edge, index) => ({
        edge,
        index,
        z: (edge.zIndex ?? 0) + (edge.selected && this.#options.elevateEdgesOnSelect ? 1000 : 0),
      }))
      .sort((a, b) => a.z - b.z || a.index - b.index)
      .map((entry) => entry.edge);
  }

  // ---------------------------------------------------------------------------
  // Layout
  // ---------------------------------------------------------------------------

  /** Run a layout algorithm and apply the positions it returns. */
  async layout(algorithm?: LayoutAlgorithm, options?: LayoutOptions & { fitView?: boolean }): Promise<void> {
    const config = this.#layoutConfig;
    const resolved = algorithm ?? config?.algorithm;
    if (!resolved) return;
    const mergedOptions = { ...(config?.options ?? {}), ...(options ?? {}) };
    const { fitView: shouldFit, ...layoutOptions } = mergedOptions as LayoutOptions & { fitView?: boolean };
    let positions: Record<string, XYPosition>;
    let dimensions: Record<string, Dimensions>;
    try {
      ({ positions, dimensions } = await computeHierarchicalLayout(this.#nodes, this.#edges, resolved, layoutOptions));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (this.#callbacks.onError) this.#callbacks.onError("layout", `${resolved.name}: ${message}`);
      else throw error;
      return;
    }
    if (this.#disposed) return;
    const changes: NodeChange<FlowNode>[] = [];
    for (const [id, position] of Object.entries(positions)) {
      const node = this.#nodeLookup.get(id);
      if (!node) continue;
      if (node.position.x === position.x && node.position.y === position.y) continue;
      changes.push({ type: "position", id, position });
    }
    // Parents grown to fit their children take a fixed size, like a user resize.
    for (const [id, size] of Object.entries(dimensions)) {
      if (!this.#nodeLookup.has(id)) continue;
      changes.push({ type: "dimensions", id, dimensions: size, setAttributes: true });
    }
    if (changes.length) this.#applyNodeChanges(changes);
    const fit = shouldFit ?? config?.fitView ?? true;
    if (fit) await this.fitView(this.#fitViewOptions);
  }

  // ---------------------------------------------------------------------------
  // Interaction state (read by builders)
  // ---------------------------------------------------------------------------

  get hoveredNodeId(): string | null {
    return this.#hoveredNodeId;
  }

  get hoveredEdgeId(): string | null {
    return this.#hoveredEdgeId;
  }

  get connection(): ConnectionState | null {
    return this.#connection;
  }

  /** Selection rectangle in pane pixels while a box selection is in progress. */
  get selectionBox(): Rect | null {
    if (!this.#selectionBox) return null;
    return rectFromPoints(this.#selectionBox.start, this.#selectionBox.current);
  }

  get isDraggingNodes(): boolean {
    return !!this.#drag?.started && this.#drag.items.size > 0;
  }

  get resizingNodeId(): string | null {
    return this.#resize?.nodeId ?? null;
  }

  isEdgeReconnectable(edge: FlowEdge): boolean {
    return this.nodesConnectable && this.#options.edgesReconnectable && edge.reconnectable !== false;
  }

  /** Which ends of an edge may be dragged to a new handle. */
  getReconnectableEnds(edge: FlowEdge): HandleType[] {
    if (!this.isEdgeReconnectable(edge)) return [];
    if (edge.reconnectable === "source" || edge.reconnectable === "target") return [edge.reconnectable];
    return ["source", "target"];
  }

  isNodeResizable(node: FlowNode): boolean {
    return this.#interactive && (node.resizable ?? this.#options.nodesResizable);
  }

  getNodeResizeOptions(node: FlowNode): Required<Pick<NodeResizeOptions, "minWidth" | "minHeight">> & NodeResizeOptions {
    return { minWidth: 10, minHeight: 10, ...this.#options.nodeResizeOptions, ...(node.resizeOptions ?? {}) };
  }

  /** Toolbar builder for a node: its type's, else the diagram-level fallback. */
  getNodeToolbarBuilder(node: FlowNode): NodeToolbarBuilder<any> | null {
    const type = this.nodeTypes[node.type ?? "default"] ?? this.nodeTypes.default;
    if (type && typeof type !== "function" && type.toolbar) return type.toolbar;
    return this.nodeToolbar;
  }

  /** React Flow shows a toolbar for the single selected node unless `isVisible` says otherwise. */
  isNodeToolbarVisible(node: FlowNode): boolean {
    if (node.hidden) return false;
    if (typeof node.toolbar?.isVisible === "boolean") return node.toolbar.isVisible;
    return !!node.selected && this.getSelectedNodes().length === 1;
  }

  get isInteractive(): boolean {
    return this.#interactive;
  }

  setInteractive(interactive: boolean): void {
    if (this.#interactive === interactive) return;
    this.#interactive = interactive;
    this.#styleVersion += 1;
    this.notifyListeners();
  }

  get nodesDraggable(): boolean {
    return this.#interactive && this.#options.nodesDraggable;
  }

  get nodesConnectable(): boolean {
    return this.#interactive && this.#options.nodesConnectable;
  }

  get elementsSelectable(): boolean {
    return this.#interactive && this.#options.elementsSelectable;
  }

  isNodeDraggable(node: FlowNode): boolean {
    return node.draggable ?? this.nodesDraggable;
  }

  isNodeSelectable(node: FlowNode): boolean {
    return this.elementsSelectable && node.selectable !== false;
  }

  isNodeConnectable(node: FlowNode): boolean {
    return this.nodesConnectable && node.connectable !== false;
  }

  /** Whether the viewport pans on a plain drag right now (keys and options considered). */
  get panEnabled(): boolean {
    const o = this.#options;
    if (this.#keyHeld(o.panActivationKeyCode)) return true;
    const selectionIntent = o.selectionOnDrag || this.#keyHeld(o.selectionKeyCode);
    return o.panOnDrag && !selectionIntent;
  }

  get zoomEnabled(): boolean {
    return this.#options.zoomOnScroll || this.#options.zoomOnPinch;
  }

  // ---------------------------------------------------------------------------
  // Gesture handlers (wired by the headless widgets)
  // ---------------------------------------------------------------------------

  handlePanePointerDown(event: MouseEvent): void {
    this.#beginPress(event);
  }

  /** Called on every document mousedown so a wheel zoom never swallows the next click. */
  resetPointerMovement(): void {
    this.#pointerMoved = false;
  }

  /** Tracks whether the pointer is over the pane; never notifies. */
  setPointerInside(inside: boolean): void {
    this.#pointerInside = inside;
  }

  get isPointerInside(): boolean {
    return this.#pointerInside;
  }

  /** Whether the zoom activation key is held (turns pan-on-scroll into zoom). */
  get zoomActivationHeld(): boolean {
    return this.#keyHeld(this.#options.zoomActivationKeyCode);
  }

  handlePaneClick(event: MouseEvent): void {
    if (this.#consumeMovement()) return;
    const double = this.#registerClick("pane", event);
    if (!this.#isMultiSelect(event)) this.clearSelection();
    if (this.#connection?.mode === "click") this.cancelConnection();
    this.#callbacks.onPaneClick?.(event);
    if (double) {
      this.#callbacks.onPaneDoubleClick?.(event);
      if (this.#options.zoomOnDoubleClick) {
        void this.#scaleAt(this.#panePoint(event), event.shiftKey ? 0.5 : 2, 250);
      }
    }
  }

  /** Returns true when a box selection started (the caller should stop propagation). */
  handleSelectionDragStart(event: MouseEvent): boolean {
    if (event.button !== 0) return false;
    this.#beginPress(event);
    const o = this.#options;
    const intent = o.selectionOnDrag || this.#keyHeld(o.selectionKeyCode) || this.#modifierHeld(event, o.selectionKeyCode);
    if (!intent || !this.elementsSelectable || this.#keyHeld(o.panActivationKeyCode)) return false;
    const point = this.#panePoint(event);
    this.#selectionBox = { start: point, current: point };
    if (!this.#isMultiSelect(event)) this.clearSelection();
    this.#callbacks.onSelectionStart?.(event);
    this.notifyListeners();
    return true;
  }

  handleSelectionDragMove(event: MouseEvent): void {
    const box = this.#selectionBox;
    if (!box) return;
    this.#pointerMoved = true;
    box.current = this.#panePoint(event);
    const paneRect = rectFromPoints(box.start, box.current);
    const v = this.viewport;
    const flowRect: Rect = {
      x: (paneRect.x - v.x) / v.zoom,
      y: (paneRect.y - v.y) / v.zoom,
      width: paneRect.width / v.zoom,
      height: paneRect.height / v.zoom,
    };
    const nodeIds = new Set<string>();
    for (const node of this.#nodes) {
      if (node.hidden || !this.isNodeSelectable(node)) continue;
      const rect = this.getNodeRect(node);
      if (!rect) continue;
      const inside = this.#options.selectionMode === "full" ? rectContains(flowRect, rect) : getOverlappingArea(flowRect, rect) > 0;
      if (inside) nodeIds.add(node.id);
    }
    const edgeIds = new Set<string>();
    for (const edge of this.#edges) {
      if (nodeIds.has(edge.source) && nodeIds.has(edge.target) && edge.selectable !== false) edgeIds.add(edge.id);
    }
    this.#setSelection(nodeIds, edgeIds, { silent: true });
    this.notifyListeners();
  }

  handleSelectionDragEnd(event: MouseEvent): void {
    if (!this.#selectionBox) return;
    this.#selectionBox = null;
    this.#callbacks.onSelectionEnd?.(event);
    this.notifyListeners();
  }

  handleViewportInteractionStart(): void {
    this.#callbacks.onMoveStart?.(this.viewport);
  }

  handleViewportInteractionUpdate(details: { focalPointDelta: XYPosition; scale: number }): void {
    if (details.focalPointDelta.x !== 0 || details.focalPointDelta.y !== 0 || details.scale !== 1) {
      this.#pointerMoved = true;
    }
  }

  handleViewportInteractionEnd(): void {
    this.#callbacks.onMoveEnd?.(this.viewport);
  }

  hoverNode(id: string, event: MouseEvent): void {
    if (this.#hoveredNodeId === id) return;
    const previous = this.#hoveredNodeId;
    this.#hoveredNodeId = id;
    const node = this.#nodeLookup.get(id);
    if (node) this.#callbacks.onNodeMouseEnter?.(event, node);
    if (previous) this.#nodeSignals.get(previous)?.notifyListeners();
    this.#nodeSignals.get(id)?.notifyListeners();
  }

  unhoverNode(id: string, event: MouseEvent): void {
    if (this.#hoveredNodeId !== id) return;
    this.#hoveredNodeId = null;
    const node = this.#nodeLookup.get(id);
    if (node) this.#callbacks.onNodeMouseLeave?.(event, node);
    this.#nodeSignals.get(id)?.notifyListeners();
  }

  hoverEdge(id: string, event: MouseEvent): void {
    if (this.#hoveredEdgeId === id) return;
    const previous = this.#hoveredEdgeId;
    this.#hoveredEdgeId = id;
    const edge = this.#edgeLookup.get(id);
    if (edge) this.#callbacks.onEdgeMouseEnter?.(event, edge);
    if (previous) this.#edgeSignals.get(previous)?.notifyListeners();
    this.#edgeSignals.get(id)?.notifyListeners();
  }

  unhoverEdge(id: string, event: MouseEvent): void {
    if (this.#hoveredEdgeId !== id) return;
    this.#hoveredEdgeId = null;
    const edge = this.#edgeLookup.get(id);
    if (edge) this.#callbacks.onEdgeMouseLeave?.(event, edge);
    this.#edgeSignals.get(id)?.notifyListeners();
  }

  handleNodeDragStart(id: string, event: MouseEvent): void {
    this.#beginPress(event);
    if (event.button !== 0) return;
    if (!this.#nodeLookup.has(id)) return;
    const pane = this.#panePoint(event);
    this.#drag = {
      nodeId: id,
      startPane: pane,
      startFlow: this.paneToFlowPosition(pane),
      lastPane: pane,
      lastEvent: event,
      started: false,
      items: new Map(),
    };
  }

  handleNodeDragMove(id: string, event: MouseEvent): void {
    const drag = this.#drag;
    if (!drag || drag.nodeId !== id) return;
    const pane = this.#panePoint(event);
    drag.lastPane = pane;
    drag.lastEvent = event;
    this.#lastPanePoint = pane;
    if (!drag.started) {
      if (distance(pane, drag.startPane) <= this.#options.nodeDragThreshold) return;
      this.#startNodeDrag(drag, event);
    }
    if (drag.items.size === 0) return;
    this.#pointerMoved = true;
    this.#updateDragPositions(event);
    if (this.#options.autoPanOnNodeDrag) this.#ensureAutoPan();
  }

  handleNodeDragEnd(id: string, event: MouseEvent): void {
    const drag = this.#drag;
    if (!drag || drag.nodeId !== id) return;
    this.#drag = null;
    this.#stopAutoPan();
    if (!drag.started || drag.items.size === 0) return;
    const changes: NodeChange<FlowNode>[] = [];
    for (const itemId of drag.items.keys()) {
      const node = this.#nodeLookup.get(itemId);
      if (node) changes.push({ type: "position", id: itemId, position: node.position, dragging: false });
    }
    this.#applyNodeChanges(changes);
    const node = this.#nodeLookup.get(id);
    if (node) {
      this.#callbacks.onNodeDragStop?.(event, node, this.#dragItemNodes(drag));
    }
  }

  handleNodeClick(id: string, event: MouseEvent): void {
    if (this.#consumeMovement()) return;
    const node = this.#nodeLookup.get(id);
    if (!node) return;
    const double = this.#registerClick(`node:${id}`, event);
    if (this.isNodeSelectable(node)) {
      const multi = this.#isMultiSelect(event);
      if (!node.selected) this.#selectNode(id, multi);
      else if (multi) this.#deselectNode(id);
    }
    if (this.#connection?.mode === "click") this.cancelConnection();
    const current = this.#nodeLookup.get(id) ?? node;
    this.#callbacks.onNodeClick?.(event, current);
    if (double) this.#callbacks.onNodeDoubleClick?.(event, current);
  }

  handleEdgePointerDown(_id: string, event: MouseEvent): void {
    this.#beginPress(event);
  }

  handleEdgeClick(id: string, event: MouseEvent): void {
    if (this.#consumeMovement()) return;
    const edge = this.#edgeLookup.get(id);
    if (!edge) return;
    const double = this.#registerClick(`edge:${id}`, event);
    if (this.elementsSelectable && edge.selectable !== false) {
      const multi = this.#isMultiSelect(event);
      if (!edge.selected) {
        const nodeIds = new Set(multi ? this.getSelectedNodes().map((n) => n.id) : []);
        const edgeIds = new Set(multi ? this.getSelectedEdges().map((e) => e.id) : []);
        edgeIds.add(id);
        this.#setSelection(nodeIds, edgeIds);
      } else if (multi) {
        const edgeIds = new Set(this.getSelectedEdges().map((e) => e.id));
        edgeIds.delete(id);
        this.#setSelection(new Set(this.getSelectedNodes().map((n) => n.id)), edgeIds);
      }
    }
    const current = this.#edgeLookup.get(id) ?? edge;
    this.#callbacks.onEdgeClick?.(event, current);
    if (double) this.#callbacks.onEdgeDoubleClick?.(event, current);
  }

  /** Returns true when a connection drag started (the caller should stop propagation). */
  handleConnectionStart(nodeId: string, handleId: string | null, type: HandleType, event: MouseEvent): boolean {
    this.#beginPress(event);
    if (event.button !== 0) return false;
    // A click-to-connect gesture is pending: let the upcoming click finish it.
    if (this.#connection?.mode === "click") return true;
    const handle = this.#findHandle(nodeId, handleId, type);
    if (!handle || !this.#isHandleConnectable(handle)) return false;
    const node = this.#nodeLookup.get(nodeId)!;
    const from = this.getHandleEndpoint(handle);
    this.#connection = {
      inProgress: true,
      from,
      fromNode: node,
      fromHandle: handle,
      fromPosition: handle.position,
      to: this.paneToFlowPosition(this.#panePoint(event)),
      toNode: null,
      toHandle: null,
      toPosition: oppositePosition(handle.position),
      isValid: null,
      mode: "drag",
      reconnectingEdge: null,
      reconnectingEnd: null,
    };
    this.#callbacks.onConnectStart?.(event, { nodeId, handleId: handle.id, handleType: handle.type });
    this.#notifyConnection([nodeId]);
    return true;
  }

  handleConnectionMove(event: MouseEvent): void {
    const connection = this.#connection;
    if (!connection || connection.mode !== "drag") return;
    this.#pointerMoved = true;
    const pane = this.#panePoint(event);
    this.#lastPanePoint = pane;
    const previousTarget = connection.toNode?.id;
    this.#updateConnectionTarget(this.paneToFlowPosition(pane));
    if (this.#options.autoPanOnConnect) this.#ensureAutoPan();
    this.#notifyConnection(previousTarget === connection.toNode?.id ? [] : [previousTarget, connection.toNode?.id]);
  }

  handleConnectionEnd(event: MouseEvent): void {
    const connection = this.#connection;
    if (!connection || connection.mode !== "drag") return;
    this.#finishConnection(connection, event);
  }

  handleHandleClick(nodeId: string, handleId: string | null, type: HandleType, event: MouseEvent): void {
    if (this.#consumeMovement()) return;
    if (!this.#options.connectOnClick) return;
    const handle = this.#findHandle(nodeId, handleId, type);
    if (!handle) return;
    const connection = this.#connection;
    if (!connection || connection.mode !== "click") {
      if (!this.#isHandleConnectable(handle)) return;
      const from = this.getHandleEndpoint(handle);
      this.#connection = {
        inProgress: true,
        from,
        fromNode: this.#nodeLookup.get(nodeId)!,
        fromHandle: handle,
        fromPosition: handle.position,
        to: from,
        toNode: null,
        toHandle: null,
        toPosition: oppositePosition(handle.position),
        isValid: null,
        mode: "click",
        reconnectingEdge: null,
        reconnectingEnd: null,
      };
      this.#callbacks.onClickConnectStart?.(event, { nodeId, handleId: handle.id, handleType: handle.type });
      this.#notifyConnection([nodeId]);
      return;
    }
    const sameHandle =
      connection.fromHandle.nodeId === handle.nodeId &&
      connection.fromHandle.id === handle.id &&
      connection.fromHandle.type === handle.type;
    if (sameHandle) {
      this.cancelConnection();
      return;
    }
    const valid = this.#isValidConnectionTarget(connection.fromHandle, handle);
    connection.to = this.getHandleEndpoint(handle);
    connection.toNode = this.#nodeLookup.get(handle.nodeId) ?? null;
    connection.toHandle = handle;
    connection.toPosition = handle.position;
    connection.isValid = valid;
    this.#finishConnection(connection, event);
  }

  /** Drag an existing edge's `end` to another handle. Returns true when the gesture started. */
  handleReconnectStart(edgeId: string, end: HandleType, event: MouseEvent): boolean {
    this.#beginPress(event);
    if (event.button !== 0) return false;
    const edge = this.#edgeLookup.get(edgeId);
    if (!edge || !this.getReconnectableEnds(edge).includes(end)) return false;
    // the fixed end stays attached; the connection starts from its handle
    const fixedType: HandleType = end === "source" ? "target" : "source";
    const fixedNodeId = end === "source" ? edge.target : edge.source;
    const fixedHandleId = end === "source" ? edge.targetHandle : edge.sourceHandle;
    const fromHandle = this.getHandle(fixedNodeId, fixedType, fixedHandleId);
    const fromNode = this.#nodeLookup.get(fixedNodeId);
    if (!fromHandle || !fromNode) return false;
    const from = this.getHandleEndpoint(fromHandle);
    this.#connection = {
      inProgress: true,
      from,
      fromNode,
      fromHandle,
      fromPosition: fromHandle.position,
      to: this.paneToFlowPosition(this.#panePoint(event)),
      toNode: null,
      toHandle: null,
      toPosition: oppositePosition(fromHandle.position),
      isValid: null,
      mode: "drag",
      reconnectingEdge: edge,
      reconnectingEnd: end,
    };
    this.#callbacks.onReconnectStart?.(event, edge, end);
    this.#edgeSignals.get(edgeId)?.notifyListeners();
    this.#notifyConnection([fixedNodeId]);
    return true;
  }

  /** Replace an edge's endpoints with a new connection (React Flow's `reconnectEdge`). */
  reconnectEdge(oldEdge: FlowEdge, connection: Connection, options: { shouldReplaceId?: boolean } = {}): void {
    const next = reconnectEdgeHelper(oldEdge, connection, this.#edges, { shouldReplaceId: options.shouldReplaceId ?? true });
    if (next === this.#edges) return;
    const item = next[next.length - 1];
    this.#applyEdgeChanges([{ type: "replace", id: oldEdge.id, item }]);
  }

  handleResizeStart(nodeId: string, position: ResizeControlPosition, event: MouseEvent): boolean {
    this.#beginPress(event);
    if (event.button !== 0) return false;
    const node = this.#nodeLookup.get(nodeId);
    if (!node || !this.isNodeResizable(node)) return false;
    const dimensions = this.getNodeDimensions(node);
    if (!dimensions) return false;
    const startRect = { x: node.position.x, y: node.position.y, ...dimensions };
    this.#resize = {
      nodeId,
      position,
      startFlow: this.paneToFlowPosition(this.#panePoint(event)),
      startRect,
      lastParams: { ...startRect, direction: [0, 0] },
    };
    this.#applyNodeChanges([
      { type: "dimensions", id: nodeId, dimensions, resizing: true, setAttributes: true },
    ]);
    this.#callbacks.onNodeResizeStart?.(event, this.#nodeLookup.get(nodeId)!);
    return true;
  }

  handleResizeMove(event: MouseEvent): void {
    const resize = this.#resize;
    if (!resize) return;
    const node = this.#nodeLookup.get(resize.nodeId);
    if (!node) return;
    this.#pointerMoved = true;
    const pointer = this.paneToFlowPosition(this.#panePoint(event));
    const dx = pointer.x - resize.startFlow.x;
    const dy = pointer.y - resize.startFlow.y;
    const { position, startRect } = resize;
    const o = this.getNodeResizeOptions(node);
    const affectsLeft = position.endsWith("left");
    const affectsRight = position.endsWith("right");
    const affectsTop = position.startsWith("top");
    const affectsBottom = position.startsWith("bottom");
    let width = startRect.width + (affectsRight ? dx : affectsLeft ? -dx : 0);
    let height = startRect.height + (affectsBottom ? dy : affectsTop ? -dy : 0);
    width = clamp(width, o.minWidth, o.maxWidth ?? Infinity);
    height = clamp(height, o.minHeight, o.maxHeight ?? Infinity);
    if (o.keepAspectRatio && startRect.height > 0) {
      const ratio = startRect.width / startRect.height;
      const horizontal = affectsLeft || affectsRight;
      const vertical = affectsTop || affectsBottom;
      if (horizontal && !vertical) height = width / ratio;
      else if (vertical && !horizontal) width = height * ratio;
      else if (Math.abs(dx) >= Math.abs(dy)) height = width / ratio;
      else width = height * ratio;
    }
    if (this.#options.snapToGrid) {
      const [gx, gy] = this.#options.snapGrid;
      width = Math.max(o.minWidth, Math.round(width / gx) * gx);
      height = Math.max(o.minHeight, Math.round(height / gy) * gy);
    }
    let x = affectsLeft ? startRect.x + (startRect.width - width) : startRect.x;
    let y = affectsTop ? startRect.y + (startRect.height - height) : startRect.y;
    // Keep the resized box inside the node's extent (nodeExtent, node.extent or its parent).
    const extent = this.#nodeExtentOf(node);
    if (extent) {
      const right = Math.min(x + width, extent[1][0]);
      const bottom = Math.min(y + height, extent[1][1]);
      x = Math.max(x, extent[0][0]);
      y = Math.max(y, extent[0][1]);
      width = Math.max(o.minWidth, right - x);
      height = Math.max(o.minHeight, bottom - y);
    }
    const changes: NodeChange<FlowNode>[] = [
      { type: "dimensions", id: node.id, dimensions: { width, height }, resizing: true, setAttributes: true },
    ];
    if (x !== node.position.x || y !== node.position.y) {
      changes.push({ type: "position", id: node.id, position: { x, y } });
    }
    this.#applyNodeChanges(changes);
    const params: ResizeParams = { x, y, width, height, direction: [Math.sign(dx), Math.sign(dy)] };
    resize.lastParams = params;
    this.#callbacks.onNodeResize?.(event, this.#nodeLookup.get(node.id)!, params);
  }

  handleResizeEnd(event: MouseEvent): void {
    const resize = this.#resize;
    if (!resize) return;
    this.#resize = null;
    const node = this.#nodeLookup.get(resize.nodeId);
    if (!node) return;
    const dimensions = this.getNodeDimensions(node) ?? { width: resize.lastParams.width, height: resize.lastParams.height };
    this.#applyNodeChanges([{ type: "dimensions", id: node.id, dimensions, resizing: false, setAttributes: true }]);
    this.#callbacks.onNodeResizeEnd?.(event, this.#nodeLookup.get(node.id)!, resize.lastParams);
  }

  cancelConnection(): void {
    const connection = this.#connection;
    if (!connection) return;
    this.#connection = null;
    this.#stopAutoPan();
    if (connection.reconnectingEdge) this.#edgeSignals.get(connection.reconnectingEdge.id)?.notifyListeners();
    this.#notifyConnection([connection.fromNode.id, connection.toNode?.id]);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (isInputTarget(event.target)) return;
    const name = keyNameOf(event);
    const o = this.#options;
    this.#keysHeld.add(name);
    if (toKeyList(o.deleteKeyCode).includes(name) && !event.repeat) {
      const nodes = this.getSelectedNodes();
      const edges = this.getSelectedEdges();
      if (nodes.length || edges.length) {
        event.preventDefault();
        void this.deleteElements({ nodes, edges });
      }
      return;
    }
    if (name === "Escape") {
      if (this.#connection) this.cancelConnection();
      return;
    }
    // Space must not scroll the page while it pans the diagram under the pointer.
    if (toKeyList(o.panActivationKeyCode).includes(name) && this.#pointerInside) event.preventDefault();
    if (this.#affectsGestures(name)) this.notifyListeners();
  }

  handleKeyUp(event: KeyboardEvent): void {
    const name = keyNameOf(event);
    if (!this.#keysHeld.delete(name)) return;
    if (this.#affectsGestures(name)) this.notifyListeners();
  }

  handleWindowBlur(): void {
    if (this.#keysHeld.size === 0) return;
    this.#keysHeld.clear();
    this.notifyListeners();
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  #handleTransformChange = () => {
    // Gestures from InteractiveViewer bypass #applyViewport: enforce translateExtent here.
    if (this.#options.translateExtent !== infiniteExtent) {
      const current = this.viewport;
      const clamped = this.#clampViewport(current);
      if (clamped.x !== current.x || clamped.y !== current.y) {
        this.#setMatrix(clamped); // re-enters this listener with a clamped value
        return;
      }
    }
    this.#callbacks.onMove?.(this.viewport);
    this.notifyListeners();
  };

  #replaceNodes(nodes: FlowNode[]): void {
    this.#nodes = nodes.map((node) => {
      if (node.measured) return node;
      const previous = this.#nodeLookup.get(node.id);
      return previous?.measured ? { ...node, measured: previous.measured } : node;
    });
    this.#rebuildNodeLookup();
  }

  #replaceEdges(edges: FlowEdge[]): void {
    this.#edges = edges;
    this.#rebuildEdgeLookup();
  }

  #rebuildNodeLookup(): void {
    this.#nodeLookup = new Map(this.#nodes.map((n) => [n.id, n]));
  }

  #rebuildEdgeLookup(): void {
    this.#edgeLookup = new Map(this.#edges.map((e) => [e.id, e]));
  }

  #applyNodeChanges(changes: NodeChange<FlowNode>[], { silent = false }: { silent?: boolean } = {}): void {
    if (changes.length === 0) return;
    this.#nodes = applyNodeChanges(changes, this.#nodes);
    this.#rebuildNodeLookup();
    this.#callbacks.onNodesChange?.(changes);
    for (const change of changes) {
      const id = change.type === "add" ? change.item.id : change.id;
      if (change.type === "remove") this.#nodeSignals.delete(id);
      else this.#nodeSignals.get(id)?.notifyListeners();
    }
    if (silent) return;
    this.#emitSelectionChange();
    this.notifyListeners();
  }

  #applyEdgeChanges(changes: EdgeChange<FlowEdge>[], { silent = false }: { silent?: boolean } = {}): void {
    if (changes.length === 0) return;
    this.#edges = applyEdgeChanges(changes, this.#edges);
    this.#rebuildEdgeLookup();
    this.#callbacks.onEdgesChange?.(changes);
    for (const change of changes) {
      const id = change.type === "add" ? change.item.id : change.id;
      if (change.type === "remove") this.#edgeSignals.delete(id);
      else this.#edgeSignals.get(id)?.notifyListeners();
    }
    if (silent) return;
    this.#emitSelectionChange();
    this.notifyListeners();
  }

  #notifyAllNodes(): void {
    for (const signal of this.#nodeSignals.values()) signal.notifyListeners();
  }

  #notifyAllEdges(): void {
    for (const signal of this.#edgeSignals.values()) signal.notifyListeners();
  }

  /** Connection gesture changed: refresh the line and the handles of the nodes involved. */
  #notifyConnection(nodeIds: (string | undefined)[]): void {
    for (const id of new Set(nodeIds)) if (id) this.#nodeSignals.get(id)?.notifyListeners();
    this.connectionSignal.notifyListeners();
  }

  #setSelection(nodeIds: Set<string>, edgeIds: Set<string>, { silent = false }: { silent?: boolean } = {}): void {
    const nodeChanges: NodeChange<FlowNode>[] = [];
    for (const node of this.#nodes) {
      const selected = nodeIds.has(node.id);
      if (!!node.selected !== selected) nodeChanges.push({ type: "select", id: node.id, selected });
    }
    const edgeChanges: EdgeChange<FlowEdge>[] = [];
    for (const edge of this.#edges) {
      const selected = edgeIds.has(edge.id);
      if (!!edge.selected !== selected) edgeChanges.push({ type: "select", id: edge.id, selected });
    }
    if (nodeChanges.length === 0 && edgeChanges.length === 0) return;
    if (nodeChanges.length) this.#applyNodeChanges(nodeChanges, { silent: true });
    if (edgeChanges.length) this.#applyEdgeChanges(edgeChanges, { silent: true });
    this.#emitSelectionChange();
    if (!silent) this.notifyListeners();
  }

  #selectNode(id: string, additive: boolean): void {
    const nodeIds = new Set(additive ? this.getSelectedNodes().map((n) => n.id) : []);
    const edgeIds = new Set(additive ? this.getSelectedEdges().map((e) => e.id) : []);
    nodeIds.add(id);
    this.#setSelection(nodeIds, edgeIds);
  }

  #deselectNode(id: string): void {
    const nodeIds = new Set(this.getSelectedNodes().map((n) => n.id));
    nodeIds.delete(id);
    this.#setSelection(nodeIds, new Set(this.getSelectedEdges().map((e) => e.id)));
  }

  #emitSelectionChange(): void {
    const nodes = this.getSelectedNodes();
    const edges = this.getSelectedEdges();
    const key = `${nodes.map((n) => n.id).join(",")}|${edges.map((e) => e.id).join(",")}`;
    if (key === this.#selectionSnapshot) return;
    this.#selectionSnapshot = key;
    this.#callbacks.onSelectionChange?.({ nodes, edges });
  }

  #allNodesMeasured(): boolean {
    return this.#nodes.every((n) => n.hidden || this.getNodeDimensions(n) != null);
  }

  #afterMeasure(): void {
    if (!this.#allNodesMeasured()) return;
    if (this.#layoutPending) {
      this.#layoutPending = false;
      const fit = this.#fitViewOnInit || (this.#layoutConfig?.fitView ?? true);
      this.#fitViewOnInit = false;
      void this.layout(undefined, { fitView: fit });
      return;
    }
    if (this.#fitViewOnInit) {
      this.#fitViewOnInit = false;
      void this.fitView(this.#fitViewOptions);
    }
  }

  #clampViewport(viewport: Viewport): Viewport {
    const zoomed = { ...viewport, zoom: clamp(viewport.zoom, this.#options.minZoom, this.#options.maxZoom) };
    const extent = this.#options.translateExtent;
    if (extent === infiniteExtent || this.#paneSize.width === 0 || this.#paneSize.height === 0) return zoomed;
    return clampViewportToExtent(zoomed, extent, this.#paneSize);
  }

  #setMatrix(viewport: Viewport): void {
    const matrix = Matrix4.translationValues(viewport.x, viewport.y, 0);
    matrix.multiplyMatrix(Matrix4.diagonal3Values(viewport.zoom, viewport.zoom, 1));
    this.transformation.value = matrix;
  }

  #applyViewport(viewport: Viewport, duration: number): Promise<void> {
    this.#stopAnimation();
    const target = this.#clampViewport(viewport);
    const current = this.viewport;
    if (current.x === target.x && current.y === target.y && current.zoom === target.zoom) return Promise.resolve();
    if (!(duration > 0) || typeof window === "undefined") {
      this.#setMatrix(target);
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const from = current;
      const animation = new AnimationController({ duration });
      this.#animation = animation;
      animation.addListener(() => {
        const t = easeInOutCubic(animation.value);
        this.#setMatrix({
          x: lerp(from.x, target.x, t),
          y: lerp(from.y, target.y, t),
          zoom: lerp(from.zoom, target.zoom, t),
        });
        if (animation.value >= 1) {
          this.#setMatrix(target);
          if (this.#animation === animation) this.#animation = null;
          animation.dispose();
          resolve();
        }
      });
      animation.forward();
    });
  }

  #stopAnimation(): void {
    if (!this.#animation) return;
    this.#animation.stop();
    this.#animation.dispose();
    this.#animation = null;
  }

  #scaleAt(point: XYPosition, ratio: number, duration: number): Promise<void> {
    const current = this.viewport;
    const zoom = clamp(current.zoom * ratio, this.#options.minZoom, this.#options.maxZoom);
    if (zoom === current.zoom) return Promise.resolve();
    const k = zoom / current.zoom;
    return this.#applyViewport(
      { x: point.x - (point.x - current.x) * k, y: point.y - (point.y - current.y) * k, zoom },
      duration,
    );
  }

  #paneCenter(): XYPosition {
    return { x: this.#paneSize.width / 2, y: this.#paneSize.height / 2 };
  }

  #paneRenderObject(): RenderObject | null {
    if (!this.#paneKey) return null;
    try {
      return this.#paneKey.currentContext.renderObject;
    } catch {
      return null;
    }
  }

  #panePoint(event: MouseEvent): XYPosition {
    const render = this.#paneRenderObject();
    if (!render) return { x: event.clientX, y: event.clientY };
    return eventPosition(render, event);
  }

  #clientToPane(point: XYPosition): XYPosition {
    const render = this.#paneRenderObject();
    if (!render) return point;
    return eventPosition(render, { clientX: point.x, clientY: point.y } as MouseEvent);
  }

  #beginPress(event: MouseEvent): void {
    this.#pointerMoved = false;
    this.#lastPanePoint = this.#panePoint(event);
  }

  #consumeMovement(): boolean {
    const moved = this.#pointerMoved;
    this.#pointerMoved = false;
    return moved;
  }

  #registerClick(key: string, event: MouseEvent): boolean {
    const now = Date.now();
    const last = this.#lastClick;
    const double =
      !!last &&
      last.key === key &&
      now - last.time < 300 &&
      Math.hypot(event.clientX - last.x, event.clientY - last.y) < 6;
    this.#lastClick = double ? null : { key, time: now, x: event.clientX, y: event.clientY };
    return double;
  }

  #keyHeld(code: KeyCode): boolean {
    return toKeyList(code).some((key) => this.#keysHeld.has(key));
  }

  #modifierHeld(event: MouseEvent, code: KeyCode): boolean {
    return toKeyList(code).some((key) => modifierMatches(event, key) === true);
  }

  #isMultiSelect(event: MouseEvent): boolean {
    return toKeyList(this.#options.multiSelectionKeyCode).some(
      (key) => modifierMatches(event, key) ?? this.#keysHeld.has(key),
    );
  }

  #affectsGestures(name: string): boolean {
    const o = this.#options;
    return (
      toKeyList(o.panActivationKeyCode).includes(name) ||
      toKeyList(o.selectionKeyCode).includes(name) ||
      toKeyList(o.zoomActivationKeyCode).includes(name)
    );
  }

  /** Resolve a handle spec against a node rect (public so widgets can place handles before measurement). */
  resolveHandle(node: FlowNode, rect: Rect, spec: HandleSpec): ResolvedHandle {
    const size = this.#options.handleSize;
    const { x, y } = handleCenter(spec, rect);
    return {
      ...spec,
      id: spec.id ?? null,
      nodeId: node.id,
      width: spec.width ?? size,
      height: spec.height ?? size,
      x,
      y,
    };
  }

  #findHandle(nodeId: string, handleId: string | null, type: HandleType): ResolvedHandle | null {
    const handles = this.getNodeHandles(nodeId);
    return handles.find((h) => h.type === type && h.id === handleId) ?? null;
  }

  #isHandleConnectable(handle: ResolvedHandle): boolean {
    const node = this.#nodeLookup.get(handle.nodeId);
    if (!node || !this.isNodeConnectable(node)) return false;
    return handle.connectable !== false;
  }

  #buildConnection(from: ResolvedHandle, to: ResolvedHandle): Connection {
    const isTarget = from.type === "target";
    return {
      source: isTarget ? to.nodeId : from.nodeId,
      sourceHandle: isTarget ? to.id : from.id,
      target: isTarget ? from.nodeId : to.nodeId,
      targetHandle: isTarget ? from.id : to.id,
    };
  }

  #isValidConnectionTarget(from: ResolvedHandle, to: ResolvedHandle): boolean {
    if (!this.#isHandleConnectable(to)) return false;
    const strict = this.#options.connectionMode === "strict";
    const sameHandle = from.nodeId === to.nodeId && from.id === to.id && from.type === to.type;
    const typeOk = strict ? from.type !== to.type : !sameHandle;
    if (!typeOk) return false;
    return this.#options.isValidConnection(this.#buildConnection(from, to));
  }

  #closestHandle(point: XYPosition, from: ResolvedHandle): ResolvedHandle | null {
    const radius = this.#options.connectionRadius;
    let closest: ResolvedHandle[] = [];
    let min = Infinity;
    for (const node of this.#nodes) {
      if (node.hidden) continue;
      const rect = this.getNodeRect(node);
      if (!rect) continue;
      // skip nodes whose rect is far from the pointer
      if (
        point.x < rect.x - radius * 2 ||
        point.x > rect.x + rect.width + radius * 2 ||
        point.y < rect.y - radius * 2 ||
        point.y > rect.y + rect.height + radius * 2
      ) {
        continue;
      }
      for (const handle of this.getNodeHandles(node)) {
        if (handle.nodeId === from.nodeId && handle.id === from.id && handle.type === from.type) continue;
        const d = distance(point, { x: handle.x, y: handle.y });
        if (d > radius) continue;
        if (d < min) {
          min = d;
          closest = [handle];
        } else if (d === min) {
          closest.push(handle);
        }
      }
    }
    if (closest.length === 0) return null;
    if (closest.length > 1) {
      const opposite = from.type === "source" ? "target" : "source";
      return closest.find((h) => h.type === opposite) ?? closest[0];
    }
    return closest[0];
  }

  #updateConnectionTarget(flowPoint: XYPosition): void {
    const connection = this.#connection;
    if (!connection) return;
    const closest = this.#closestHandle(flowPoint, connection.fromHandle);
    if (closest) {
      connection.to = this.getHandleEndpoint(closest);
      connection.toNode = this.#nodeLookup.get(closest.nodeId) ?? null;
      connection.toHandle = closest;
      connection.toPosition = closest.position;
      connection.isValid = this.#isValidConnectionTarget(connection.fromHandle, closest);
    } else {
      connection.to = flowPoint;
      connection.toNode = null;
      connection.toHandle = null;
      connection.toPosition = oppositePosition(connection.fromPosition);
      connection.isValid = null;
    }
  }

  #finishConnection(connection: ConnectionState, event: MouseEvent): void {
    this.#connection = null;
    this.#stopAutoPan();
    const final = { ...connection, inProgress: false };
    if (connection.reconnectingEdge) {
      const edge = connection.reconnectingEdge;
      if (connection.isValid && connection.toHandle) {
        const params = this.#buildConnection(connection.fromHandle, connection.toHandle);
        if (this.#callbacks.onReconnect) this.#callbacks.onReconnect(edge, params);
        else this.reconnectEdge(edge, params);
      }
      this.#callbacks.onReconnectEnd?.(event, edge, connection.reconnectingEnd ?? "target", final);
      this.#edgeSignals.get(edge.id)?.notifyListeners();
      this.#notifyConnection([connection.fromNode.id, connection.toNode?.id]);
      return;
    }
    if (connection.isValid && connection.toHandle) {
      const params = this.#buildConnection(connection.fromHandle, connection.toHandle);
      if (this.#callbacks.onConnect) {
        this.#callbacks.onConnect(params);
      } else {
        this.addEdges(params);
      }
    }
    if (connection.mode === "click") this.#callbacks.onClickConnectEnd?.(event, final);
    else this.#callbacks.onConnectEnd?.(event, final);
    this.#notifyConnection([connection.fromNode.id, connection.toNode?.id]);
  }

  #startNodeDrag(drag: DragState, event: MouseEvent): void {
    drag.started = true;
    const node = this.#nodeLookup.get(drag.nodeId);
    if (!node) return;
    if (this.#options.selectNodesOnDrag && this.isNodeSelectable(node) && !node.selected) {
      this.#selectNode(node.id, this.#isMultiSelect(event));
    }
    const current = this.#nodeLookup.get(drag.nodeId)!;
    const draggableItems = current.selected
      ? this.#nodes.filter((n) => n.selected && !n.hidden && this.isNodeDraggable(n) && !this.#hasSelectedAncestor(n))
      : this.isNodeDraggable(current)
        ? [current]
        : [];
    if (draggableItems.length === 0) return;
    for (const item of draggableItems) drag.items.set(item.id, { start: item.position });
    this.#applyNodeChanges(draggableItems.map((n) => ({ type: "position", id: n.id, dragging: true }) as NodeChange<FlowNode>));
    this.#callbacks.onNodeDragStart?.(event, this.#nodeLookup.get(drag.nodeId)!, this.#dragItemNodes(drag));
  }

  #hasSelectedAncestor(node: FlowNode): boolean {
    let parentId = node.parentId;
    let guard = 0;
    while (parentId && guard++ < 64) {
      const parent = this.#nodeLookup.get(parentId);
      if (!parent) return false;
      if (parent.selected) return true;
      parentId = parent.parentId;
    }
    return false;
  }

  #dragItemNodes(drag: DragState): FlowNode[] {
    return Array.from(drag.items.keys())
      .map((id) => this.#nodeLookup.get(id))
      .filter((n): n is FlowNode => !!n);
  }

  #updateDragPositions(event: MouseEvent): void {
    const drag = this.#drag;
    if (!drag || !drag.started || drag.items.size === 0) return;
    const currentFlow = this.paneToFlowPosition(drag.lastPane);
    const delta = { x: currentFlow.x - drag.startFlow.x, y: currentFlow.y - drag.startFlow.y };
    const o = this.#options;
    const changes: NodeChange<FlowNode>[] = [];
    for (const [id, item] of drag.items) {
      const node = this.#nodeLookup.get(id);
      if (!node) continue;
      let next: XYPosition = { x: item.start.x + delta.x, y: item.start.y + delta.y };
      if (o.snapToGrid) next = snapPosition(next, o.snapGrid);
      next = this.#clampToExtent(node, next);
      if (next.x === node.position.x && next.y === node.position.y) continue;
      changes.push({ type: "position", id, position: next, dragging: true });
    }
    if (changes.length) this.#applyNodeChanges(changes);
    const node = this.#nodeLookup.get(drag.nodeId);
    if (node) this.#callbacks.onNodeDrag?.(event, node, this.#dragItemNodes(drag));
  }

  /** Coordinate extent that applies to a node, or null when unbounded. */
  #nodeExtentOf(node: FlowNode): CoordinateExtent | null {
    if (node.extent === "parent") {
      const parent = node.parentId ? this.#nodeLookup.get(node.parentId) : undefined;
      const parentDimensions = parent ? this.getNodeDimensions(parent) : null;
      return parentDimensions
        ? [
            [0, 0],
            [parentDimensions.width, parentDimensions.height],
          ]
        : null;
    }
    const extent = node.extent ?? this.#options.nodeExtent;
    return extent === infiniteExtent ? null : extent;
  }

  #clampToExtent(node: FlowNode, position: XYPosition): XYPosition {
    const dimensions = this.getNodeDimensions(node) ?? undefined;
    if (node.extent === "parent") {
      const parent = node.parentId ? this.#nodeLookup.get(node.parentId) : undefined;
      const parentDimensions = parent ? this.getNodeDimensions(parent) : null;
      if (parentDimensions) {
        const extent: CoordinateExtent = [
          [0, 0],
          [parentDimensions.width, parentDimensions.height],
        ];
        return clampPosition(position, extent, dimensions);
      }
      return position;
    }
    const extent = node.extent ?? this.#options.nodeExtent;
    if (extent === infiniteExtent) return position;
    return clampPosition(position, extent, dimensions);
  }

  #ensureAutoPan(): void {
    if (this.#autoPanFrame != null || typeof requestAnimationFrame === "undefined") return;
    const tick = () => {
      this.#autoPanFrame = null;
      const dragging = !!this.#drag?.started && this.#drag.items.size > 0;
      const connecting = this.#connection?.mode === "drag";
      if (!dragging && !connecting) return;
      const [vx, vy] = calcAutoPan(this.#lastPanePoint, this.#paneSize, this.#options.autoPanSpeed);
      if (vx !== 0 || vy !== 0) {
        this.panBy({ x: vx, y: vy });
        if (dragging && this.#drag) this.#updateDragPositions(this.#drag.lastEvent);
        if (connecting && this.#connection) {
          const previousTarget = this.#connection.toNode?.id;
          this.#updateConnectionTarget(this.paneToFlowPosition(this.#lastPanePoint));
          this.#notifyConnection([previousTarget, this.#connection.toNode?.id]);
        }
      }
      this.#autoPanFrame = requestAnimationFrame(tick);
    };
    this.#autoPanFrame = requestAnimationFrame(tick);
  }

  #stopAutoPan(): void {
    if (this.#autoPanFrame == null) return;
    if (typeof cancelAnimationFrame !== "undefined") cancelAnimationFrame(this.#autoPanFrame);
    this.#autoPanFrame = null;
  }
}

export { createId as createFlowId, getEdgeId };
