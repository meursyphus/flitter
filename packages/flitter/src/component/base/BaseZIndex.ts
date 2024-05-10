import { type SvgPainterZIndexVisitor } from "../../framework/renderer/svg/svg-renderer";
import { SvgPainter } from "../../framework/renderer/svg/svg-painter";
import { SingleChildRenderObject } from "../../renderobject";
import type { Widget } from "../../widget";
import { SingleChildRenderObjectWidget } from "../../widget";

export default class BaseZIndex extends SingleChildRenderObjectWidget {
  zIndex: number;
  constructor({
    key,
    child,
    zIndex,
  }: {
    key?: any;
    child?: Widget;
    zIndex: number;
  }) {
    super({ key, child });

    this.zIndex = zIndex;
  }

  createRenderObject(): SingleChildRenderObject {
    return new RenderZIndex({ zIndex: this.zIndex });
  }

  updateRenderObject(renderObject: RenderZIndex): void {
    renderObject.zIndex = this.zIndex;
  }
}

export class RenderZIndex extends SingleChildRenderObject {
  #zIndex: number;
  set zIndex(value: number) {
    if (this.svgPainter != null) {
      (this.svgPainter as SvgPainterZIndex).zIndex = value;
    }
  }
  constructor({ zIndex }: { zIndex: number }) {
    super({ isPainter: false });
    this.#zIndex = zIndex;
  }
  override createSvgPainter() {
    return new SvgPainterZIndex(this, this.#zIndex);
  }
}

export class SvgPainterZIndex extends SvgPainter {
  constructor(renderObject: RenderZIndex, zIndex: number) {
    super(renderObject);
    this.#zIndex = zIndex;
  }
  #zIndex: number;
  get zIndex() {
    return this.#zIndex;
  }
  set zIndex(value: number) {
    if (this.#zIndex === value) return;
    this.#zIndex = value;
    this.didDomOrderChange();
  }

  override accept(visitor: SvgPainterZIndexVisitor): void {
    visitor.visitZIndex(this);
  }
}
