import Utils, { assert } from "../../utils";
import Data from "./_data";
import type EdgeInsets from "./edge-insets";
import Size from "./_size";

type ConstraintsProps = {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
};

/*
  It is like BoxConstraints on Flutter.
*/
class Constraints extends Data {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;

  constructor({
    maxHeight = Infinity,
    maxWidth = Infinity,
    minHeight = 0,
    minWidth = 0,
  }: ConstraintsProps = {}) {
    super();
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
  }

  static lerp(a: Constraints, b: Constraints, t: number): Constraints {
    assert(
      (Number.isFinite(a.minWidth) && Number.isFinite(b.minWidth)) ||
        (a.minWidth === Infinity && b.minWidth === Infinity),
      "Cannot interpolate between finite constraints and unbounded constraints."
    );
    assert(
      (Number.isFinite(a.maxWidth) && Number.isFinite(b.maxWidth)) ||
        (a.maxWidth === Infinity && b.maxWidth === Infinity),
      "Cannot interpolate between finite constraints and unbounded constraints."
    );
    assert(
      (Number.isFinite(a.minHeight) && Number.isFinite(b.minHeight)) ||
        (a.minHeight === Infinity && b.minHeight === Infinity),
      "Cannot interpolate between finite constraints and unbounded constraints."
    );
    assert(
      (Number.isFinite(a.minHeight) && Number.isFinite(b.minHeight)) ||
        (a.minHeight === Infinity && b.minHeight === Infinity),
      "Cannot interpolate between finite constraints and unbounded constraints."
    );

    return new Constraints({
      minWidth: Number.isFinite(a.minWidth)
        ? Utils.lerp(a.minWidth, b.minWidth, t)
        : Infinity,
      maxWidth: Number.isFinite(a.maxWidth)
        ? Utils.lerp(a.maxWidth, b.maxWidth, t)
        : Infinity,
      minHeight: Number.isFinite(a.minHeight)
        ? Utils.lerp(a.minHeight, b.minHeight, t)
        : Infinity,
      maxHeight: Number.isFinite(a.maxHeight)
        ? Utils.lerp(a.maxHeight, b.maxHeight, t)
        : Infinity,
    });
  }

  static expand({
    width = Infinity,
    height = Infinity,
  }: { width?: number; height?: number } = {}) {
    return new Constraints({
      maxHeight: height,
      minHeight: height,
      maxWidth: width,
      minWidth: width,
    });
  }

  static zero() {
    return new Constraints({
      minHeight: 0,
      maxHeight: 0,
      minWidth: 0,
      maxWidth: 0,
    });
  }

  static loose(size: { width: number; height: number }) {
    return new Constraints({
      minHeight: 0,
      maxHeight: size.height,
      minWidth: 0,
      maxWidth: size.width,
    });
  }

  static tight({ width, height }: { width: number; height: number }) {
    return new Constraints({
      maxHeight: height,
      minHeight: height,
      maxWidth: width,
      minWidth: width,
    });
  }

  static tightFor({ width, height }: { width?: number; height?: number }) {
    return new Constraints({
      maxHeight: height ?? Infinity,
      minHeight: height ?? 0,
      maxWidth: width ?? Infinity,
      minWidth: width ?? 0,
    });
  }

  enforce(parent: Constraints): Constraints {
    return new Constraints({
      minWidth: parent.constrainWidth(this.minWidth),
      maxWidth: parent.constrainWidth(this.maxWidth),
      minHeight: parent.constrainHeight(this.minHeight),
      maxHeight: parent.constrainHeight(this.maxHeight),
    });
  }

  loosen(): Constraints {
    return new Constraints({
      ...this,
      minHeight: 0,
      minWidth: 0,
    });
  }

  constrain({ width, height }: Size): Size {
    return new Size({
      width: this.constrainWidth(width),
      height: this.constrainHeight(height),
    });
  }

  normalize(): Constraints {
    return new Constraints({
      ...this,
      minHeight: Math.min(this.minHeight, this.maxHeight),
      minWidth: Math.min(this.minWidth, this.maxWidth),
    });
  }

  getMax(key: "width" | "height"): number {
    return key === "width" ? this.maxWidth : this.maxHeight;
  }

  getMin(key: "width" | "height"): number {
    return key === "width" ? this.minWidth : this.minHeight;
  }

  get hasTightWidth(): boolean {
    return this.maxWidth === this.minWidth;
  }

  get hasTightHeight(): boolean {
    return this.maxHeight === this.minHeight;
  }

  get isTight(): boolean {
    return this.hasTightWidth && this.hasBoundedHeight;
  }

  get hasBoundedWidth(): boolean {
    return this.maxWidth !== Infinity;
  }

  get hasBoundedHeight(): boolean {
    return this.maxHeight !== Infinity;
  }

  get isUnbounded(): boolean {
    return !this.hasBoundedHeight && !this.hasBoundedWidth;
  }

  get hasInfiniteWidth(): boolean {
    return this.minWidth >= Infinity;
  }

  get hasInfiniteHeight(): boolean {
    return this.minHeight >= Infinity;
  }

  copyWith({
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
  }: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  }): Constraints {
    return new Constraints({
      minHeight: minHeight ?? this.minHeight,
      maxHeight: maxHeight ?? this.maxHeight,
      minWidth: minWidth ?? this.minWidth,
      maxWidth: maxWidth ?? this.maxWidth,
    });
  }

  // Return new box constraints that are smaller by the given dimensions.
  deflate(edge: EdgeInsets) {
    const horizontal = edge.horizontal;
    const vertical = edge.vertical;
    const deflatedMinWidth = Math.max(0, this.minWidth - horizontal);
    const deflatedMinHeight = Math.max(0, this.minHeight - vertical);
    return new Constraints({
      minWidth: deflatedMinWidth,
      maxWidth: Math.max(deflatedMinWidth, this.maxWidth - horizontal),
      minHeight: deflatedMinHeight,
      maxHeight: Math.max(deflatedMinHeight, this.maxHeight - vertical),
    });
  }

  constrainWidth(width: number = Infinity) {
    return this.clampDouble(width, this.minWidth, this.maxWidth);
  }

  constrainHeight(height: number = Infinity) {
    return this.clampDouble(height, this.minHeight, this.maxHeight);
  }

  tighten({ width, height }: { width?: number; height?: number }) {
    return new Constraints({
      minWidth:
        width == null
          ? this.minWidth
          : this.clampDouble(width, this.minWidth, this.maxWidth),
      maxWidth:
        width == null
          ? this.maxWidth
          : this.clampDouble(width, this.minWidth, this.maxWidth),
      minHeight:
        height == null
          ? this.minHeight
          : this.clampDouble(height, this.minHeight, this.maxHeight),
      maxHeight:
        height == null
          ? this.maxHeight
          : this.clampDouble(height, this.minHeight, this.maxHeight),
    });
  }

  widthConstraints(): Constraints {
    return new Constraints({
      minWidth: this.minWidth,
      maxWidth: this.maxWidth,
    });
  }

  heightConstraints(): Constraints {
    return new Constraints({
      minHeight: this.minHeight,
      maxHeight: this.maxHeight,
    });
  }

  get smallest(): Size {
    return new Size({
      width: this.constrainWidth(0),
      height: this.constrainHeight(0),
    });
  }

  get biggest(): Size {
    return new Size({
      width: this.constrainWidth(),
      height: this.constrainHeight(),
    });
  }

  /**
   * @deprecated The method should not be used
   */
  equal(other: Constraints): boolean {
    return this.equals(other);
  }

  equals(other: Constraints): boolean {
    if (this === other) return true;
    return (
      this.maxWidth === other.maxWidth &&
      this.minWidth === other.minWidth &&
      this.maxHeight === other.maxHeight &&
      this.minHeight === other.minHeight
    );
  }

  private clampDouble(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }
}

export default Constraints;
