import type { SvgPaintContext } from "../../../utils/type";
import { assert } from "../../../utils";
import { Matrix4, type Offset } from "../../../type";
import type { SvgRenderPipeline } from "./svg-renderer";
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
  didDomOrderChange() {
    this.#domOrderChanged = true;
  }

  get domNode() {
    if (this.#domNode == null) {
      this.#domNode = this.createSvgEl(this.renderOwner.paintContext);
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
  get needsPaintTransformUpdate(): boolean {
    return this.renderObject.needsPaintTransformUpdate;
  }
  set needsPaintTransformUpdate(newValue: boolean) {
    this.renderObject.needsPaintTransformUpdate = newValue;
  }
  get paintTransform(): Matrix4 {
    return this.renderObject.paintTransform;
  }
  set paintTransform(newValue: Matrix4) {
    this.renderObject.paintTransform = newValue;
  }

  paint(context: SvgPaintContext, clipId?: string, opacity: number = 1) {
    const clipIdChanged = this.#clipId !== clipId;
    const opacityChanged = this.#opacity !== opacity;
    if (
      !clipIdChanged &&
      !opacityChanged &&
      !this.#didChangePaintTransform &&
      !this.needsPaint
    ) {
      return;
    }

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
      if (this.#didChangePaintTransform) {
        this.#didChangePaintTransform = false;
        Object.values(svgEls).forEach(el =>
          this.setSvgTransform(el, this.paintTransform),
        );
      }
      if (this.needsPaint) {
        this.performPaint(svgEls, context);
      }
    }
    this.needsPaint = false;
    const childClipId = this.getChildClipId(clipId);
    const childOpacity = this.getChildOpacity(opacity);
    this.paintChildren(context, {
      clipId: childClipId,
      opacity: childOpacity,
    });
  }

  paintChildren(
    context: SvgPaintContext,
    {
      clipId,
      opacity,
    }: {
      clipId?: string;
      opacity: number;
    },
  ) {
    this.renderObject.visitChildren(child => {
      child.svgPainter.paint(context, clipId, opacity);
    });
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
    this.paint(context, this.#clipId, this.#opacity);
  }

  /**
   * It is currently only used on ZIndexRenderObject
   */
  rearrangeDomOrder() {
    if (!this.#domOrderChanged) return;

    if (this.isPainter) {
      this.renderOwner.paintContext.insertSvgEl(
        this.domNode,
        this.renderObject.zOrder,
      );
    }

    this.#domOrderChanged = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected createDefaultSvgEl(paintContext: SvgPaintContext): {
    [key: string]: SVGElement;
  } {
    throw new NotImplementedError("createDefaultSvgEl");
  }

  #didChangePaintTransform = false;
  updatePaintTransform(
    parentPaintTransform: Matrix4 = this.renderObject?.parent?.paintTransform ??
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
    this.#didChangePaintTransform = true;
    const childPaintTransform =
      this.renderObject.applyPaintTransform(newTransform);
    this.renderObject.visitChildren(child => {
      child.svgPainter.updatePaintTransform(childPaintTransform);
    });
  }
}
