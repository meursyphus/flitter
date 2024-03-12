import type { RenderObjectElement } from "../../element";
import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { TypedObject, assert, createUniqueId } from "../../utils";
import type { PaintContext } from "../../utils/type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

type Cursor =
  | "pointer"
  | "default"
  | "move"
  | "text"
  | "wait"
  | "help"
  | "progress"
  | "not-allowed"
  | "crosshair"
  | "grab"
  | "grabbing"
  | "e-resize"
  | "ne-resize"
  | "nw-resize"
  | "n-resize"
  | "se-resize"
  | "sw-resize"
  | "s-resize"
  | "w-resize"
  | "ew-resize"
  | "ns-resize"
  | "nesw-resize"
  | "nwse-resize"
  | "col-resize"
  | "row-resize"
  | "all-scroll";

let globalDragBackend: DragBackend;
let backendRefCount = 0;
function getSingletonDragBackend(): DragBackend {
  if (globalDragBackend == null) {
    globalDragBackend = new DragBackend();
  }

  return globalDragBackend;
}

type EventType =
  | "click"
  | "mousedown"
  | "mouseup"
  | "mousemove"
  | "wheel"
  | "mouseover"
  | "mouseenter"
  | "mouseleave"
  | "dragstart"
  | "dragend"
  | "drag";

type Bubble = Record<EventType, boolean>;

class BaseGestureDetector extends SingleChildRenderObjectWidget {
  onClick: (e: MouseEvent) => void;
  onMouseUp: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onMouseDown: (e: MouseEvent) => void;
  onMouseOver: (e: MouseEvent) => void;
  onMouseEnter: (e: MouseEvent) => void;
  onMouseLeave: (e: MouseEvent) => void;
  onDragStart: (e: MouseEvent) => void;
  onDragMove: (e: MouseEvent) => void;
  onDragEnd: (e: MouseEvent) => void;
  onWheel: (e: WheelEvent) => void;
  cursor: Cursor;
  bubble: Bubble;
  constructor({
    child,
    onClick,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseOver,
    onMouseEnter,
    onMouseLeave,
    key,
    cursor,
    onDragEnd,
    onDragMove,
    onDragStart,
    bubble = {},
    onWheel,
  }: {
    child?: Widget;
    onClick?: (e: MouseEvent) => void;
    onMouseUp?: (e: MouseEvent) => void;
    onMouseMove?: (e: MouseEvent) => void;
    onMouseDown?: (e: MouseEvent) => void;
    onMouseOver?: (e: MouseEvent) => void;
    onMouseEnter?: (e: MouseEvent) => void;
    onMouseLeave?: (e: MouseEvent) => void;
    onDragStart?: (e: MouseEvent) => void;
    onDragMove?: (e: MouseEvent) => void;
    onDragEnd?: (e: MouseEvent) => void;
    onWheel?: (e: WheelEvent) => void;
    cursor?: Cursor;
    key?: any;
    bubble?: Partial<Bubble>;
  }) {
    super({ child, key });
    this.onClick = onClick ?? emptyCallback;
    this.onMouseDown = onMouseDown ?? emptyCallback;
    this.onMouseMove = onMouseMove ?? emptyCallback;
    this.onMouseUp = onMouseUp ?? emptyCallback;
    this.onMouseOver = onMouseOver ?? emptyCallback;
    this.onMouseEnter = onMouseEnter ?? emptyCallback;
    this.onMouseLeave = onMouseLeave ?? emptyCallback;
    this.onDragStart = onDragStart ?? emptyCallback;
    this.onDragMove = onDragMove ?? emptyCallback;
    this.onDragEnd = onDragEnd ?? emptyCallback;
    this.onWheel = onWheel ?? emptyCallback;
    this.cursor = cursor ?? "pointer";
    this.bubble = {
      mousedown: false,
      mouseenter: false,
      mouseleave: false,
      mousemove: false,
      mouseover: false,
      mouseup: false,
      click: false,
      wheel: false,
      dragstart: false,
      dragend: false,
      drag: false,
      ...bubble,
    };
  }

  override createRenderObject(): RenderGestureDetector {
    return new RenderGestureDetector({
      onClick: this.onClick,
      onMouseDown: this.onMouseDown,
      onMouseMove: this.onMouseMove,
      onMouseUp: this.onMouseUp,
      onMouseOver: this.onMouseOver,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onDragStart: this.onDragStart,
      onDragMove: this.onDragMove,
      onDragEnd: this.onDragEnd,
      onWheel: this.onWheel,
      cursor: this.cursor,
      bubble: this.bubble,
    });
  }

  updateRenderObject(renderObject: RenderGestureDetector): void {
    renderObject.onClick = this.onClick;
    renderObject.onMouseOver = this.onMouseOver;
    renderObject.cursor = this.cursor;
    renderObject.onMouseEnter = this.onMouseEnter;
    renderObject.onMouseLeave = this.onMouseLeave;
    renderObject.onDragStart = this.onDragStart;
    renderObject.onDragMove = this.onDragMove;
    renderObject.onDragEnd = this.onDragEnd;
    renderObject.bubble = this.bubble;
    renderObject.onWheel = this.onWheel;
  }
}

class RenderGestureDetector extends SingleChildRenderObject {
  private id = createUniqueId();
  private _bubble: Bubble;
  get bubble(): Bubble {
    return this._bubble;
  }
  set bubble(prop: Bubble) {
    this._bubble = prop;
  }
  private _cursor: Cursor;
  get cursor(): Cursor {
    return this._cursor;
  }
  set cursor(prop: Cursor) {
    if (this._cursor === prop) return;
    this._cursor = prop;
    this.markNeedsPaint();
  }
  private _onClick: MouseEventCallback;
  get onClick() {
    return this._onClick;
  }
  set onClick(prop) {
    if (this.onClick === prop) return;
    this._onClick = prop;
  }
  private _onMouseDown: MouseEventCallback;
  get onMouseDown(): MouseEventCallback {
    return this._onMouseDown;
  }
  set onMouseDown(prop: MouseEventCallback) {
    if (this._onMouseDown === prop) return;
    this._onMouseDown = prop;
  }
  private _onMouseMove: MouseEventCallback;
  get onMouseMove(): MouseEventCallback {
    return this._onMouseMove;
  }
  set onMouseMove(prop: MouseEventCallback) {
    if (this._onMouseMove === prop) return;
    this._onMouseMove = prop;
  }
  private _onMouseUp: MouseEventCallback;
  get onMouseUp(): MouseEventCallback {
    return this._onMouseUp;
  }
  set onMouseUp(prop: MouseEventCallback) {
    if (this._onMouseUp === prop) return;
    this._onMouseUp = prop;
  }
  private _onMouseOver: MouseEventCallback;
  get onMouseOver(): MouseEventCallback {
    return this._onMouseOver;
  }
  set onMouseOver(prop: MouseEventCallback) {
    if (this._onMouseOver === prop) return;
    this._onMouseOver = prop;
  }
  private _onMouseEnter: MouseEventCallback;
  get onMouseEnter(): MouseEventCallback {
    return this._onMouseEnter;
  }
  set onMouseEnter(prop: MouseEventCallback) {
    if (this._onMouseEnter === prop) return;
    this._onMouseEnter = prop;
  }
  private _onMouseLeave: MouseEventCallback;
  get onMouseLeave(): MouseEventCallback {
    return this._onMouseLeave;
  }
  set onMouseLeave(prop: MouseEventCallback) {
    if (this._onMouseLeave === prop) return;
    this._onMouseLeave = prop;
  }
  private _onDragStart: MouseEventCallback;
  get onDragStart(): MouseEventCallback {
    return this._onDragStart;
  }
  set onDragStart(prop: MouseEventCallback) {
    if (this._onDragStart === prop) return;
    this._onDragStart = prop;
  }
  private _onDragMove: MouseEventCallback;
  get onDragMove(): MouseEventCallback {
    return this._onDragMove;
  }
  set onDragMove(prop: MouseEventCallback) {
    if (this._onDragMove === prop) return;
    this._onDragMove = prop;
  }
  private _onDragEnd: MouseEventCallback;
  get onDragEnd(): MouseEventCallback {
    return this._onDragEnd;
  }
  set onDragEnd(prop: MouseEventCallback) {
    if (this._onDragEnd === prop) return;
    this._onDragEnd = prop;
  }
  private _onWheel: (e: WheelEvent) => void;
  get onWheel(): (e: WheelEvent) => void {
    return this._onWheel;
  }
  set onWheel(prop: (e: WheelEvent) => void) {
    if (this._onWheel === prop) return;
    this._onWheel = prop;
  }

  constructor({
    onClick,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseOver,
    onMouseEnter,
    onMouseLeave,
    onDragEnd,
    onDragMove,
    onDragStart,
    cursor,
    bubble,
    onWheel,
  }: {
    onClick: MouseEventCallback;
    onMouseUp: MouseEventCallback;
    onMouseMove: MouseEventCallback;
    onMouseDown: MouseEventCallback;
    onMouseOver: MouseEventCallback;
    onMouseLeave: MouseEventCallback;
    onMouseEnter: MouseEventCallback;
    onDragStart: MouseEventCallback;
    onDragMove: MouseEventCallback;
    onDragEnd: MouseEventCallback;
    onWheel: (e: WheelEvent) => void;
    cursor: Cursor;
    bubble: Bubble;
  }) {
    super({ isPainter: true });
    this._onClick = onClick;
    this._onMouseDown = onMouseDown;
    this._onMouseMove = onMouseMove;
    this._onMouseUp = onMouseUp;
    this._onMouseOver = onMouseOver;
    this._onMouseEnter = onMouseEnter;
    this._onMouseLeave = onMouseLeave;
    this._onDragEnd = onDragEnd;
    this._onDragMove = onDragMove;
    this._onDragStart = onDragStart;
    this._onWheel = onWheel;
    this._cursor = cursor;
    this._bubble = bubble;
  }
  private get listeners(): Record<
    EventType,
    MouseEventCallback | ((e: WheelEvent) => void)
  > {
    const listeners = {
      click: this.onClick,
      mousedown: this.onMouseDown,
      mousemove: this.onMouseMove,
      mouseup: this.onMouseUp,
      mouseover: this.onMouseOver,
      mouseenter: this.onMouseEnter,
      mouseleave: this.onMouseLeave,
      wheel: this.onWheel,
      dragstart: this.onDragStart,
      drag: this.onDragMove,
      dragend: this.onDragEnd,
    };

    return TypedObject.keys(listeners).reduce((acc, key) => {
      acc[key] = (e: any) => {
        if (this.bubble[key]) {
          this.dispatchParent(e);
        }
        listeners[key]?.(e);
      };

      return acc;
    }, {} as Record<EventType, MouseEventCallback | ((e: WheelEvent) => void)>);
  }

  attach(ownerElement: RenderObjectElement): void {
    super.attach(ownerElement);
    this.addEventListeners();
  }

  dispose(context: PaintContext): void {
    this.removeEventListeners();
    backendRefCount--;
    if (backendRefCount === 0) {
      getSingletonDragBackend().teardown();
      globalDragBackend = null;
    }
    super.dispose(context);
  }

  private removeEventListeners() {
    getSingletonDragBackend().disconnectDragSource(this.id);
  }

  private addEventListeners() {
    const isBrowser = typeof window !== "undefined";
    if (!isBrowser) return;

    const {
      svgEls: { rect },
    } = this.resolveSvgEl();

    const dragBackend = getSingletonDragBackend();
    dragBackend.isSetup || dragBackend.setup();
    backendRefCount++;

    const { drag, dragend, dragstart, ...restListeners } = this.listeners;

    dragBackend.connectDragSource(this.id, rect, {
      onDragStart: dragstart,
      onDragMove: drag,
      onDragEnd: dragend,
    });

    TypedObject.entries(restListeners).forEach(([type, listener]) => {
      rect.addEventListener(type, (e: any) => {
        listener(e);
      });
    });
  }

  protected performPaint({ rect }: { rect: SVGRectElement }): void {
    rect.setAttribute("width", `${this.size.width}`);
    rect.setAttribute("height", `${this.size.height}`);
    rect.setAttribute("cursor", this.cursor);
    rect.setAttribute("pointer-events", "auto");
    rect.setAttribute("fill", "transparent");
  }

  createDefaultSvgEl({ createSvgEl }: PaintContext) {
    const rect = createSvgEl("rect");
    return {
      rect,
    };
  }

  dispatch(e: Event) {
    this.listeners[e.type]?.(e);
  }

  dispatchParent(e: Event) {
    let parent = this.parent;

    while (parent != null) {
      if (parent instanceof RenderGestureDetector) {
        parent.dispatch(e);
        break;
      }
      parent = parent.parent;
    }
  }
}

type MouseEventCallback = (event: MouseEvent) => void;

function emptyCallback(_arg?: any) {}

type SourceId = string;

class DragBackend {
  isSetup = false;
  private activeDragSourceId: string | null = null;
  get root(): Document {
    assert(
      typeof document !== "undefined",
      "DragBackend requires document. please use DragBackend in browser environment."
    );
    return document;
  }
  private dragStartListener: Record<SourceId, (e: MouseEvent) => void> = {};
  private dragMoveListener: Record<SourceId, (e: MouseEvent) => void> = {};
  private dragEndListener: Record<SourceId, (e: MouseEvent) => void> = {};

  constructor() {}

  setup() {
    if (typeof window === "undefined") return;
    if (this.isSetup) return;
    this.root.addEventListener("mousemove", this.handleMouseMoveTop);
    this.root.addEventListener("mouseup", this.handleMouseUpTop);
    this.isSetup = true;
  }

  teardown() {
    if (typeof window === "undefined") return;
    this.root.removeEventListener("mousemove", this.handleMouseMoveTop);
    this.root.removeEventListener("mouseup", this.handleMouseUpTop);
    this.isSetup = false;
  }

  private handleMouseMoveTop = (e: MouseEvent) => {
    if (this.activeDragSourceId == null) return;
    this.dragMoveListener[this.activeDragSourceId]?.(e);
  };

  private handleMouseUpTop = (e: MouseEvent) => {
    if (this.activeDragSourceId == null) return;
    this.dragEndListener[this.activeDragSourceId]?.(e);
    this.activeDragSourceId = null;
  };

  public connectDragSource(
    sourceId: string,
    node: SVGElement,
    {
      onDragStart = emptyCallback,
      onDragMove = emptyCallback,
      onDragEnd = emptyCallback,
    }: {
      onDragStart?: (e: MouseEvent) => void;
      onDragMove?: (e: MouseEvent) => void;
      onDragEnd?: (e: MouseEvent) => void;
    } = {}
  ) {
    this.dragStartListener[sourceId] = (e) => {
      this.activeDragSourceId = sourceId;
      onDragStart(e);
    };
    node.addEventListener(
      "mousedown",
      this.dragStartListener[sourceId].bind(this)
    );
    this.dragMoveListener[sourceId] = (e) => {
      onDragMove(e);
    };
    this.dragEndListener[sourceId] = (e) => {
      this.activeDragSourceId = null;
      onDragEnd(e);
    };
  }

  public disconnectDragSource(sourceId: string) {
    delete this.dragMoveListener[sourceId];
    delete this.dragEndListener[sourceId];
  }
}

export default BaseGestureDetector;
