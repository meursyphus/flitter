import type { Offset } from "../../type";
import {
  SvgPainter,
  type SvgPaintContext,
  type CanvasPaintingContext,
  CanvasPainter,
} from "../../framework";
import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class ColoredBox extends SingleChildRenderObjectWidget {
  color: string;
  constructor({
    color,
    child,
    key,
  }: {
    color: string;
    child?: Widget;
    key?: any;
  }) {
    super({ child, key });
    this.color = color;
  }

  override createRenderObject(): RenderColoredBox {
    return new RenderColoredBox({ color: this.color });
  }

  updateRenderObject(renderObject: RenderColoredBox): void {
    renderObject.color = this.color;
  }
}

class RenderColoredBox extends SingleChildRenderObject {
  _color: string;
  get color() {
    return this._color;
  }
  set color(value) {
    if (value === this._color) return;
    this._color = value;
    this.markNeedsPaint();
  }
  constructor({ color }: { color: string }) {
    super({ isPainter: true });
    this._color = color;
  }

  override createSvgPainter() {
    return new SvgPainterColoredBox(this);
  }

  override createCanvasPainter() {
    return new CanvasPainterColoredBox(this);
  }
}

class SvgPainterColoredBox extends SvgPainter {
  get color() {
    return (this.renderObject as RenderColoredBox).color;
  }

  protected override performPaint({ rect }: { rect: SVGElement }): void {
    rect.setAttribute("fill", this.color);
    rect.setAttribute("width", `${this.size.width}`);
    rect.setAttribute("height", `${this.size.height}`);
  }

  override createDefaultSvgEl({ createSvgEl }: SvgPaintContext): {
    [key: string]: SVGElement;
  } {
    const rect = createSvgEl("rect");
    return {
      rect,
    };
  }
}

class CanvasPainterColoredBox extends CanvasPainter {
  get color() {
    return (this.renderObject as RenderColoredBox).color;
  }

  protected override performPaint(
    paintContext: CanvasPaintingContext,
    offset: Offset,
  ): void {
    const { canvas: ctx } = paintContext;
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(offset.x, offset.y, this.size.width, this.size.height);
    ctx.restore();
    this.defaultPaint(paintContext, offset);
  }
}

export default ColoredBox;
