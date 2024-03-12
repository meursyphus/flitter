import Radius from "./_radius";
import type Rect from "./_rect";
type RRectProps = {
  top: number;
  left: number;
  bottom: number;
  right: number;
  tlRadiusX: number;
  tlRadiusY: number;
  blRadiusX: number;
  blRadiusY: number;
  trRadiusX: number;
  trRadiusY: number;
  brRadiusX: number;
  brRadiusY: number;
};
export class RRect {
  get width() {
    return this.right - this.left;
  }

  get height() {
    return this.bottom - this.top;
  }

  static fromLTRBXY({
    left,
    top,
    right,
    bottom,
    radiusX,
    radiusY,
  }: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    radiusX: number;
    radiusY: number;
  }) {
    return this.raw({
      top,
      left,
      right,
      bottom,
      tlRadiusX: radiusX,
      tlRadiusY: radiusY,
      trRadiusX: radiusX,
      trRadiusY: radiusY,
      blRadiusX: radiusX,
      blRadiusY: radiusY,
      brRadiusX: radiusX,
      brRadiusY: radiusY,
    });
  }

  static fromLTRBR({
    left,
    radius,
    top,
    right,
    bottom,
  }: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    radius: Radius;
  }) {
    return this.fromLTRBXY({
      left,
      top,
      right,
      bottom,
      radiusX: radius.x,
      radiusY: radius.y,
    });
  }

  static fromRectXY({
    radiusX,
    radiusY,
    rect,
  }: {
    rect: Rect;
    radiusX: number;
    radiusY: number;
  }) {
    return this.raw({
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      tlRadiusX: radiusX,
      tlRadiusY: radiusY,
      trRadiusX: radiusX,
      trRadiusY: radiusY,
      blRadiusX: radiusX,
      blRadiusY: radiusY,
      brRadiusX: radiusX,
      brRadiusY: radiusY,
    });
  }

  static fromRecAndRadius({ radius, rect }: { rect: Rect; radius: Radius }) {
    return this.fromRectXY({
      radiusX: radius.x,
      radiusY: radius.y,
      rect,
    });
  }

  static fromLTRBAndCorners({
    left,
    right,
    bottom,
    top,
    topLeft = Radius.zero,
    topRight = Radius.zero,
    bottomLeft = Radius.zero,
    bottomRight = Radius.zero,
  }: {
    left: number;
    right: number;
    bottom: number;
    top: number;
    topLeft?: Radius;
    topRight?: Radius;
    bottomLeft?: Radius;
    bottomRight?: Radius;
  }) {
    return this.raw({
      left,
      right,
      bottom,
      top,
      tlRadiusX: topLeft.x,
      tlRadiusY: topLeft.y,
      trRadiusX: topRight.x,
      trRadiusY: topRight.y,
      blRadiusX: bottomLeft.x,
      blRadiusY: bottomLeft.y,
      brRadiusX: bottomRight.x,
      brRadiusY: bottomRight.y,
    });
  }

  static fromRectAndCorners({
    rect,
    topLeft = Radius.zero,
    topRight = Radius.zero,
    bottomLeft = Radius.zero,
    bottomRight = Radius.zero,
  }: {
    rect: Rect;
    topLeft?: Radius;
    topRight?: Radius;
    bottomLeft?: Radius;
    bottomRight?: Radius;
  }) {
    return this.fromLTRBAndCorners({
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      top: rect.top,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    });
  }

  private constructor(
    public top: number,
    public left: number,
    public bottom: number,
    public right: number,
    public tlRadiusX: number,
    public tlRadiusY: number,
    public blRadiusX: number,
    public blRadiusY: number,
    public trRadiusX: number,
    public trRadiusY: number,
    public brRadiusX: number,
    public brRadiusY: number
  ) {}

  static raw({
    top,
    left,
    bottom,
    right,
    tlRadiusX,
    tlRadiusY,
    blRadiusX,
    blRadiusY,
    trRadiusX,
    trRadiusY,
    brRadiusX,
    brRadiusY,
  }: RRectProps) {
    return new RRect(
      top,
      left,
      bottom,
      right,
      tlRadiusX,
      tlRadiusY,
      blRadiusX,
      blRadiusY,
      trRadiusX,
      trRadiusY,
      brRadiusX,
      brRadiusY
    );
  }

  inflate(delta: number) {
    return RRect.raw({
      left: this.left - delta,
      top: this.top - delta,
      right: this.right + delta,
      bottom: this.bottom + delta,
      tlRadiusX: Math.max(0, this.tlRadiusX + delta),
      trRadiusX: Math.max(0, this.trRadiusX + delta),
      blRadiusX: Math.max(0, this.blRadiusX + delta),
      brRadiusX: Math.max(0, this.brRadiusX + delta),
      tlRadiusY: Math.max(0, this.tlRadiusY + delta),
      trRadiusY: Math.max(0, this.trRadiusY + delta),
      blRadiusY: Math.max(0, this.blRadiusY + delta),
      brRadiusY: Math.max(0, this.brRadiusY + delta),
    });
  }

  deflate(delta: number) {
    return this.inflate(-delta);
  }
}

export default RRect;
