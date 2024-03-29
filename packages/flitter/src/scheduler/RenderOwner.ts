import type { RenderZIndex } from "../component/base/BaseZIndex";
import type RenderObject from "../renderobject/RenderObject";
import { type RenderObjectVisitor } from "../renderobject/RenderObjectVisitor";
import type { HitTestDispatcher } from "../hit-test/HitTestDispatcher";
import type { RenderContext } from "../runApp";

class RenderOwner {
  hitTestDispatcher: HitTestDispatcher;
  renderContext: RenderContext;
  private onNeedVisualUpdate: () => void;
  needsPaintRenderObjects: RenderObject[] = [];
  needsLayoutRenderObjects: RenderObject[] = [];
  /*
   this will be set by RenderView
  */
  renderView!: RenderObject;
  constructor({
    onNeedVisualUpdate,
    renderContext,
    hitTestDispatcher,
  }: {
    onNeedVisualUpdate: () => void;
    renderContext: RenderContext;
    hitTestDispatcher: HitTestDispatcher;
  }) {
    this.onNeedVisualUpdate = onNeedVisualUpdate;
    this.renderContext = renderContext;
    this.hitTestDispatcher = hitTestDispatcher;
    this.hitTestDispatcher.init({ renderContext: this.renderContext });
  }

  requestVisualUpdate() {
    this.onNeedVisualUpdate();
  }

  drawFrame() {
    this.flushLayout();
    this.rearrangeDomOrder();
    this.flushPaint();
  }

  domOrderChanged: boolean = true;
  rearrangeDomOrder() {
    if (!this.domOrderChanged) return;
    this.domOrderChanged = false;
    const domOrderVisitor = new DomOrderVisitor();
    this.renderView.accept(domOrderVisitor);

    const painterRenderObjects = domOrderVisitor.getRenderObjectsByDomOrder();

    for (let i = painterRenderObjects.length - 1; i >= 0; i--) {
      const renderObject = painterRenderObjects[i];
      renderObject.domOrder = i;
      renderObject.rearrangeDomOrder();
    }
  }

  didDomOrderChange() {
    this.domOrderChanged = true;
  }

  private flushLayout() {
    const dirties = this.needsLayoutRenderObjects;
    this.needsLayoutRenderObjects = [];

    dirties
      .sort((a, b) => a.depth - b.depth)
      .forEach(renderObject => {
        if (!renderObject.needsLayout) return;
        renderObject.layoutWithoutResize();
      });
  }

  private flushPaint() {
    const dirties = this.needsPaintRenderObjects;
    this.needsPaintRenderObjects = [];

    dirties
      .sort((a, b) => a.depth - b.depth)
      .forEach(renderObject => {
        if (!renderObject.needsPaint) return;
        renderObject.paintWithoutLayout(this.renderContext.paintContext);
      });
  }
}

type StackingContext = {
  zIndex: number;
  visitedOrder: number;
};

class DomOrderVisitor implements RenderObjectVisitor {
  private collectedRenderObjects: {
    renderObject: RenderObject;
    visitedOrder: number;
    contexts: StackingContext[];
  }[] = [];
  private currentVisitedOrder = 0;
  private currentStackingContext: StackingContext[] = [];

  private visit(
    renderObject: RenderObject,
    { willCollect }: { willCollect: boolean },
  ) {
    if (willCollect) {
      this.collectedRenderObjects.push({
        renderObject,
        contexts: this.currentStackingContext,
        visitedOrder: this.currentVisitedOrder++,
      });
    }

    renderObject.visitChildren(child => {
      child.accept(this);
    });
  }

  visitGeneral(renderObject: RenderObject): void {
    this.visit(renderObject, { willCollect: renderObject.isPainter });
  }

  visitZIndex(renderObject: RenderZIndex) {
    /**
     * This is a hack to optimize memory in order to reuse currentZIndexContext until ZIndexRenderObject is visited.
     */
    this.currentStackingContext = [...this.currentStackingContext];
    this.currentStackingContext.push({
      visitedOrder: this.currentVisitedOrder,
      zIndex: renderObject.zIndex,
    });

    this.visit(renderObject, { willCollect: false });

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

export default RenderOwner;
