import { assert } from "../../utils";
import Stack, { RenderStack } from "./BaseStack";
import type Widget from "../../widget/Widget";
import type { Alignment, Matrix4 } from "../../type";
import { StackFit } from "../../type";
import type { PaintContext } from "../../utils/type";

class IndexedStack extends Stack {
  index: number;
  constructor({
    children,
    index = 0,
    sizing = StackFit.loose,
    alignment,
    key,
  }: {
    children: Widget[];
    sizing?: StackFit;
    alignment?: Alignment;
    index?: number;
    key?: any;
  }) {
    super({ children, fit: sizing, alignment, key });
    this.index = index;
  }
  createRenderObject(): RenderIndexedStack {
    return new RenderIndexedStack({
      index: this.index,
      fit: this.fit,
      alignment: this.alignment,
    });
  }

  updateRenderObject(renderObject: RenderIndexedStack): void {
    renderObject.index = this.index;
    renderObject.fit = this.fit;
    renderObject.alignment = this.alignment;
  }
}

class RenderIndexedStack extends RenderStack {
  _index: number;
  get index() {
    return this._index;
  }
  set index(value: number) {
    if (this._index === value) return;
    this._index = value;
    this.markNeedsPaint();
  }
  constructor({
    index,
    fit,
    alignment,
  }: {
    fit: StackFit;
    alignment: Alignment;
    index: number;
  }) {
    super({ alignment, fit });
    this._index = index;
  }

  paintChildren(
    context: PaintContext,
    {
      clipId,
      matrix4,
      opacity,
    }: {
      clipId?: string | undefined;
      matrix4: Matrix4;
      opacity: number;
    }
  ): void {
    this.children.forEach((child) => child.dispose(context));
    const child = this.children[this.index];
    assert(child != null);
    child.paint(context, clipId, matrix4, opacity);
  }
}

export default IndexedStack;
