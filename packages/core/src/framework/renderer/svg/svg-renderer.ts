import type RenderObject from "../../../renderobject/RenderObject";
import type { SvgPaintContext } from "./svg-painter";
import { Constraints } from "../../../type";
import { RenderPipeline } from "../renderer";

export class SvgRenderPipeline extends RenderPipeline {
  override drawFrame() {
    this.flushLayout();
    this.flushPaintTransformUpdate();
    this.flushPaint();
    const painterRenderObjects = this.recalculateZOrder();
    this.#rearrangeDomOrder(painterRenderObjects);
  }

  override reinitializeFrame() {
    this.renderView.layout(Constraints.tight(this.renderContext.viewSize));
    this.renderView.updatePaintTransform();
    this.renderView.svgPainter.paint(this.paintContext);
    const painterRenderObjects = this.recalculateZOrder();
    this.#rearrangeDomOrder(painterRenderObjects);
  }

  paintContext: SvgPaintContext = {
    isOnBrowser: () => typeof this.renderContext.window !== "undefined",
    createSvgEl: (tagName: string) => {
      const el = this.renderContext.document.createElementNS(
        "http://www.w3.org/2000/svg",
        tagName,
      ) as unknown as SVGElement;
      return el;
    },
    appendSvgEl: (el: SVGElement) => {
      this.renderContext.view.appendChild(el);
    },
    insertSvgEl: (el: SVGElement, index: number) => {
      const child = this.renderContext.view.children[index];
      if (child == null) {
        this.renderContext.view.appendChild(el);
        return;
      }

      child.insertAdjacentElement("beforebegin", el);
    },
  };

  #rearrangeDomOrder(painterRenderObjects: RenderObject[]) {
    painterRenderObjects.reverse();
    painterRenderObjects.forEach(child => {
      child.svgPainter.rearrangeDomOrder();
    });
  }

  override flushPaint() {
    const dirties = this.needsPaintRenderObjects;
    this.needsPaintRenderObjects = [];

    dirties
      .sort((a, b) => a.depth - b.depth)
      .forEach(renderObject => {
        if (!renderObject.needsPaint) return;
        renderObject.svgPainter.paintWithoutLayout(this.paintContext);
      });
  }

  override disposeRenderObject(renderObject: RenderObject): void {
    if (renderObject.isPainter) {
      renderObject.svgPainter.domNode.remove();
    }
  }

  override markNeedsPaint(renderObject: RenderObject): void {
    renderObject.needsPaint = true;
    this.needsPaintRenderObjects.push(renderObject);
    this.requestVisualUpdate();
  }

  override markNeedsPaintTransformUpdate(renderObject: RenderObject): void {
    renderObject.needsPaintTransformUpdate = true;
    this.needsPaintTransformUpdateRenderObjects.push(renderObject);
    this.markNeedsPaint(renderObject);
  }

  override didChangePaintTransform(renderObject: RenderObject): void {
    renderObject.svgPainter.didChangePaintTransform();
  }
}
