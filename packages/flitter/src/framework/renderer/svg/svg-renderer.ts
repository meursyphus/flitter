import type { SvgPainterZIndex } from "../../../component/base/BaseZIndex";
import type RenderObject from "../../../renderobject/RenderObject";
import type { SvgPaintContext } from "../../../utils/type";
import type { SvgPainter } from "./svg-painter";
import { Constraints } from "../../../type";
import { RenderPipeline } from "../renderer";

export class SvgPainterZIndexVisitor {
  private collectedRenderObjects: {
    renderObject: RenderObject;
    visitedOrder: number;
    contexts: StackingContext[];
  }[] = [];
  private currentVisitedOrder = 0;
  private currentStackingContext: StackingContext[] = [];

  private visit(
    painter: SvgPainter,
    { willCollect }: { willCollect: boolean },
  ) {
    if (willCollect) {
      this.collectedRenderObjects.push({
        renderObject: painter.renderObject,
        contexts: this.currentStackingContext,
        visitedOrder: this.currentVisitedOrder++,
      });
    }

    painter.renderObject.visitChildren(child => {
      child.svgPainter.accept(this);
    });
  }

  visitGeneral(painter: SvgPainter): void {
    this.visit(painter, { willCollect: painter.isPainter });
  }

  visitZIndex(painter: SvgPainterZIndex) {
    /**
     * This is a hack to optimize memory in order to reuse currentZIndexContext until ZIndexRenderObject is visited.
     */
    this.currentStackingContext = [...this.currentStackingContext];
    this.currentStackingContext.push({
      visitedOrder: this.currentVisitedOrder,
      zIndex: painter.zIndex,
    });

    this.visit(painter, { willCollect: false });

    this.currentStackingContext = [...this.currentStackingContext];
    this.currentStackingContext.pop();
  }

  getRenderObjectsByDomOrder(): RenderObject[] {
    const sorted = this.collectedRenderObjects.sort((a, b) => {
      const limit = Math.min(a.contexts.length, b.contexts.length);

      for (let i = 0; i < limit; i++) {
        const aContext = a.contexts[i];
        const bContext = b.contexts[i];

        if (aContext.zIndex !== bContext.zIndex) {
          return aContext.zIndex - bContext.zIndex;
        } else if (aContext.visitedOrder !== bContext.visitedOrder) {
          return aContext.visitedOrder - bContext.visitedOrder;
        }
      }

      if (limit > 0) {
        const lastContext = a.contexts[limit - 1];

        if (
          lastContext.visitedOrder === a.visitedOrder ||
          lastContext.visitedOrder === b.visitedOrder
        ) {
          return a.visitedOrder - b.visitedOrder;
        }
      }

      if (a.contexts.length !== b.contexts.length) {
        const aContext = a.contexts[limit] ?? {
          visitedOrder: a.visitedOrder,
          zIndex: 0,
        };
        const bContext = b.contexts[limit] ?? {
          visitedOrder: b.visitedOrder,
          zIndex: 0,
        };

        if (aContext.zIndex !== bContext.zIndex) {
          return aContext.zIndex - bContext.zIndex;
        } else if (aContext.visitedOrder !== bContext.visitedOrder) {
          return aContext.visitedOrder - bContext.visitedOrder;
        }
      }

      return a.visitedOrder - b.visitedOrder;
    });

    return sorted.map(({ renderObject }) => renderObject);
  }
}

type StackingContext = {
  zIndex: number;
  visitedOrder: number;
};

export class SvgRenderPipeline extends RenderPipeline {
  override drawFrame() {
    this.flushLayout();
    this.rearrangeDomOrder();
    this.flushPaint();
  }

  override reinitializeFrame() {
    this.renderView.layout(Constraints.tight(this.renderContext.viewSize));
    this.rearrangeDomOrder();
    this.renderView.svgPainter.paint(this.paintContext);
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

  domOrderChanged: boolean = true;
  private rearrangeDomOrder() {
    if (!this.domOrderChanged) return;
    this.domOrderChanged = false;
    const domOrderVisitor = new SvgPainterZIndexVisitor();
    this.renderView.svgPainter.accept(domOrderVisitor);

    const painterRenderObjects = domOrderVisitor.getRenderObjectsByDomOrder();

    for (let i = painterRenderObjects.length - 1; i >= 0; i--) {
      const renderObject = painterRenderObjects[i];
      renderObject.svgPainter.zOrder = i;
      renderObject.svgPainter.rearrangeDomOrder();
    }
  }

  didDomOrderChange() {
    this.domOrderChanged = true;
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
      this.didDomOrderChange();
    }
  }

  override markNeedsPaintRenderObject(renderObject: RenderObject): void {
    renderObject.needsPaint = true;
    this.needsPaintRenderObjects.push(renderObject);
  }
}
