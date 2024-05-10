import { Size, Offset, Constraints, Matrix4 } from "../type";
import type { RenderObjectElement } from "../element";
import {
  CanvasPainter,
  type RenderPipeline as RenderOwner,
  SvgPainter,
} from "../framework";
import { NotImplementedError } from "../exception";

/*
  It does more things than flutters' RenderObject 
  Actually, It is more like RenderShiftedBox
*/
export class RenderObject {
  readonly runtimeType = this.constructor.name;
  readonly isPainter: boolean;
  ownerElement!: RenderObjectElement;
  matrix: Matrix4 = Matrix4.Constants.identity;
  renderOwner!: RenderOwner;
  parent?: RenderObject;
  needsPaint = true;
  needsLayout = true;
  depth = 0;

  /**
   * zOrder is used to order the render objects in the z axis
   */
  zOrder!: number;
  #svgPainter: SvgPainter;
  get svgPainter() {
    if (this.#svgPainter == null) {
      this.#svgPainter = this.createSvgPainter();
    }
    return this.#svgPainter;
  }
  #canvasPainter: CanvasPainter;
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

  attach(ownerElement: RenderObjectElement) {
    this.ownerElement = ownerElement;
    this.depth = ownerElement.depth;
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
  /*
   * Do not call this method directly. instead call layout
   */
  protected preformLayout(): void {
    throw new NotImplementedError("performLayout");
  }

  layoutWithoutResize() {
    this.layout(this.constraints, { parentUsesSize: this.parentUsesSize });
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
    this.renderOwner.markNeedsPaintRenderObject(this);
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
