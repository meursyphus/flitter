import { Offset } from "../../type";
import {
  SvgPainter,
  CanvasPainter,
  type CanvasPaintingContext,
} from "../../framework";
import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { assert } from "../../utils";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class Opacity extends SingleChildRenderObjectWidget {
  opacity: number;
  constructor({
    child,
    opacity,
    key,
  }: {
    child?: Widget;
    opacity: number;
    key?: any;
  }) {
    super({ child, key });
    this.opacity = opacity;
  }

  override createRenderObject(): SingleChildRenderObject {
    return new RenderOpacity({
      opacity: this.opacity,
    });
  }

  updateRenderObject(renderObject: RenderOpacity): void {
    renderObject.opacityProp = this.opacity;
  }
}

class RenderOpacity extends SingleChildRenderObject {
  _opacityProp!: number;
  _alpha!: number;
  get opacityProp(): number {
    return this._opacityProp;
  }
  set opacityProp(value: number) {
    assert(value >= 0 && value <= 1.0);
    if (this._opacityProp === value) return;
    this._opacityProp = value;
    this._alpha = Math.round(value * 255);
    this.markNeedsPaint();
  }

  constructor({ opacity }: { opacity: number }) {
    super({ isPainter: false });
    this._opacityProp = opacity;
    this._alpha = Math.round(opacity * 255);
  }

  get alpha(): number {
    return this._alpha;
  }

  protected override preformLayout(): void {
    if (this.child != null) {
      this.child.layout(this.constraints, { parentUsesSize: true });
      this.size = this.child.size;
    }
  }
  override createSvgPainter(): SvgPainter {
    return new SvgPainterOpacity(this);
  }
  override createCanvasPainter(): CanvasPainter {
    return new CanvasPainterOpacity(this);
  }
}

class SvgPainterOpacity extends SvgPainter {
  get opacity() {
    return (this.renderObject as RenderOpacity).opacityProp;
  }

  override getChildOpacity(parentOpacity: number): number {
    return parentOpacity * this.opacity;
  }
}

class CanvasPainterOpacity extends CanvasPainter {
  get opacity() {
    return (this.renderObject as RenderOpacity).opacityProp;
  }

  get alpha() {
    return (this.renderObject as RenderOpacity).alpha;
  }

  override performPaint(context: CanvasPaintingContext, offset: Offset) {
    if (this.renderObject.children.length === 0 || this.alpha === 0) {
      return;
    }

    if (this.alpha === 255) {
      this.defaultPaint(context, offset);
      return;
    }

    context.canvas.save();
    context.canvas.globalAlpha *= this.opacity;
    this.defaultPaint(context, offset);
    context.canvas.restore();
  }
}

export default Opacity;
