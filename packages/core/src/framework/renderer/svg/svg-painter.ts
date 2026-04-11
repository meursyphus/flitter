import { assert } from "../../../utils";
import type { Matrix4 } from "../../../type";
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
  get renderOwner(): SvgRenderPipeline {
    return this.renderObject.renderOwner as SvgRenderPipeline;
  }

  get domNode() {
    if (this.#domNode == null) {
      this.#domNode = this.createSvgEl(this.renderOwner.paintContext);
    }
    assert(this.#domNode != null, "domNode is not initialized");
    return this.#domNode;
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

    if (this.isPainter && this.domNode) {
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
  didChangePaintTransform() {
    this.#didChangePaintTransform = true;
  }
}

export type SvgPaintContext = {
  createSvgEl: (tagName: keyof SVGElementTagNameMap) => SVGElement;
  appendSvgEl: (el: SVGElement) => void;
  insertSvgEl: (el: SVGElement, index: number) => void;
  isOnBrowser: () => boolean;
};
