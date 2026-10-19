import {
  type BuildContext,
  type ChangeNotifier,
  Constraints,
  EdgeInsets,
  GestureDetector,
  GlobalKey,
  InteractiveViewer,
  LayoutBuilder,
  type PinchWheelEvent,
  Positioned,
  RepaintBoundary,
  SizedBox,
  State,
  StatefulWidget,
  StatelessWidget,
  type Widget,
} from "flitter-core";
import { type FlowDiagramController, getSceneOrder } from "./controller";
import { FlowDiagramProvider } from "./provider";
import {
  FlowHandleAnchor,
  FlowSceneGroup,
  FlowSceneItem,
  type NodeAttachmentPlacement,
} from "./scene";
import type {
  EdgeMarker,
  FlowEdge,
  FlowNode,
  FlowDiagramProps,
  HandleType,
  ControlKind,
  ContextMenuCustomArgs,
  ResizeControlPosition,
} from "./types";
import type { MarkerShape } from "../../shared/edges";
import {
  distanceToPolyline,
  pointsBounds,
  translateEdgePath,
} from "../../shared/edges";
import {
  type Rect,
  handleCenter,
  inflateRect,
  getBoundsOfRects,
} from "../../shared/geometry";
import { isMacOs } from "../../shared/utils";

/** Extra room around an edge's sampled polyline for markers and stroke width. */
const EDGE_MARGIN = 24;

/** d3-zoom's wheel curve, as used by React Flow. */
export function reactFlowWheelScale(event: WheelEvent): number {
  const factor = event.ctrlKey && isMacOs() ? 10 : 1;
  const delta =
    -event.deltaY *
    (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) *
    factor;
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
  toolbars = new Map<string, Widget>();
  connectionLine: ConnectionLineWidget | null = null;
  guides: GuidesWidget | null = null;
  styleVersion = -1;

  sync(controller: FlowDiagramController): void {
    if (
      this.styleVersion === controller.styleVersion &&
      this.connectionLine?.controller === controller
    )
      return;
    this.nodes.clear();
    this.edges.clear();
    this.toolbars.clear();
    this.connectionLine = null;
    this.guides = null;
    this.styleVersion = controller.styleVersion;
  }
}

export class FlowRoot extends StatefulWidget {
  constructor(readonly props: FlowDiagramProps<any>) {
    super(props.key);
  }

  override createState(): State<FlowRoot> {
    return new FlowRootState();
  }
}

class FlowRootState extends State<FlowRoot> {
  controller!: FlowDiagramController;
  owned = false;
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
    this.controller = FlowDiagramProvider.of(context);
    this.owned = props.controller == null;
    this.controller.attachPane(this.paneKey);
    context.scheduler.addPostFrameCallbacks(() => {
      this.attachHost();
      props.on?.init?.(this.controller);
    });
  }

  override dispose(): void {
    this.detachHost();
    if (this.owned) this.controller.dispose();
    super.dispose();
  }

  private handleKeyDown = (event: KeyboardEvent) =>
    this.controller.handleKeyDown(event);
  private handleKeyUp = (event: KeyboardEvent) =>
    this.controller.handleKeyUp(event);
  private handleBlur = () => this.controller.handleWindowBlur();
  private handlePointerDown = () => this.controller.resetPointerMovement();

  private attachHost(): void {
    if (this.keyboardAttached) return;
    try {
      const context =
        this.paneKey.currentContext.renderObject.renderOwner.renderContext;
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
    this.controller = FlowDiagramProvider.of(_context);
    return new FlowView(this.paneKey, this.cache);
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
    const ctx = FlowDiagramProvider.of(context);
    this.cache.sync(ctx);
    return LayoutBuilder({
      builder: (_builderContext, constraints) => {
        const width = constraints.maxWidth;
        const height = constraints.maxHeight;
        const options = ctx.options;
        const toolbars: Widget[] = [];
        this.cache.toolbars.clear();
        for (const node of ctx.getVisibleNodes()) {
          const toolbar = buildNodeToolbar(ctx, node);
          if (toolbar) {
            toolbars.push(toolbar);
            this.cache.toolbars.set(node.id, toolbar);
          }
        }

        const background = Positioned.fill({
          child: ctx.custom.background(
            { viewport: ctx.viewport, width, height },
            ctx as any,
          ),
        });
        const viewport = Positioned.fill({
          child: LayoutBuilder({
            builder: (_context, pane) => {
              ctx.setPaneSize(pane.maxWidth, pane.maxHeight);
              return GestureDetector({
                key: this.paneKey,
                behavior: "opaque",
                cursor: "default",
                onMouseDown: (event) => ctx.handlePanePointerDown(event),
                onMouseMove: (event) => ctx.handlePanePointerMove(event),
                onWheel: (event) => ctx.handlePaneWheel(event),
                longPressDelay: ctx.interaction.contextMenu.longPress,
                onContextMenu: (event) => {
                  if (ctx.handleContextMenu({ kind: "pane" }, event))
                    event.stopPropagation();
                },
                onMouseEnter: () => ctx.setPointerInside(true),
                onMouseLeave: () => ctx.setPointerInside(false),
                onClick: (event) => ctx.handlePaneClick(event),
                onDragStart: (event) => {
                  if (ctx.handleSelectionDragStart(event))
                    event.stopPropagation();
                },
                onDragMove: (event) => ctx.handleSelectionDragMove(event),
                onDragEnd: (event) => ctx.handleSelectionDragEnd(event),
                child: InteractiveViewer({
                  transformationController: ctx.transformation,
                  constrained: true,
                  boundaryMargin: EdgeInsets.all(Infinity),
                  minScale: options.minZoom,
                  maxScale: options.maxZoom,
                  panEnabled: ctx.panEnabled,
                  scaleEnabled: ctx.zoomEnabled,
                  panOnScroll:
                    options.panOnScroll &&
                    !ctx.zoomActivationHeld &&
                    ctx.can("pan", { kind: "pane" }),
                  panOnScrollSpeed: options.panOnScrollSpeed,
                  wheelScale: (event) => {
                    const pinchScale = (event as PinchWheelEvent).pinchScale;
                    if (pinchScale != null)
                      return options.zoomOnPinch ? pinchScale : 1;
                    const pinch = event.ctrlKey || event.metaKey;
                    if (pinch ? !options.zoomOnPinch : !options.zoomOnScroll)
                      return 1;
                    return reactFlowWheelScale(event);
                  },
                  clipBehavior: "hardEdge",
                  onInteractionStart: () =>
                    ctx.handleViewportInteractionStart(),
                  onInteractionUpdate: (details) =>
                    ctx.handleViewportInteractionUpdate(details),
                  onInteractionEnd: () => ctx.handleViewportInteractionEnd(),
                  child: GestureDetector({
                    // Stop disabled touch input before it reaches the viewport detector.
                    onMouseDown: (event) => {
                      if (!ctx.acceptsPointer(event)) event.stopPropagation();
                    },
                    child: buildScene(ctx, this.cache),
                  }),
                }),
              });
            },
          }),
        });
        const selection = ctx.selectionBox;
        const selectionBox = selection
          ? Positioned({
              left: selection.x,
              top: selection.y,
              width: selection.width,
              height: selection.height,
              child: ctx.custom.selectionBox({ rect: selection }, ctx as any),
            })
          : SizedBox.shrink();
        const menu = ctx.contextMenu;
        let contextMenu: Widget = SizedBox.shrink();
        if (menu) {
          const content = buildContextMenu(ctx, menu);
          const point = ctx.flowToPanePosition(menu.position);
          contextMenu = Positioned.fill({
            child: new FlowSceneGroup({
              children: [
                new FlowSceneItem({
                  key: "context-menu",
                  x: point.x,
                  y: point.y,
                  child: GestureDetector({
                    behavior: "opaque",
                    onMouseDown: (event) => event.stopPropagation(),
                    onClick: (event) => event.stopPropagation(),
                    onContextMenu: (event) => event.stopPropagation(),
                    child: content,
                  }),
                }),
              ],
            }),
          });
        }
        return ctx.custom.layout(
          {
            background,
            viewport,
            selectionBox,
            toolbars: Positioned.fill({
              child: new FlowSceneGroup({ children: toolbars }),
            }),
            controls: buildControls(ctx),
            minimap: buildMinimap(ctx),
            contextMenu,
          },
          ctx as any,
        );
      },
    });
  }
}

/** Screen-space toolbar beside a node, like React Flow's `<NodeToolbar>` (not scaled with the viewport). */
function buildNodeToolbar(
  ctx: FlowDiagramController,
  node: FlowNode,
): Widget | null {
  if (!ctx.isNodeToolbarVisible(node)) return null;
  const builder = ctx.custom.nodeToolbar;
  if (!builder) return null;
  const rect = ctx.getNodeRect(node);
  if (!rect) return null;
  const widget = builder({ node, isSelected: !!node.selected }, ctx as any);
  if (!widget) return null;
  const options = node.toolbar ?? {};
  const position = options.position ?? "top";
  const align = options.align ?? "center";
  const offset = options.offset ?? 10;
  const zoom = ctx.viewport.zoom;
  const topLeft = ctx.flowToPanePosition({ x: rect.x, y: rect.y });
  const width = rect.width * zoom;
  const height = rect.height * zoom;
  const alongX =
    align === "start"
      ? topLeft.x
      : align === "end"
        ? topLeft.x + width
        : topLeft.x + width / 2;
  const alongY =
    align === "start"
      ? topLeft.y
      : align === "end"
        ? topLeft.y + height
        : topLeft.y + height / 2;
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

const RESIZE_CURSORS: Record<
  ResizeControlPosition,
  "ns-resize" | "ew-resize" | "nwse-resize" | "nesw-resize"
> = {
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
function resizePlacement(
  position: ResizeControlPosition,
  variant: "line" | "handle",
): NodeAttachmentPlacement {
  if (variant === "line") {
    switch (position) {
      case "top":
        return {
          constraints: (b) => Constraints.tightFor({ width: b.width }),
          offset: (_b, a) => ({ x: 0, y: -a.height / 2 }),
        };
      case "bottom":
        return {
          constraints: (b) => Constraints.tightFor({ width: b.width }),
          offset: (b, a) => ({ x: 0, y: b.height - a.height / 2 }),
        };
      case "left":
        return {
          constraints: (b) => Constraints.tightFor({ height: b.height }),
          offset: (_b, a) => ({ x: -a.width / 2, y: 0 }),
        };
      default:
        return {
          constraints: (b) => Constraints.tightFor({ height: b.height }),
          offset: (b, a) => ({ x: b.width - a.width / 2, y: 0 }),
        };
    }
  }
  return {
    offset: (b, a) => {
      const cx = position.endsWith("left")
        ? 0
        : position.endsWith("right")
          ? b.width
          : b.width / 2;
      const cy = position.startsWith("top")
        ? 0
        : position.startsWith("bottom")
          ? b.height
          : b.height / 2;
      return { x: cx - a.width / 2, y: cy - a.height / 2 };
    },
  };
}

function resolveMarker(
  marker: EdgeMarker | MarkerShape | undefined,
): EdgeMarker | null {
  if (marker == null) return null;
  return typeof marker === "string" ? { type: marker } : marker;
}

/** Scene children in paint order; cached widgets are reused when nothing about their identity changed. */
function buildScene(ctx: FlowDiagramController, cache: SceneCache): Widget {
  const items: Widget[] = [];
  const liveEdges = new Set<string>(),
    liveNodes = new Set<string>();
  for (const entry of getSceneOrder(ctx)) {
    if (entry.kind === "edge") {
      const id = entry.edge.id;
      liveEdges.add(id);
      let widget = cache.edges.get(id);
      if (!widget) {
        widget = new EdgeWidget(ctx, id);
        cache.edges.set(id, widget);
      }
      items.push(widget);
    } else {
      const id = entry.node.id;
      liveNodes.add(id);
      let widget = cache.nodes.get(id);
      if (!widget) {
        widget = new NodeWidget(ctx, id, cache);
        cache.nodes.set(id, widget);
      }
      items.push(widget);
    }
  }
  for (const id of cache.edges.keys())
    if (!liveEdges.has(id)) cache.edges.delete(id);
  for (const id of cache.nodes.keys())
    if (!liveNodes.has(id)) cache.nodes.delete(id);

  const guides = (cache.guides ??= new GuidesWidget(ctx));
  let nodesSelectionRect: Widget = SizedBox.shrink();
  const selectedNodes = ctx.getSelectedNodes();
  if (selectedNodes.length > 1) {
    const rect = ctx.getNodesBounds(selectedNodes);
    if (rect.width > 0 || rect.height > 0) {
      const widget = ctx.custom.nodesSelectionRect(
        { rect, nodes: selectedNodes },
        ctx as any,
      );
      if (widget) {
        nodesSelectionRect = new FlowSceneItem({
          key: "nodes-selection",
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          interactive: ctx.interaction.select.box,
          child: GestureDetector({
            longPressDelay: ctx.interaction.contextMenu.longPress,
            onContextMenu: (event) => {
              ctx.handleContextMenu({ kind: "selection" }, event);
              event.stopPropagation();
            },
            onDragStart: (event) => {
              if (ctx.interaction.select.box) {
                ctx.handleNodeDragStart(selectedNodes[0].id, event);
                event.stopPropagation();
              }
            },
            onDragMove: (event) =>
              ctx.handleNodeDragMove(selectedNodes[0].id, event),
            onDragEnd: (event) =>
              ctx.handleNodeDragEnd(selectedNodes[0].id, event),
            child: widget,
          }),
        });
      }
    }
  }

  const connectionLine = (cache.connectionLine ??= new ConnectionLineWidget(
    ctx,
  ));
  return ctx.custom.viewport(
    {
      items,
      edges: items.filter((item) => item instanceof EdgeWidget),
      nodes: items.filter((item) => item instanceof NodeWidget),
      connectionLine,
      nodesSelectionRect,
      guides,
    },
    ctx as any,
  );
}

/** Subscribes a State to controller signals and rebuilds on change. */
abstract class SignalState<T extends StatefulWidget> extends State<T> {
  private subscriptions: ChangeNotifier[] = [];
  private rebuild = () => this.setState();

  protected subscribe(signals: ChangeNotifier[]): void {
    const same =
      signals.length === this.subscriptions.length &&
      signals.every((signal, i) => signal === this.subscriptions[i]);
    if (same) return;
    for (const signal of this.subscriptions)
      signal.removeListener(this.rebuild);
    this.subscriptions = signals;
    for (const signal of signals) signal.addListener(this.rebuild);
  }

  override dispose(): void {
    for (const signal of this.subscriptions)
      signal.removeListener(this.rebuild);
    this.subscriptions = [];
    super.dispose();
  }
}

// ---------------------------------------------------------------------------
// Node
// ---------------------------------------------------------------------------

class NodeWidget extends StatefulWidget {
  constructor(
    readonly controller: FlowDiagramController,
    readonly id: string,
    readonly cache: SceneCache,
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
    if (!node || ctx.isNodeHidden(node)) return SizedBox.shrink();
    const connection = ctx.connection;
    const positionAbsolute = ctx.getNodePositionAbsolute(node);
    const selected = !!node.selected;
    const dragging = !!node.dragging;
    const hovered = ctx.hoveredNodeId === node.id;
    const draggable = ctx.isNodeDraggable(node);
    const selectable = ctx.isNodeSelectable(node);
    const connectable = ctx.isNodeConnectable(node);
    const args = {
      node,
      isSelected: selected,
      isDragging: dragging,
      isHovered: hovered,
      isDraggable: draggable,
      isSelectable: selectable,
      isConnectable: connectable,
      positionAbsolute,
      zIndex: ctx.getNodeZIndex(node),
      isConnectionTarget: connection?.toNode?.id === node.id,
      isResizable: ctx.isNodeResizable(node),
      isResizing: !!node.resizing,
      isEditing: ctx.editingId === node.id,
      isDropTarget: ctx.dropTargetId === node.id,
      isCollapsed: !!node.collapsed,
      hiddenChildCount: ctx.hiddenChildCount(node.id),
      isOverlapping: dragging && ctx.getIntersectingNodes(node).length > 0,
      isNeighbour: ctx.isNodeNeighbour(node.id),
    };
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
    const inlineHandles: {
      id: string | null;
      type: HandleType;
      handle: Widget;
    }[] = [];
    const from = connection?.fromHandle;
    const to = connection?.toHandle;
    for (const spec of specs) {
      const handle = ctx.resolveHandle(node, knownRect, spec);
      const handleConnectable = ctx.can(
        "connect",
        { kind: "node", id: node.id },
        connectable && handle.connectable !== false,
      );
      const isConnecting =
        !!from &&
        from.nodeId === node.id &&
        from.id === handle.id &&
        from.type === handle.type;
      const isCandidate =
        !!to &&
        to.nodeId === node.id &&
        to.id === handle.id &&
        to.type === handle.type;
      const widget = ctx.custom.handle(
        {
          node,
          handle,
          isConnectable: handleConnectable,
          isConnecting,
          isConnectionCandidate: isCandidate,
          isValidCandidate: isCandidate ? connection!.isValid : null,
          isConnectionInProgress: !!connection,
        },
        ctx as any,
      );
      const handleWidget = GestureDetector({
        behavior: "opaque",
        cursor: handleConnectable ? "crosshair" : "default",
        onMouseEnter: (event) => ctx.hoverNode(node.id, event),
        onMouseLeave: (event) => ctx.unhoverNode(node.id, event),
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
      });
      if (spec.placement === "inline") {
        inlineHandles.push({
          id: handle.id,
          type: handle.type,
          handle: FlowHandleAnchor({ id: handle.id, type: handle.type, child: handleWidget }),
        });
        continue;
      }
      attachments.push(handleWidget);
      placements.push({
        offset: (bodySize, attachmentSize) => {
          const center = handleCenter(spec, {
            x: 0,
            y: 0,
            width: bodySize.width,
            height: bodySize.height,
          });
          return {
            x: center.x - attachmentSize.width / 2,
            y: center.y - attachmentSize.height / 2,
          };
        },
      });
    }

    const boundaryHandleCount = attachments.length;
    if (ctx.isNodeResizable(node) && selected) {
      const options = ctx.getNodeResizeOptions(node);
      const lines = options.lines ?? ["top", "right", "bottom", "left"];
      const corners: ResizeControlPosition[] = options.handles ?? [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ];
      const controls: {
        position: ResizeControlPosition;
        variant: "line" | "handle";
      }[] = [
        ...lines.map((position) => ({ position, variant: "line" as const })),
        ...corners.map((position) => ({
          position,
          variant: "handle" as const,
        })),
      ];
      for (const control of controls) {
        const widget = ctx.custom.resizeControl(
          {
            node,
            position: control.position,
            variant: control.variant,
            isResizing: !!node.resizing,
          },
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

    const content = ctx.custom.node(
      {
        ...args,
        label: ctx.custom.nodeLabel(args, ctx as any),
        handles: inlineHandles,
      },
      ctx as any,
    );
    const body = GestureDetector({
      behavior: "opaque",
      cursor: dragging
        ? "grabbing"
        : draggable
          ? "grab"
          : selectable
            ? "pointer"
            : "default",
      onDragStart: (event) => {
        ctx.handleNodeDragStart(node.id, event);
        // A locked node lets the press fall through so the pane pans or box-selects under it.
        if (draggable) event.stopPropagation();
      },
      onDragMove: (event) => ctx.handleNodeDragMove(node.id, event),
      onDragEnd: (event) => ctx.handleNodeDragEnd(node.id, event),
      onClick: (event) => {
        ctx.handleNodeClick(node.id, event);
        event.stopPropagation();
      },
      longPressDelay: ctx.interaction.contextMenu.longPress,
      onContextMenu: (event) => {
        ctx.handleContextMenu({ kind: "node", id: node.id }, event);
        event.stopPropagation();
      },
      onMouseEnter: (event) => ctx.hoverNode(node.id, event),
      onMouseLeave: (event) => ctx.unhoverNode(node.id, event),
      child: RepaintBoundary({ child: content }),
    });

    return ctx.custom.nodeBox(
      {
        node: body,
        handles: attachments.slice(0, boundaryHandleCount),
        resizeControls: attachments.slice(boundaryHandleCount),
        toolbar: this.widget.cache.toolbars.get(node.id) ?? SizedBox.shrink(),
        args,
        placements,
      },
      ctx as any,
    );
  }
}

// ---------------------------------------------------------------------------
// Edge
// ---------------------------------------------------------------------------

function edgeGestures(
  ctx: FlowDiagramController,
  edge: FlowEdge,
  child: Widget,
): Widget {
  const selectable = ctx.isEdgeSelectable(edge);
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
    longPressDelay: ctx.interaction.contextMenu.longPress,
    onContextMenu: (event) => {
      ctx.handleContextMenu({ kind: "edge", id: edge.id }, event);
      event.stopPropagation();
    },
    onMouseEnter: (event) => ctx.hoverEdge(edge.id, event),
    onMouseLeave: (event) => ctx.unhoverEdge(edge.id, event),
    child,
  });
}

class EdgeWidget extends StatefulWidget {
  constructor(
    readonly controller: FlowDiagramController,
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
    this.subscribe([
      ctx.edgeSignal(edge.id),
      ctx.nodeSignal(edge.source),
      ctx.nodeSignal(edge.target),
    ]);
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
    const args = {
      edge,
      path: local,
      origin: { x: bounds.x, y: bounds.y },
      size: { width: bounds.width, height: bounds.height },
      endpoints,
      isSelected: selected,
      isHovered: hovered,
      isAnimated: !!edge.animated,
      sourceNode,
      targetNode,
      markerStart: resolveMarker(edge.markerStart),
      markerEnd: resolveMarker(edge.markerEnd),
      interactionWidth,
      isReconnecting: reconnecting,
      waypoints: edge.waypoints ?? [],
      activeHandle:
        ctx.activeEdgeHandle?.edgeId === edge.id ? ctx.activeEdgeHandle : null,
      isNeighbour: ctx.isEdgeNeighbour(edge),
    };
    const content = ctx.custom.edge(args, ctx as any);
    const localPoints = local.points;
    const children: Widget[] = [
      new FlowSceneItem({
        key: "path",
        x: bounds.x,
        y: bounds.y,
        hitTest: (position) =>
          distanceToPolyline(position, localPoints) <= interactionWidth / 2,
        child: edgeGestures(
          ctx,
          edge,
          SizedBox({
            width: bounds.width,
            height: bounds.height,
            child: content,
          }),
        ),
      }),
    ];
    let labelWidget: Widget = SizedBox.shrink();
    if (edge.label != null && edge.label !== "") {
      const label = ctx.custom.edgeLabel(
        {
          edge,
          label: edge.label,
          isSelected: selected,
          isHovered: hovered,
          x: path.labelX,
          y: path.labelY,
        },
        ctx as any,
      );
      if (label) {
        labelWidget = new FlowSceneItem({
          key: "label",
          x: path.labelX,
          y: path.labelY,
          anchor: "center",
          child: edgeGestures(ctx, edge, label),
        });
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
              if (ctx.handleReconnectStart(edge.id, end, event))
                event.stopPropagation();
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
    const reconnectHandles = children.splice(1);
    if (selected && ctx.isEdgeReshapable(edge)) {
      const vertices = [
        { x: endpoints.sourceX, y: endpoints.sourceY },
        ...(edge.waypoints ?? []),
        { x: endpoints.targetX, y: endpoints.targetY },
      ];
      const handles = [
        ...(edge.waypoints ?? []).map((point, index) => ({
          point,
          kind: "waypoint" as const,
          index,
        })),
        ...vertices.slice(1).map((point, index) => ({
          point: {
            x: (vertices[index].x + point.x) / 2,
            y: (vertices[index].y + point.y) / 2,
          },
          kind: "midpoint" as const,
          index,
        })),
      ];
      for (const { point, kind, index } of handles) {
        const active =
          ctx.activeEdgeHandle?.edgeId === edge.id &&
          ctx.activeEdgeHandle.index === index &&
          kind === ctx.activeEdgeHandle.kind;
        children.push(
          new FlowSceneItem({
            key: `${kind}:${index}`,
            x: point.x,
            y: point.y,
            anchor: "center",
            child: GestureDetector({
              cursor: "move",
              behavior: "opaque",
              onDragStart: (event) => {
                ctx.handleReshapeStart(edge.id, kind, index, event);
                event.stopPropagation();
              },
              onDragMove: (event) => ctx.handleReshapeMove(event),
              onDragEnd: (event) => ctx.handleReshapeEnd(event),
              onClick: (event) => {
                if (kind === "waypoint")
                  ctx.handleWaypointClick(edge.id, index, event);
                event.stopPropagation();
              },
              child: ctx.custom.edgeHandle(
                { edge, kind, index, isActive: active },
                ctx as any,
              ),
            }),
          }),
        );
      }
    }
    return ctx.custom.edgeBox(
      {
        edge: children[0],
        label: labelWidget,
        reconnectHandles,
        edgeHandles: children.slice(1),
        args,
      },
      ctx as any,
    );
  }
}

// ---------------------------------------------------------------------------
// Connection line
// ---------------------------------------------------------------------------

class ConnectionLineWidget extends StatefulWidget {
  constructor(readonly controller: FlowDiagramController) {
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
    if (!connection || (connection.mode !== "drag" && !connection.toHandle))
      return SizedBox.shrink();
    const path = ctx.getConnectionLinePath(connection);
    const bounds = inflateRect(pointsBounds(path.points), EDGE_MARGIN);
    const local = translateEdgePath(path, -bounds.x, -bounds.y);
    const widget = ctx.custom.connectionLine(
      {
        connection,
        path: local,
        from: {
          x: connection.from.x - bounds.x,
          y: connection.from.y - bounds.y,
        },
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
      child: SizedBox({
        width: bounds.width,
        height: bounds.height,
        child: widget,
      }),
    });
  }
}

/** Headless diagram widget: bring a `custom` style and get React Flow's behaviour. */

class GuidesWidget extends StatefulWidget {
  constructor(readonly controller: FlowDiagramController) {
    super("guides");
  }
  override createState(): State<GuidesWidget> {
    return new GuidesState();
  }
}
class GuidesState extends SignalState<GuidesWidget> {
  override initState(context: BuildContext): void {
    super.initState(context);
    this.subscribe([this.widget.controller.guidesSignal]);
  }
  override build(): Widget {
    const ctx = this.widget.controller;
    const lines = ctx.guides;
    if (!lines.length) return SizedBox.shrink();
    const xs = lines.flatMap((line) =>
      line.axis === "x" ? [line.position] : [line.from, line.to],
    );
    const ys = lines.flatMap((line) =>
      line.axis === "y" ? [line.position] : [line.from, line.to],
    );
    const x = Math.min(...xs) - 1,
      y = Math.min(...ys) - 1;
    const local = lines.map((line) => ({
      ...line,
      position: line.position - (line.axis === "x" ? x : y),
      from: line.from - (line.axis === "x" ? y : x),
      to: line.to - (line.axis === "x" ? y : x),
    }));
    const child = ctx.custom.guides({ lines: local }, ctx as any);
    return child
      ? new FlowSceneItem({
          x,
          y,
          width: Math.max(...xs) - x + 1,
          height: Math.max(...ys) - y + 1,
          interactive: false,
          child,
        })
      : SizedBox.shrink();
  }
}

/** Shared action interaction, so replacing a visual never replaces its gestures. */
class ActionWidget extends StatefulWidget {
  constructor(
    readonly child: (isHovered: boolean) => Widget,
    readonly onClick: () => void,
    readonly isDisabled: boolean,
  ) {
    super();
  }
  createState() {
    return new ActionState();
  }
}
class ActionState extends State<ActionWidget> {
  isHovered = false;
  build(): Widget {
    return GestureDetector({
      cursor: this.widget.isDisabled ? "default" : "pointer",
      onMouseEnter: () =>
        this.setState(() => {
          this.isHovered = true;
        }),
      onMouseLeave: () =>
        this.setState(() => {
          this.isHovered = false;
        }),
      onMouseDown: (event) => event.stopPropagation(),
      onClick: (event) => {
        event.stopPropagation();
        if (!this.widget.isDisabled) this.widget.onClick();
      },
      child: this.widget.child(this.isHovered),
    });
  }
}
function buildAction(
  child: (isHovered: boolean) => Widget,
  onClick: () => void,
  isDisabled = false,
): Widget {
  return new ActionWidget(child, onClick, isDisabled);
}
export function buildMinimap(ctx: FlowDiagramController): Widget {
  const entries = ctx.getVisibleNodes().flatMap((node) => {
    const rect = ctx.getNodeRect(node);
    return rect ? [{ node, rect }] : [];
  });
  const view = ctx.getViewportRect();
  const bounds = entries.length
    ? getBoundsOfRects([...entries.map((n) => n.rect), view])
    : view;
  const {
    width,
    height,
    pannable,
    padding = 5,
  } = ctx.getMinimapOptions?.(ctx as any) ?? {
    width: 200,
    height: 150,
    pannable: true,
  };
  const viewScale = Math.max(bounds.width / width, bounds.height / height) || 1;
  const scale = width / (viewScale * (width + padding * 2));
  const origin = {
    x: bounds.x - (viewScale * width - bounds.width) / 2 - padding * viewScale,
    y:
      bounds.y - (viewScale * height - bounds.height) / 2 - padding * viewScale,
  };
  const local = (rect: Rect): Rect => ({
    x: (rect.x - origin.x) * scale,
    y: (rect.y - origin.y) * scale,
    width: rect.width * scale,
    height: rect.height * scale,
  });
  const raw = local(view);
  const rect = {
    x: Math.max(0, raw.x),
    y: Math.max(0, raw.y),
    width: Math.max(0, Math.min(width, raw.x + raw.width) - Math.max(0, raw.x)),
    height: Math.max(
      0,
      Math.min(height, raw.y + raw.height) - Math.max(0, raw.y),
    ),
  };
  const nodes = entries.map(({ node, rect }) =>
    ctx.custom.minimapNode(
      { node, rect: local(rect), isSelected: !!node.selected },
      ctx as any,
    ),
  );
  let last: { x: number; y: number } | null = null;
  return GestureDetector({
    cursor: pannable ? "grab" : "default",
    behavior: "opaque",
    onMouseDown: (event) => event.stopPropagation(),
    onClick: (event) => event.stopPropagation(),
    onDragStart: (event) => {
      event.stopPropagation();
      last = { x: event.clientX, y: event.clientY };
    },
    onDragMove: (event) => {
      if (!pannable || !last) return;
      ctx.panBy({
        x: (-(event.clientX - last.x) / scale) * ctx.zoom,
        y: (-(event.clientY - last.y) / scale) * ctx.zoom,
      });
      last = { x: event.clientX, y: event.clientY };
    },
    onDragEnd: () => {
      last = null;
    },
    child: ctx.custom.minimap(
      {
        width,
        height,
        nodes,
        background: ctx.custom.minimapBackground({ width, height }, ctx as any),
        mask: ctx.custom.minimapMask({ width, height, rect }, ctx as any),
        viewport: ctx.custom.minimapViewport({ rect }, ctx as any),
      },
      ctx as any,
    ),
  });
}

export function buildControls(ctx: FlowDiagramController): Widget {
  const options = ctx.getControlsOptions?.(ctx as any);
  const actions: Record<ControlKind, () => void> = {
    zoomIn: () => {
      void ctx.zoomIn({ duration: options?.zoomDuration ?? 0 });
    },
    zoomOut: () => {
      void ctx.zoomOut({ duration: options?.zoomDuration ?? 0 });
    },
    fitView: () => {
      void ctx.fitView({ duration: options?.fitViewDuration ?? 200 });
    },
    interactive: () => ctx.setInteractive(!ctx.isInteractive),
  };
  const button = (kind: ControlKind) =>
    buildAction(
      (isHovered) =>
        ctx.custom.controlButton(
          {
            kind,
            isHovered,
            isDisabled: false,
            isInteractive: ctx.isInteractive,
          },
          ctx as any,
        ),
      actions[kind],
    );
  return ctx.custom.controls(
    {
      zoomIn: button("zoomIn"),
      zoomOut: button("zoomOut"),
      fitView: button("fitView"),
      interactive: button("interactive"),
    },
    ctx as any,
  );
}

/** Composes interaction-ready menu items before invoking the menu layout slot. */
export function buildContextMenu(
  ctx: FlowDiagramController,
  menu: ContextMenuCustomArgs,
): Widget {
  const items = (ctx.getContextMenuItems?.(menu, ctx as any) ?? []).map(
    (item, index) =>
      buildAction(
        (isHovered) =>
          ctx.custom.menuItem(
            {
              label: item.label,
              index,
              isHovered,
              isDisabled: !!item.disabled,
              isSeparator: !!item.separator,
            },
            ctx as any,
          ),
        () => {
          ctx.closeContextMenu();
          item.onSelect();
        },
        !!item.disabled,
      ),
  );
  return ctx.custom.contextMenu({ ...menu, items }, ctx as any);
}
