import { Size, Offset, Constraints, Matrix4 } from "../type";
import type { PaintContext } from "../utils/type";
import { type RenderObjectVisitor } from "./RenderObjectVisitor";
import type { RenderObjectElement } from "../element";
import type { RenderOwner } from "../scheduler";
import { assert } from "../utils";
import { NotImplementedError } from "../exception";

/*
  It does more things than flutters' RenderObject 
  Actually, It is more like RenderShiftedBox
*/
export class RenderObject {
  readonly runtimeType = this.constructor.name;
  readonly isPainter: boolean;
  ownerElement!: RenderObjectElement;
  renderOwner!: RenderOwner;
  parent?: RenderObject;
  needsPaint = true;
  needsLayout = true;
  clipId?: string = undefined;
  matrix: Matrix4 = Matrix4.Constants.identity;
  opacity = 1;
  depth = 0;

  #domNode!: SVGElement;
  /**
   * domOrder is used to rearrange dom order
   * it will be set by RenderOwner before flushPaint
   */
  #domOrder!: number;
  get domOrder() {
    assert(this.#domOrder != null, "domOrder is not initialized");
    return this.#domOrder;
  }
  set domOrder(newOrder: number) {
    if (newOrder === this.#domOrder) return;
    this.#domOrder = newOrder;
    this.didDomOrderChange();
  }
  #domOrderChanged = false;
  didDomOrderChange() {
    this.#domOrderChanged = true;
  }
  get domNode() {
    assert(this.#domNode != null, "domNode is not initialized");
    return this.#domNode;
  }
  protected set domNode(el: SVGElement) {
    this.#domNode = el;
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

  layout(
    constraint: Constraints,
    { parentUsesSize = true }: { parentUsesSize?: boolean } = {},
  ) {
    const normalizedConstraints = constraint.normalize();
    if (this.constraints.equals(normalizedConstraints) && !this.needsLayout) {
      return;
    }
    this.constraints = normalizedConstraints;
    this.parentUsesSize = parentUsesSize;
    this.preformLayout();
    this.needsLayout = false;
    this.markNeedsPaint();
  }

  paint(
    context: PaintContext,
    clipId?: string,
    matrix4: Matrix4 = Matrix4.Constants.identity,
    opacity: number = 1,
  ) {
    const translatedMatrix4 = matrix4.translated(this.offset.x, this.offset.y);
    const clipIdChanged = this.clipId !== clipId;
    const opacityChanged = this.opacity !== opacity;
    const matrixChanged = !this.matrix.equals(translatedMatrix4);
    if (
      !clipIdChanged &&
      !opacityChanged &&
      !matrixChanged &&
      !this.needsPaint
    ) {
      return;
    }

    this.matrix = translatedMatrix4;
    this.clipId = clipId;
    this.opacity = opacity;

    if (this.isPainter) {
      const { svgEls, container } = this.resolveSvgEl();
      if (clipId && clipIdChanged) {
        container.setAttribute("clip-path", `url(#${clipId})`);
      }
      if (opacityChanged) {
        container.setAttribute("opacity", `${opacity}`);
      }
      if (matrixChanged) {
        Object.values(svgEls).forEach(el =>
          this.setSvgTransform(el, this.matrix),
        );
      }
      if (this.needsPaint) {
        this.performPaint(svgEls, context);
      }
    }
    this.needsPaint = false;
    const childClipId = this.getChildClipId(clipId);
    const childMatrix4 = this.getChildMatrix4(this.matrix);
    const childOpacity = this.getChildOpacity(opacity);
    this.paintChildren(context, {
      clipId: childClipId,
      matrix4: childMatrix4,
      opacity: childOpacity,
    });
  }

  paintChildren(
    context: PaintContext,
    {
      clipId,
      matrix4,
      opacity,
    }: {
      clipId?: string;
      matrix4: Matrix4;
      opacity: number;
    },
  ) {
    this.children.forEach(child =>
      child.paint(context, clipId, matrix4, opacity),
    );
  }

  protected getChildMatrix4(parentMatrix: Matrix4): Matrix4 {
    return parentMatrix;
  }

  protected getChildOpacity(parentOpacity: number): number {
    return parentOpacity;
  }

  private setSvgTransform(el: SVGElement, matrix: Matrix4) {
    el.style.transform = `matrix3d(${matrix.storage.join(",")})`;
  }

  attach(ownerElement: RenderObjectElement) {
    this.ownerElement = ownerElement;
    this.depth = ownerElement.depth;
    if (this.isPainter) {
      this.mountSvgEl(this.renderOwner.renderContext.paintContext);
      this.renderOwner.didDomOrderChange();
    }
  }

  dispose(_: PaintContext) {
    if (this.isPainter) {
      this.#domNode.remove();
      this.renderOwner.didDomOrderChange();
    }
  }

  getIntrinsicWidth(_height: number) {
    return 0;
  }

  getIntrinsicHeight(_width: number) {
    return 0;
  }

  mountSvgEl(context: PaintContext) {
    const { appendSvgEl } = context;

    const svgEls = this.createDefaultSvgEl(context);
    const entries = Object.entries(svgEls);
    entries.forEach(([name, value]) => {
      value.setAttribute("data-render-name", name);
    });
    const svgG = context.createSvgEl("g");
    appendSvgEl(svgG);
    svgG.setAttribute("data-render-type", this.type);
    entries.forEach(([_, value]) => {
      svgG.appendChild(value);
    });

    svgG.setAttribute("pointer-events", "none");
    this.#domNode = svgG;
  }

  protected resolveSvgEl(): {
    svgEls: Record<string, SVGElement>;
    container: SVGElement;
  } {
    const container = this.domNode;
    const svgEls: Record<string, SVGElement> = {};
    for (const element of container.children) {
      const child = element;
      const name = child.getAttribute("data-render-name")!;
      svgEls[name] = child as unknown as SVGElement;
    }

    return { svgEls, container };
  }

  rearrangeDomOrder() {
    if (!this.#domOrderChanged) return;

    this.isPainter &&
      this.renderOwner.renderContext.paintContext.insertSvgEl(
        this.domNode,
        this.domOrder,
      );
    this.#domOrderChanged = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected createDefaultSvgEl(paintContext: PaintContext): {
    [key: string]: SVGElement;
  } {
    throw new NotImplementedError("createDefaultSvgEl");
  }

  /*
   * Do not call this method directly. instead call layout
   */
  protected preformLayout(): void {
    throw new NotImplementedError("performLayout");
  }

  /*
   * Do not call this method directly. instead call paint
   */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  protected performPaint(
    _svgEls: { [key: string]: SVGElement },
    _context: PaintContext,
  ): void {
    //
  }

  protected getChildClipId(parentClipId?: string) {
    return parentClipId;
  }

  layoutWithoutResize() {
    this.layout(this.constraints, { parentUsesSize: this.parentUsesSize });
  }

  paintWithoutLayout(context: PaintContext) {
    this.paint(context, this.clipId, this.matrix, this.opacity);
  }

  markNeedsParentLayout() {
    this.parent?.markNeedsLayout();
  }

  protected markNeedsLayout() {
    this.needsLayout = true;
    if (this.parentUsesSize && this.parent != null) {
      this.markNeedsParentLayout();
    } else {
      this.renderOwner.needsLayoutRenderObjects.push(this);
      this.renderOwner.requestVisualUpdate();
    }
  }

  protected markNeedsPaint() {
    this.needsPaint = true;
    this.renderOwner.needsPaintRenderObjects.push(this);
  }

  protected didChangeDomOrder() {
    this.renderOwner.didDomOrderChange();
  }

  localToGlobal(additionalOffset: Offset = Offset.Constants.zero) {
    return new Offset({
      x: this.matrix.storage[12] + additionalOffset.x,
      y: this.matrix.storage[13] + additionalOffset.y,
    });
  }

  visitChildren(callback: (child: RenderObject) => void) {
    this.children.forEach(callback);
  }

  /**
   * It is currently only used on ZIndexRenderObject
   */
  accept(visitor: RenderObjectVisitor) {
    visitor.visitGeneral(this);
  }

  hitTest({ globalPoint }: { globalPoint: Offset }): boolean {
    const viewPort = this.renderOwner.renderContext.viewPort;
    const { translation, scale } = viewPort;
    const left = (this.matrix.storage[12] + translation.x) * scale;
    const top = (this.matrix.storage[13] + translation.y) * scale;
    const right = left + this.size.width * scale;
    const bottom = top + this.size.height * scale;

    return (
      globalPoint.x >= left &&
      globalPoint.x <= right &&
      globalPoint.y >= top &&
      globalPoint.y <= bottom
    );
  }
}

export default RenderObject;
