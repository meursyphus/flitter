import type { NodeAttachmentPlacement } from "./scene";
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
import type {
  EdgePathParams,
  EdgePathResult,
  MarkerShape,
} from "../../shared/edges";
import type { Connection, EdgeChange, NodeChange } from "../../shared/changes";
import type { LayoutAlgorithm, LayoutOptions } from "../../shared/layout";
import type { DeepPartial } from "../../shared/utils";
import type { FlowDiagramController } from "./controller";

export type {
  XYPosition,
  Dimensions,
  Rect,
  Position,
  Viewport,
  CoordinateExtent,
  SnapGrid,
};
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
  /** Inline handles are placed by the node widget; their anchors are measured after layout. */
  placement?: "boundary" | "inline";
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
export type ResolvedHandle = Omit<
  HandleSpec,
  "id" | "width" | "height" | "x" | "y"
> & {
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
  collapsible?: boolean;
  collapsed?: boolean;
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
  /** Bend points in flow coordinates that the path routes through (see `edit.waypoints`). */
  waypoints?: XYPosition[];
  /** What happens to the bends when an endpoint node moves: keep them, move only the end segments (default), or stretch all. */
  adjusting?: "none" | "ends" | "stretch";
  /** Options for the built-in path algorithms (curvature, offset, borderRadius). */
  pathOptions?: { curvature?: number; offset?: number; borderRadius?: number };
};

export type FlowContent = { nodes: FlowNode[]; edges: FlowEdge[] };

export type EdgeEndpoints = Required<
  Pick<EdgePathParams, "sourceX" | "sourceY" | "targetX" | "targetY">
> & {
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

export type FlowEvents = {
  nodesChange?: (changes: NodeChange<FlowNode>[]) => void;
  edgesChange?: (changes: EdgeChange<FlowEdge>[]) => void;
  connect?: (connection: Connection) => void;
  nodeClick?: (event: MouseEvent, node: FlowNode) => void;
  nodeDoubleClick?: (event: MouseEvent, node: FlowNode) => void;
  dragStart?: (event: MouseEvent, node: FlowNode, nodes: FlowNode[]) => void;
  drag?: (event: MouseEvent, node: FlowNode, nodes: FlowNode[]) => void;
  dragEnd?: (event: MouseEvent, node: FlowNode, nodes: FlowNode[]) => void;
  edgeClick?: (event: MouseEvent, edge: FlowEdge) => void;
  edgeDoubleClick?: (event: MouseEvent, edge: FlowEdge) => void;
  paneClick?: (event: MouseEvent) => void;
  paneDoubleClick?: (event: MouseEvent) => void;
  selectionChange?: (selection: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  }) => void;
  delete?: (deleted: { nodes: FlowNode[]; edges: FlowEdge[] }) => void;
  beforeDelete?: (deleted: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  }) =>
    | boolean
    | { nodes: FlowNode[]; edges: FlowEdge[] }
    | Promise<boolean | { nodes: FlowNode[]; edges: FlowEdge[] }>;
  reconnect?: (oldEdge: FlowEdge, newConnection: Connection) => void;
  resizeStart?: (event: MouseEvent, node: FlowNode) => void;
  resize?: (event: MouseEvent, node: FlowNode, params: ResizeParams) => void;
  resizeEnd?: (event: MouseEvent, node: FlowNode, params: ResizeParams) => void;
  init?: (controller: FlowDiagramController) => void;
  error?: (code: "layout", message: string) => void;
  viewportChange?: (change: {
    phase: "start" | "move" | "end";
    viewport: Viewport;
  }) => void;
  connectStart?: (state: ConnectionState) => void;
  connectEnd?: (result: {
    state: ConnectionState;
    dropPosition: XYPosition;
  }) => void;
  beforeConnect?: (connection: Connection) => false | Connection | void;
  reshapeStart?: (args: EdgeHandleCustomArgs) => void;
  reshape?: (args: EdgeHandleCustomArgs) => void;
  reshapeEnd?: (args: EdgeHandleCustomArgs) => void;
  editStart?: (args: { node: FlowNode }) => void;
  editEnd?: (args: { node: FlowNode; committed: boolean }) => void;
  historyChange?: (state: { canUndo: boolean; canRedo: boolean }) => void;
  contextMenu?: (args: ContextMenuCustomArgs) => void;
};

export type InteractionPreset = "editor" | "viewer" | "whiteboard";
export type Gesture =
  | "pan"
  | "zoom"
  | "select"
  | "drag"
  | "connect"
  | "reconnect"
  | "resize"
  | "reshape"
  | "edit"
  | "delete"
  | "copy"
  | "contextMenu";
export type GestureTarget = {
  kind: "node" | "edge" | "pane" | "selection";
  id?: string;
};

export type FlowInteraction = {
  pane: {
    drag: "pan" | "select";
    scroll: "zoom" | "pan";
    scrollSpeed: number;
    pinch: boolean;
    doubleClick: "zoom" | "none";
    autoPan: boolean | { speed: number };
    panKey: KeyCode;
    selectKey: KeyCode;
  };
  select: {
    enabled: boolean;
    box: boolean;
    mode: SelectionMode;
    toggleKey: KeyCode;
    elevate: boolean;
    edgeHitWidth: number;
  };
  drag: {
    enabled: boolean;
    threshold: number;
    snap: { grid: false | [number, number]; guides: boolean; radius: number };
    overlap: "allow" | "push" | "reject";
    dropIntoGroup: boolean;
  };
  connect: {
    enabled: boolean;
    mode: ConnectionMode;
    radius: number;
    onClick: boolean;
    reconnect: boolean;
    reconnectRadius: number;
    lineType: string;
    validate?: (connection: Connection) => boolean;
  };
  edit: {
    text: boolean;
    waypoints: boolean;
    resize: boolean | NodeResizeOptions;
  };
  history: { enabled: boolean; limit: number };
  clipboard: { enabled: boolean; offset: XYPosition; system: boolean };
  contextMenu: { enabled: boolean; longPress: number };
  /** Custom nudge arrays bind left, right, up, down, in that order. */
  keys: {
    delete: KeyCode;
    undo: KeyCode;
    redo: KeyCode;
    copy: KeyCode;
    paste: KeyCode;
    duplicate: KeyCode;
    selectAll: KeyCode;
    fitView: KeyCode;
    zoomIn: KeyCode;
    zoomOut: KeyCode;
    nudge: KeyCode;
    escape: KeyCode;
  };
  touch: boolean;
};

export type ResizeParams = {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Sign of the pointer movement on each axis. */
  direction: [number, number];
};

export type FlowDiagramContext<TConfig extends object = object> =
  FlowDiagramController & { config: TConfig };

export type CustomArgs<TArgs = undefined, TConfig extends object = object> = (
  args: TArgs,
  context: FlowDiagramContext<TConfig>,
) => Widget;

export type NodeCustomArgs = {
  node: FlowNode;
  isSelected: boolean;
  isDragging: boolean;
  isHovered: boolean;
  isDraggable: boolean;
  isSelectable: boolean;
  isConnectable: boolean;
  positionAbsolute: XYPosition;
  zIndex: number;
  /** A connection is being dragged over this node (any of its handles is the candidate). */
  isConnectionTarget: boolean;
  isResizable: boolean;
  isResizing: boolean;
  isEditing: boolean;
  isDropTarget: boolean;
  isOverlapping: boolean;
  isCollapsed: boolean;
  hiddenChildCount: number;
  isNeighbour: boolean;
};

export type EdgeCustomArgs = {
  edge: FlowEdge;
  /** Geometry in the edge widget's local coordinates (top-left is `origin`). */
  path: EdgePathResult;
  /** Top-left of the edge widget in flow coordinates. */
  origin: XYPosition;
  size: Dimensions;
  endpoints: EdgeEndpoints;
  isSelected: boolean;
  isHovered: boolean;
  isAnimated: boolean;
  sourceNode: FlowNode;
  targetNode: FlowNode;
  markerStart: EdgeMarker | null;
  markerEnd: EdgeMarker | null;
  interactionWidth: number;
  /** One endpoint of this edge is being dragged to a new handle. */
  isReconnecting: boolean;
  waypoints: XYPosition[];
  activeHandle: { kind: "waypoint" | "midpoint"; index: number } | null;
  isNeighbour: boolean;
};

export type EdgeLabelCustomArgs = {
  edge: FlowEdge;
  label: string;
  isSelected: boolean;
  isHovered: boolean;
  /** Label anchor in flow coordinates. */
  x: number;
  y: number;
};

export type HandleCustomArgs = {
  node: FlowNode;
  handle: ResolvedHandle;
  isConnectable: boolean;
  /** This handle started the connection in progress. */
  isConnecting: boolean;
  /** This handle is the snapped candidate of the connection in progress. */
  isConnectionCandidate: boolean;
  isValidCandidate: boolean | null;
  isConnectionInProgress: boolean;
};

export type ConnectionLineCustomArgs = {
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

export type BackgroundCustomArgs = {
  viewport: Viewport;
  width: number;
  height: number;
};

export type SelectionBoxCustomArgs = {
  /** Rectangle in pane pixels. */
  rect: Rect;
};

export type NodesSelectionRectCustomArgs = {
  /** Bounds of the selected nodes in flow coordinates. */
  rect: Rect;
  nodes: FlowNode[];
};

export type ResizeControlCustomArgs = {
  node: FlowNode;
  position: ResizeControlPosition;
  variant: "line" | "handle";
  isResizing: boolean;
};

export type ReconnectHandleCustomArgs = {
  edge: FlowEdge;
  end: HandleType;
  /** Diameter of the grab area in flow pixels. */
  size: number;
};

export type NodeToolbarCustomArgs = {
  node: FlowNode;
  isSelected: boolean;
};

export type NodeToolbarCustom<TConfig extends object = object> = (
  args: NodeToolbarCustomArgs,
  context: FlowDiagramContext<TConfig>,
) => Widget;

export type EdgePathCustomArgs = {
  edge: FlowEdge | null;
  params: EdgePathParams;
  /** Type being resolved: the edge type, or `connectionLineType` while connecting. */
  type: string;
};

export type Guide = {
  axis: "x" | "y";
  position: number;
  from: number;
  to: number;
};
export type ContextMenuCustomArgs = {
  target: GestureTarget["kind"];
  ids: string[];
  position: XYPosition;
  screenPosition: XYPosition;
};
export type GuidesCustomArgs = {
  /** Overlay-local coordinates; controller.guides uses flow coordinates. */ lines: Guide[];
};
export type EdgeHandleCustomArgs = {
  edge: FlowEdge;
  kind: "waypoint" | "midpoint";
  index: number;
  isActive: boolean;
};

export type LayoutCustomArgs = {
  background: Widget;
  viewport: Widget;
  selectionBox: Widget;
  toolbars: Widget;
  controls: Widget;
  minimap: Widget;
  contextMenu: Widget;
};
export type ViewportCustomArgs = {
  edges: Widget[];
  nodes: Widget[];
  connectionLine: Widget;
  nodesSelectionRect: Widget;
  guides: Widget;
  /** Interleaved nodes/edges in controller paint order, preserving group-edge elevation. */
  items: Widget[];
};
export type NodeBoxCustomArgs = {
  node: Widget;
  handles: Widget[];
  resizeControls: Widget[];
  /** The pre-built screen-space toolbar, also supplied to layout.toolbars for unscaled placement. */
  toolbar: Widget;
  args: NodeCustomArgs;
  /** Placement rules measured against the node body's laid-out size. */
  placements: NodeAttachmentPlacement[];
};
export type EdgeBoxCustomArgs = {
  edge: Widget;
  label: Widget;
  reconnectHandles: Widget[];
  edgeHandles: Widget[];
  args: EdgeCustomArgs;
};
export type ControlKind = "zoomIn" | "zoomOut" | "fitView" | "interactive";
export type ControlButtonCustomArgs = {
  kind: ControlKind;
  isHovered: boolean;
  isDisabled: boolean;
  isInteractive: boolean;
};
export type ControlsCustomArgs = {
  zoomIn: Widget;
  zoomOut: Widget;
  fitView: Widget;
  interactive: Widget;
};
export type MenuItem = {
  id?: string;
  label: string;
  onSelect(): void;
  disabled?: boolean;
  separator?: boolean;
};
export type MenuItemCustomArgs = {
  label: string;
  index: number;
  isHovered: boolean;
  isDisabled: boolean;
  isSeparator: boolean;
};
export type NodeBodyCustomArgs = NodeCustomArgs & {
  label: Widget;
  /** Interaction-ready inline handles. Place each handle once in the node's widget tree. */
  handles: { id: string | null; type: HandleType; handle: Widget }[];
};
export type MinimapCustomArgs = {
  width: number;
  height: number;
  background: Widget;
  nodes: Widget[];
  mask: Widget;
  viewport: Widget;
};
export type MinimapNodeCustomArgs = {
  node: FlowNode;
  rect: Rect;
  isSelected: boolean;
};
export type MinimapViewportCustomArgs = { rect: Rect };
export type MinimapBackgroundCustomArgs = { width: number; height: number };
export type MinimapMaskCustomArgs = MinimapBackgroundCustomArgs &
  MinimapViewportCustomArgs;

export type FlowDiagramCustom<TConfig extends object = object> = {
  layout: CustomArgs<LayoutCustomArgs, TConfig>;
  viewport: CustomArgs<ViewportCustomArgs, TConfig>;
  nodeBox: CustomArgs<NodeBoxCustomArgs, TConfig>;
  edgeBox: CustomArgs<EdgeBoxCustomArgs, TConfig>;
  controls: CustomArgs<ControlsCustomArgs, TConfig>;
  controlButton: CustomArgs<ControlButtonCustomArgs, TConfig>;
  minimap: CustomArgs<MinimapCustomArgs, TConfig>;
  minimapNode: CustomArgs<MinimapNodeCustomArgs, TConfig>;
  minimapBackground: CustomArgs<MinimapBackgroundCustomArgs, TConfig>;
  minimapMask: CustomArgs<MinimapMaskCustomArgs, TConfig>;
  minimapViewport: CustomArgs<MinimapViewportCustomArgs, TConfig>;
  contextMenu: CustomArgs<ContextMenuCustomArgs & { items: Widget[] }, TConfig>;
  menuItem: CustomArgs<MenuItemCustomArgs, TConfig>;
  guides: CustomArgs<GuidesCustomArgs, TConfig>;
  edgeHandle: CustomArgs<EdgeHandleCustomArgs, TConfig>;
  node: CustomArgs<NodeBodyCustomArgs, TConfig>;
  nodeLabel: CustomArgs<NodeCustomArgs, TConfig>;
  nodeToolbar: CustomArgs<NodeToolbarCustomArgs, TConfig>;
  edge: CustomArgs<EdgeCustomArgs, TConfig>;
  edgeLabel: CustomArgs<EdgeLabelCustomArgs, TConfig>;
  handle: CustomArgs<HandleCustomArgs, TConfig>;
  connectionLine: CustomArgs<ConnectionLineCustomArgs, TConfig>;
  background: CustomArgs<BackgroundCustomArgs, TConfig>;
  selectionBox: CustomArgs<SelectionBoxCustomArgs, TConfig>;
  nodesSelectionRect: CustomArgs<NodesSelectionRectCustomArgs, TConfig>;
  /** Resize lines/handles shown around a selected resizable node. */
  resizeControl: CustomArgs<ResizeControlCustomArgs, TConfig>;
  /** Grab area at an edge endpoint; invisible by default. */
  reconnectHandle: CustomArgs<ReconnectHandleCustomArgs, TConfig>;
};

export type NodeCustom<TConfig extends object = object> = CustomArgs<
  NodeBodyCustomArgs,
  TConfig
>;
export type EdgeCustom<TConfig extends object = object> = CustomArgs<
  EdgeCustomArgs,
  TConfig
>;

/** Per-type interaction metadata. All visual builders live in `custom`. */
export type NodeOptions = {
  lod?: number[];
  group?: boolean;
  editable?: boolean;
  handles?: HandleSpec[] | ((node: FlowNode) => HandleSpec[]);
};
export type GetHandlesFn<TConfig extends object = object> = (
  node: FlowNode,
  context: FlowDiagramContext<TConfig>,
) => HandleSpec[];
export type GetEdgePathFn<TConfig extends object = object> = (
  args: EdgePathCustomArgs,
  context: FlowDiagramContext<TConfig>,
) => EdgePathResult;
export type GetContextMenuItemsFn<TConfig extends object = object> = (
  args: ContextMenuCustomArgs,
  context: FlowDiagramContext<TConfig>,
) => MenuItem[];
export type GetControlsOptionsFn<TConfig extends object = object> = (
  context: FlowDiagramContext<TConfig>,
) => { zoomDuration?: number; fitViewDuration?: number };
export type GetMinimapOptionsFn<TConfig extends object = object> = (
  context: FlowDiagramContext<TConfig>,
) => { width: number; height: number; pannable: boolean; padding?: number };

export type FlowDiagramData = { nodes: FlowNode[]; edges: FlowEdge[] };

export type FlowDiagramProps<TConfig extends object = object> = {
  data: FlowDiagramData;
  custom: FlowDiagramCustom<TConfig>;
  config?: TConfig;
  nodeOptions?: Record<string, NodeOptions>;
  getHandles?: GetHandlesFn<TConfig>;
  getEdgePath?: GetEdgePathFn<TConfig>;
  getContextMenuItems?: GetContextMenuItemsFn<TConfig>;
  getControlsOptions?: GetControlsOptionsFn<TConfig>;
  getMinimapOptions?: GetMinimapOptionsFn<TConfig>;
  /** Rebuild visual slots on graph-wide hover/selection changes (e.g. dim unrelated nodes). */
  highlightConnected?: boolean;
  layout?: LayoutAlgorithm | LayoutConfig;
  viewport?: {
    initial?: Viewport;
    fitView?: boolean | FitViewOptions;
    minZoom?: number;
    maxZoom?: number;
    extent?: CoordinateExtent;
  };
  interaction?:
    | InteractionPreset
    | (DeepPartial<FlowInteraction> & { preset?: InteractionPreset });
  can?: (gesture: Gesture, target: GestureTarget) => boolean;
  on?: FlowEvents;
  controller?: FlowDiagramController;
  key?: unknown;
};

export type FlowBuildContext = BuildContext;
