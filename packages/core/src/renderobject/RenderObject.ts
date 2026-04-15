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
  needsCompositedLayerUpdate = false;
  needsLayout = true;
  needsPaintTransformUpdate = true;
  depth = 0;
  private relayoutBoundary: RenderObject | null = null;

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
        : this.parent?.relayoutBoundary ?? null;

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
    this.markNeedsPaintTransformUpdate();
    this.markNeedsUpdateZOrder();
  }

  detach() {
    this.parent = undefined;
    this.relayoutBoundary = null;
  }

  dispose() {
    this.renderOwner.disposeRenderObject(this);
  }

  getIntrinsicWidth(_height: number) {
    return 0;
  }

  getIntrinsicHeight(_width: number) {
    return 0;
  }

  protected get sizedByParent(): boolean {
    return false;
  }

  getDryLayout(constraint: Constraints) {
    const normalizedConstraints = constraint.normalize();
    const cacheKey = RenderObject.getDryLayoutCacheKey(normalizedConstraints);
    const cachedSize = this.dryLayoutCache.get(cacheKey);
    if (cachedSize != null) {
      return cachedSize;
    }

    const size = this.computeDryLayout(normalizedConstraints);
    this.dryLayoutCache.set(cacheKey, size);
    return size;
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
    this.needsLayout = true;
    this.parent?.markNeedsLayout();
  }

  protected markNeedsLayout() {
    if (this.needsLayout) return;

    this.needsLayout = true;
    const hadCachedDryLayoutResult = this.dryLayoutCache.size > 0;
    this.dryLayoutCache.clear();

    if (hadCachedDryLayoutResult && this.parent != null) {
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

  markNeedsPaint() {
    this.renderOwner.markNeedsPaint(this);
  }

  markNeedsCompositedLayerUpdate() {
    this.renderOwner.markNeedsCompositedLayerUpdate(this);
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
    return [
      constraints.minWidth,
      constraints.maxWidth,
      constraints.minHeight,
      constraints.maxHeight,
    ].join(":");
  }
}

export default RenderObject;
