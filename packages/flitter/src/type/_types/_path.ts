import type Rect from "./_rect";
import type { RRect } from "./r-rect";

export class Path {
  private _d: string = "";

  getD(): string {
    return this._d;
  }

  moveTo(point: Offset) {
    return this._moveTo(point, false);
  }

  relativeMoveTo(point: Offset) {
    return this._moveTo(point, true);
  }

  lineTo(point: Offset) {
    return this._lineTo(point, false);
  }

  relativeLineTo(point: Offset) {
    return this._lineTo(point, true);
  }

  quadraticBezierTo(props: { controlPoint: Offset; endPoint: Offset }) {
    return this._quadraticBezierTo(props, false);
  }

  relativeQuadraticBezierTo(props: { controlPoint: Offset; endPoint: Offset }) {
    return this._quadraticBezierTo(props, true);
  }

  cubicTo(props: {
    endControlPoint: Offset;
    startControlPoint: Offset;
    endPoint: Offset;
  }) {
    return this._cubicTo(props, false);
  }

  relativeCubicTo(props: {
    endControlPoint: Offset;
    startControlPoint: Offset;
    endPoint: Offset;
  }) {
    return this._cubicTo(props, true);
  }

  arcToPoint(props: {
    endPoint: Offset;
    rotation: number;
    radius: Radius;
    largeArc: boolean;
    clockwise: boolean;
  }) {
    return this._arcToPoint(props, false);
  }

  relativeArcToPoint(props: {
    endPoint: Offset;
    rotation: number;
    radius: Radius;
    largeArc: boolean;
    clockwise: boolean;
  }) {
    return this._arcToPoint(props, true);
  }

  addRect(rect: Rect) {
    return this.moveTo({ x: rect.left, y: rect.top })
      .lineTo({ x: rect.right, y: rect.top })
      .lineTo({ x: rect.right, y: rect.bottom })
      .lineTo({ x: rect.left, y: rect.bottom })
      .close();
  }

  addRRect(rRect: RRect, { clockwise = true }: { clockwise?: boolean } = {}) {
    if (rRect.width == 0 || rRect.height == 0) {
      return this;
    }

    const {
      left,
      right,
      top,
      bottom,
      tlRadiusX,
      tlRadiusY,
      trRadiusX,
      trRadiusY,
      blRadiusX,
      blRadiusY,
      brRadiusX,
      brRadiusY,
    } = rRect;

    const common = {
      rotation: 0,
      largeArc: false,
      clockwise,
    };

    const points = [
      { x: left, y: top + tlRadiusY },
      { x: tlRadiusX, y: top },
      { x: right - trRadiusX, y: top },
      { x: right, y: top + trRadiusY },
      { x: right, y: bottom - brRadiusY },
      { x: right - brRadiusX, y: bottom },
      { x: left + blRadiusX, y: bottom },
      { x: left, y: bottom - blRadiusY },
    ];
    const radiuses = [
      { x: tlRadiusX, y: tlRadiusY },
      { x: trRadiusX, y: trRadiusY },
      { x: brRadiusX, y: brRadiusY },
      { x: blRadiusX, y: blRadiusY },
    ];

    if (!clockwise) {
      points.reverse();
      radiuses.reverse();
    }

    return this.moveTo(points[0])
      .arcToPoint({
        ...common,
        radius: radiuses[0],
        endPoint: points[1],
      })
      .lineTo(points[2])
      .arcToPoint({
        ...common,
        radius: radiuses[1],
        endPoint: points[3],
      })
      .lineTo(points[4])
      .arcToPoint({
        ...common,
        radius: radiuses[2],
        endPoint: points[5],
      })
      .lineTo(points[6])
      .arcToPoint({
        ...common,
        radius: radiuses[3],
        endPoint: points[7],
      })
      .close();
  }

  addDRRect({ inner, outer }: { inner: RRect; outer: RRect }) {
    return new Path().addRRect(outer).addRRect(inner, { clockwise: false });
  }

  addOval(rect: Rect) {
    const common = {
      rotation: 0,
      radius: { x: rect.width / 2, y: rect.height / 2 },
      largeArc: false,
      clockwise: true,
    };
    const point1 = { x: rect.left, y: (rect.top + rect.bottom) / 2 };
    const point2 = { x: rect.right, y: (rect.top + rect.bottom) / 2 };

    return this.moveTo(point1)
      .arcToPoint({
        ...common,
        endPoint: point2,
      })
      .arcToPoint({
        ...common,
        endPoint: point1,
      })
      .close();
  }

  addPolygons(points: Offset[]) {
    if (points.length < 3) throw Error("polygons need at least 3 points");

    this.moveTo(points[0]);
    points.slice(1).forEach((point) => this.lineTo(point));
    return this.close();
  }

  close() {
    this._d += "Z";
    return this;
  }

  private _quadraticBezierTo(
    {
      controlPoint,
      endPoint,
    }: {
      controlPoint: Offset;
      endPoint: Offset;
    },
    relative: boolean
  ) {
    this._d += `${relative ? "q" : "Q"}${controlPoint.x} ${controlPoint.y} ${
      endPoint.x
    } ${endPoint.y}`;
    return this;
  }

  private _lineTo({ x, y }: Offset, relative: boolean) {
    this._d += `${relative ? "l" : "L"}${x} ${y}`;
    return this;
  }

  private _moveTo({ x, y }: Offset, relative: boolean) {
    this._d += `${relative ? "m" : "M"}${x} ${y}`;
    return this;
  }

  private _cubicTo(
    {
      startControlPoint,
      endControlPoint,
      endPoint,
    }: {
      endControlPoint: Offset;
      startControlPoint: Offset;
      endPoint: Offset;
    },
    relative: boolean
  ) {
    this._d += `${relative ? "c" : "C"}${startControlPoint.x} ${
      startControlPoint.y
    } ${endControlPoint.x} ${endControlPoint.y} ${endPoint.x} ${endPoint.y}`;
    return this;
  }

  private _arcToPoint(
    {
      endPoint,
      radius,
      rotation,
      largeArc,
      clockwise,
    }: {
      endPoint: Offset;
      rotation: number;
      radius: Radius;
      largeArc: boolean;
      clockwise: boolean;
    },
    relative: boolean
  ) {
    this._d += `${relative ? "a" : "A"}${radius.x} ${radius.y} ${rotation} ${
      largeArc ? 1 : 0
    } ${clockwise ? 1 : 0} ${endPoint.x} ${endPoint.y}`;
    return this;
  }
}

type Offset = { x: number; y: number };

type Radius = {
  x: number;
  y: number;
};

export default Path;
