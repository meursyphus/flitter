import {
  type BuildContext,
  Center,
  type ChangeNotifier,
  Constraints,
  EdgeInsets,
  GestureDetector,
  GlobalKey,
  InteractiveViewer,
  LayoutBuilder,
  type PinchWheelEvent,
  Positioned,
  Provider,
  RepaintBoundary,
  SizedBox,
  Stack,
  StackFit,
  State,
  StatefulWidget,
  StatelessWidget,
  type Widget,
} from "flitter-core";
import { FlowController } from "./controller";
import { FLOW_PROVIDER_KEY, FlowProvider } from "./provider";
import { FlowNodeItem, FlowScene, FlowSceneGroup, FlowSceneItem, type NodeAttachmentPlacement } from "./scene";
import type {
  EdgeBuilder,
  EdgeMarker,
  FlowEdge,
  FlowNode,
  FlowPanel,
  FlowProps,
  HandleType,
  NodeBuilder,
  ResizeControlPosition,
} from "./types";
import type { MarkerShape } from "../../shared/edges";
import { distanceToPolyline, pointsBounds, translateEdgePath } from "../../shared/edges";
import { type Rect, handleCenter, inflateRect } from "../../shared/geometry";
import { isMacOs } from "../../shared/utils";

/** Extra room around an edge's sampled polyline for markers and stroke width. */
const EDGE_MARGIN = 24;
const PANEL_MARGIN = 15;

/** d3-zoom's wheel curve, as used by React Flow. */
export function reactFlowWheelScale(event: WheelEvent): number {
  const factor = event.ctrlKey && isMacOs() ? 10 : 1;
  const delta = -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * factor;
  return Math.pow(2, delta);
}

/**
 * Widget instances reused across scene builds. A node or edge widget is
 * created once per id and rebuilds itself from its own signal, so a drag or
 * hover touches one subtree instead of the whole scene.
 */
class SceneCache {
  nodes = new Map<string, NodeWidget>();
  edges = new Map<string, EdgeWidget>();
  connectionLine: ConnectionLineWidget | null = null;
  styleVersion = -1;

  sync(controller: FlowController): void {
    if (this.styleVersion === controller.styleVersion && this.connectionLine?.controller === controller) return;
    this.nodes.clear();
    this.edges.clear();
    this.connectionLine = null;
    this.styleVersion = controller.styleVersion;
  }
}

class FlowRoot extends StatefulWidget {
  constructor(readonly props: FlowProps<any>) {
    super(props.key);
  }

  override createState(): State<FlowRoot> {
    return new FlowRootState();
  }
}

class FlowRootState extends State<FlowRoot> {
  controller!: FlowController;
  owned = false;
  version = 0;
  paneKey = new GlobalKey();
  cache = new SceneCache();
  private doc: Document | null = null;
  private win: Window | null = null;
  private view: HTMLElement | SVGElement | null = null;
  private previousUserSelect = "";
  private keyboardAttached = false;

  override initState(context: BuildContext): void {
    super.initState(context);
    const props = this.widget.props;
    this.controller = props.controller ?? new FlowController();
    this.owned = props.controller == null;
    this.controller.configure(props);
    this.controller.attachPane(this.paneKey);
    this.controller.addListener(this.handleChange);
    context.scheduler.addPostFrameCallbacks(() => {
      this.attachHost();
      props.onInit?.(this.controller);
    });
  }

  override didUpdateWidget(oldWidget: FlowRoot): void {
    super.didUpdateWidget(oldWidget);
    const props = this.widget.props;
    const next = props.controller ?? (this.owned ? this.controller : new FlowController());
    if (next !== this.controller) {
      this.controller.removeListener(this.handleChange);
      if (this.owned) this.controller.dispose();
      this.controller = next;
      this.owned = props.controller == null;
      this.controller.addListener(this.handleChange);
      this.controller.attachPane(this.paneKey);
    }
    this.controller.configure(props);
    // Props may have replaced nodes/edges: notify provider dependents (panels) too.
    this.version += 1;
  }

  override dispose(): void {
    this.detachHost();
    this.controller.removeListener(this.handleChange);
    if (this.owned) this.controller.dispose();
    super.dispose();
  }

  private handleChange = () => {
    this.setState(() => {
      this.version += 1;
    });
  };

  private handleKeyDown = (event: KeyboardEvent) => this.controller.handleKeyDown(event);
  private handleKeyUp = (event: KeyboardEvent) => this.controller.handleKeyUp(event);
  private handleBlur = () => this.controller.handleWindowBlur();
  private handlePointerDown = () => this.controller.resetPointerMovement();

  private attachHost(): void {
    if (this.keyboardAttached) return;
    try {
      const context = this.paneKey.currentContext.renderObject.renderOwner.renderContext;
      this.doc = context.document;
      this.win = context.window;
      // Dragging would otherwise select SVG text and labels on the host.
      this.view = context.view;
      this.previousUserSelect = this.view.style.userSelect;
      this.view.style.userSelect = "none";
    } catch {
      if (typeof document === "undefined") return;
      this.doc = document;
      this.win = window;
    }
    if (!this.doc) return;
    this.doc.addEventListener("keydown", this.handleKeyDown);
    this.doc.addEventListener("keyup", this.handleKeyUp);
    this.doc.addEventListener("mousedown", this.handlePointerDown, true);
    this.win?.addEventListener("blur", this.handleBlur);
    this.keyboardAttached = true;
  }

  private detachHost(): void {
    if (!this.keyboardAttached || !this.doc) return;
    this.doc.removeEventListener("keydown", this.handleKeyDown);
    this.doc.removeEventListener("keyup", this.handleKeyUp);
    this.doc.removeEventListener("mousedown", this.handlePointerDown, true);
    this.win?.removeEventListener("blur", this.handleBlur);
    if (this.view) this.view.style.userSelect = this.previousUserSelect;
    this.view = null;
    this.keyboardAttached = false;
  }

  override build(_context: BuildContext): Widget {
    return Provider({
      providerKey: FLOW_PROVIDER_KEY,
      value: this.controller,
      notifyToken: this.version,
      child: new FlowView(this.paneKey, this.cache),
    });
  }
}

class FlowView extends StatelessWidget {
  constructor(
    readonly paneKey: GlobalKey,
    readonly cache: SceneCache,
  ) {
    super();
  }

  override build(context: BuildContext): Widget {
    const ctx = FlowProvider.of(context);
    this.cache.sync(ctx);
    return LayoutBuilder({
      builder: (_builderContext, constraints) => {
        const width = constraints.maxWidth;
        const height = constraints.maxHeight;
        ctx.setPaneSize(width, height);
        const options = ctx.options;
        const children: Widget[] = [];
        const background = ctx.custom.background({ viewport: ctx.viewport, width, height }, ctx as any);
        if (background) children.push(Positioned.fill({ child: background }));
        children.push(
          Positioned.fill({
            child: InteractiveViewer({
              transformationController: ctx.transformation,
              constrained: true,
              boundaryMargin: EdgeInsets.all(Infinity),
              minScale: options.minZoom,
              maxScale: options.maxZoom,
              panEnabled: ctx.panEnabled,
              scaleEnabled: ctx.zoomEnabled,
              panOnScroll: options.panOnScroll && !ctx.zoomActivationHeld,
              panOnScrollSpeed: options.panOnScrollSpeed,
              wheelScale: (event) => {
                const pinchScale = (event as PinchWheelEvent).pinchScale;
                if (pinchScale != null) return options.zoomOnPinch ? pinchScale : 1;
                const pinch = event.ctrlKey || event.metaKey;
                if (pinch ? !options.zoomOnPinch : !options.zoomOnScroll) return 1;
                return reactFlowWheelScale(event);
              },
              clipBehavior: "hardEdge",
              onInteractionStart: () => ctx.handleViewportInteractionStart(),
              onInteractionUpdate: (details) => ctx.handleViewportInteractionUpdate(details),
              onInteractionEnd: () => ctx.handleViewportInteractionEnd(),
              child: buildScene(ctx, this.cache),
            }),
          }),
        );
        const selection = ctx.selectionBox;
        if (selection) {
          children.push(
            Positioned({
              left: selection.x,
              top: selection.y,
              width: selection.width,
              height: selection.height,
              child: ctx.custom.selectionBox({ rect: selection }, ctx as any),
            }),
          );
        }
        const toolbars: Widget[] = [];
        for (const node of ctx.getVisibleNodes()) {
          const toolbar = buildNodeToolbar(ctx, node);
          if (toolbar) toolbars.push(toolbar);
        }
        if (toolbars.length > 0) {
          // An unbounded group: toolbars hang outside their anchor box, which a
          // Positioned wrapper would clip from hit testing.
          children.push(Positioned.fill({ child: new FlowSceneGroup({ children: toolbars }) }));
        }
        for (const panel of ctx.panels) children.push(positionPanel(panel));
        return GestureDetector({
          key: this.paneKey,
          behavior: "opaque",
          cursor: "default",
          onMouseDown: (event) => ctx.handlePanePointerDown(event),
          onMouseEnter: () => ctx.setPointerInside(true),
          onMouseLeave: () => ctx.setPointerInside(false),
          onClick: (event) => ctx.handlePaneClick(event),
          onDragStart: (event) => {
            if (ctx.handleSelectionDragStart(event)) event.stopPropagation();
          },
          onDragMove: (event) => ctx.handleSelectionDragMove(event),
          onDragEnd: (event) => ctx.handleSelectionDragEnd(event),
          child: Stack({ fit: StackFit.expand, children }),
        });
      },
    });
  }
}

function positionPanel(panel: FlowPanel): Widget {
  const [vertical, horizontal] = panel.position.split("-") as ["top" | "bottom", "left" | "center" | "right"];
  const top = vertical === "top" ? PANEL_MARGIN : undefined;
  const bottom = vertical === "bottom" ? PANEL_MARGIN : undefined;
  if (horizontal === "center") {
    return Positioned({ top, bottom, left: 0, right: 0, child: Center({ child: panel.child }) });
  }
  return Positioned({
    top,
    bottom,
    left: horizontal === "left" ? PANEL_MARGIN : undefined,
    right: horizontal === "right" ? PANEL_MARGIN : undefined,
    child: panel.child,
  });
}

/** Screen-space toolbar beside a node, like React Flow's `<NodeToolbar>` (not scaled with the viewport). */
function buildNodeToolbar(ctx: FlowController, node: FlowNode): Widget | null {
  if (!ctx.isNodeToolbarVisible(node)) return null;
  const builder = ctx.getNodeToolbarBuilder(node);
  if (!builder) return null;
  const rect = ctx.getNodeRect(node);
  if (!rect) return null;
  const widget = builder({ node, selected: !!node.selected }, ctx as any);
  if (!widget) return null;
  const options = node.toolbar ?? {};
  const position = options.position ?? "top";
  const align = options.align ?? "center";
  const offset = options.offset ?? 10;
  const zoom = ctx.viewport.zoom;
  const topLeft = ctx.flowToPanePosition({ x: rect.x, y: rect.y });
  const width = rect.width * zoom;
  const height = rect.height * zoom;
  const alongX = align === "start" ? topLeft.x : align === "end" ? topLeft.x + width : topLeft.x + width / 2;
  const alongY = align === "start" ? topLeft.y : align === "end" ? topLeft.y + height : topLeft.y + height / 2;
  const fractionAlong = align === "start" ? 0 : align === "end" ? 1 : 0.5;
  let x: number;
  let y: number;
  let anchor: { x: number; y: number };
  switch (position) {
    case "top":
      x = alongX;
      y = topLeft.y - offset;
      anchor = { x: fractionAlong, y: 1 };
      break;
    case "bottom":
      x = alongX;
      y = topLeft.y + height + offset;
      anchor = { x: fractionAlong, y: 0 };
      break;
    case "left":
      x = topLeft.x - offset;
      y = alongY;
      anchor = { x: 1, y: fractionAlong };
      break;
    case "right":
      x = topLeft.x + width + offset;
      y = alongY;
      anchor = { x: 0, y: fractionAlong };
      break;
  }
  return new FlowSceneItem({
    key: `toolbar:${node.id}`,
    x,
    y,
    anchor,
    child: GestureDetector({
      behavior: "opaque",
      cursor: "default",
      onMouseDown: (event) => event.stopPropagation(),
      onClick: (event) => event.stopPropagation(),
      child: widget,
    }),
  });
}

const RESIZE_CURSORS: Record<ResizeControlPosition, "ns-resize" | "ew-resize" | "nwse-resize" | "nesw-resize"> = {
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize",
  "top-left": "nwse-resize",
  "bottom-right": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
};

/** Where a resize control sits relative to the node body. */
function resizePlacement(position: ResizeControlPosition, variant: "line" | "handle"): NodeAttachmentPlacement {
  if (variant === "line") {
    switch (position) {
      case "top":
        return { constraints: (b) => Constraints.tightFor({ width: b.width }), offset: (_b, a) => ({ x: 0, y: -a.height / 2 }) };
      case "bottom":
        return {
          constraints: (b) => Constraints.tightFor({ width: b.width }),
          offset: (b, a) => ({ x: 0, y: b.height - a.height / 2 }),
        };
      case "left":
        return { constraints: (b) => Constraints.tightFor({ height: b.height }), offset: (_b, a) => ({ x: -a.width / 2, y: 0 }) };
      default:
        return {
          constraints: (b) => Constraints.tightFor({ height: b.height }),
          offset: (b, a) => ({ x: b.width - a.width / 2, y: 0 }),
        };
    }
  }
  return {
    offset: (b, a) => {
      const cx = position.endsWith("left") ? 0 : position.endsWith("right") ? b.width : b.width / 2;
      const cy = position.startsWith("top") ? 0 : position.startsWith("bottom") ? b.height : b.height / 2;
      return { x: cx - a.width / 2, y: cy - a.height / 2 };
    },
  };
}

function resolveMarker(marker: EdgeMarker | MarkerShape | undefined): EdgeMarker | null {
  if (marker == null) return null;
  return typeof marker === "string" ? { type: marker } : marker;
}

function resolveNodeBuilder(ctx: FlowController, type: string | undefined): NodeBuilder<any> {
  const definition = ctx.nodeTypes[type ?? "default"] ?? ctx.nodeTypes.default;
  if (!definition) return ctx.custom.node;
  return typeof definition === "function" ? definition : definition.build;
}

function resolveEdgeBuilder(ctx: FlowController, type: string | undefined): EdgeBuilder<any> {
  const definition = ctx.edgeTypes[type ?? "default"] ?? ctx.edgeTypes.default;
  if (!definition) return ctx.custom.edge;
  return typeof definition === "function" ? definition : definition.build;
}

/** Scene children in paint order; cached widgets are reused when nothing about their identity changed. */
function buildScene(ctx: FlowController, cache: SceneCache): Widget {
  const items: Widget[] = [];
  const liveEdges = new Set<string>();
  for (const edge of ctx.getVisibleEdges()) {
    liveEdges.add(edge.id);
    let widget = cache.edges.get(edge.id);
    if (!widget) {
      widget = new EdgeWidget(ctx, edge.id);
      cache.edges.set(edge.id, widget);
    }
    items.push(widget);
  }
  for (const id of cache.edges.keys()) if (!liveEdges.has(id)) cache.edges.delete(id);

  const selectedNodes = ctx.getSelectedNodes();
  if (selectedNodes.length > 1) {
    const rect = ctx.getNodesBounds(selectedNodes);
    if (rect.width > 0 || rect.height > 0) {
      const widget = ctx.custom.nodesSelectionRect({ rect, nodes: selectedNodes }, ctx as any);
      if (widget) {
        items.push(
          new FlowSceneItem({
            key: "nodes-selection",
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            interactive: false,
            child: widget,
          }),
        );
      }
    }
  }

  const liveNodes = new Set<string>();
  for (const node of ctx.getVisibleNodes()) {
    liveNodes.add(node.id);
    let widget = cache.nodes.get(node.id);
    if (!widget) {
      widget = new NodeWidget(ctx, node.id);
      cache.nodes.set(node.id, widget);
    }
    items.push(widget);
  }
  for (const id of cache.nodes.keys()) if (!liveNodes.has(id)) cache.nodes.delete(id);

  items.push((cache.connectionLine ??= new ConnectionLineWidget(ctx)));

  return new FlowScene({
    children: items,
    onMeasure: (entries) => ctx.setNodeDimensions(entries),
  });
}

/** Subscribes a State to controller signals and rebuilds on change. */
abstract class SignalState<T extends StatefulWidget> extends State<T> {
  private subscriptions: ChangeNotifier[] = [];
  private rebuild = () => this.setState();

  protected subscribe(signals: ChangeNotifier[]): void {
    const same =
      signals.length === this.subscriptions.length && signals.every((signal, i) => signal === this.subscriptions[i]);
    if (same) return;
    for (const signal of this.subscriptions) signal.removeListener(this.rebuild);
    this.subscriptions = signals;
    for (const signal of signals) signal.addListener(this.rebuild);
  }

  override dispose(): void {
    for (const signal of this.subscriptions) signal.removeListener(this.rebuild);
    this.subscriptions = [];
    super.dispose();
  }
}

// ---------------------------------------------------------------------------
// Node
// ---------------------------------------------------------------------------

class NodeWidget extends StatefulWidget {
  constructor(
    readonly controller: FlowController,
    readonly id: string,
  ) {
    super(`node:${id}`);
  }

  override createState(): State<NodeWidget> {
    return new NodeWidgetState();
  }
}

class NodeWidgetState extends SignalState<NodeWidget> {
  override initState(context: BuildContext): void {
    super.initState(context);
    const { controller, id } = this.widget;
    this.subscribe([controller.nodeSignal(id)]);
  }

  override build(_context: BuildContext): Widget {
    const ctx = this.widget.controller;
    const node = ctx.getNode(this.widget.id);
    if (!node || node.hidden) return SizedBox.shrink();
    const connection = ctx.connection;
    const positionAbsolute = ctx.getNodePositionAbsolute(node);
    const selected = !!node.selected;
    const dragging = !!node.dragging;
    const hovered = ctx.hoveredNodeId === node.id;
    const draggable = ctx.isNodeDraggable(node);
    const selectable = ctx.isNodeSelectable(node);
    const connectable = ctx.isNodeConnectable(node);
    const content = resolveNodeBuilder(ctx, node.type)(
      {
        node,
        selected,
        dragging,
        hovered,
        draggable,
        selectable,
        connectable,
        positionAbsolute,
        zIndex: ctx.getNodeZIndex(node),
        isConnectionTarget: connection?.toNode?.id === node.id,
        resizable: ctx.isNodeResizable(node),
        resizing: !!node.resizing,
      },
      ctx as any,
    );
    const body = GestureDetector({
      behavior: "opaque",
      cursor: dragging ? "grabbing" : draggable ? "grab" : selectable ? "pointer" : "default",
      onDragStart: (event) => {
        ctx.handleNodeDragStart(node.id, event);
        event.stopPropagation();
      },
      onDragMove: (event) => ctx.handleNodeDragMove(node.id, event),
      onDragEnd: (event) => ctx.handleNodeDragEnd(node.id, event),
      onClick: (event) => {
        ctx.handleNodeClick(node.id, event);
        event.stopPropagation();
      },
      onMouseEnter: (event) => ctx.hoverNode(node.id, event),
      onMouseLeave: (event) => ctx.unhoverNode(node.id, event),
      child: RepaintBoundary({ child: content }),
    });

    // Handles are placed from the body's laid-out size (see FlowNodeItem), but
    // the builder args use the best known rect so styles can read geometry.
    const knownRect: Rect = ctx.getNodeRect(node) ?? {
      ...positionAbsolute,
      width: node.width ?? 0,
      height: node.height ?? 0,
    };
    const specs = ctx.getHandleSpecs(node);
    const attachments: Widget[] = [];
    const placements: NodeAttachmentPlacement[] = [];
    const from = connection?.fromHandle;
    const to = connection?.toHandle;
    for (const spec of specs) {
      const handle = ctx.resolveHandle(node, knownRect, spec);
      const handleConnectable = connectable && handle.connectable !== false;
      const isConnecting =
        !!from && from.nodeId === node.id && from.id === handle.id && from.type === handle.type;
      const isCandidate = !!to && to.nodeId === node.id && to.id === handle.id && to.type === handle.type;
      const widget = ctx.custom.handle(
        {
          node,
          handle,
          connectable: handleConnectable,
          isConnecting,
          isConnectionCandidate: isCandidate,
          isValidCandidate: isCandidate ? connection!.isValid : null,
          connectionInProgress: !!connection,
        },
        ctx as any,
      );
      attachments.push(
        GestureDetector({
          behavior: "opaque",
          cursor: handleConnectable ? "crosshair" : "default",
          onDragStart: (event) => {
            ctx.handleConnectionStart(node.id, handle.id, handle.type, event);
            event.stopPropagation();
          },
          onDragMove: (event) => ctx.handleConnectionMove(event),
          onDragEnd: (event) => ctx.handleConnectionEnd(event),
          onClick: (event) => {
            ctx.handleHandleClick(node.id, handle.id, handle.type, event);
            event.stopPropagation();
          },
          child: widget,
        }),
      );
      placements.push({
        offset: (bodySize, attachmentSize) => {
          const center = handleCenter(spec, { x: 0, y: 0, width: bodySize.width, height: bodySize.height });
          return { x: center.x - attachmentSize.width / 2, y: center.y - attachmentSize.height / 2 };
        },
      });
    }

    if (ctx.isNodeResizable(node) && selected) {
      const options = ctx.getNodeResizeOptions(node);
      const lines = options.lines ?? ["top", "right", "bottom", "left"];
      const corners: ResizeControlPosition[] = options.handles ?? ["top-left", "top-right", "bottom-left", "bottom-right"];
      const controls: { position: ResizeControlPosition; variant: "line" | "handle" }[] = [
        ...lines.map((position) => ({ position, variant: "line" as const })),
        ...corners.map((position) => ({ position, variant: "handle" as const })),
      ];
      for (const control of controls) {
        const widget = ctx.custom.resizeControl(
          { node, position: control.position, variant: control.variant, resizing: !!node.resizing },
          ctx as any,
        );
        attachments.push(
          GestureDetector({
            behavior: "opaque",
            cursor: RESIZE_CURSORS[control.position],
            onDragStart: (event) => {
              ctx.handleResizeStart(node.id, control.position, event);
              event.stopPropagation();
            },
            onDragMove: (event) => ctx.handleResizeMove(event),
            onDragEnd: (event) => ctx.handleResizeEnd(event),
            onClick: (event) => event.stopPropagation(),
            child: widget,
          }),
        );
        placements.push(resizePlacement(control.position, control.variant));
      }
    }

    return new FlowNodeItem({
      body,
      attachments,
      placements,
      x: positionAbsolute.x,
      y: positionAbsolute.y,
      width: node.width,
      height: node.height,
      measureId: node.id,
    });
  }
}

// ---------------------------------------------------------------------------
// Edge
// ---------------------------------------------------------------------------

function edgeGestures(ctx: FlowController, edge: FlowEdge, child: Widget): Widget {
  const selectable = ctx.elementsSelectable && edge.selectable !== false;
  return GestureDetector({
    behavior: "opaque",
    cursor: selectable ? "pointer" : "default",
    onMouseDown: (event) => {
      ctx.handleEdgePointerDown(edge.id, event);
      event.stopPropagation();
    },
    onClick: (event) => {
      ctx.handleEdgeClick(edge.id, event);
      event.stopPropagation();
    },
    onMouseEnter: (event) => ctx.hoverEdge(edge.id, event),
    onMouseLeave: (event) => ctx.unhoverEdge(edge.id, event),
    child,
  });
}

class EdgeWidget extends StatefulWidget {
  constructor(
    readonly controller: FlowController,
    readonly id: string,
  ) {
    super(`edge:${id}`);
  }

  override createState(): State<EdgeWidget> {
    return new EdgeWidgetState();
  }
}

class EdgeWidgetState extends SignalState<EdgeWidget> {
  override build(_context: BuildContext): Widget {
    const ctx = this.widget.controller;
    const edge = ctx.getEdge(this.widget.id);
    if (!edge) {
      this.subscribe([ctx.edgeSignal(this.widget.id)]);
      return SizedBox.shrink();
    }
    // Follow the edge itself and both endpoints (positions, sizes, handles).
    this.subscribe([ctx.edgeSignal(edge.id), ctx.nodeSignal(edge.source), ctx.nodeSignal(edge.target)]);
    if (edge.hidden) return SizedBox.shrink();
    const endpoints = ctx.getEdgeEndpoints(edge);
    if (!endpoints) return SizedBox.shrink();
    const sourceNode = ctx.getNode(edge.source);
    const targetNode = ctx.getNode(edge.target);
    if (!sourceNode || !targetNode) return SizedBox.shrink();

    const interactionWidth = ctx.options.edgeInteractionWidth;
    const path = ctx.getEdgePath(edge, endpoints);
    const bounds = inflateRect(
      pointsBounds([...path.points, { x: path.labelX, y: path.labelY }]),
      interactionWidth / 2 + EDGE_MARGIN,
    );
    const local = translateEdgePath(path, -bounds.x, -bounds.y);
    const selected = !!edge.selected;
    const hovered = ctx.hoveredEdgeId === edge.id;
    const reconnecting = ctx.connection?.reconnectingEdge?.id === edge.id;
    const content = resolveEdgeBuilder(ctx, edge.type)(
      {
        edge,
        path: local,
        origin: { x: bounds.x, y: bounds.y },
        size: { width: bounds.width, height: bounds.height },
        endpoints,
        selected,
        hovered,
        animated: !!edge.animated,
        sourceNode,
        targetNode,
        markerStart: resolveMarker(edge.markerStart),
        markerEnd: resolveMarker(edge.markerEnd),
        interactionWidth,
        reconnecting,
      },
      ctx as any,
    );
    const localPoints = local.points;
    const children: Widget[] = [
      new FlowSceneItem({
        key: "path",
        x: bounds.x,
        y: bounds.y,
        hitTest: (position) => distanceToPolyline(position, localPoints) <= interactionWidth / 2,
        child: edgeGestures(ctx, edge, SizedBox({ width: bounds.width, height: bounds.height, child: content })),
      }),
    ];
    if (edge.label != null && edge.label !== "") {
      const label = ctx.custom.edgeLabel(
        { edge, label: edge.label, selected, hovered, x: path.labelX, y: path.labelY },
        ctx as any,
      );
      if (label) {
        children.push(
          new FlowSceneItem({
            key: "label",
            x: path.labelX,
            y: path.labelY,
            anchor: "center",
            child: edgeGestures(ctx, edge, label),
          }),
        );
      }
    }
    // Invisible grab areas at the endpoints start a reconnection drag. They sit
    // above the path but below node handles (nodes paint after edges).
    const size = ctx.options.reconnectRadius * 2;
    for (const end of ctx.getReconnectableEnds(edge)) {
      const point: HandleType = end;
      const x = point === "source" ? endpoints.sourceX : endpoints.targetX;
      const y = point === "source" ? endpoints.sourceY : endpoints.targetY;
      children.push(
        new FlowSceneItem({
          key: `reconnect:${end}`,
          x,
          y,
          anchor: "center",
          child: GestureDetector({
            behavior: "opaque",
            cursor: "move",
            onDragStart: (event) => {
              if (ctx.handleReconnectStart(edge.id, end, event)) event.stopPropagation();
            },
            onDragMove: (event) => ctx.handleConnectionMove(event),
            onDragEnd: (event) => ctx.handleConnectionEnd(event),
            onClick: (event) => {
              ctx.handleEdgeClick(edge.id, event);
              event.stopPropagation();
            },
            child: ctx.custom.reconnectHandle({ edge, end, size }, ctx as any),
          }),
        }),
      );
    }
    return new FlowSceneGroup({ children });
  }
}

// ---------------------------------------------------------------------------
// Connection line
// ---------------------------------------------------------------------------

class ConnectionLineWidget extends StatefulWidget {
  constructor(readonly controller: FlowController) {
    super("connection-line");
  }

  override createState(): State<ConnectionLineWidget> {
    return new ConnectionLineWidgetState();
  }
}

class ConnectionLineWidgetState extends SignalState<ConnectionLineWidget> {
  override initState(context: BuildContext): void {
    super.initState(context);
    this.subscribe([this.widget.controller.connectionSignal]);
  }

  override build(_context: BuildContext): Widget {
    const ctx = this.widget.controller;
    const connection = ctx.connection;
    if (!connection || (connection.mode !== "drag" && !connection.toHandle)) return SizedBox.shrink();
    const path = ctx.getConnectionLinePath(connection);
    const bounds = inflateRect(pointsBounds(path.points), EDGE_MARGIN);
    const local = translateEdgePath(path, -bounds.x, -bounds.y);
    const widget = ctx.custom.connectionLine(
      {
        connection,
        path: local,
        from: { x: connection.from.x - bounds.x, y: connection.from.y - bounds.y },
        to: { x: connection.to.x - bounds.x, y: connection.to.y - bounds.y },
        fromPosition: connection.fromPosition,
        toPosition: connection.toPosition,
        isValid: connection.isValid,
        origin: { x: bounds.x, y: bounds.y },
        size: { width: bounds.width, height: bounds.height },
      },
      ctx as any,
    );
    return new FlowSceneItem({
      x: bounds.x,
      y: bounds.y,
      interactive: false,
      child: SizedBox({ width: bounds.width, height: bounds.height, child: widget }),
    });
  }
}

/** Headless diagram widget: bring a `custom` style and get React Flow's behaviour. */
export function Flow<TConfig extends object = object>(props: FlowProps<TConfig>): Widget {
  return new FlowRoot(props);
}
