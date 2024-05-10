import type { SvgPaintContext } from "../../../utils/type";
import { assert } from "../../../utils";
import { Matrix4, type Offset } from "../../../type";
import type {
  SvgPainterZIndexVisitor,
  SvgRenderPipeline,
} from "./svg-renderer";
import { NotImplementedError } from "../../../exception";
import { Painter } from "../renderer";

export class SvgPainter extends Painter {
  #clipId?: string = undefined;
  #opacity = 1;
  #domNode!: SVGElement;
  /**
   * domOrder is used to rearrange dom order
   */
  #domOrderChanged = false;
  get zOrder() {
    return this.renderObject.zOrder;
  }
  set zOrder(newOrder: number) {
    if (newOrder === this.zOrder) return;
    this.renderObject.zOrder = newOrder;
    this.didDomOrderChange();
  }

  get domNode() {
    if (this.#domNode == null) {
      this.#domNode = this.createSvgEl(this.renderOwner.paintContext);
      this.didDomOrderChange();
    }
    assert(this.#domNode != null, "domNode is not initialized");
    return this.#domNode;
  }
  get isPainter(): boolean {
    return this.renderObject.isPainter;
  }
  get renderOwner(): SvgRenderPipeline {
    return this.renderObject.renderOwner as SvgRenderPipeline;
  }
  get matrix(): Matrix4 {
    return this.renderObject.matrix;
  }
  set matrix(newValue: Matrix4) {
    this.renderObject.matrix = newValue;
  }
  get needsPaint(): boolean {
    return this.renderObject.needsPaint;
  }
  set needsPaint(newValue: boolean) {
    this.renderObject.needsPaint = newValue;
  }
  get offset(): Offset {
    return this.renderObject.offset;
  }
  get type(): string {
    return this.renderObject.type;
  }

  paint(
    context: SvgPaintContext,
    clipId?: string,
    matrix4: Matrix4 = Matrix4.Constants.identity,
    opacity: number = 1,
  ) {
    const translatedMatrix4 = matrix4.translated(this.offset.x, this.offset.y);
    const clipIdChanged = this.#clipId !== clipId;
    const opacityChanged = this.#opacity !== opacity;
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
    this.#clipId = clipId;
    this.#opacity = opacity;

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
    context: SvgPaintContext,
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
    this.renderObject.visitChildren(child => {
      child.svgPainter.paint(context, clipId, matrix4, opacity);
    });
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

  protected createSvgEl(context: SvgPaintContext): SVGElement {
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
    return svgG;
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
  /*
   * Do not call this method directly. instead call paint
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  protected performPaint(
    _svgEls: { [key: string]: SVGElement },
    _context: SvgPaintContext,
  ): void {
    //
  }

  protected getChildClipId(parentClipId?: string) {
    return parentClipId;
  }

  paintWithoutLayout(context: SvgPaintContext) {
    this.paint(context, this.#clipId, this.matrix, this.#opacity);
  }

  protected didDomOrderChange() {
    this.#domOrderChanged = true;
    this.renderOwner.didDomOrderChange();
  }

  /**
   * It is currently only used on ZIndexRenderObject
   */
  accept(visitor: SvgPainterZIndexVisitor) {
    visitor.visitGeneral(this);
  }

  rearrangeDomOrder() {
    if (!this.#domOrderChanged) return;

    this.isPainter &&
      this.renderOwner.paintContext.insertSvgEl(this.domNode, this.zOrder);
    this.#domOrderChanged = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected createDefaultSvgEl(paintContext: SvgPaintContext): {
    [key: string]: SVGElement;
  } {
    throw new NotImplementedError("createDefaultSvgEl");
  }
}
