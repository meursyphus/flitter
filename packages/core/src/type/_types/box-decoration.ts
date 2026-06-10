/* eslint-disable no-case-declarations */
import type { BoxBorder } from "./_border";
import Border from "./_border";
import type BorderRadiusGeometry from "./border-radius-geometry";
import type { EdgeInsetsGeometry } from "./edge-insets";
import Path from "./_path";
import Rect from "./_rect";
import type Size from "./_size";
import RRect from "./r-rect";
import Color from "./_color";
import BoxShadow from "./box-shadow";
import Utils, { assert } from "../../utils";
import { BorderSide } from "./_borders";
import BorderRadius from "./border-radius";
import Radius from "./_radius";
import Data from "./_data";

export type Decoration = BoxDecoration;

export default class BoxDecoration extends Data {
  readonly color: Color;
  readonly border?: Border;
  readonly borderRadius?: BorderRadiusGeometry;
  readonly boxShadow?: BoxShadow[];
  readonly shape: BoxShape;

  static lerp(a: BoxDecoration, b: BoxDecoration, t: number) {
    assert(t >= 0 && t <= 1, "t must be between 0 and 1");
    return new BoxDecoration({
      color: Utils.lerp(a.color, b.color, t),
      border: Border.lerp(
        a.border ?? Border.fromBorderSide(BorderSide.none),
        b.border ?? Border.fromBorderSide(BorderSide.none),
        t,
      ),
      borderRadius: BorderRadius.lerp(
        a.borderRadius ?? BorderRadius.all(Radius.zero),
        b.borderRadius ?? BorderRadius.all(Radius.zero),
        t,
      ),
      boxShadow: BoxShadow.lerp(a.boxShadow ?? [], b.boxShadow ?? [], t),
      shape: t < 0.5 ? a.shape : b.shape,
    });
  }

  equals(other: BoxDecoration): boolean {
    if (this === other) return true;
    if (
      !(this.color == null && other.color == null) &&
      (!(this.color != null && other.color != null) ||
        !this.color.equals(other.color))
    ) {
      return false;
    }
    if (
      !(this.border == null && other.border == null) &&
      (!(this.border != null && other.border != null) ||
        !this.border.equals(other.border))
    ) {
      return false;
    }
    if (
      !(this.borderRadius == null && other.borderRadius == null) &&
      (!(this.borderRadius != null && other.borderRadius != null) ||
        !this.borderRadius.equal(other.borderRadius))
    ) {
      return false;
    }

    if (
      !(this.boxShadow == null && other.boxShadow == null) &&
      (!(this.boxShadow != null && other.boxShadow != null) ||
        !BoxShadow.equals(this.boxShadow, other.boxShadow))
    ) {
      return false;
    }
    if (this.shape !== other.shape) return false;

    return true;
  }

  /*
    Those are not implemented
    gradient?: Gradient
    blendMode?: BlendMode
    image?: DecorationImage
  */

  constructor({
    color = "transparent",
    border,
    borderRadius,
    shape = "rectangle",
    boxShadow,
  }: {
    color?: string | Color;
    border?: BoxBorder;
    borderRadius?: BorderRadiusGeometry;
    shape?: BoxShape;
    boxShadow?: BoxShadow[];
  }) {
    super();
    this.color = typeof color === "string" ? Color.of(color) : color;
    this.border = border;
    this.borderRadius = borderRadius;
    this.shape = shape;
    this.boxShadow = boxShadow;
  }

  get padding(): EdgeInsetsGeometry | undefined {
    return this.border?.dimensions;
  }

  getClipPath(rect: Rect): Path {
    switch (this.shape) {
      case "circle":
        const center = rect.center;
        const radius = rect.shortestSide / 2;
        const square = Rect.fromCircle({ center, radius });
        return new Path().addOval(square);
      case "rectangle":
        if (this.borderRadius != null) {
          return new Path().addRRect(this.borderRadius.toRRect(rect));
        }
        return new Path().addRect(rect);
    }
  }

  private _backgroundPath?: Path;
  private _backgroundPathKey?: string;

  /**
   * The background path is pure in (this, rect): all decoration fields are
   * readonly and RenderDecoratedBox keeps the same instance while the
   * decoration is unchanged, so a single-slot memo can never go stale.
   */
  _resolveBackgroundPath(rect: Rect): Path {
    const key = `${rect.left} ${rect.top} ${rect.width} ${rect.height}`;
    if (this._backgroundPath == null || this._backgroundPathKey !== key) {
      this._backgroundPathKey = key;
      this._backgroundPath = this._buildBackgroundPath(rect);
    }
    return this._backgroundPath;
  }

  private _buildBackgroundPath(rect: Rect): Path {
    const path = new Path();
    if (this.shape === "circle") {
      return path.addOval(rect);
    }
    if (this.borderRadius == null) {
      return path.addRect(rect);
    }
    return path.addRRect(
      RRect.fromRectAndCorners({
        rect,
        topLeft: this.borderRadius.topLeft,
        topRight: this.borderRadius.topRight,
        bottomLeft: this.borderRadius.bottomLeft,
        bottomRight: this.borderRadius.bottomRight,
      }),
    );
  }

  createSvgBoxPainter() {
    return new BoxDecorationSvgPainter(this);
  }

  createCanvasBoxPainter() {
    return new BoxDecorationCanvasPainter(this);
  }

  copyWith({
    color = this.color,
    border = this.border,
    borderRadius = this.borderRadius,
    shape = this.shape,
    boxShadow = this.boxShadow,
  }: {
    color?: string | Color;
    border?: BoxBorder;
    borderRadius?: BorderRadiusGeometry;
    shape?: BoxShape;
    boxShadow?: BoxShadow[];
  }): BoxDecoration {
    return new BoxDecoration({ color, border, borderRadius, shape, boxShadow });
  }
}

export type BoxShape = "rectangle" | "circle";

type BoxDecorationSvgEls = {
  topBorder: SVGPathElement;
  leftBorder: SVGPathElement;
  rightBorder: SVGPathElement;
  bottomBorder: SVGPathElement;
  box: SVGPathElement;
};

class BoxDecorationSvgPainter {
  constructor(private decoration: BoxDecoration) {}

  paint(svgEls: BoxDecorationSvgEls, size: Size) {
    const rect = Rect.fromLTWH({
      left: 0,
      top: 0,
      width: size.width,
      height: size.height,
    });

    this.paintBackgroundColor(svgEls.box, rect);
    this.paintShadows(svgEls.box);

    const painter = this.decoration.border?.createSvgPainter();
    if (painter != null) {
      painter.paint(
        {
          top: svgEls.topBorder,
          bottom: svgEls.bottomBorder,
          left: svgEls.leftBorder,
          right: svgEls.rightBorder,
        },
        {
          rect,
          shape: this.decoration.shape,
          borderRadius: this.decoration.borderRadius,
        },
      );
    } else {
      svgEls.topBorder.setAttribute("d", "");
      svgEls.bottomBorder.setAttribute("d", "");
      svgEls.leftBorder.setAttribute("d", "");
      svgEls.rightBorder.setAttribute("d", "");
    }
  }

  private paintShadows(box: SVGPathElement) {
    if (
      this.decoration.boxShadow == null ||
      this.decoration.boxShadow.length === 0
    ) {
      box.removeAttribute("filter");
      return;
    }

    const filter = this.decoration.boxShadow.reduce(
      (acc, shadow) =>
        acc +
        ` drop-shadow(${shadow.offset.x} ${shadow.offset.y} ${shadow.blurRadius} ${shadow.color.value})`,
      "",
    );
    box.setAttribute("filter", filter);
  }

  private paintBackgroundColor(box: SVGPathElement, rect: Rect) {
    box.setAttribute("stroke-width", "0");
    box.setAttribute("fill", this.decoration.color.value || "none");
    box.setAttribute("d", this.decoration._resolveBackgroundPath(rect).getD());
  }
}

class BoxDecorationCanvasPainter {
  constructor(private decoration: BoxDecoration) {}

  paint(ctx: CanvasRenderingContext2D, rect: Rect) {
    const backgroundPath = this.paintBackgroundColor(ctx, rect);
    this.paintShadows(ctx, backgroundPath);
    if (this.decoration.border != null) {
      this.decoration.border.createCanvasPainter().paint(ctx, {
        rect,
        shape: this.decoration.shape,
        borderRadius: this.decoration.borderRadius,
      });
    }
  }

  private paintShadows(ctx: CanvasRenderingContext2D, backgroundPath: Path) {
    if (
      this.decoration.boxShadow == null ||
      this.decoration.boxShadow.length === 0
    ) {
      return;
    }

    this.decoration.boxShadow.forEach(shadow => {
      ctx.save();
      ctx.shadowOffsetX = shadow.offset.x;
      ctx.shadowOffsetY = shadow.offset.y;
      ctx.shadowBlur = shadow.blurRadius;
      ctx.shadowColor = shadow.color.value;

      ctx.fill(backgroundPath.toCanvasPath());
      ctx.restore();
    });
  }

  private paintBackgroundColor(ctx: CanvasRenderingContext2D, rect: Rect) {
    ctx.fillStyle = this.decoration.color.value || "none";
    const path = this.decoration._resolveBackgroundPath(rect);
    ctx.fill(path.toCanvasPath());
    return path;
  }
}
