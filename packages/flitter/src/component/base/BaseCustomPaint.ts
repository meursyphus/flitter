import { CanvasPainter, SvgPainter } from "../../framework";
import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import type { Constraints } from "../../type";
import { Size } from "../../type";
import type { SvgPaintContext, CanvasPaintingContext } from "../../framework";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

export type Painter<
  D = any,
  T extends Record<string, SVGElement> = Record<string, SVGElement>,
> = {
  dependencies?: D;
  shouldRepaint?: (oldPainter: Painter<D>) => boolean;
} & (CustomSvgPainter<T> | CustomCanvasPainter);

export type CustomSvgPainter<T extends Record<string, SVGElement>> = {
  type: "svg";
  createDefaultSvgEl: (context: SvgPaintContext) => T;
  paint: (els: T, size: Size) => void;
};

export type CustomCanvasPainter = {
  type: "canvas";
  paint: (context: CanvasPaintingContext, size: Size) => void;
};

class BaseCustomPaint<
  T extends Record<string, SVGElement>,
> extends SingleChildRenderObjectWidget {
  painter: Painter<T>;
  size: Size;

  constructor({
    child,
    size = Size.zero,
    painter,
    key,
  }: {
    child?: Widget;
    size?: Size;
    painter: Painter<T>;
    key?: any;
  }) {
    super({ child, key });
    this.painter = painter;
    this.size = size;
  }

  createRenderObject(): RenderCustomPaint<T> {
    return new RenderCustomPaint({
      painter: this.painter,
      preferredSize: this.size,
    });
  }

  updateRenderObject(renderObject: RenderCustomPaint<T>): void {
    renderObject.painter = this.painter;
    renderObject.preferredSize = this.size;
  }
}

export class RenderCustomPaint<
  T extends Record<string, SVGElement> = Record<string, SVGElement>,
> extends SingleChildRenderObject {
  _painter: Painter<T>;
  get painter() {
    return this._painter;
  }
  set painter(value) {
    if (this._painter === value) return;
    const oldPainter = this._painter;
    this._painter = value;
    this.didUpdatePainter(this._painter, oldPainter);
  }
  private didUpdatePainter(newPainter, oldPainter) {
    const { shouldRepaint } = newPainter;
    if (shouldRepaint == null) return;
    if (!shouldRepaint(oldPainter)) return;
    this.markNeedsPaint();
  }
  _preferredSize: Size;
  get preferredSize() {
    return this._preferredSize;
  }
  set preferredSize(value) {
    if (value.equal(this.preferredSize)) return;
    this.preferredSize = value;
    this.markNeedsLayout();
  }

  constructor({
    preferredSize = Size.zero,
    painter,
  }: {
    preferredSize?: Size;
    painter: Painter<T>;
  }) {
    super({ isPainter: true });
    this._painter = painter;
    this._preferredSize = preferredSize;
  }

  protected computeSizeForNoChild(constraints: Constraints): Size {
    return constraints.constrain(this.preferredSize);
  }

  override getIntrinsicWidth(height: number): number {
    if (this.child == null) {
      return Number.isFinite(this.preferredSize.width)
        ? this.preferredSize.width
        : 0;
    }
    return super.getIntrinsicWidth(height);
  }

  override getIntrinsicHeight(width: number): number {
    if (this.child == null) {
      return Number.isFinite(this.preferredSize.height)
        ? this.preferredSize.height
        : 0;
    }

    return super.getIntrinsicHeight(width);
  }

  protected override createSvgPainter() {
    return new SvgPainterCustomPaint(this);
  }

  protected override createCanvasPainter(): CanvasPainter {
    return new CanvasPainterCustomPaint(this);
  }
}

class SvgPainterCustomPaint<
  T extends Record<string, SVGElement>,
> extends SvgPainter {
  get painter() {
    return (this.renderObject as RenderCustomPaint<T>).painter;
  }

  protected override performPaint(svgEls: T, _: SvgPaintContext): void {
    (this.painter as CustomSvgPainter<T>).paint(svgEls, this.size);
  }

  protected override createDefaultSvgEl(paintContext: SvgPaintContext): T {
    return (this.painter as CustomSvgPainter<T>).createDefaultSvgEl(
      paintContext,
    );
  }
}

class CanvasPainterCustomPaint extends CanvasPainter {
  get painter() {
    return (this.renderObject as RenderCustomPaint).painter;
  }

  protected override performPaint(context: CanvasPaintingContext): void {
    (this.painter as CustomCanvasPainter).paint(context, this.size);
  }
}

export default BaseCustomPaint;
