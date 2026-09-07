import { Size, Offset, Constraints, Matrix4 } from "../type";
import type { RenderObjectElement } from "../element";
import { CanvasPainter, type RenderPipeline, SvgPainter } from "../framework";
import { NotImplementedError } from "../exception";
import type { RenderObjectVisitor } from "./RenderObjectVisitor";
import { HitTestEntry, HitTestResult } from "../hit-test/HitTestResult";

/*
  It does more things than flutters' RenderObject 
  Actually, It is more like RenderShiftedBox
*/
export class RenderObject {
  readonly runtimeType = this.constructor.name;
  readonly isPainter: boolean;
  ownerElement!: RenderObjectElement;
  renderOwner!: RenderPipeline;
  paintTransform: Matrix4 = Matrix4.Constants.identity;
  parent?: RenderObject;
  needsPaint = true;
  needsCompositing = false;
  needsCompositingBitsUpdate = false;
  needsCompositedLayerUpdate = false;
  needsLayout = true;
  needsPaintTransformUpdate = true;
  depth = 0;
  private relayoutBoundary: RenderObject | null = null;
  // Numeric-keyed so a lookup doesn't allocate a transient string key every call.
  private intrinsicWidthCache = new Map<number, number>();
  private intrinsicHeightCache = new Map<number, number>();

  /**
   * zOrder is used to order the render objects in the z axis
   * Also related to event bubbling on HitTestDispatcher
   */
  #zOrder!: number;
  get zOrder() {
    return this.#zOrder;
  }

  /**
   * The minimum zOrder among all painter descendants (or own zOrder if painter).
   * Used by canvas renderer to sort children for z-ordered tree walk painting.
   */
  minDescendantZOrder: number = 0;
  /** Computed with z-order, never guessed from the current widget types. */
  paintOrderIsTreeOrder = true;
  updateZOrder(value: number) {
    this.#zOrder = value;
    if (this.#svgPainter != null) {
      this.#svgPainter.didDomOrderChange();
    }
  }
  #svgPainter!: SvgPainter;
  get svgPainter() {
    if (this.#svgPainter == null) {
      this.#svgPainter = this.createSvgPainter();
    }
    return this.#svgPainter;
  }
  #canvasPainter!: CanvasPainter;
  get canvasPainter() {
    if (this.#canvasPainter == null) {
      this.#canvasPainter = this.createCanvasPainter();
    }
    return this.#canvasPainter;
  }

  /**
   * You should override this method if this renderer context is on SVG
   */
  protected createSvgPainter() {
    return new SvgPainter(this);
  }
  /**
   * You should override this method if this renderer context is on Canvas
   */
  protected createCanvasPainter() {
    return new CanvasPainter(this);
  }

  constructor({ isPainter }: { isPainter: boolean }) {
    this.isPainter = isPainter;
  }
  type = this.constructor.name;
  private _childrenCache: RenderObject[] | null = null;
  private _childrenCacheEpoch = -1;
  get children(): RenderObject[] {
    const owner = this.renderOwner;
    if (owner == null) {
      return this.ownerElement.children.map(child => child.renderObject);
    }
    if (
      this._childrenCache !== null &&
      this._childrenCacheEpoch === owner.structureEpoch
    ) {
      return this._childrenCache;
    }
    const result = this.ownerElement.children.map(child => child.renderObject);
    this._childrenCache = result;
    this._childrenCacheEpoch = owner.structureEpoch;
    return result;
  }
  constraints: Constraints = Constraints.Constants.default;
  private _offset: Offset = Offset.Constants.zero;
  get offset() {
    return this._offset;
  }
  set offset(value: Offset) {
    if (this.offset.x === value.x && this.offset.y === value.y) return;
    this._offset = value;
    this.markNeedsPaintTransformUpdate();
  }
  private _size: Size = Size.zero;
  get size() {
    return this._size;
  }
  set size(value) {
    if (this.size.height === value.height && this.size.width === value.width) {
      return;
    }
    this._size = value;
  }
  parentUsesSize = false;
  private dryLayoutCache = new Map<string, Size>();

  layout(
    constraint: Constraints,
    { parentUsesSize = false }: { parentUsesSize?: boolean } = {},
  ) {
    const normalizedConstraints = constraint.normalize();
    this.parentUsesSize = parentUsesSize;
    this.relayoutBoundary =
      !parentUsesSize ||
      this.sizedByParent ||
      normalizedConstraints.isTight ||
      this.parent == null
        ? this
        : (this.parent?.relayoutBoundary ?? null);

    if (this.constraints.equals(normalizedConstraints) && !this.needsLayout) {
      return;
    }

    this.constraints = normalizedConstraints;
    if (this.sizedByParent) {
      this.performResize();
    }
    this.preformLayout();
    this.needsLayout = false;
    this.markNeedsPaint();
  }

  attach(ownerElement: RenderObjectElement) {
    this.ownerElement = ownerElement;
    this.depth = ownerElement.depth;
    this.relayoutBoundary = null;
    this.markNeedsCompositingBitsUpdate();
    this.markNeedsPaintTransformUpdate();
    this.markNeedsUpdateZOrder();
  }

  detach() {
    this.renderOwner?.bumpStructureEpoch();
    this.parent = undefined;
    this.relayoutBoundary = null;
  }

  dispose() {
    this.renderOwner.disposeRenderObject(this);
  }

  getIntrinsicWidth(height: number) {
    const cached = this.intrinsicWidthCache.get(height);
    if (cached != null) {
      return cached;
    }

    const result = this.computeIntrinsicWidth(height);
    this.intrinsicWidthCache.set(height, result);
    return result;
  }

  getIntrinsicHeight(width: number) {
    const cached = this.intrinsicHeightCache.get(width);
    if (cached != null) {
      return cached;
    }

    const result = this.computeIntrinsicHeight(width);
    this.intrinsicHeightCache.set(width, result);
    return result;
  }

  protected get sizedByParent(): boolean {
    return false;
  }

  protected get alwaysNeedsCompositing(): boolean {
    return false;
  }

  getDryLayout(constraint: Constraints) {
    const normalizedConstraints = constraint.normalize();
    if (!this.needsLayout && this.constraints.equals(normalizedConstraints)) {
      return this.size;
    }

    const cacheKey = RenderObject.getDryLayoutCacheKey(normalizedConstraints);
    const cachedSize = this.dryLayoutCache.get(cacheKey);
    if (cachedSize != null) {
      return cachedSize;
    }

    const size = normalizedConstraints.constrain(
      this.computeDryLayout(normalizedConstraints),
    );
    this.dryLayoutCache.set(cacheKey, size);
    return size;
  }

  protected computeIntrinsicWidth(_height: number) {
    return 0;
  }

  protected computeIntrinsicHeight(_width: number) {
    return 0;
  }

  protected computeDryLayout(constraints: Constraints): Size {
    return constraints.constrain(Size.zero);
  }

  protected performResize(): void {
    this.size = this.computeDryLayout(this.constraints);
  }
  /*
   * Do not call this method directly. instead call layout
   */
  protected preformLayout(): void {
    throw new NotImplementedError("performLayout");
  }

  layoutWithoutResize() {
    this.layout(this.constraints, { parentUsesSize: this.parentUsesSize });
  }

  markNeedsLayoutForSizedByParentChange() {
    this.markNeedsLayout();
    if (this.parent != null) {
      this.markNeedsParentLayout();
    }
  }

  markNeedsParentLayout() {
    this.clearLayoutCaches();
    this.needsLayout = true;
    this.parent?.markNeedsLayout();
  }

  protected markNeedsLayout() {
    // Dry/intrinsic queries may repopulate caches while this node is already
    // dirty (including before its first layout). Invalidate before the guard.
    const hadCachedLayoutResult = this.clearLayoutCaches();
    if (this.needsLayout) {
      if (hadCachedLayoutResult) this.parent?.markNeedsLayout();
      return;
    }

    this.needsLayout = true;

    if (hadCachedLayoutResult && this.parent != null) {
      this.markNeedsParentLayout();
      return;
    }

    if (this.relayoutBoundary === this || this.parent == null) {
      this.renderOwner.needsLayoutRenderObjects.push(this);
      this.renderOwner.requestVisualUpdate();
      return;
    }

    if (this.parent != null) {
      this.markNeedsParentLayout();
    }
  }

  private clearLayoutCaches(): boolean {
    const hadCachedLayoutResult =
      this.intrinsicWidthCache.size > 0 ||
      this.intrinsicHeightCache.size > 0 ||
      this.dryLayoutCache.size > 0;
    this.intrinsicWidthCache.clear();
    this.intrinsicHeightCache.clear();
    this.dryLayoutCache.clear();
    return hadCachedLayoutResult;
  }

  /** Reconciliation changed the child identities or their order. */
  markNeedsChildrenUpdate() {
    this.renderOwner.bumpStructureEpoch();
    this.markNeedsLayout();
    this.markNeedsUpdateZOrder();
  }

  markNeedsPaint() {
    this.renderOwner.markNeedsPaint(this);
  }

  markNeedsCompositedLayerUpdate() {
    this.renderOwner.markNeedsCompositedLayerUpdate(this);
  }

  markNeedsCompositingBitsUpdate() {
    if (this.needsCompositingBitsUpdate) return;
    this.needsCompositingBitsUpdate = true;

    const parent = this.parent;
    if (parent != null) {
      if (parent.needsCompositingBitsUpdate) {
        return;
      }

      if (
        !this.canvasPainter.isRepaintBoundary &&
        !parent.canvasPainter.isRepaintBoundary
      ) {
        parent.markNeedsCompositingBitsUpdate();
        return;
      }
    }

    this.renderOwner.markNeedsCompositingBitsUpdate(this);
  }

  updateCompositingBits() {
    if (!this.needsCompositingBitsUpdate) return;

    const oldNeedsCompositing = this.needsCompositing;
    let nextNeedsCompositing =
      this.alwaysNeedsCompositing || this.canvasPainter.isRepaintBoundary;

    this.visitChildren(child => {
      child.updateCompositingBits();
      if (child.needsCompositing) {
        nextNeedsCompositing = true;
      }
    });

    this.needsCompositing = nextNeedsCompositing;
    this.needsCompositingBitsUpdate = false;

    if (oldNeedsCompositing !== nextNeedsCompositing) {
      this.markNeedsPaint();
    }
  }

  localToGlobal(additionalOffset: Offset = Offset.Constants.zero) {
    const transform = this.#computePaintTransform();
    return new Offset({
      x: transform.storage[12] + additionalOffset.x,
      y: transform.storage[13] + additionalOffset.y,
    });
  }

  /**
   * Lazily reproduces the absolute paint transform of this node by walking from
   * the root down — translate by each node's offset, then apply that node's
   * paint transform for its descendants. Mirrors Flutter's getTransformTo: the
   * transform is computed on demand (localToGlobal has a single caller) instead
   * of being cached on every node by a per-frame tree walk. The SVG renderer
   * still maintains paintTransform eagerly for DOM element placement.
   */
  #computePaintTransform(): Matrix4 {
    const chain: RenderObject[] = [];
    let node: RenderObject | undefined = this;
    while (node != null) {
      chain.push(node);
      node = node.parent;
    }
    let parentTransform: Matrix4 = Matrix4.Constants.identity;
    let transform: Matrix4 = Matrix4.Constants.identity;
    for (let i = chain.length - 1; i >= 0; i--) {
      const current = chain[i];
      transform = parentTransform.translated(
        current.offset.x,
        current.offset.y,
      );
      parentTransform = current.applyPaintTransform(transform);
    }
    return transform;
  }

  visitChildren(callback: (child: RenderObject) => void) {
    this.children.forEach(callback);
  }

  protected markNeedsPaintTransformUpdate() {
    this.renderOwner.markNeedsPaintTransformUpdate(this);
  }

  applyPaintTransform(transform: Matrix4): Matrix4 {
    return transform;
  }
  accept(visitor: RenderObjectVisitor): void {
    visitor.visit(this);
  }
  markNeedsUpdateZOrder() {
    this.renderOwner.notifyZOrderChanged();
  }

  updatePaintTransform(
    parentPaintTransform: Matrix4 = this.parent?.paintTransform ??
      Matrix4.Constants.identity,
  ) {
    const oldTransform = this.paintTransform;
    const newTransform = parentPaintTransform.translated(
      this.offset.x,
      this.offset.y,
    );
    if (!this.needsPaintTransformUpdate && newTransform.equals(oldTransform)) {
      return;
    }
    this.needsPaintTransformUpdate = false;
    this.paintTransform = newTransform;
    this.#didChangePaintTransform();
    const childPaintTransform = this.applyPaintTransform(newTransform);
    this.visitChildren(child => {
      child.updatePaintTransform(childPaintTransform);
    });
  }

  hitTest(result: HitTestResult, position: Offset): boolean {
    if (this.size.contains(position)) {
      if (
        this.hitTestChildren(result, position) ||
        this.hitTestSelf(position)
      ) {
        result.add(new HitTestEntry(this));
        return true;
      }
    }
    return false;
  }

  hitTestChildren(result: HitTestResult, position: Offset): boolean {
    const children = this.children;
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      const childOffset = child.offset;
      const childPosition = new Offset({
        x: position.x - childOffset.x,
        y: position.y - childOffset.y,
      });
      if (child.hitTest(result, childPosition)) return true;
    }
    return false;
  }

  hitTestSelf(_position: Offset): boolean {
    return false;
  }

  #didChangePaintTransform(): void {
    this.renderOwner.didChangePaintTransform(this);
  }

  private static getDryLayoutCacheKey(constraints: Constraints) {
    // Template literal instead of array.join avoids the intermediate array
    // allocation; the four numbers separated by ":" stay collision-free.
    return `${constraints.minWidth}:${constraints.maxWidth}:${constraints.minHeight}:${constraints.maxHeight}`;
  }
}

export default RenderObject;
