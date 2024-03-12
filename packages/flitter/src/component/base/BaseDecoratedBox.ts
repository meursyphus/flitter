import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import type { Decoration } from "../../type";
import type { PaintContext } from "../../utils/type";
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
    if (this.decoration.equal(value)) return;
    this._decoration = value;
    this.markNeedsPaint();
  }

  constructor({ decoration }: { decoration: Decoration }) {
    super({ isPainter: true });
    this._decoration = decoration;
  }

  protected performPaint(svgEls: {
    box: SVGElement;
    topBorder: SVGElement;
    bottomBorder: SVGElement;
    leftBorder: SVGElement;
    rightBorder: SVGElement;
  }): void {
    const painter = this.decoration.createBoxPainter();

    painter.paint(svgEls, this.size);
  }

  createDefaultSvgEl({ createSvgEl }: PaintContext): {
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

export default DecoratedBox;
