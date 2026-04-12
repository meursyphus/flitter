import { Size, Offset, Constraints, Matrix4 } from "../type";
import type { RenderObjectElement } from "../element";
import { CanvasPainter, type RenderPipeline, SvgPainter } from "../framework";
import { NotImplementedError } from "../exception";
import type { RenderObjectVisitor } from "./RenderObjectVisitor";
import { HitTestEntry, type HitTestResult } from "../hit-test/HitTestResult";

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
  needsCompositedLayerUpdate = false;
  needsLayout = true;
  needsPaintTransformUpdate = true;
  depth = 0;
  private _relayoutBoundary: RenderObject | null = null;
  private _intrinsicCache = new Map<string, number>();
  private _dryLayoutCache = new Map<string, Size>();

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
  get children(): RenderObject[] {
    return this.ownerElement.children.map(child => child.renderObject);
  }
  constraints: Constraints = Constraints.loose(Size.maximum());
  private _offset: Offset = Offset.zero();
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
  get sizedByParent(): boolean {
    return false;
  }

  layout(
    constraint: Constraints,
    { parentUsesSize = false }: { parentUsesSize?: boolean } = {},
  ) {
    const normalizedConstraints = constraint.normalize();
    this.parentUsesSize = parentUsesSize;
    this._relayoutBoundary =
      !parentUsesSize ||
      this.sizedByParent ||
      normalizedConstraints.isTight ||
      this.parent == null
        ? this
        : this.parent?._relayoutBoundary ?? null;

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
    this._relayoutBoundary = null;
    this.markNeedsPaintTransformUpdate();
    this.markNeedsUpdateZOrder();
  }

  detach() {
    if (this.isPainter) {
      this.svgPainter.detach();
    }
    this.canvasPainter.detach();
    this.parent = undefined;
    this._relayoutBoundary = null;
  }

  dispose() {
    this.renderOwner.disposeRenderObject(this);
  }

  getIntrinsicWidth(height: number) {
    const cacheKey = `width:${height}`;
    const cached = this._intrinsicCache.get(cacheKey);
    if (cached != null) {
      return cached;
    }

    const result = this.computeIntrinsicWidth(height);
    this._intrinsicCache.set(cacheKey, result);
    return result;
  }

  getIntrinsicHeight(width: number) {
    const cacheKey = `height:${width}`;
    const cached = this._intrinsicCache.get(cacheKey);
    if (cached != null) {
      return cached;
    }

    const result = this.computeIntrinsicHeight(width);
    this._intrinsicCache.set(cacheKey, result);
    return result;
  }

  getDryLayout(constraints: Constraints): Size {
    const normalizedConstraints = constraints.normalize();
    if (!this.needsLayout && this.constraints.equals(normalizedConstraints)) {
      return this.size;
    }

    const cacheKey = [
      normalizedConstraints.minWidth,
      normalizedConstraints.maxWidth,
      normalizedConstraints.minHeight,
      normalizedConstraints.maxHeight,
    ].join(":");
    const cached = this._dryLayoutCache.get(cacheKey);
    if (cached != null) {
      return cached;
    }

    const result = normalizedConstraints.constrain(
      this.computeDryLayout(normalizedConstraints),
    );
    this._dryLayoutCache.set(cacheKey, result);
    return result;
  }

  protected computeIntrinsicWidth(_height: number) {
    return 0;
  }

  protected computeIntrinsicHeight(_width: number) {
    return 0;
  }

  protected computeDryLayout(constraints: Constraints): Size {
    return constraints.constrain(this.size);
  }
  /*
   * Do not call this method directly. instead call layout
   */
  protected preformLayout(): void {
    throw new NotImplementedError("performLayout");
  }

  protected performResize(): void {}

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
    this.needsLayout = true;
    this.parent?.markNeedsLayout();
  }

  protected markNeedsLayout() {
    if (this.needsLayout) {
      return;
    }

    this.needsLayout = true;
    const hadCachedLayoutResult =
      this._intrinsicCache.size > 0 || this._dryLayoutCache.size > 0;
    if (hadCachedLayoutResult) {
      this._intrinsicCache.clear();
      this._dryLayoutCache.clear();
    }

    if (hadCachedLayoutResult && this.parent != null) {
      this.markNeedsParentLayout();
      return;
    }

    if (this._relayoutBoundary === this || this.parent == null) {
      this.renderOwner.needsLayoutRenderObjects.push(this);
      this.renderOwner.requestVisualUpdate();
      return;
    }

    if (this.parent != null) {
      this.markNeedsParentLayout();
    }
  }

  markNeedsPaint() {
    this.renderOwner.markNeedsPaint(this);
  }

  localToGlobal(additionalOffset: Offset = Offset.Constants.zero) {
    return new Offset({
      x: this.paintTransform.storage[12] + additionalOffset.x,
      y: this.paintTransform.storage[13] + additionalOffset.y,
    });
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
    {
      skipPaintInvalidation = false,
    }: {
      skipPaintInvalidation?: boolean;
    } = {},
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
    if (!skipPaintInvalidation) {
      this.#didChangePaintTransform();
    }
    const childPaintTransform = this.applyPaintTransform(newTransform);
    this.visitChildren(child => {
      child.updatePaintTransform(childPaintTransform, {
        skipPaintInvalidation: this.canvasPainter.isRepaintBoundary,
      });
    });
  }

  hitTest(result: HitTestResult, position: Offset): boolean {
    if (this.size.contains(position)) {
      if (this.hitTestChildren(result, position) || this.hitTestSelf(position)) {
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
}

export default RenderObject;
