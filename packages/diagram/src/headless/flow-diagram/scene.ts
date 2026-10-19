import {
  Constraints,
  HitTestEntry,
  type HitTestResult,
  MultiChildRenderObject,
  MultiChildRenderObjectWidget,
  Offset,
  type RenderObject,
  SingleChildRenderObject,
  SingleChildRenderObjectWidget,
  Size,
  type Widget,
} from "flitter-core";

export type MeasureEntry = { id: string; width: number; height: number };
/** Which point of the child sits on `(x, y)`: a preset or fractions of the child's size. */
export type ItemAnchor = "topLeft" | "center" | { x: number; y: number };

function anchorFractions(anchor: ItemAnchor): { x: number; y: number } {
  if (anchor === "topLeft") return { x: 0, y: 0 };
  if (anchor === "center") return { x: 0.5, y: 0.5 };
  return anchor;
}
export type ItemHitTest = (position: { x: number; y: number }, size: Size) => boolean;

/** Render objects a scene group knows how to position. */
interface PositionedChild extends RenderObject {
  sceneX: number;
  sceneY: number;
  sceneAnchor: ItemAnchor;
  collectMeasures(out: MeasureEntry[]): void;
}

function isPositionedChild(child: RenderObject): child is PositionedChild {
  return typeof (child as PositionedChild).collectMeasures === "function";
}

function layoutPositionedChildren(parent: RenderObject): void {
  for (const child of parent.children) {
    child.layout(new Constraints(), { parentUsesSize: true });
    if (!isPositionedChild(child)) {
      child.offset = Offset.zero();
      continue;
    }
    const size = child.size;
    const fraction = anchorFractions(child.sceneAnchor);
    child.offset = new Offset({
      x: child.sceneX - size.width * fraction.x,
      y: child.sceneY - size.height * fraction.y,
    });
  }
}

function collectChildMeasures(parent: RenderObject, out: MeasureEntry[]): void {
  for (const child of parent.children) {
    if (isPositionedChild(child)) child.collectMeasures(out);
  }
}

/** Hit test children only; the container's own bounds never gate pointer events. */
function hitTestUnbounded(render: RenderObject, result: HitTestResult, position: Offset): boolean {
  if (render.hitTestChildren(result, position)) {
    result.add(new HitTestEntry(render));
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Group: positions each child at absolute flow coordinates
// ---------------------------------------------------------------------------

/**
 * A set of scene children laid out at their own flow coordinates. Groups let
 * one widget (an edge, a node) own several independently positioned pieces
 * while the parent scene keeps a flat, keyed child list.
 */
export class FlowSceneGroup extends MultiChildRenderObjectWidget {
  constructor({ children, key }: { children: Widget[]; key?: unknown }) {
    super({ children, key });
  }

  override createRenderObject(): RenderFlowSceneGroup {
    return new RenderFlowSceneGroup();
  }

  override updateRenderObject(_renderObject: RenderFlowSceneGroup): void {}
}

export class RenderFlowSceneGroup extends MultiChildRenderObject implements PositionedChild {
  sceneX = 0;
  sceneY = 0;
  sceneAnchor: ItemAnchor = "topLeft";

  constructor() {
    super({ isPainter: false });
  }

  protected override preformLayout(): void {
    this.size = Size.zero;
    layoutPositionedChildren(this);
  }

  collectMeasures(out: MeasureEntry[]): void {
    collectChildMeasures(this, out);
  }

  override hitTest(result: HitTestResult, position: Offset): boolean {
    return hitTestUnbounded(this, result, position);
  }
}

// ---------------------------------------------------------------------------
// Scene: the infinite canvas inside the viewport transform
// ---------------------------------------------------------------------------

/**
 * Infinite canvas for the flow. Children are items/groups laid out at absolute
 * flow coordinates. The scene sizes itself to the viewport but hit tests
 * children anywhere, so nodes at negative coordinates stay interactive.
 * Measured node sizes are reported post-frame through `onMeasure`.
 */
export class FlowScene extends MultiChildRenderObjectWidget {
  onMeasure: (entries: MeasureEntry[]) => void;
  constructor({
    children,
    onMeasure,
    key,
  }: {
    children: Widget[];
    onMeasure: (entries: MeasureEntry[]) => void;
    key?: unknown;
  }) {
    super({ children, key });
    this.onMeasure = onMeasure;
  }

  override createRenderObject(): RenderFlowScene {
    return new RenderFlowScene({ onMeasure: this.onMeasure });
  }

  override updateRenderObject(renderObject: RenderFlowScene): void {
    renderObject.onMeasure = this.onMeasure;
  }
}

export class RenderFlowScene extends MultiChildRenderObject {
  onMeasure: (entries: MeasureEntry[]) => void;

  constructor({ onMeasure }: { onMeasure: (entries: MeasureEntry[]) => void }) {
    super({ isPainter: false });
    this.onMeasure = onMeasure;
  }

  protected override preformLayout(): void {
    const constraints = this.constraints;
    this.size = new Size({
      width: Number.isFinite(constraints.maxWidth) ? constraints.maxWidth : 0,
      height: Number.isFinite(constraints.maxHeight) ? constraints.maxHeight : 0,
    });
    layoutPositionedChildren(this);
    const measured: MeasureEntry[] = [];
    collectChildMeasures(this, measured);
    if (measured.length > 0) {
      const scheduler = this.ownerElement?.scheduler;
      const report = () => this.onMeasure(measured);
      if (scheduler) scheduler.addPostFrameCallbacks(report);
      else report();
    }
  }

  override hitTest(result: HitTestResult, position: Offset): boolean {
    return hitTestUnbounded(this, result, position);
  }
}

// ---------------------------------------------------------------------------
// Item: one child at a flow coordinate
// ---------------------------------------------------------------------------

/**
 * Positions one child inside a scene or group. `anchor: "center"` centres the
 * child on `(x, y)`; `measureId` reports the laid-out size back to the
 * controller; `hitTest` gates pointer events (used for edge strokes).
 */
export class FlowSceneItem extends SingleChildRenderObjectWidget {
  x: number;
  y: number;
  anchor: ItemAnchor;
  width?: number;
  height?: number;
  measureId?: string;
  interactive: boolean;
  hitTestFn?: ItemHitTest;

  constructor({
    child,
    x,
    y,
    anchor = "topLeft",
    width,
    height,
    measureId,
    interactive = true,
    hitTest,
    key,
  }: {
    child: Widget;
    x: number;
    y: number;
    anchor?: ItemAnchor;
    width?: number;
    height?: number;
    measureId?: string;
    interactive?: boolean;
    hitTest?: ItemHitTest;
    key?: unknown;
  }) {
    super({ child, key });
    this.x = x;
    this.y = y;
    this.anchor = anchor;
    this.width = width;
    this.height = height;
    this.measureId = measureId;
    this.interactive = interactive;
    this.hitTestFn = hitTest;
  }

  override createRenderObject(): RenderFlowSceneItem {
    return new RenderFlowSceneItem(this);
  }

  override updateRenderObject(renderObject: RenderFlowSceneItem): void {
    renderObject.update(this);
  }
}

export class RenderFlowSceneItem extends SingleChildRenderObject implements PositionedChild {
  sceneX: number;
  sceneY: number;
  sceneAnchor: ItemAnchor;
  width?: number;
  height?: number;
  measureId?: string;
  interactive: boolean;
  hitTestFn?: ItemHitTest;

  constructor(widget: FlowSceneItem) {
    super({ isPainter: false });
    this.sceneX = widget.x;
    this.sceneY = widget.y;
    this.sceneAnchor = widget.anchor;
    this.width = widget.width;
    this.height = widget.height;
    this.measureId = widget.measureId;
    this.interactive = widget.interactive;
    this.hitTestFn = widget.hitTestFn;
  }

  update(widget: FlowSceneItem): void {
    const positionChanged =
      this.sceneX !== widget.x ||
      this.sceneY !== widget.y ||
      this.sceneAnchor !== widget.anchor ||
      this.width !== widget.width ||
      this.height !== widget.height ||
      this.measureId !== widget.measureId;
    this.sceneX = widget.x;
    this.sceneY = widget.y;
    this.sceneAnchor = widget.anchor;
    this.width = widget.width;
    this.height = widget.height;
    this.measureId = widget.measureId;
    this.interactive = widget.interactive;
    this.hitTestFn = widget.hitTestFn;
    if (positionChanged) this.markNeedsParentLayout();
  }

  protected override preformLayout(): void {
    const child = this.child;
    if (child == null) {
      this.size = Size.zero;
      return;
    }
    const constraints =
      this.width != null || this.height != null
        ? Constraints.tightFor({ width: this.width, height: this.height })
        : new Constraints();
    child.layout(constraints, { parentUsesSize: true });
    child.offset = Offset.zero();
    this.size = child.size;
  }

  collectMeasures(out: MeasureEntry[]): void {
    if (this.measureId != null) {
      out.push({ id: this.measureId, width: this.size.width, height: this.size.height });
    }
  }

  override hitTest(result: HitTestResult, position: Offset): boolean {
    if (!this.interactive) return false;
    if (this.hitTestFn && !this.hitTestFn(position, this.size)) return false;
    return hitTestUnbounded(this, result, position);
  }
}

// ---------------------------------------------------------------------------
// Node item: a body plus attachments placed relative to the body's size
// ---------------------------------------------------------------------------

/** Where to put an attachment (handle, resize control) once the body is laid out. */
export type NodeAttachmentPlacement = {
  /** Constraints for the attachment given the body size; loose by default. */
  constraints?: (body: Size) => Constraints;
  /** Top-left of the attachment relative to the body's top-left. */
  offset: (body: Size, attachment: Size) => { x: number; y: number };
};

/**
 * A node body at `(x, y)` with attachments (handles, resize controls) placed
 * relative to the body's laid-out size, so they are positioned in the same
 * frame the body is measured. Attachments are hit tested before the body.
 */
export class FlowNodeItem extends MultiChildRenderObjectWidget {
  x: number;
  y: number;
  width?: number;
  height?: number;
  measureId: string;
  placements: NodeAttachmentPlacement[];

  constructor({
    body,
    attachments,
    placements,
    x,
    y,
    width,
    height,
    measureId,
    key,
  }: {
    body: Widget;
    attachments: Widget[];
    placements: NodeAttachmentPlacement[];
    x: number;
    y: number;
    width?: number;
    height?: number;
    measureId: string;
    key?: unknown;
  }) {
    super({ children: [body, ...attachments], key });
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.measureId = measureId;
    this.placements = placements;
  }

  override createRenderObject(): RenderFlowNodeItem {
    return new RenderFlowNodeItem(this);
  }

  override updateRenderObject(renderObject: RenderFlowNodeItem): void {
    renderObject.update(this);
  }
}

export class RenderFlowNodeItem extends MultiChildRenderObject implements PositionedChild {
  sceneX: number;
  sceneY: number;
  readonly sceneAnchor: ItemAnchor = "topLeft";
  width?: number;
  height?: number;
  measureId: string;
  placements: NodeAttachmentPlacement[];

  constructor(widget: FlowNodeItem) {
    super({ isPainter: false });
    this.sceneX = widget.x;
    this.sceneY = widget.y;
    this.width = widget.width;
    this.height = widget.height;
    this.measureId = widget.measureId;
    this.placements = widget.placements;
  }

  update(widget: FlowNodeItem): void {
    const positionChanged = this.sceneX !== widget.x || this.sceneY !== widget.y;
    const layoutChanged =
      this.width !== widget.width || this.height !== widget.height || this.placements !== widget.placements;
    this.sceneX = widget.x;
    this.sceneY = widget.y;
    this.width = widget.width;
    this.height = widget.height;
    this.measureId = widget.measureId;
    this.placements = widget.placements;
    if (positionChanged) this.markNeedsParentLayout();
    else if (layoutChanged) this.markNeedsLayout();
  }

  protected override preformLayout(): void {
    const children = this.children;
    const body = children[0];
    if (body == null) {
      this.size = Size.zero;
      return;
    }
    const bodyConstraints =
      this.width != null || this.height != null
        ? Constraints.tightFor({ width: this.width, height: this.height })
        : new Constraints();
    body.layout(bodyConstraints, { parentUsesSize: true });
    body.offset = Offset.zero();
    this.size = body.size;
    for (let i = 1; i < children.length; i++) {
      const attachment = children[i];
      const placement = this.placements[i - 1];
      const constraints = placement?.constraints?.(this.size) ?? new Constraints();
      attachment.layout(constraints, { parentUsesSize: true });
      const offset = placement ? placement.offset(this.size, attachment.size) : { x: 0, y: 0 };
      attachment.offset = new Offset(offset);
    }
  }

  collectMeasures(out: MeasureEntry[]): void {
    out.push({ id: this.measureId, width: this.size.width, height: this.size.height });
  }

  override hitTest(result: HitTestResult, position: Offset): boolean {
    return hitTestUnbounded(this, result, position);
  }
}
