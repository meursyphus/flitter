/* eslint-disable no-case-declarations */
import type { BorderStyle, ShapeBorder, StrokeAlign } from "./_borders";
import { BorderSide } from "./_borders";
import type { EdgeInsetsGeometry } from "./edge-insets";
import EdgeInsets from "./edge-insets";
import Path from "./_path";
import Rect from "./_rect";
import BorderRadius from "./border-radius";
import { assert } from "../../utils";
import type { BoxShape } from "./box-decoration";
import type BorderRadiusGeometry from "./border-radius-geometry";
import Data from "./_data";

class _BoxBorder extends Data implements ShapeBorder {
  get dimensions(): EdgeInsetsGeometry {
    throw new Error("dimensions is not implemented.");
  }
  getInnerPath(rect: Rect): Path {
    return new Path().addRect(this.dimensions.deflateRect(rect));
  }
  getOuterPath(rect: Rect): Path {
    return new Path().addRect(rect);
  }
  paint(
    _: BorderPathEls,
    __: { rect: Rect; borderRadius?: BorderRadiusGeometry; shape?: BoxShape }
  ): void {
    throw new Error("paint is not implemented.");
  }

  /**
   * @deprecated The method should not be used
   */
  equal(_: BoxBorder): boolean {
    throw new Error("equal is not implemented.");
  }

  protected static paintUniformBorderWidthRadius(
    paths: BorderPathEls,
    {
      side,
      borderRadius,
      rect,
    }: { side: BorderSide; borderRadius: BorderRadiusGeometry; rect: Rect }
  ) {
    assert(side.style !== "none");
    const border = paths.top;
    border.setAttribute("stroke-width", "0");
    border.setAttribute("fill", side.color.value);

    const borderRect = borderRadius.toRRect(rect);
    const inner = borderRect.deflate(side.strokeInset);
    const outer = borderRect.inflate(side.strokeOutset);

    border.setAttribute("d", new Path().addDRRect({ inner, outer }).getD());

    [("left" as const, "right" as const, "bottom" as const)].forEach((key) => {
      const path = paths[key];
      BorderSide.none.paint(path);
    });
  }

  protected static paintUniformBorderWidthCircle(
    paths: BorderPathEls,
    { side, rect }: { side: BorderSide; rect: Rect }
  ) {
    assert(side.style !== "none");
    const border = paths.top;
    side.paint(border);
    border.setAttribute(
      "d",
      new Path()
        .addOval(
          Rect.fromCircle({
            center: rect.center,
            radius: (rect.shortestSide + side.strokeOffset) / 2,
          })
        )
        .getD()
    );

    [("left" as const, "right" as const, "bottom" as const)].forEach((key) => {
      const path = paths[key];
      BorderSide.none.paint(path);
    });
  }

  protected static paintUniformBorderWidthRectangle(
    paths: BorderPathEls,
    { side, rect }: { side: BorderSide; rect: Rect }
  ) {
    assert(side.style !== "none");
    const border = paths.top;
    side.paint(border);
    border.setAttribute(
      "d",
      new Path().addRect(rect.inflate(side.strokeOffset / 2)).getD()
    );

    [("left" as const, "right" as const, "bottom" as const)].forEach((key) => {
      const path = paths[key];
      BorderSide.none.paint(path);
    });
  }
}

class Border extends _BoxBorder {
  top: BorderSide;
  right: BorderSide;
  bottom: BorderSide;
  left: BorderSide;
  constructor({
    top = BorderSide.none,
    right = BorderSide.none,
    bottom = BorderSide.none,
    left = BorderSide.none,
  }: {
    top?: BorderSide;
    right?: BorderSide;
    bottom?: BorderSide;
    left?: BorderSide;
  }) {
    super();
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }

  static lerp(a: Border, b: Border, t: number) {
    assert(t >= 0 && t <= 1);
    return new Border({
      top: BorderSide.lerp(a.top, b.top, t),
      left: BorderSide.lerp(a.left, b.left, t),
      bottom: BorderSide.lerp(a.bottom, b.bottom, t),
      right: BorderSide.lerp(a.right, b.right, t),
    });
  }

  equals(other: BoxBorder): boolean {
    if (this === other) return true;
    if (!(other instanceof Border)) return false;
    return (
      this.top.equals(other.top) &&
      this.right.equals(other.right) &&
      this.bottom.equals(other.bottom) &&
      this.left.equals(other.left)
    );
  }

  /**
   * @deprecated The method should not be used
   */
  equal(other: BoxBorder): boolean {
    return this.equals(other);
  }

  static fromBorderSide(side: BorderSide): Border {
    return new Border({ left: side, right: side, bottom: side, top: side });
  }

  static symmetric({
    vertical = BorderSide.none,
    horizontal = BorderSide.none,
  }: {
    vertical?: BorderSide;
    horizontal?: BorderSide;
  }) {
    return new Border({
      left: vertical,
      right: vertical,
      top: horizontal,
      bottom: horizontal,
    });
  }

  static all({
    color = "black",
    width = 1,
    style = "solid",
    strokeAlign = BorderSide.strokeAlignInside,
  }: {
    color?: string;
    width?: number;
    style?: BorderStyle;
    strokeAlign?: StrokeAlign;
  } = {}) {
    const side = new BorderSide({ strokeAlign, style, color, width });
    return Border.fromBorderSide(side);
  }

  get dimensions(): EdgeInsetsGeometry {
    if (this._widthIsUniform) {
      return EdgeInsets.all(this.top.strokeInset);
    }

    return EdgeInsets.fromLTRB({
      left: this.left.strokeInset,
      right: this.right.strokeInset,
      bottom: this.bottom.strokeInset,
      top: this.top.strokeInset,
    });
  }

  get isUniform() {
    const result =
      this._colorIsUniform &&
      this._styleIsUniform &&
      this._strokeAlignIsUniform &&
      this._widthIsUniform;

    return result;
  }

  paint(
    paths: BorderPathEls,
    {
      rect,
      borderRadius,
      shape = "rectangle",
    }: { rect: Rect; borderRadius?: BorderRadiusGeometry; shape?: BoxShape }
  ): void {
    if (this.isUniform) {
      switch (this.top.style) {
        case "none":
          Object.values(paths).forEach((path) => {
            path.setAttribute("stroke-width", "0");
            path.setAttribute("fill", "none");
            path.setAttribute("d", "");
          });
          return;
        case "solid":
          switch (shape) {
            case "circle":
              assert(
                borderRadius == null,
                "A borderRadius can only be given for rectangular boxes."
              );
              _BoxBorder.paintUniformBorderWidthCircle(paths, {
                side: this.top,
                rect,
              });
              break;
            case "rectangle":
              if (borderRadius != null && borderRadius != BorderRadius.zero) {
                _BoxBorder.paintUniformBorderWidthRadius(paths, {
                  side: this.top,
                  borderRadius,
                  rect,
                });

                return;
              }
              _BoxBorder.paintUniformBorderWidthRectangle(paths, {
                side: this.top,
                rect,
              });
              break;
          }
          return;
      }
    }

    assert(
      (() => {
        if (borderRadius != null) {
          const errorMessage = `
          A borderRadius can only be given for a uniform Border.
          The following is not uniform: `;

          if (!this._colorIsUniform) {
            throw new Error(errorMessage + "BorderSide.color");
          }
          if (!this._widthIsUniform) {
            throw new Error(errorMessage + "BorderSide.width");
          }
          if (!this._styleIsUniform) {
            throw new Error(errorMessage + "BorderSide.style");
          }
          if (!this._strokeAlignIsUniform) {
            throw new Error(errorMessage + "BorderSide.strokeAlign");
          }
        }
        return true;
      })()
    );

    assert(
      (() => {
        if (shape != "rectangle") {
          const errorMessage = `
          A Border can only be drawn as a circle if it is uniform.
          The following is not uniform: `;

          if (!this._colorIsUniform) {
            throw new Error(errorMessage + "BorderSide.color");
          }
          if (!this._widthIsUniform) {
            throw new Error(errorMessage + "BorderSide.width");
          }
          if (!this._styleIsUniform) {
            throw new Error(errorMessage + "BorderSide.style");
          }
          if (!this._strokeAlignIsUniform) {
            throw new Error(errorMessage + "BorderSide.strokeAlign");
          }
        }
        return true;
      })()
    );

    assert(
      (() => {
        if (
          !this._strokeAlignIsUniform &&
          this.top.strokeAlign !== BorderSide.strokeAlignInside
        ) {
          throw new Error(
            "A Border can only have different strokeAlign when BorderSide.strokeAlignInside is used on uniform borders."
          );
        }
        return true;
      })()
    );

    this.paintBorder(paths, { rect });
  }

  private paintBorder(pathEls: BorderPathEls, { rect }: { rect: Rect }): void {
    // We draw the borders as filled shapes, unless the borders are hairline
    // borders, in which case we use PaintingStyle.stroke, with the stroke width
    // specified here.
    pathEls.bottom.setAttribute("stroke-width", "0");
    pathEls.top.setAttribute("stroke-width", "0");
    pathEls.left.setAttribute("stroke-width", "0");
    pathEls.right.setAttribute("stroke-width", "0");

    switch (this.top.style) {
      case "solid":
        pathEls.top.setAttribute("fill", this.top.color.value);
        const topPath = new Path();
        topPath.moveTo({ x: rect.left, y: rect.top });
        topPath.lineTo({ x: rect.right, y: rect.top });
        if (this.top.width === 0) {
          pathEls.top.setAttribute("fill", "none");
          pathEls.top.setAttribute("stroke", "none");
        } else {
          topPath.lineTo({
            x: rect.right - this.right.width,
            y: rect.top + this.top.width,
          });
          topPath.lineTo({
            x: rect.left + this.left.width,
            y: rect.top + this.top.width,
          });
        }
        topPath.close();
        pathEls.top.setAttribute("d", topPath.getD());
        break;
      case "none":
        pathEls.top.setAttribute("d", "");
        break;
    }

    switch (this.right.style) {
      case "solid":
        pathEls.right.setAttribute("fill", this.right.color.value);
        const rightPath = new Path();
        rightPath.moveTo({ x: rect.right, y: rect.top });
        rightPath.lineTo({ x: rect.right, y: rect.bottom });
        if (this.right.width === 0) {
          pathEls.right.setAttribute("fill", "none");
          pathEls.right.setAttribute("stroke", "none");
        } else {
          rightPath.lineTo({
            x: rect.right - this.right.width,
            y: rect.bottom - this.bottom.width,
          });
          rightPath.lineTo({
            x: rect.right - this.right.width,
            y: rect.top + this.top.width,
          });
        }
        rightPath.close();
        pathEls.right.setAttribute("d", rightPath.getD());
        break;
      case "none":
        pathEls.right.setAttribute("d", "");
        break;
    }

    switch (this.bottom.style) {
      case "solid":
        pathEls.bottom.setAttribute("fill", this.bottom.color.value);
        const bottomPath = new Path();
        bottomPath.moveTo({ x: rect.right, y: rect.bottom });
        bottomPath.lineTo({ x: rect.left, y: rect.bottom });
        if (this.bottom.width === 0) {
          pathEls.bottom.setAttribute("fill", "none");
          pathEls.bottom.setAttribute("stroke", "none");
        } else {
          bottomPath.lineTo({
            x: rect.left + this.left.width,
            y: rect.bottom - this.bottom.width,
          });
          bottomPath.lineTo({
            x: rect.right - this.right.width,
            y: rect.bottom - this.bottom.width,
          });
        }
        bottomPath.close();
        pathEls.bottom.setAttribute("d", bottomPath.getD());
        break;
      case "none":
        pathEls.bottom.setAttribute("d", "");
        break;
    }

    switch (this.left.style) {
      case "solid":
        pathEls.left.setAttribute("fill", this.left.color.value);
        const leftPath = new Path();
        leftPath.moveTo({ x: rect.left, y: rect.bottom });
        leftPath.lineTo({ x: rect.left, y: rect.top });
        if (this.left.width === 0) {
          pathEls.left.setAttribute("fill", "none");
          pathEls.left.setAttribute("stroke", "none");
        } else {
          leftPath.lineTo({
            x: rect.left + this.left.width,
            y: rect.top + this.top.width,
          });
          leftPath.lineTo({
            x: rect.left + this.left.width,
            y: rect.bottom - this.bottom.width,
          });
        }
        leftPath.close();
        pathEls.left.setAttribute("d", leftPath.getD());
        break;
      case "none":
        pathEls.left.setAttribute("d", "");
        break;
    }
  }

  private get _colorIsUniform(): boolean {
    const topColor = this.top.color;
    return (
      this.right.color.equals(topColor) &&
      this.bottom.color.equals(topColor) &&
      this.left.color.equals(topColor)
    );
  }

  private get _widthIsUniform() {
    const topWidth = this.top.width;
    return (
      this.right.width === topWidth &&
      this.bottom.width === topWidth &&
      this.left.width === topWidth
    );
  }

  private get _styleIsUniform() {
    const topStyle = this.top.style;
    return (
      this.right.style == topStyle &&
      this.bottom.style == topStyle &&
      this.left.style == topStyle
    );
  }

  private get _strokeAlignIsUniform() {
    const topStrokeAlign = this.top.strokeAlign;

    return (
      this.right.strokeAlign == topStrokeAlign &&
      this.bottom.strokeAlign == topStrokeAlign &&
      this.left.strokeAlign == topStrokeAlign
    );
  }
}

type BorderPathEls = {
  top: SVGPathElement;
  bottom: SVGPathElement;
  left: SVGPathElement;
  right: SVGPathElement;
};

export type BoxBorder = Border;

export default Border;
