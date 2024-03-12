import Utils, { assert } from "../../utils";
import Color from "./_color";
import Data from "./_data";
import type { EdgeInsetsGeometry } from "./edge-insets";
import type Path from "./_path";
import type Rect from "./_rect";

export type StrokeAlign = -1 | 0 | 1;

export interface ShapeBorder {
  get dimensions(): EdgeInsetsGeometry;

  getInnerPath(rect: Rect): Path;
  getOuterPath(rect: Rect): Path;
  paint(svgEls: Record<string, SVGElement>, _: { rect: Rect }): void;
}

export class BorderSide extends Data {
  readonly color: Color;
  readonly width: number;
  readonly style: BorderStyle;
  readonly strokeAlign: number;
  constructor({
    style = "solid",
    width = 1,
    color = "black",
    strokeAlign = BorderSide.strokeAlignInside,
  }: {
    color?: string | Color;
    width?: number;
    style?: BorderStyle;
    strokeAlign?: StrokeAlign;
  } = {}) {
    super();
    this.color = typeof color === "string" ? Color.of(color) : color;
    this.style = style;
    this.width = width;
    assert(
      strokeAlign >= -1 && strokeAlign <= 1,
      "strokeAlign must be between -1 and 1"
    );
    this.strokeAlign = strokeAlign;
  }

  static lerp(a: BorderSide, b: BorderSide, t: number) {
    return new BorderSide({
      style: t < 0.5 ? a.style : b.style,
      color: Utils.lerp(a.color, b.color, t),
      width: Utils.lerp(a.width, b.width, t),
      strokeAlign: Utils.lerp(a.strokeAlign, b.strokeAlign, t) as StrokeAlign,
    });
  }

  /**
   * @deprecated The method should not be used
   */
  equal(other: BorderSide) {
    return this.equals(other);
  }

  equals(other: BorderSide): boolean {
    if (this === other) return true;
    return (
      this.color === other.color &&
      this.width === other.width &&
      this.style === other.style &&
      this.strokeAlign === other.strokeAlign
    );
  }

  static strokeAlignInside = -1 as const;
  static strokeAlignCenter = 0 as const;
  static strokeAlignOutside = 1 as const;
  static get none() {
    return new BorderSide({ width: 0, style: "none" });
  }

  get strokeInset(): number {
    return this.width * (1 - (1 + this.strokeAlign) / 2);
  }

  get strokeOutset(): number {
    return (this.width * (1 + this.strokeAlign)) / 2;
  }

  get strokeOffset() {
    return this.width * this.strokeAlign;
  }

  paint(path: SVGPathElement) {
    if (this.style === "none") {
      path.setAttribute("stroke-width", "0");
      path.setAttribute("stroke", "transparent");
    } else {
      path.setAttribute("stroke-width", `${this.width}`);
      path.setAttribute("stroke", `${this.color.value}`);
    }

    path.setAttribute("fill", "none");
  }
}

export type BorderStyle = "solid" | "none";
