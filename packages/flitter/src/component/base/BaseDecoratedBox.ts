import {
  SvgPainter,
  CanvasPainter,
  type SvgPaintContext,
  type CanvasPaintingContext,
} from "../../framework";
import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import type { Decoration } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class DecoratedBox extends SingleChildRenderObjectWidget {
  decoration: Decoration;
  constructor({
    decoration,
    child,
    key,
  }: {
    decoration: Decoration;
    child?: Widget;
    key?: any;
  }) {
    super({ child, key });
    this.decoration = decoration;
  }

  override createRenderObject(): RenderDecoratedBox {
    return new RenderDecoratedBox({ decoration: this.decoration });
  }

  updateRenderObject(renderObject: RenderDecoratedBox): void {
    renderObject.decoration = this.decoration;
  }
}

class RenderDecoratedBox extends SingleChildRenderObject {
  _decoration: Decoration;
  get decoration() {
    return this._decoration;
  }
  set decoration(value) {
    if (this.decoration.equals(value)) return;
    this._decoration = value;
    this.markNeedsPaint();
  }

  constructor({ decoration }: { decoration: Decoration }) {
    super({ isPainter: true });
    this._decoration = decoration;
  }

  protected override createSvgPainter() {
    return new SvgPainterDecoratedBox(this);
  }
  protected override createCanvasPainter() {
    return new CanvasPainterDecoratedBox(this);
  }
}

class SvgPainterDecoratedBox extends SvgPainter {
  get decoration() {
    return (this.renderObject as RenderDecoratedBox).decoration;
  }

  protected override performPaint(svgEls: {
    box: SVGPathElement;
    topBorder: SVGPathElement;
    bottomBorder: SVGPathElement;
    leftBorder: SVGPathElement;
    rightBorder: SVGPathElement;
  }): void {
    const painter = this.decoration.createSvgBoxPainter();
    painter.paint(svgEls, this.size);
  }

  protected override createDefaultSvgEl({ createSvgEl }: SvgPaintContext): {
    [key: string]: SVGElement;
  } {
    return {
      box: createSvgEl("path"),
      topBorder: createSvgEl("path"),
      leftBorder: createSvgEl("path"),
      rightBorder: createSvgEl("path"),
      bottomBorder: createSvgEl("path"),
    };
  }
}

class CanvasPainterDecoratedBox extends CanvasPainter {
  get decoration() {
    return (this.renderObject as RenderDecoratedBox).decoration;
  }
  override performPaint(context: CanvasPaintingContext): void {
    const painter = this.decoration.createCanvasBoxPainter();
    painter.paint(context.canvas, this.size);
  }
}

export default DecoratedBox;
