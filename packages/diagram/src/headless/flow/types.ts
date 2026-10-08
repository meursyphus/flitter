import type { BuildContext, Widget } from "flitter-core";
import type {
  CoordinateExtent,
  Dimensions,
  Position,
  Rect,
  SnapGrid,
  Viewport,
  XYPosition,
} from "../../shared/geometry";
import type { EdgePathParams, EdgePathResult, MarkerShape } from "../../shared/edges";
import type { Connection, EdgeChange, NodeChange } from "../../shared/changes";
import type { LayoutAlgorithm, LayoutOptions } from "../../shared/layout";
import type { FlowController } from "./controller";

export type { XYPosition, Dimensions, Rect, Position, Viewport, CoordinateExtent, SnapGrid };
export type { Connection, NodeChange, EdgeChange };
export type HandleType = "source" | "target";
export type ResizeControlPosition =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type NodeResizeOptions = {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  keepAspectRatio?: boolean;
  /** Corner/side handles to show; defaults to the four corners. */
  handles?: ResizeControlPosition[];
  /** Side lines to show; defaults to all four sides. */
  lines?: ("top" | "right" | "bottom" | "left")[];
};

export type NodeToolbarOptions = {
  /** Side of the node the toolbar sits on. Defaults to "top". */
  position?: Position;
  align?: "start" | "center" | "end";
  /** Gap between node and toolbar in screen pixels. Defaults to 10. */
  offset?: number;
  /** Force visibility; by default the toolbar shows while this is the only selected node. */
  isVisible?: boolean;
};

/**
 * Declares where a connection handle sits on a node. Handles are declared
 * rather than measured: `position` picks the side, `align` the fraction along
 * it, and `x`/`y` pin the centre to an exact offset from the node origin.
 */
export type HandleSpec = {
  id?: string;
  type: HandleType;
  position: Position;
  /** 0..1 along the side; defaults to 0.5 (centre). */
  align?: number;
  /** Centre x relative to the node's top-left; overrides the side midpoint. */
  x?: number;
  /** Centre y relative to the node's top-left; overrides the side midpoint. */
  y?: number;
  width?: number;
  height?: number;
  connectable?: boolean;
  data?: unknown;
};

/** A handle with its absolute geometry resolved against the measured node. */
export type ResolvedHandle = Omit<HandleSpec, "id" | "width" | "height" | "x" | "y"> & {
  nodeId: string;
  id: string | null;
  width: number;
  height: number;
  /** Absolute centre. */
  x: number;
  y: number;
};

export type FlowNode<TData = Record<string, unknown>> = {
  id: string;
  /** Top-left in flow coordinates (relative to the parent when `parentId` is set). */
  position: XYPosition;
  data: TData;
  type?: string;
  /** Fixed size; when omitted the node is measured after layout. */
  width?: number;
  height?: number;
  /** Written by the engine after measurement. */
  measured?: Dimensions;
  selected?: boolean;
  dragging?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  deletable?: boolean;
  hidden?: boolean;
  parentId?: string;
  extent?: CoordinateExtent | "parent";
  zIndex?: number;
  /** Fallback edge anchor sides when the node has no handles. */
  sourcePosition?: Position;
  targetPosition?: Position;
  /** Overrides the node type's handles. */
  handles?: HandleSpec[];
  /** Shows resize controls while selected (see `nodesResizable` for the global default). */
  resizable?: boolean;
  resizeOptions?: NodeResizeOptions;
  /** Written by the engine while a resize gesture is active. */
  resizing?: boolean;
  toolbar?: NodeToolbarOptions;
};

export type EdgeMarker = {
  type: MarkerShape;
  color?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
};

export type EdgeStyle = {
  stroke?: string;
  strokeWidth?: number;
};

export type FlowEdge<TData = Record<string, unknown>> = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;
  data?: TData;
  label?: string;
  selected?: boolean;
  animated?: boolean;
  hidden?: boolean;
  deletable?: boolean;
  selectable?: boolean;
  reconnectable?: boolean | "source" | "target";
  markerStart?: EdgeMarker | MarkerShape;
  markerEnd?: EdgeMarker | MarkerShape;
  zIndex?: number;
  style?: EdgeStyle;
  /** Options for the built-in path algorithms (curvature, offset, borderRadius). */
  pathOptions?: { curvature?: number; offset?: number; borderRadius?: number };
};

export type EdgeEndpoints = Required<Pick<EdgePathParams, "sourceX" | "sourceY" | "targetX" | "targetY">> & {
  sourcePosition: Position;
  targetPosition: Position;
  sourceHandle: ResolvedHandle | null;
  targetHandle: ResolvedHandle | null;
};

export type ConnectionState = {
  inProgress: boolean;
  /** Absolute start point. */
  from: XYPosition;
  fromNode: FlowNode;
  fromHandle: ResolvedHandle;
  fromPosition: Position;
  /** Absolute end point: a snapped handle or the pointer. */
  to: XYPosition;
  toNode: FlowNode | null;
  toHandle: ResolvedHandle | null;
  toPosition: Position;
  /** `true` snapped onto a valid handle, `false` onto an invalid one, `null` free pointer. */
  isValid: boolean | null;
  /** Whether the gesture started with a click (connect-on-click) or a drag. */
  mode: "drag" | "click";
  /** Set while an existing edge's endpoint is being dragged to a new handle. */
  reconnectingEdge: FlowEdge | null;
  reconnectingEnd: HandleType | null;
};

export type ConnectionMode = "strict" | "loose";
export type SelectionMode = "full" | "partial";
export type PanelPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type FitViewOptions = {
  padding?: number;
  minZoom?: number;
  maxZoom?: number;
  duration?: number;
  /** Fit only these nodes. */
  nodes?: (FlowNode | { id: string })[];
  includeHiddenNodes?: boolean;
};

export type LayoutConfig = {
  algorithm: LayoutAlgorithm;
  options?: LayoutOptions;
  /** Run `fitView` once the layout has been applied. Defaults to true. */
  fitView?: boolean;
  /** `mount` runs once after the nodes are measured; `manual` waits for `controller.layout()`. */
  runOn?: "mount" | "manual";
};

export type KeyCode = string | string[] | null;

/** Behavioural options, all defaulting to React Flow's values. */
export type FlowOptions = {
  minZoom: number;
  maxZoom: number;
  zoomOnScroll: boolean;
  zoomOnPinch: boolean;
  panOnScroll: boolean;
  panOnScrollSpeed: number;
  zoomOnDoubleClick: boolean;
  panOnDrag: boolean;
  selectionOnDrag: boolean;
  selectionMode: SelectionMode;
  nodesDraggable: boolean;
  nodesConnectable: boolean;
  elementsSelectable: boolean;
  selectNodesOnDrag: boolean;
  nodeDragThreshold: number;
  snapToGrid: boolean;
  snapGrid: SnapGrid;
  connectionMode: ConnectionMode;
  connectionRadius: number;
  connectOnClick: boolean;
  autoPanOnNodeDrag: boolean;
  autoPanOnConnect: boolean;
  autoPanSpeed: number;
  elevateNodesOnSelect: boolean;
  elevateEdgesOnSelect: boolean;
  deleteKeyCode: KeyCode;
  multiSelectionKeyCode: KeyCode;
  selectionKeyCode: KeyCode;
  panActivationKeyCode: KeyCode;
  zoomActivationKeyCode: KeyCode;
  nodeExtent: CoordinateExtent;
  /** Flow-coordinate region the viewport may show; the translation is clamped to it. */
  translateExtent: CoordinateExtent;
  /** Allow dragging an edge endpoint onto another handle. */
  edgesReconnectable: boolean;
  /** Radius (flow px) of the invisible grab area at each edge endpoint. */
  reconnectRadius: number;
  /** Global default for `node.resizable`. */
  nodesResizable: boolean;
  nodeResizeOptions: NodeResizeOptions;
  /** Default handle size used for edge anchoring when a HandleSpec has no size. */
  handleSize: number;
  /** Invisible stroke width used to hit test edges. */
  edgeInteractionWidth: number;
  defaultEdgeOptions: Partial<FlowEdge>;
  isValidConnection: (connection: Connection) => boolean;
  /** Path type used for the connection line while connecting. */
  connectionLineType: string;
};

export type FlowCallbacks = {
  onNodesChange?: (changes: NodeChange<FlowNode>[]) => void;
  onEdgesChange?: (changes: EdgeChange<FlowEdge>[]) => void;
  onConnect?: (connection: Connection) => void;
  onConnectStart?: (event: MouseEvent, params: { nodeId: string; handleId: string | null; handleType: HandleType }) => void;
  onConnectEnd?: (event: MouseEvent, state: ConnectionState) => void;
  onClickConnectStart?: (event: MouseEvent, params: { nodeId: string; handleId: string | null; handleType: HandleType }) => void;
  onClickConnectEnd?: (event: MouseEvent, state: ConnectionState) => void;
  onNodeClick?: (event: MouseEvent, node: FlowNode) => void;
  onNodeDoubleClick?: (event: MouseEvent, node: FlowNode) => void;
  onNodeMouseEnter?: (event: MouseEvent, node: FlowNode) => void;
  onNodeMouseLeave?: (event: MouseEvent, node: FlowNode) => void;
  onNodeDragStart?: (event: MouseEvent, node: FlowNode, nodes: FlowNode[]) => void;
  onNodeDrag?: (event: MouseEvent, node: FlowNode, nodes: FlowNode[]) => void;
  onNodeDragStop?: (event: MouseEvent, node: FlowNode, nodes: FlowNode[]) => void;
  onEdgeClick?: (event: MouseEvent, edge: FlowEdge) => void;
  onEdgeDoubleClick?: (event: MouseEvent, edge: FlowEdge) => void;
  onEdgeMouseEnter?: (event: MouseEvent, edge: FlowEdge) => void;
  onEdgeMouseLeave?: (event: MouseEvent, edge: FlowEdge) => void;
  onPaneClick?: (event: MouseEvent) => void;
  onPaneDoubleClick?: (event: MouseEvent) => void;
  onSelectionChange?: (selection: { nodes: FlowNode[]; edges: FlowEdge[] }) => void;
  onSelectionStart?: (event: MouseEvent) => void;
  onSelectionEnd?: (event: MouseEvent) => void;
  onMoveStart?: (viewport: Viewport) => void;
  onMove?: (viewport: Viewport) => void;
  onMoveEnd?: (viewport: Viewport) => void;
  onNodesDelete?: (nodes: FlowNode[]) => void;
  onEdgesDelete?: (edges: FlowEdge[]) => void;
  onDelete?: (deleted: { nodes: FlowNode[]; edges: FlowEdge[] }) => void;
  onBeforeDelete?: (
    deleted: { nodes: FlowNode[]; edges: FlowEdge[] },
  ) => boolean | { nodes: FlowNode[]; edges: FlowEdge[] } | Promise<boolean | { nodes: FlowNode[]; edges: FlowEdge[] }>;
  onReconnect?: (oldEdge: FlowEdge, newConnection: Connection) => void;
  onReconnectStart?: (event: MouseEvent, edge: FlowEdge, handleType: HandleType) => void;
  onReconnectEnd?: (event: MouseEvent, edge: FlowEdge, handleType: HandleType, state: ConnectionState) => void;
  onNodeResizeStart?: (event: MouseEvent, node: FlowNode) => void;
  onNodeResize?: (event: MouseEvent, node: FlowNode, params: ResizeParams) => void;
  onNodeResizeEnd?: (event: MouseEvent, node: FlowNode, params: ResizeParams) => void;
  onInit?: (controller: FlowController) => void;
  /** Called with `"layout"` when a layout algorithm throws (otherwise the error propagates). */
  onError?: (code: "layout", message: string) => void;
};

export type ResizeParams = {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Sign of the pointer movement on each axis. */
  direction: [number, number];
};

export type FlowContext<TConfig extends object = object> = FlowController & { config: TConfig };

type Builder<TArgs, TConfig extends object> = (args: TArgs, context: FlowContext<TConfig>) => Widget;

export type NodeBuilderArgs = {
  node: FlowNode;
  selected: boolean;
  dragging: boolean;
  hovered: boolean;
  draggable: boolean;
  selectable: boolean;
  connectable: boolean;
  positionAbsolute: XYPosition;
  zIndex: number;
  /** A connection is being dragged over this node (any of its handles is the candidate). */
  isConnectionTarget: boolean;
  resizable: boolean;
  resizing: boolean;
};

export type EdgeBuilderArgs = {
  edge: FlowEdge;
  /** Geometry in the edge widget's local coordinates (top-left is `origin`). */
  path: EdgePathResult;
  /** Top-left of the edge widget in flow coordinates. */
  origin: XYPosition;
  size: Dimensions;
  endpoints: EdgeEndpoints;
  selected: boolean;
  hovered: boolean;
  animated: boolean;
  sourceNode: FlowNode;
  targetNode: FlowNode;
  markerStart: EdgeMarker | null;
  markerEnd: EdgeMarker | null;
  interactionWidth: number;
  /** One endpoint of this edge is being dragged to a new handle. */
  reconnecting: boolean;
};

export type EdgeLabelBuilderArgs = {
  edge: FlowEdge;
  label: string;
  selected: boolean;
  hovered: boolean;
  /** Label anchor in flow coordinates. */
  x: number;
  y: number;
};

export type HandleBuilderArgs = {
  node: FlowNode;
  handle: ResolvedHandle;
  connectable: boolean;
  /** This handle started the connection in progress. */
  isConnecting: boolean;
  /** This handle is the snapped candidate of the connection in progress. */
  isConnectionCandidate: boolean;
  isValidCandidate: boolean | null;
  connectionInProgress: boolean;
};

export type ConnectionLineBuilderArgs = {
  connection: ConnectionState;
  /** Path in local coordinates of the connection line widget. */
  path: EdgePathResult;
  from: XYPosition;
  to: XYPosition;
  fromPosition: Position;
  toPosition: Position;
  isValid: boolean | null;
  origin: XYPosition;
  size: Dimensions;
};

export type BackgroundBuilderArgs = {
  viewport: Viewport;
  width: number;
  height: number;
};

export type SelectionBoxBuilderArgs = {
  /** Rectangle in pane pixels. */
  rect: Rect;
};

export type NodesSelectionRectBuilderArgs = {
  /** Bounds of the selected nodes in flow coordinates. */
  rect: Rect;
  nodes: FlowNode[];
};

export type ResizeControlBuilderArgs = {
  node: FlowNode;
  position: ResizeControlPosition;
  variant: "line" | "handle";
  resizing: boolean;
};

export type ReconnectHandleBuilderArgs = {
  edge: FlowEdge;
  end: HandleType;
  /** Diameter of the grab area in flow pixels. */
  size: number;
};

export type NodeToolbarBuilderArgs = {
  node: FlowNode;
  selected: boolean;
};

export type NodeToolbarBuilder<TConfig extends object = object> = (
  args: NodeToolbarBuilderArgs,
  context: FlowContext<TConfig>,
) => Widget | null;

export type EdgePathBuilderArgs = {
  edge: FlowEdge | null;
  params: EdgePathParams;
  /** Type being resolved: the edge type, or `connectionLineType` while connecting. */
  type: string;
};

export type FlowCustom<TConfig extends object = object> = {
  /** Fallback node renderer when `nodeTypes` has no entry for `node.type`. */
  node: Builder<NodeBuilderArgs, TConfig>;
  /** Fallback edge renderer when `edgeTypes` has no entry for `edge.type`. */
  edge: Builder<EdgeBuilderArgs, TConfig>;
  edgeLabel: (args: EdgeLabelBuilderArgs, context: FlowContext<TConfig>) => Widget | null;
  handle: Builder<HandleBuilderArgs, TConfig>;
  /** Handles for nodes that declare none (and whose node type declares none). */
  defaultHandles: (node: FlowNode, context: FlowContext<TConfig>) => HandleSpec[];
  connectionLine: Builder<ConnectionLineBuilderArgs, TConfig>;
  background: (args: BackgroundBuilderArgs, context: FlowContext<TConfig>) => Widget | null;
  selectionBox: Builder<SelectionBoxBuilderArgs, TConfig>;
  nodesSelectionRect: (args: NodesSelectionRectBuilderArgs, context: FlowContext<TConfig>) => Widget | null;
  /** Geometry for built-in edge types; override to tune curvature or add types. */
  edgePath: (args: EdgePathBuilderArgs, context: FlowContext<TConfig>) => EdgePathResult;
  /** Resize lines/handles shown around a selected resizable node. */
  resizeControl: Builder<ResizeControlBuilderArgs, TConfig>;
  /** Grab area at an edge endpoint; invisible by default. */
  reconnectHandle: Builder<ReconnectHandleBuilderArgs, TConfig>;
};

export type NodeBuilder<TConfig extends object = object> = Builder<NodeBuilderArgs, TConfig>;
export type NodeTypeDefinition<TConfig extends object = object> = {
  build: NodeBuilder<TConfig>;
  handles?: HandleSpec[] | ((node: FlowNode) => HandleSpec[]);
  /** Toolbar rendered in screen space next to the node (see `node.toolbar`). */
  toolbar?: NodeToolbarBuilder<TConfig>;
};
export type NodeType<TConfig extends object = object> = NodeBuilder<TConfig> | NodeTypeDefinition<TConfig>;

export type EdgeBuilder<TConfig extends object = object> = Builder<EdgeBuilderArgs, TConfig>;
export type EdgeTypeDefinition<TConfig extends object = object> = {
  build: EdgeBuilder<TConfig>;
  getPath?: (params: EdgePathParams, edge: FlowEdge | null) => EdgePathResult;
};
export type EdgeType<TConfig extends object = object> = EdgeBuilder<TConfig> | EdgeTypeDefinition<TConfig>;

export type FlowPanel = {
  position: PanelPosition;
  child: Widget;
};

export type FlowProps<TConfig extends object = object> = Partial<FlowOptions> &
  FlowCallbacks & {
    nodes?: FlowNode[];
    edges?: FlowEdge[];
    /** Bring your own controller to drive the diagram from outside. */
    controller?: FlowController;
    custom: FlowCustom<TConfig>;
    config?: TConfig;
    nodeTypes?: Record<string, NodeType<TConfig>>;
    edgeTypes?: Record<string, EdgeType<TConfig>>;
    defaultViewport?: Viewport;
    /** Fit all nodes once they are measured. */
    fitView?: boolean;
    fitViewOptions?: FitViewOptions;
    /** Automatic layout algorithm. See `layeredLayout`, `treeLayout`, ... */
    layout?: LayoutAlgorithm | LayoutConfig;
    panels?: FlowPanel[];
    /** Fallback toolbar for node types without their own `toolbar`. */
    nodeToolbar?: NodeToolbarBuilder<TConfig>;
    key?: unknown;
  };

export type FlowBuildContext = BuildContext;
