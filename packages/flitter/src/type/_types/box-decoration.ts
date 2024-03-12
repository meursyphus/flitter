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
        t
      ),
      borderRadius: BorderRadius.lerp(
        a.borderRadius ?? BorderRadius.all(Radius.zero),
        b.borderRadius ?? BorderRadius.all(Radius.zero),
        t
      ),
      boxShadow: BoxShadow.lerp(a.boxShadow ?? [], b.boxShadow ?? [], t),
      shape: t < 0.5 ? a.shape : b.shape,
    });
  }

  equals(other: BoxDecoration): boolean {
    if (this === other) return true;
    if (!(other instanceof BoxDecoration)) return false;
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

  /**
   * @deprecated The method should not be used
   */
  equal(other: BoxDecoration): boolean {
    return this.equals(other);
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

  createBoxPainter(): BoxPainter {
    return new BoxDecorationPainter(this);
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

class BoxDecorationPainter implements BoxPainter {
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

    this.decoration.border?.paint(
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
      }
    );
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
      ""
    );
    box.setAttribute("filter", filter);
  }

  private paintBackgroundColor(box: SVGPathElement, rect: Rect) {
    box.setAttribute("stroke-width", "0");
    box.setAttribute("fill", this.decoration.color.value || "none");

    if (this.decoration.shape == "circle") {
      box.setAttribute("d", new Path().addOval(rect).getD());
      return;
    }

    if (this.decoration.borderRadius == null) {
      box.setAttribute("d", new Path().addRect(rect).getD());
      return;
    }

    box.setAttribute(
      "d",
      new Path()
        .addRRect(
          RRect.fromRectAndCorners({
            rect,
            topLeft: this.decoration.borderRadius.topLeft,
            topRight: this.decoration.borderRadius.topRight,
            bottomLeft: this.decoration.borderRadius.bottomLeft,
            bottomRight: this.decoration.borderRadius.bottomRight,
          })
        )
        .getD()
    );
  }
}

interface BoxPainter {
  paint(svgEls: Record<string, SVGElement>, size: Size): void;
}
