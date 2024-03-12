var Kt = Object.defineProperty;
var Qt = (u, s, t) => s in u ? Kt(u, s, { enumerable: !0, configurable: !0, writable: !0, value: t }) : u[s] = t;
var a = (u, s, t) => (Qt(u, typeof s != "symbol" ? s + "" : s, t), t), Dt = (u, s, t) => {
  if (!s.has(u))
    throw TypeError("Cannot " + t);
};
var tt = (u, s, t) => (Dt(u, s, "read from private field"), t ? t.call(u) : s.get(u)), pt = (u, s, t) => {
  if (s.has(u))
    throw TypeError("Cannot add the same private member more than once");
  s instanceof WeakSet ? s.add(u) : s.set(u, t);
}, vt = (u, s, t, e) => (Dt(u, s, "write to private field"), e ? e.call(u, t) : s.set(u, t), t);
import { jsx as Ht } from "react/jsx-runtime";
import { useRef as Ft, useEffect as Jt } from "react";
class kt {
  equals(s) {
    throw new Error("equals not implemented");
  }
}
class ut extends kt {
  plus(s) {
    throw Error("plus is not implemented");
  }
  minus(s) {
    return this.plus(s.multiply(-1));
  }
  multiply(s) {
    throw Error("multiply is not implemented");
  }
}
class T extends ut {
  constructor({ x: t, y: e }) {
    super();
    a(this, "x");
    a(this, "y");
    this.x = t, this.y = e;
  }
  static raw({ x: t, y: e }) {
    return new T({ x: t, y: e });
  }
  static zero() {
    return T.raw({ x: 0, y: 0 });
  }
  plus({ x: t, y: e }) {
    return T.raw({ x: this.x + t, y: this.y + e });
  }
  multiply(t) {
    return T.raw({ x: this.x * t, y: this.y * t });
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  minus(t) {
    return super.minus(t);
  }
}
class K {
  constructor(s, t, e, r) {
    this.left = s, this.top = t, this.right = e, this.bottom = r;
  }
  get width() {
    return this.right - this.left;
  }
  get height() {
    return this.bottom - this.top;
  }
  get shortestSide() {
    return Math.min(Math.abs(this.width), Math.abs(this.height));
  }
  get longestSide() {
    return Math.max(Math.abs(this.width), Math.abs(this.height));
  }
  get topLeft() {
    return new T({ x: this.left, y: this.top });
  }
  get topCenter() {
    return new T({ x: this.left + this.width / 2, y: this.top });
  }
  get topRight() {
    return new T({ x: this.right, y: this.top });
  }
  get center() {
    return new T({
      x: this.left + this.width / 2,
      y: this.top + this.height / 2
    });
  }
  static fromLTRB({
    left: s,
    top: t,
    right: e,
    bottom: r
  }) {
    return new K(s, t, e, r);
  }
  static fromLTWH({
    left: s,
    top: t,
    width: e,
    height: r
  }) {
    return K.fromLTRB({
      left: s,
      top: t,
      right: s + e,
      bottom: t + r
    });
  }
  static fromCircle({ center: s, radius: t }) {
    return K.fromCenter({ center: s, width: 2 * t, height: 2 * t });
  }
  static fromCenter({
    center: s,
    width: t,
    height: e
  }) {
    return K.fromLTRB({
      left: s.x - t / 2,
      top: s.y - e / 2,
      right: s.x + t / 2,
      bottom: s.y + e / 2
    });
  }
  static fromPoints(s, t) {
    return K.fromLTRB({
      left: Math.min(s.x, t.x),
      top: Math.min(s.y, t.y),
      right: Math.max(s.x, t.x),
      bottom: Math.max(s.y, t.y)
    });
  }
  inflate(s) {
    return K.fromLTRB({
      left: this.left - s,
      top: this.top - s,
      right: this.right + s,
      bottom: this.bottom + s
    });
  }
  deflate(s) {
    return this.inflate(-s);
  }
}
const D = class D extends ut {
  constructor({ x: t, y: e }) {
    super();
    a(this, "x");
    // -1 ~ 1
    a(this, "y");
    this.x = t, this.y = e;
  }
  // -1 ~ 1
  plus(t) {
    return new D({
      x: this.x + t.x,
      y: this.y + t.y
    });
  }
  multiply(t) {
    return new D({ x: this.x * t, y: this.y * t });
  }
  equals(t) {
    return t === this ? !0 : this.x === t.x && this.y === t.y;
  }
  /**
   * @deprecated The method should not be used
   */
  equal(t) {
    return this.equals(t);
  }
  add(t) {
    return new D({
      x: this.x + t.x,
      y: this.y + t.y
    });
  }
  alongOffset(t) {
    const e = t.x / 2, r = t.y / 2;
    return T.raw({
      x: e + this.x * e,
      y: r + this.y * r
    });
  }
  alongSize(t) {
    const e = t.width / 2, r = t.height / 2;
    return T.raw({
      x: e + this.x * e,
      y: r + this.y * r
    });
  }
  withRect(t) {
    const e = t.width / 2, r = t.height / 2;
    return T.raw({
      x: t.left + e + this.x * e,
      y: t.top + r + this.y * r
    });
  }
  /// Returns a rect of the given size, aligned within given rect as specified
  /// by this alignment.
  ///
  /// For example, a 100×100 size inscribed on a 200×200 rect using
  /// [Alignment.topLeft] would be the 100×100 rect at the top left of
  inscribe(t, e) {
    const r = (e.width - t.width) / 2, h = (e.height - t.height) / 2;
    return K.fromLTWH({
      left: e.left + r + this.x * r,
      top: e.top + h + this.y * h,
      width: t.width,
      height: t.height
    });
  }
  static lerp({
    start: t,
    end: e,
    t: r
  }) {
    if (!(t == null && e == null))
      return t == null ? new D({
        x: xt(0, e.x, r),
        y: xt(0, e.y, r)
      }) : e == null ? new D({
        x: xt(t.x, 0, r),
        y: xt(t.y, 0, r)
      }) : new D({
        x: xt(t.x, e.x, r),
        y: xt(t.y, e.y, r)
      });
  }
  getOffset({
    target: t,
    current: e
  }) {
    return new T({
      x: (1 + this.x) * (e.width - t.width) / 2,
      y: (1 + this.y) * (e.height - t.height) / 2
    });
  }
  static of({ x: t, y: e }) {
    return new D({ x: t, y: e });
  }
  resolve(t) {
    return this;
  }
};
a(D, "topLeft", D.of({ x: -1, y: -1 })), a(D, "topCenter", D.of({ x: 0, y: -1 })), a(D, "topRight", D.of({ x: 1, y: -1 })), a(D, "centerLeft", D.of({ x: -1, y: 0 })), a(D, "center", D.of({ x: 0, y: 0 })), a(D, "centerRight", D.of({ x: 1, y: 0 })), a(D, "bottomLeft", D.of({ x: -1, y: 1 })), a(D, "bottomCenter", D.of({ x: 0, y: 1 })), a(D, "bottomRight", D.of({ x: 1, y: 1 }));
let rt = D;
function xt(u, s, t) {
  if (t > 1 || t < 0)
    throw new Error("value must be between 0 and 1: " + t.toString());
  return u + (s - u) * t;
}
function Y(u, s) {
  if (!u)
    throw new Error(s || "Assertion failed");
}
function Vt(u, s, t) {
  return u + (s - u) * t;
}
const ts = 20, ss = 100, es = "007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N", rs = 12;
function is(u) {
  const s = {};
  if (typeof JSON > "u")
    return s;
  for (let t = 0; t < u.length; t++) {
    const e = String.fromCharCode(t + 32), r = (u.charCodeAt(t) - ts) / ss;
    s[e] = r;
  }
  return s;
}
const hs = is(es);
let Ot;
function gs() {
  return typeof window > "u" ? null : (Ot == null && (Ot = document.createElement("canvas").getContext("2d")), Ot);
}
function as({
  text: u,
  font: s
}) {
  const t = gs();
  if (t != null)
    return t.font = s, Math.ceil(t.measureText(u).width);
  const e = /(\d+)px/.exec(s), r = e && +e[1] || rs;
  let h = 0;
  if (s.indexOf("mono") >= 0)
    h = r * u.length;
  else
    for (let g = 0; g < u.length; g++) {
      const o = hs[u[g]];
      h += o == null ? r : o * r;
    }
  return Math.ceil(h);
}
function dt(u) {
  return (...s) => new u(...s);
}
const wt = class wt {
  static sum(s) {
    return s.reduce(wt.sumReducer, 0);
  }
  static repeat(s, t) {
    return Array.from({ length: t }, () => s);
  }
  static clampDouble(s, t, e) {
    return Math.min(e, Math.max(t, s));
  }
  static arrayEqual(s, t) {
    return s.length !== t.length ? !1 : s.every((e, r) => e === t[r]);
  }
  static lerp(s, t, e) {
    return Y(e >= 0 && e <= 1), typeof s == "number" ? Vt(s, t, e) : (Y(t instanceof ut), s.plus(t.minus(s).multiply(e)));
  }
};
a(wt, "sumReducer", (s, t) => s + t), a(wt, "maxReducer", (s, t) => Math.max(s, t)), a(wt, "minReducer", (s, t) => Math.min(s, t));
let G = wt;
const gt = class gt {
  constructor({ width: s, height: t }) {
    a(this, "width");
    a(this, "height");
    this.width = s, this.height = t;
  }
  equal(s) {
    return this === s ? !0 : this.width === s.width && this.height === s.height;
  }
  static maximum() {
    return new gt({ width: 1 / 0, height: 1 / 0 });
  }
  get isFinite() {
    return Number.isFinite(this.width) && Number.isFinite(this.height);
  }
  get shortest() {
    return Math.min(this.width, this.height);
  }
  get longest() {
    return Math.max(this.width, this.height);
  }
  minus(s) {
    return new T({
      x: this.width - s.width,
      y: this.height - s.height
    });
  }
};
a(gt, "zero", new gt({ width: 0, height: 0 })), //depricated because javascript is vernerable for unexpected mutating variable
a(gt, "infinite", new gt({ width: 1 / 0, height: 1 / 0 }));
let A = gt;
class N extends kt {
  constructor({
    maxHeight: t = 1 / 0,
    maxWidth: e = 1 / 0,
    minHeight: r = 0,
    minWidth: h = 0
  } = {}) {
    super();
    a(this, "minWidth");
    a(this, "maxWidth");
    a(this, "minHeight");
    a(this, "maxHeight");
    this.minWidth = h, this.maxWidth = e, this.minHeight = r, this.maxHeight = t;
  }
  static lerp(t, e, r) {
    return Y(
      Number.isFinite(t.minWidth) && Number.isFinite(e.minWidth) || t.minWidth === 1 / 0 && e.minWidth === 1 / 0,
      "Cannot interpolate between finite constraints and unbounded constraints."
    ), Y(
      Number.isFinite(t.maxWidth) && Number.isFinite(e.maxWidth) || t.maxWidth === 1 / 0 && e.maxWidth === 1 / 0,
      "Cannot interpolate between finite constraints and unbounded constraints."
    ), Y(
      Number.isFinite(t.minHeight) && Number.isFinite(e.minHeight) || t.minHeight === 1 / 0 && e.minHeight === 1 / 0,
      "Cannot interpolate between finite constraints and unbounded constraints."
    ), Y(
      Number.isFinite(t.minHeight) && Number.isFinite(e.minHeight) || t.minHeight === 1 / 0 && e.minHeight === 1 / 0,
      "Cannot interpolate between finite constraints and unbounded constraints."
    ), new N({
      minWidth: Number.isFinite(t.minWidth) ? G.lerp(t.minWidth, e.minWidth, r) : 1 / 0,
      maxWidth: Number.isFinite(t.maxWidth) ? G.lerp(t.maxWidth, e.maxWidth, r) : 1 / 0,
      minHeight: Number.isFinite(t.minHeight) ? G.lerp(t.minHeight, e.minHeight, r) : 1 / 0,
      maxHeight: Number.isFinite(t.maxHeight) ? G.lerp(t.maxHeight, e.maxHeight, r) : 1 / 0
    });
  }
  static expand({
    width: t = 1 / 0,
    height: e = 1 / 0
  } = {}) {
    return new N({
      maxHeight: e,
      minHeight: e,
      maxWidth: t,
      minWidth: t
    });
  }
  static zero() {
    return new N({
      minHeight: 0,
      maxHeight: 0,
      minWidth: 0,
      maxWidth: 0
    });
  }
  static loose(t) {
    return new N({
      minHeight: 0,
      maxHeight: t.height,
      minWidth: 0,
      maxWidth: t.width
    });
  }
  static tight({ width: t, height: e }) {
    return new N({
      maxHeight: e,
      minHeight: e,
      maxWidth: t,
      minWidth: t
    });
  }
  static tightFor({ width: t, height: e }) {
    return new N({
      maxHeight: e ?? 1 / 0,
      minHeight: e ?? 0,
      maxWidth: t ?? 1 / 0,
      minWidth: t ?? 0
    });
  }
  enforce(t) {
    return new N({
      minWidth: t.constrainWidth(this.minWidth),
      maxWidth: t.constrainWidth(this.maxWidth),
      minHeight: t.constrainHeight(this.minHeight),
      maxHeight: t.constrainHeight(this.maxHeight)
    });
  }
  loosen() {
    return new N({
      ...this,
      minHeight: 0,
      minWidth: 0
    });
  }
  constrain({ width: t, height: e }) {
    return new A({
      width: this.constrainWidth(t),
      height: this.constrainHeight(e)
    });
  }
  normalize() {
    return new N({
      ...this,
      minHeight: Math.min(this.minHeight, this.maxHeight),
      minWidth: Math.min(this.minWidth, this.maxWidth)
    });
  }
  getMax(t) {
    return t === "width" ? this.maxWidth : this.maxHeight;
  }
  getMin(t) {
    return t === "width" ? this.minWidth : this.minHeight;
  }
  get hasTightWidth() {
    return this.maxWidth === this.minWidth;
  }
  get hasTightHeight() {
    return this.maxHeight === this.minHeight;
  }
  get isTight() {
    return this.hasTightWidth && this.hasBoundedHeight;
  }
  get hasBoundedWidth() {
    return this.maxWidth !== 1 / 0;
  }
  get hasBoundedHeight() {
    return this.maxHeight !== 1 / 0;
  }
  get isUnbounded() {
    return !this.hasBoundedHeight && !this.hasBoundedWidth;
  }
  get hasInfiniteWidth() {
    return this.minWidth >= 1 / 0;
  }
  get hasInfiniteHeight() {
    return this.minHeight >= 1 / 0;
  }
  copyWith({
    maxHeight: t,
    maxWidth: e,
    minHeight: r,
    minWidth: h
  }) {
    return new N({
      minHeight: r ?? this.minHeight,
      maxHeight: t ?? this.maxHeight,
      minWidth: h ?? this.minWidth,
      maxWidth: e ?? this.maxWidth
    });
  }
  // Return new box constraints that are smaller by the given dimensions.
  deflate(t) {
    const e = t.horizontal, r = t.vertical, h = Math.max(0, this.minWidth - e), g = Math.max(0, this.minHeight - r);
    return new N({
      minWidth: h,
      maxWidth: Math.max(h, this.maxWidth - e),
      minHeight: g,
      maxHeight: Math.max(g, this.maxHeight - r)
    });
  }
  constrainWidth(t = 1 / 0) {
    return this.clampDouble(t, this.minWidth, this.maxWidth);
  }
  constrainHeight(t = 1 / 0) {
    return this.clampDouble(t, this.minHeight, this.maxHeight);
  }
  tighten({ width: t, height: e }) {
    return new N({
      minWidth: t == null ? this.minWidth : this.clampDouble(t, this.minWidth, this.maxWidth),
      maxWidth: t == null ? this.maxWidth : this.clampDouble(t, this.minWidth, this.maxWidth),
      minHeight: e == null ? this.minHeight : this.clampDouble(e, this.minHeight, this.maxHeight),
      maxHeight: e == null ? this.maxHeight : this.clampDouble(e, this.minHeight, this.maxHeight)
    });
  }
  widthConstraints() {
    return new N({
      minWidth: this.minWidth,
      maxWidth: this.maxWidth
    });
  }
  heightConstraints() {
    return new N({
      minHeight: this.minHeight,
      maxHeight: this.maxHeight
    });
  }
  get smallest() {
    return new A({
      width: this.constrainWidth(0),
      height: this.constrainHeight(0)
    });
  }
  get biggest() {
    return new A({
      width: this.constrainWidth(),
      height: this.constrainHeight()
    });
  }
  /**
   * @deprecated The method should not be used
   */
  equal(t) {
    return this.equals(t);
  }
  equals(t) {
    return this === t ? !0 : this.maxWidth === t.maxWidth && this.minWidth === t.minWidth && this.maxHeight === t.maxHeight && this.minHeight === t.minHeight;
  }
  clampDouble(t, e, r) {
    return Math.min(r, Math.max(e, t));
  }
}
class zt extends ut {
  constructor({ top: t, bottom: e, left: r, right: h }) {
    super();
    a(this, "top");
    a(this, "bottom");
    a(this, "left");
    a(this, "right");
    this.top = t, this.bottom = e, this.left = r, this.right = h;
  }
  plus(t) {
    return new zt({
      top: this.top + t.top,
      bottom: this.bottom + t.bottom,
      left: this.left + t.left,
      right: this.right + t.right
    });
  }
  multiply(t) {
    return new zt({
      top: this.top * t,
      bottom: this.bottom * t,
      left: this.left * t,
      right: this.right * t
    });
  }
  equals(t) {
    if (this !== t)
      return this.top === t.top && this.bottom === t.bottom && this.left === t.left && this.right === t.right;
  }
  /**
   * @deprecated The method should not be used
   * Instead use elquals
   */
  eqaul(t) {
    return this.equals(t);
  }
  get horizontal() {
    return this.left + this.right;
  }
  get vertical() {
    return this.top + this.bottom;
  }
  deflateRect(t) {
    return K.fromLTRB({
      left: t.left + this.left,
      top: t.top + this.top,
      bottom: t.bottom - this.bottom,
      right: t.right - this.right
    });
  }
  add(t) {
    return new zt({
      left: this.left + t.left,
      right: this.right + t.right,
      bottom: this.bottom + t.bottom,
      top: this.top + t.top
    });
  }
}
class at extends zt {
  static all(s) {
    return new at({
      top: s,
      bottom: s,
      left: s,
      right: s
    });
  }
  static symmetric({
    horizontal: s = 0,
    vertical: t = 0
  }) {
    return new at({
      top: t,
      bottom: t,
      left: s,
      right: s
    });
  }
  static only({
    top: s = 0,
    bottom: t = 0,
    left: e = 0,
    right: r = 0
  }) {
    return new at({
      top: s,
      bottom: t,
      left: e,
      right: r
    });
  }
  static fromLTRB({
    left: s,
    right: t,
    top: e,
    bottom: r
  }) {
    return new at({
      left: s,
      right: t,
      bottom: r,
      top: e
    });
  }
}
class os extends ut {
  constructor({
    topLeft: t,
    topRight: e,
    bottomLeft: r,
    bottomRight: h
  }) {
    super();
    a(this, "topLeft");
    a(this, "topRight");
    a(this, "bottomLeft");
    a(this, "bottomRight");
    this.bottomLeft = r, this.bottomRight = h, this.topLeft = t, this.topRight = e;
  }
  static lerp(t, e, r) {
    return G.lerp(t, e, r);
  }
  equals(t) {
    return this === t ? !0 : this.topLeft.equals(t.topLeft) && this.topRight.equals(t.topRight) && this.bottomLeft.equals(t.bottomLeft) && this.bottomRight.equals(t.bottomRight);
  }
  /**
   * @deprecated The method should not be used
   */
  equal(t) {
    return this.equals(t);
  }
  toRRect(t) {
    throw new Error("Not implemented");
  }
}
class Lt {
  constructor() {
    a(this, "_d", "");
  }
  getD() {
    return this._d;
  }
  moveTo(s) {
    return this._moveTo(s, !1);
  }
  relativeMoveTo(s) {
    return this._moveTo(s, !0);
  }
  lineTo(s) {
    return this._lineTo(s, !1);
  }
  relativeLineTo(s) {
    return this._lineTo(s, !0);
  }
  quadraticBezierTo(s) {
    return this._quadraticBezierTo(s, !1);
  }
  relativeQuadraticBezierTo(s) {
    return this._quadraticBezierTo(s, !0);
  }
  cubicTo(s) {
    return this._cubicTo(s, !1);
  }
  relativeCubicTo(s) {
    return this._cubicTo(s, !0);
  }
  arcToPoint(s) {
    return this._arcToPoint(s, !1);
  }
  relativeArcToPoint(s) {
    return this._arcToPoint(s, !0);
  }
  addRect(s) {
    return this.moveTo({ x: s.left, y: s.top }).lineTo({ x: s.right, y: s.top }).lineTo({ x: s.right, y: s.bottom }).lineTo({ x: s.left, y: s.bottom }).close();
  }
  addRRect(s, { clockwise: t = !0 } = {}) {
    if (s.width == 0 || s.height == 0)
      return this;
    const {
      left: e,
      right: r,
      top: h,
      bottom: g,
      tlRadiusX: o,
      tlRadiusY: _,
      trRadiusX: v,
      trRadiusY: x,
      blRadiusX: w,
      blRadiusY: m,
      brRadiusX: y,
      brRadiusY: d
    } = s, l = {
      rotation: 0,
      largeArc: !1,
      clockwise: t
    }, z = [
      { x: e, y: h + _ },
      { x: o, y: h },
      { x: r - v, y: h },
      { x: r, y: h + x },
      { x: r, y: g - d },
      { x: r - y, y: g },
      { x: e + w, y: g },
      { x: e, y: g - m }
    ], c = [
      { x: o, y: _ },
      { x: v, y: x },
      { x: y, y: d },
      { x: w, y: m }
    ];
    return t || (z.reverse(), c.reverse()), this.moveTo(z[0]).arcToPoint({
      ...l,
      radius: c[0],
      endPoint: z[1]
    }).lineTo(z[2]).arcToPoint({
      ...l,
      radius: c[1],
      endPoint: z[3]
    }).lineTo(z[4]).arcToPoint({
      ...l,
      radius: c[2],
      endPoint: z[5]
    }).lineTo(z[6]).arcToPoint({
      ...l,
      radius: c[3],
      endPoint: z[7]
    }).close();
  }
  addDRRect({ inner: s, outer: t }) {
    return new Lt().addRRect(t).addRRect(s, { clockwise: !1 });
  }
  addOval(s) {
    const t = {
      rotation: 0,
      radius: { x: s.width / 2, y: s.height / 2 },
      largeArc: !1,
      clockwise: !0
    }, e = { x: s.left, y: (s.top + s.bottom) / 2 }, r = { x: s.right, y: (s.top + s.bottom) / 2 };
    return this.moveTo(e).arcToPoint({
      ...t,
      endPoint: r
    }).arcToPoint({
      ...t,
      endPoint: e
    }).close();
  }
  addPolygons(s) {
    if (s.length < 3)
      throw Error("polygons need at least 3 points");
    return this.moveTo(s[0]), s.slice(1).forEach((t) => this.lineTo(t)), this.close();
  }
  close() {
    return this._d += "Z", this;
  }
  _quadraticBezierTo({
    controlPoint: s,
    endPoint: t
  }, e) {
    return this._d += `${e ? "q" : "Q"}${s.x} ${s.y} ${t.x} ${t.y}`, this;
  }
  _lineTo({ x: s, y: t }, e) {
    return this._d += `${e ? "l" : "L"}${s} ${t}`, this;
  }
  _moveTo({ x: s, y: t }, e) {
    return this._d += `${e ? "m" : "M"}${s} ${t}`, this;
  }
  _cubicTo({
    startControlPoint: s,
    endControlPoint: t,
    endPoint: e
  }, r) {
    return this._d += `${r ? "c" : "C"}${s.x} ${s.y} ${t.x} ${t.y} ${e.x} ${e.y}`, this;
  }
  _arcToPoint({
    endPoint: s,
    radius: t,
    rotation: e,
    largeArc: r,
    clockwise: h
  }, g) {
    return this._d += `${g ? "a" : "A"}${t.x} ${t.y} ${e} ${r ? 1 : 0} ${h ? 1 : 0} ${s.x} ${s.y}`, this;
  }
}
const Z = class Z extends ut {
  constructor(t, e) {
    super();
    a(this, "x");
    a(this, "y");
    this.x = t, this.y = e;
  }
  static circular(t) {
    return Z.elliptical({ x: t, y: t });
  }
  static elliptical({ x: t, y: e }) {
    return new Z(t, e);
  }
  plus(t) {
    return new Z(this.x + t.x, this.y + t.y);
  }
  multiply(t) {
    return new Z(this.x * t, this.y * t);
  }
  equals(t) {
    return this === t ? !0 : this.x === t.x && this.y === t.y;
  }
  /**
   * @deprecated The method should not be used
   */
  equal(t) {
    return this.equals(t);
  }
  clamp({ minimum: t, maximum: e }) {
    return t ?? (t = Z.circular(-1 / 0)), e ?? (e = Z.circular(1 / 0)), Z.elliptical({
      x: G.clampDouble(this.x, t.x, e.x),
      y: G.clampDouble(this.y, t.y, e.y)
    });
  }
  clampValues({
    maximumX: t = 1 / 0,
    maximumY: e = 1 / 0,
    minimumX: r = -1 / 0,
    minimumY: h = -1 / 0
  }) {
    return Z.elliptical({
      x: G.clampDouble(this.x, r, t),
      y: G.clampDouble(this.y, h, e)
    });
  }
};
a(Z, "zero", Z.circular(0));
let B = Z;
class ft {
  constructor(s, t, e, r, h, g, o, _, v, x, w, m) {
    this.top = s, this.left = t, this.bottom = e, this.right = r, this.tlRadiusX = h, this.tlRadiusY = g, this.blRadiusX = o, this.blRadiusY = _, this.trRadiusX = v, this.trRadiusY = x, this.brRadiusX = w, this.brRadiusY = m;
  }
  get width() {
    return this.right - this.left;
  }
  get height() {
    return this.bottom - this.top;
  }
  static fromLTRBXY({
    left: s,
    top: t,
    right: e,
    bottom: r,
    radiusX: h,
    radiusY: g
  }) {
    return this.raw({
      top: t,
      left: s,
      right: e,
      bottom: r,
      tlRadiusX: h,
      tlRadiusY: g,
      trRadiusX: h,
      trRadiusY: g,
      blRadiusX: h,
      blRadiusY: g,
      brRadiusX: h,
      brRadiusY: g
    });
  }
  static fromLTRBR({
    left: s,
    radius: t,
    top: e,
    right: r,
    bottom: h
  }) {
    return this.fromLTRBXY({
      left: s,
      top: e,
      right: r,
      bottom: h,
      radiusX: t.x,
      radiusY: t.y
    });
  }
  static fromRectXY({
    radiusX: s,
    radiusY: t,
    rect: e
  }) {
    return this.raw({
      top: e.top,
      left: e.left,
      right: e.right,
      bottom: e.bottom,
      tlRadiusX: s,
      tlRadiusY: t,
      trRadiusX: s,
      trRadiusY: t,
      blRadiusX: s,
      blRadiusY: t,
      brRadiusX: s,
      brRadiusY: t
    });
  }
  static fromRecAndRadius({ radius: s, rect: t }) {
    return this.fromRectXY({
      radiusX: s.x,
      radiusY: s.y,
      rect: t
    });
  }
  static fromLTRBAndCorners({
    left: s,
    right: t,
    bottom: e,
    top: r,
    topLeft: h = B.zero,
    topRight: g = B.zero,
    bottomLeft: o = B.zero,
    bottomRight: _ = B.zero
  }) {
    return this.raw({
      left: s,
      right: t,
      bottom: e,
      top: r,
      tlRadiusX: h.x,
      tlRadiusY: h.y,
      trRadiusX: g.x,
      trRadiusY: g.y,
      blRadiusX: o.x,
      blRadiusY: o.y,
      brRadiusX: _.x,
      brRadiusY: _.y
    });
  }
  static fromRectAndCorners({
    rect: s,
    topLeft: t = B.zero,
    topRight: e = B.zero,
    bottomLeft: r = B.zero,
    bottomRight: h = B.zero
  }) {
    return this.fromLTRBAndCorners({
      left: s.left,
      right: s.right,
      bottom: s.bottom,
      top: s.top,
      topLeft: t,
      topRight: e,
      bottomLeft: r,
      bottomRight: h
    });
  }
  static raw({
    top: s,
    left: t,
    bottom: e,
    right: r,
    tlRadiusX: h,
    tlRadiusY: g,
    blRadiusX: o,
    blRadiusY: _,
    trRadiusX: v,
    trRadiusY: x,
    brRadiusX: w,
    brRadiusY: m
  }) {
    return new ft(
      s,
      t,
      e,
      r,
      h,
      g,
      o,
      _,
      v,
      x,
      w,
      m
    );
  }
  inflate(s) {
    return ft.raw({
      left: this.left - s,
      top: this.top - s,
      right: this.right + s,
      bottom: this.bottom + s,
      tlRadiusX: Math.max(0, this.tlRadiusX + s),
      trRadiusX: Math.max(0, this.trRadiusX + s),
      blRadiusX: Math.max(0, this.blRadiusX + s),
      brRadiusX: Math.max(0, this.brRadiusX + s),
      tlRadiusY: Math.max(0, this.tlRadiusY + s),
      trRadiusY: Math.max(0, this.trRadiusY + s),
      blRadiusY: Math.max(0, this.blRadiusY + s),
      brRadiusY: Math.max(0, this.brRadiusY + s)
    });
  }
  deflate(s) {
    return this.inflate(-s);
  }
}
var it = /* @__PURE__ */ ((u) => (u.rtl = "rtl", u.ltr = "ltr", u))(it || {});
class It {
  constructor(...s) {
    a(this, "_m3storage");
    this._m3storage = s;
  }
  get storage() {
    return this._m3storage;
  }
  static zero() {
    return new It(0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class i {
  constructor(s, t, e, r) {
    a(this, "_v4storage");
    this._v4storage = [s, t, e, r];
  }
  get storage() {
    return this._v4storage;
  }
  static zero() {
    return new i(0, 0, 0, 0);
  }
  set xy(s) {
    const t = s._v2storage;
    this._v4storage[0] = t[0], this._v4storage[1] = t[1];
  }
  set xz(s) {
    const t = s._v2storage;
    this._v4storage[0] = t[0], this._v4storage[2] = t[1];
  }
  set xw(s) {
    const t = s._v2storage;
    this._v4storage[0] = t[0], this._v4storage[3] = t[1];
  }
  set yx(s) {
    const t = s._v2storage;
    this._v4storage[1] = t[0], this._v4storage[0] = t[1];
  }
  set yz(s) {
    const t = s._v2storage;
    this._v4storage[1] = t[0], this._v4storage[2] = t[1];
  }
  set yw(s) {
    const t = s._v2storage;
    this._v4storage[1] = t[0], this._v4storage[3] = t[1];
  }
  set zx(s) {
    const t = s._v2storage;
    this._v4storage[2] = t[0], this._v4storage[0] = t[1];
  }
  set zy(s) {
    const t = s._v2storage;
    this._v4storage[2] = t[0], this._v4storage[1] = t[1];
  }
  set zw(s) {
    const t = s._v2storage;
    this._v4storage[2] = t[0], this._v4storage[3] = t[1];
  }
  set wx(s) {
    const t = s._v2storage;
    this._v4storage[3] = t[0], this._v4storage[0] = t[1];
  }
  set wy(s) {
    const t = s._v2storage;
    this._v4storage[3] = t[0], this._v4storage[1] = t[1];
  }
  set wz(s) {
    const t = s._v2storage;
    this._v4storage[3] = t[0], this._v4storage[2] = t[1];
  }
  set xyz(s) {
    const t = s._v3storage;
    this._v4storage[0] = t[0], this._v4storage[1] = t[1], this._v4storage[2] = t[2];
  }
  set xyw(s) {
    const t = s._v3storage;
    this._v4storage[0] = t[0], this._v4storage[1] = t[1], this._v4storage[3] = t[2];
  }
  set xzy(s) {
    const t = s._v3storage;
    this._v4storage[0] = t[0], this._v4storage[2] = t[1], this._v4storage[1] = t[2];
  }
  set xzw(s) {
    const t = s._v3storage;
    this._v4storage[0] = t[0], this._v4storage[2] = t[1], this._v4storage[3] = t[2];
  }
  set xwy(s) {
    const t = s._v3storage;
    this._v4storage[0] = t[0], this._v4storage[3] = t[1], this._v4storage[1] = t[2];
  }
  set xwz(s) {
    const t = s._v3storage;
    this._v4storage[0] = t[0], this._v4storage[3] = t[1], this._v4storage[2] = t[2];
  }
  set yxz(s) {
    const t = s._v3storage;
    this._v4storage[1] = t[0], this._v4storage[0] = t[1], this._v4storage[2] = t[2];
  }
  set yxw(s) {
    const t = s._v3storage;
    this._v4storage[1] = t[0], this._v4storage[0] = t[1], this._v4storage[3] = t[2];
  }
  set yzx(s) {
    const t = s._v3storage;
    this._v4storage[1] = t[0], this._v4storage[2] = t[1], this._v4storage[0] = t[2];
  }
  set yzw(s) {
    const t = s._v3storage;
    this._v4storage[1] = t[0], this._v4storage[2] = t[1], this._v4storage[3] = t[2];
  }
  set ywx(s) {
    const t = s._v3storage;
    this._v4storage[1] = t[0], this._v4storage[3] = t[1], this._v4storage[0] = t[2];
  }
  set ywz(s) {
    const t = s._v3storage;
    this._v4storage[1] = t[0], this._v4storage[3] = t[1], this._v4storage[2] = t[2];
  }
  set zxy(s) {
    const t = s._v3storage;
    this._v4storage[2] = t[0], this._v4storage[0] = t[1], this._v4storage[1] = t[2];
  }
  set zxw(s) {
    const t = s._v3storage;
    this._v4storage[2] = t[0], this._v4storage[0] = t[1], this._v4storage[3] = t[2];
  }
  set zyx(s) {
    const t = s._v3storage;
    this._v4storage[2] = t[0], this._v4storage[1] = t[1], this._v4storage[0] = t[2];
  }
  set zyw(s) {
    const t = s._v3storage;
    this._v4storage[2] = t[0], this._v4storage[1] = t[1], this._v4storage[3] = t[2];
  }
  set zwx(s) {
    const t = s._v3storage;
    this._v4storage[2] = t[0], this._v4storage[3] = t[1], this._v4storage[0] = t[2];
  }
  set zwy(s) {
    const t = s._v3storage;
    this._v4storage[2] = t[0], this._v4storage[3] = t[1], this._v4storage[1] = t[2];
  }
  set wxy(s) {
    const t = s._v3storage;
    this._v4storage[3] = t[0], this._v4storage[0] = t[1], this._v4storage[1] = t[2];
  }
  set wxz(s) {
    const t = s._v3storage;
    this._v4storage[3] = t[0], this._v4storage[0] = t[1], this._v4storage[2] = t[2];
  }
  set wyx(s) {
    const t = s._v3storage;
    this._v4storage[3] = t[0], this._v4storage[1] = t[1], this._v4storage[0] = t[2];
  }
  set wyz(s) {
    const t = s._v3storage;
    this._v4storage[3] = t[0], this._v4storage[1] = t[1], this._v4storage[2] = t[2];
  }
  set wzx(s) {
    const t = s._v3storage;
    this._v4storage[3] = t[0], this._v4storage[2] = t[1], this._v4storage[0] = t[2];
  }
  set wzy(s) {
    const t = s._v3storage;
    this._v4storage[3] = t[0], this._v4storage[2] = t[1], this._v4storage[1] = t[2];
  }
  set xyzw(s) {
    const t = s._v4storage;
    this._v4storage[0] = t[0], this._v4storage[1] = t[1], this._v4storage[2] = t[2], this._v4storage[3] = t[3];
  }
  set xywz(s) {
    const t = s._v4storage;
    this._v4storage[0] = t[0], this._v4storage[1] = t[1], this._v4storage[3] = t[2], this._v4storage[2] = t[3];
  }
  set xzyw(s) {
    const t = s._v4storage;
    this._v4storage[0] = t[0], this._v4storage[2] = t[1], this._v4storage[1] = t[2], this._v4storage[3] = t[3];
  }
  set xzwy(s) {
    const t = s._v4storage;
    this._v4storage[0] = t[0], this._v4storage[2] = t[1], this._v4storage[3] = t[2], this._v4storage[1] = t[3];
  }
  set xwyz(s) {
    const t = s._v4storage;
    this._v4storage[0] = t[0], this._v4storage[3] = t[1], this._v4storage[1] = t[2], this._v4storage[2] = t[3];
  }
  set xwzy(s) {
    const t = s._v4storage;
    this._v4storage[0] = t[0], this._v4storage[3] = t[1], this._v4storage[2] = t[2], this._v4storage[1] = t[3];
  }
  set yxzw(s) {
    const t = s._v4storage;
    this._v4storage[1] = t[0], this._v4storage[0] = t[1], this._v4storage[2] = t[2], this._v4storage[3] = t[3];
  }
  set yxwz(s) {
    const t = s._v4storage;
    this._v4storage[1] = t[0], this._v4storage[0] = t[1], this._v4storage[3] = t[2], this._v4storage[2] = t[3];
  }
  set yzxw(s) {
    const t = s._v4storage;
    this._v4storage[1] = t[0], this._v4storage[2] = t[1], this._v4storage[0] = t[2], this._v4storage[3] = t[3];
  }
  set yzwx(s) {
    const t = s._v4storage;
    this._v4storage[1] = t[0], this._v4storage[2] = t[1], this._v4storage[3] = t[2], this._v4storage[0] = t[3];
  }
  set ywxz(s) {
    const t = s._v4storage;
    this._v4storage[1] = t[0], this._v4storage[3] = t[1], this._v4storage[0] = t[2], this._v4storage[2] = t[3];
  }
  set ywzx(s) {
    const t = s._v4storage;
    this._v4storage[1] = t[0], this._v4storage[3] = t[1], this._v4storage[2] = t[2], this._v4storage[0] = t[3];
  }
  set zxyw(s) {
    const t = s._v4storage;
    this._v4storage[2] = t[0], this._v4storage[0] = t[1], this._v4storage[1] = t[2], this._v4storage[3] = t[3];
  }
  set zxwy(s) {
    const t = s._v4storage;
    this._v4storage[2] = t[0], this._v4storage[0] = t[1], this._v4storage[3] = t[2], this._v4storage[1] = t[3];
  }
  set zyxw(s) {
    const t = s._v4storage;
    this._v4storage[2] = t[0], this._v4storage[1] = t[1], this._v4storage[0] = t[2], this._v4storage[3] = t[3];
  }
  set zywx(s) {
    const t = s._v4storage;
    this._v4storage[2] = t[0], this._v4storage[1] = t[1], this._v4storage[3] = t[2], this._v4storage[0] = t[3];
  }
  set zwxy(s) {
    const t = s._v4storage;
    this._v4storage[2] = t[0], this._v4storage[3] = t[1], this._v4storage[0] = t[2], this._v4storage[1] = t[3];
  }
  set zwyx(s) {
    const t = s._v4storage;
    this._v4storage[2] = t[0], this._v4storage[3] = t[1], this._v4storage[1] = t[2], this._v4storage[0] = t[3];
  }
  set wxyz(s) {
    const t = s._v4storage;
    this._v4storage[3] = t[0], this._v4storage[0] = t[1], this._v4storage[1] = t[2], this._v4storage[2] = t[3];
  }
  set wxzy(s) {
    const t = s._v4storage;
    this._v4storage[3] = t[0], this._v4storage[0] = t[1], this._v4storage[2] = t[2], this._v4storage[1] = t[3];
  }
  set wyxz(s) {
    const t = s._v4storage;
    this._v4storage[3] = t[0], this._v4storage[1] = t[1], this._v4storage[0] = t[2], this._v4storage[2] = t[3];
  }
  set wyzx(s) {
    const t = s._v4storage;
    this._v4storage[3] = t[0], this._v4storage[1] = t[1], this._v4storage[2] = t[2], this._v4storage[0] = t[3];
  }
  set wzxy(s) {
    const t = s._v4storage;
    this._v4storage[3] = t[0], this._v4storage[2] = t[1], this._v4storage[0] = t[2], this._v4storage[1] = t[3];
  }
  set wzyx(s) {
    const t = s._v4storage;
    this._v4storage[3] = t[0], this._v4storage[2] = t[1], this._v4storage[1] = t[2], this._v4storage[0] = t[3];
  }
  set r(s) {
    this.x = s;
  }
  set g(s) {
    this.y = s;
  }
  set b(s) {
    this.z = s;
  }
  set a(s) {
    this.w = s;
  }
  set s(s) {
    this.x = s;
  }
  set t(s) {
    this.y = s;
  }
  set p(s) {
    this.z = s;
  }
  set q(s) {
    this.w = s;
  }
  set x(s) {
    this._v4storage[0] = s;
  }
  set y(s) {
    this._v4storage[1] = s;
  }
  set z(s) {
    this._v4storage[2] = s;
  }
  set w(s) {
    this._v4storage[3] = s;
  }
  set rg(s) {
    this.xy = s;
  }
  set rb(s) {
    this.xz = s;
  }
  set ra(s) {
    this.xw = s;
  }
  set gr(s) {
    this.yx = s;
  }
  set gb(s) {
    this.yz = s;
  }
  set ga(s) {
    this.yw = s;
  }
  set br(s) {
    this.zx = s;
  }
  set bg(s) {
    this.zy = s;
  }
  set ba(s) {
    this.zw = s;
  }
  set ar(s) {
    this.wx = s;
  }
  set ag(s) {
    this.wy = s;
  }
  set ab(s) {
    this.wz = s;
  }
  set rgb(s) {
    this.xyz = s;
  }
  set rga(s) {
    this.xyw = s;
  }
  set rbg(s) {
    this.xzy = s;
  }
  set rba(s) {
    this.xzw = s;
  }
  set rag(s) {
    this.xwy = s;
  }
  set rab(s) {
    this.xwz = s;
  }
  set grb(s) {
    this.yxz = s;
  }
  set gra(s) {
    this.yxw = s;
  }
  set gbr(s) {
    this.yzx = s;
  }
  set gba(s) {
    this.yzw = s;
  }
  set gar(s) {
    this.ywx = s;
  }
  set gab(s) {
    this.ywz = s;
  }
  set brg(s) {
    this.zxy = s;
  }
  set bra(s) {
    this.zxw = s;
  }
  set bgr(s) {
    this.zyx = s;
  }
  set bga(s) {
    this.zyw = s;
  }
  set bar(s) {
    this.zwx = s;
  }
  set bag(s) {
    this.zwy = s;
  }
  set arg(s) {
    this.wxy = s;
  }
  set arb(s) {
    this.wxz = s;
  }
  set agr(s) {
    this.wyx = s;
  }
  set agb(s) {
    this.wyz = s;
  }
  set abr(s) {
    this.wzx = s;
  }
  set abg(s) {
    this.wzy = s;
  }
  set rgba(s) {
    this.xyzw = s;
  }
  set rgab(s) {
    this.xywz = s;
  }
  set rbga(s) {
    this.xzyw = s;
  }
  set rbag(s) {
    this.xzwy = s;
  }
  set ragb(s) {
    this.xwyz = s;
  }
  set rabg(s) {
    this.xwzy = s;
  }
  set grba(s) {
    this.yxzw = s;
  }
  set grab(s) {
    this.yxwz = s;
  }
  set gbra(s) {
    this.yzxw = s;
  }
  set gbar(s) {
    this.yzwx = s;
  }
  set garb(s) {
    this.ywxz = s;
  }
  set gabr(s) {
    this.ywzx = s;
  }
  set brga(s) {
    this.zxyw = s;
  }
  set brag(s) {
    this.zxwy = s;
  }
  set bgra(s) {
    this.zyxw = s;
  }
  set bgar(s) {
    this.zywx = s;
  }
  set barg(s) {
    this.zwxy = s;
  }
  set bagr(s) {
    this.zwyx = s;
  }
  set argb(s) {
    this.wxyz = s;
  }
  set arbg(s) {
    this.wxzy = s;
  }
  set agrb(s) {
    this.wyxz = s;
  }
  set agbr(s) {
    this.wyzx = s;
  }
  set abrg(s) {
    this.wzxy = s;
  }
  set abgr(s) {
    this.wzyx = s;
  }
  set st(s) {
    this.xy = s;
  }
  set sp(s) {
    this.xz = s;
  }
  set sq(s) {
    this.xw = s;
  }
  set ts(s) {
    this.yx = s;
  }
  set tp(s) {
    this.yz = s;
  }
  set tq(s) {
    this.yw = s;
  }
  set ps(s) {
    this.zx = s;
  }
  set pt(s) {
    this.zy = s;
  }
  set pq(s) {
    this.zw = s;
  }
  set qs(s) {
    this.wx = s;
  }
  set qt(s) {
    this.wy = s;
  }
  set qp(s) {
    this.wz = s;
  }
  set stp(s) {
    this.xyz = s;
  }
  set stq(s) {
    this.xyw = s;
  }
  set spt(s) {
    this.xzy = s;
  }
  set spq(s) {
    this.xzw = s;
  }
  set sqt(s) {
    this.xwy = s;
  }
  set sqp(s) {
    this.xwz = s;
  }
  set tsp(s) {
    this.yxz = s;
  }
  set tsq(s) {
    this.yxw = s;
  }
  set tps(s) {
    this.yzx = s;
  }
  set tpq(s) {
    this.yzw = s;
  }
  set tqs(s) {
    this.ywx = s;
  }
  set tqp(s) {
    this.ywz = s;
  }
  set pst(s) {
    this.zxy = s;
  }
  set psq(s) {
    this.zxw = s;
  }
  set pts(s) {
    this.zyx = s;
  }
  set ptq(s) {
    this.zyw = s;
  }
  set pqs(s) {
    this.zwx = s;
  }
  set pqt(s) {
    this.zwy = s;
  }
  set qst(s) {
    this.wxy = s;
  }
  set qsp(s) {
    this.wxz = s;
  }
  set qts(s) {
    this.wyx = s;
  }
  set qtp(s) {
    this.wyz = s;
  }
  set qps(s) {
    this.wzx = s;
  }
  set qpt(s) {
    this.wzy = s;
  }
  set stpq(s) {
    this.xyzw = s;
  }
  set stqp(s) {
    this.xywz = s;
  }
  set sptq(s) {
    this.xzyw = s;
  }
  set spqt(s) {
    this.xzwy = s;
  }
  set sqtp(s) {
    this.xwyz = s;
  }
  set sqpt(s) {
    this.xwzy = s;
  }
  set tspq(s) {
    this.yxzw = s;
  }
  set tsqp(s) {
    this.yxwz = s;
  }
  set tpsq(s) {
    this.yzxw = s;
  }
  set tpqs(s) {
    this.yzwx = s;
  }
  set tqsp(s) {
    this.ywxz = s;
  }
  set tqps(s) {
    this.ywzx = s;
  }
  set pstq(s) {
    this.zxyw = s;
  }
  set psqt(s) {
    this.zxwy = s;
  }
  set ptsq(s) {
    this.zyxw = s;
  }
  set ptqs(s) {
    this.zywx = s;
  }
  set pqst(s) {
    this.zwxy = s;
  }
  set pqts(s) {
    this.zwyx = s;
  }
  set qstp(s) {
    this.wxyz = s;
  }
  set qspt(s) {
    this.wxzy = s;
  }
  set qtsp(s) {
    this.wyxz = s;
  }
  set qtps(s) {
    this.wyzx = s;
  }
  set qpst(s) {
    this.wzxy = s;
  }
  set qpts(s) {
    this.wzyx = s;
  }
  get xx() {
    return new E(this._v4storage[0], this._v4storage[0]);
  }
  get xy() {
    return new E(this._v4storage[0], this._v4storage[1]);
  }
  get xz() {
    return new E(this._v4storage[0], this._v4storage[2]);
  }
  get xw() {
    return new E(this._v4storage[0], this._v4storage[3]);
  }
  get yx() {
    return new E(this._v4storage[1], this._v4storage[0]);
  }
  get yy() {
    return new E(this._v4storage[1], this._v4storage[1]);
  }
  get yz() {
    return new E(this._v4storage[1], this._v4storage[2]);
  }
  get yw() {
    return new E(this._v4storage[1], this._v4storage[3]);
  }
  get zx() {
    return new E(this._v4storage[2], this._v4storage[0]);
  }
  get zy() {
    return new E(this._v4storage[2], this._v4storage[1]);
  }
  get zz() {
    return new E(this._v4storage[2], this._v4storage[2]);
  }
  get zw() {
    return new E(this._v4storage[2], this._v4storage[3]);
  }
  get wx() {
    return new E(this._v4storage[3], this._v4storage[0]);
  }
  get wy() {
    return new E(this._v4storage[3], this._v4storage[1]);
  }
  get wz() {
    return new E(this._v4storage[3], this._v4storage[2]);
  }
  get ww() {
    return new E(this._v4storage[3], this._v4storage[3]);
  }
  get xxx() {
    return new p(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get xxy() {
    return new p(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get xxz() {
    return new p(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get xxw() {
    return new p(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get xyx() {
    return new p(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get xyy() {
    return new p(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get xyz() {
    return new p(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get xyw() {
    return new p(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get xzx() {
    return new p(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get xzy() {
    return new p(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get xzz() {
    return new p(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get xzw() {
    return new p(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get xwx() {
    return new p(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get xwy() {
    return new p(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get xwz() {
    return new p(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get xww() {
    return new p(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get yxx() {
    return new p(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get yxy() {
    return new p(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get yxz() {
    return new p(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get yxw() {
    return new p(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get yyx() {
    return new p(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get yyy() {
    return new p(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get yyz() {
    return new p(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get yyw() {
    return new p(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get yzx() {
    return new p(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get yzy() {
    return new p(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get yzz() {
    return new p(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get yzw() {
    return new p(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get ywx() {
    return new p(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get ywy() {
    return new p(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get ywz() {
    return new p(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get yww() {
    return new p(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get zxx() {
    return new p(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get zxy() {
    return new p(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get zxz() {
    return new p(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get zxw() {
    return new p(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get zyx() {
    return new p(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get zyy() {
    return new p(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get zyz() {
    return new p(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get zyw() {
    return new p(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get zzx() {
    return new p(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get zzy() {
    return new p(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get zzz() {
    return new p(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get zzw() {
    return new p(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get zwx() {
    return new p(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get zwy() {
    return new p(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get zwz() {
    return new p(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get zww() {
    return new p(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get wxx() {
    return new p(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get wxy() {
    return new p(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get wxz() {
    return new p(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get wxw() {
    return new p(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get wyx() {
    return new p(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get wyy() {
    return new p(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get wyz() {
    return new p(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get wyw() {
    return new p(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get wzx() {
    return new p(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get wzy() {
    return new p(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get wzz() {
    return new p(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get wzw() {
    return new p(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get wwx() {
    return new p(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get wwy() {
    return new p(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get wwz() {
    return new p(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get www() {
    return new p(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get xxxx() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get xxxy() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get xxxz() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get xxxw() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get xxyx() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get xxyy() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get xxyz() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get xxyw() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get xxzx() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get xxzy() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get xxzz() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get xxzw() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get xxwx() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get xxwy() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get xxwz() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get xxww() {
    return new i(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get xyxx() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get xyxy() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get xyxz() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get xyxw() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get xyyx() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get xyyy() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get xyyz() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get xyyw() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get xyzx() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get xyzy() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get xyzz() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get xyzw() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get xywx() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get xywy() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get xywz() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get xyww() {
    return new i(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get xzxx() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get xzxy() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get xzxz() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get xzxw() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get xzyx() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get xzyy() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get xzyz() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get xzyw() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get xzzx() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get xzzy() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get xzzz() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get xzzw() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get xzwx() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get xzwy() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get xzwz() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get xzww() {
    return new i(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get xwxx() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get xwxy() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get xwxz() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get xwxw() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get xwyx() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get xwyy() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get xwyz() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get xwyw() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get xwzx() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get xwzy() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get xwzz() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get xwzw() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get xwwx() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get xwwy() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get xwwz() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get xwww() {
    return new i(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get yxxx() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get yxxy() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get yxxz() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get yxxw() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get yxyx() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get yxyy() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get yxyz() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get yxyw() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get yxzx() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get yxzy() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get yxzz() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get yxzw() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get yxwx() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get yxwy() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get yxwz() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get yxww() {
    return new i(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get yyxx() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get yyxy() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get yyxz() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get yyxw() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get yyyx() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get yyyy() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get yyyz() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get yyyw() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get yyzx() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get yyzy() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get yyzz() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get yyzw() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get yywx() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get yywy() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get yywz() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get yyww() {
    return new i(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get yzxx() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get yzxy() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get yzxz() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get yzxw() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get yzyx() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get yzyy() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get yzyz() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get yzyw() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get yzzx() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get yzzy() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get yzzz() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get yzzw() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get yzwx() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get yzwy() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get yzwz() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get yzww() {
    return new i(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get ywxx() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get ywxy() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get ywxz() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get ywxw() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get ywyx() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get ywyy() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get ywyz() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get ywyw() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get ywzx() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get ywzy() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get ywzz() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get ywzw() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get ywwx() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get ywwy() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get ywwz() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get ywww() {
    return new i(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get zxxx() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get zxxy() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get zxxz() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get zxxw() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get zxyx() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get zxyy() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get zxyz() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get zxyw() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get zxzx() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get zxzy() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get zxzz() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get zxzw() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get zxwx() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get zxwy() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get zxwz() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get zxww() {
    return new i(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get zyxx() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get zyxy() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get zyxz() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get zyxw() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get zyyx() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get zyyy() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get zyyz() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get zyyw() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get zyzx() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get zyzy() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get zyzz() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get zyzw() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get zywx() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get zywy() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get zywz() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get zyww() {
    return new i(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get zzxx() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get zzxy() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get zzxz() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get zzxw() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get zzyx() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get zzyy() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get zzyz() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get zzyw() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get zzzx() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get zzzy() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get zzzz() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get zzzw() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get zzwx() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get zzwy() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get zzwz() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get zzww() {
    return new i(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get zwxx() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get zwxy() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get zwxz() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get zwxw() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get zwyx() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get zwyy() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get zwyz() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get zwyw() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get zwzx() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get zwzy() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get zwzz() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get zwzw() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get zwwx() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get zwwy() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get zwwz() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get zwww() {
    return new i(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get wxxx() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get wxxy() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get wxxz() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get wxxw() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get wxyx() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get wxyy() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get wxyz() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get wxyw() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get wxzx() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get wxzy() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get wxzz() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get wxzw() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get wxwx() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get wxwy() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get wxwz() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get wxww() {
    return new i(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get wyxx() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get wyxy() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get wyxz() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get wyxw() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get wyyx() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get wyyy() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get wyyz() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get wyyw() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get wyzx() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get wyzy() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get wyzz() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get wyzw() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get wywx() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get wywy() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get wywz() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get wyww() {
    return new i(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get wzxx() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get wzxy() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get wzxz() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get wzxw() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get wzyx() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get wzyy() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get wzyz() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get wzyw() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get wzzx() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get wzzy() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get wzzz() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get wzzw() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get wzwx() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get wzwy() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get wzwz() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get wzww() {
    return new i(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get wwxx() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get wwxy() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get wwxz() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get wwxw() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get wwyx() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get wwyy() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get wwyz() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get wwyw() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get wwzx() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get wwzy() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get wwzz() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get wwzw() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get wwwx() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get wwwy() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get wwwz() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get wwww() {
    return new i(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get r() {
    return this.x;
  }
  get g() {
    return this.y;
  }
  get b() {
    return this.z;
  }
  get a() {
    return this.w;
  }
  get s() {
    return this.x;
  }
  get t() {
    return this.y;
  }
  get p() {
    return this.z;
  }
  get q() {
    return this.w;
  }
  get x() {
    return this._v4storage[0];
  }
  get y() {
    return this._v4storage[1];
  }
  get z() {
    return this._v4storage[2];
  }
  get w() {
    return this._v4storage[3];
  }
  get rr() {
    return this.xx;
  }
  get rg() {
    return this.xy;
  }
  get rb() {
    return this.xz;
  }
  get ra() {
    return this.xw;
  }
  get gr() {
    return this.yx;
  }
  get gg() {
    return this.yy;
  }
  get gb() {
    return this.yz;
  }
  get ga() {
    return this.yw;
  }
  get br() {
    return this.zx;
  }
  get bg() {
    return this.zy;
  }
  get bb() {
    return this.zz;
  }
  get ba() {
    return this.zw;
  }
  get ar() {
    return this.wx;
  }
  get ag() {
    return this.wy;
  }
  get ab() {
    return this.wz;
  }
  get aa() {
    return this.ww;
  }
  get rrr() {
    return this.xxx;
  }
  get rrg() {
    return this.xxy;
  }
  get rrb() {
    return this.xxz;
  }
  get rra() {
    return this.xxw;
  }
  get rgr() {
    return this.xyx;
  }
  get rgg() {
    return this.xyy;
  }
  get rgb() {
    return this.xyz;
  }
  get rga() {
    return this.xyw;
  }
  get rbr() {
    return this.xzx;
  }
  get rbg() {
    return this.xzy;
  }
  get rbb() {
    return this.xzz;
  }
  get rba() {
    return this.xzw;
  }
  get rar() {
    return this.xwx;
  }
  get rag() {
    return this.xwy;
  }
  get rab() {
    return this.xwz;
  }
  get raa() {
    return this.xww;
  }
  get grr() {
    return this.yxx;
  }
  get grg() {
    return this.yxy;
  }
  get grb() {
    return this.yxz;
  }
  get gra() {
    return this.yxw;
  }
  get ggr() {
    return this.yyx;
  }
  get ggg() {
    return this.yyy;
  }
  get ggb() {
    return this.yyz;
  }
  get gga() {
    return this.yyw;
  }
  get gbr() {
    return this.yzx;
  }
  get gbg() {
    return this.yzy;
  }
  get gbb() {
    return this.yzz;
  }
  get gba() {
    return this.yzw;
  }
  get gar() {
    return this.ywx;
  }
  get gag() {
    return this.ywy;
  }
  get gab() {
    return this.ywz;
  }
  get gaa() {
    return this.yww;
  }
  get brr() {
    return this.zxx;
  }
  get brg() {
    return this.zxy;
  }
  get brb() {
    return this.zxz;
  }
  get bra() {
    return this.zxw;
  }
  get bgr() {
    return this.zyx;
  }
  get bgg() {
    return this.zyy;
  }
  get bgb() {
    return this.zyz;
  }
  get bga() {
    return this.zyw;
  }
  get bbr() {
    return this.zzx;
  }
  get bbg() {
    return this.zzy;
  }
  get bbb() {
    return this.zzz;
  }
  get bba() {
    return this.zzw;
  }
  get bar() {
    return this.zwx;
  }
  get bag() {
    return this.zwy;
  }
  get bab() {
    return this.zwz;
  }
  get baa() {
    return this.zww;
  }
  get arr() {
    return this.wxx;
  }
  get arg() {
    return this.wxy;
  }
  get arb() {
    return this.wxz;
  }
  get ara() {
    return this.wxw;
  }
  get agr() {
    return this.wyx;
  }
  get agg() {
    return this.wyy;
  }
  get agb() {
    return this.wyz;
  }
  get aga() {
    return this.wyw;
  }
  get abr() {
    return this.wzx;
  }
  get abg() {
    return this.wzy;
  }
  get abb() {
    return this.wzz;
  }
  get aba() {
    return this.wzw;
  }
  get aar() {
    return this.wwx;
  }
  get aag() {
    return this.wwy;
  }
  get aab() {
    return this.wwz;
  }
  get aaa() {
    return this.www;
  }
  get rrrr() {
    return this.xxxx;
  }
  get rrrg() {
    return this.xxxy;
  }
  get rrrb() {
    return this.xxxz;
  }
  get rrra() {
    return this.xxxw;
  }
  get rrgr() {
    return this.xxyx;
  }
  get rrgg() {
    return this.xxyy;
  }
  get rrgb() {
    return this.xxyz;
  }
  get rrga() {
    return this.xxyw;
  }
  get rrbr() {
    return this.xxzx;
  }
  get rrbg() {
    return this.xxzy;
  }
  get rrbb() {
    return this.xxzz;
  }
  get rrba() {
    return this.xxzw;
  }
  get rrar() {
    return this.xxwx;
  }
  get rrag() {
    return this.xxwy;
  }
  get rrab() {
    return this.xxwz;
  }
  get rraa() {
    return this.xxww;
  }
  get rgrr() {
    return this.xyxx;
  }
  get rgrg() {
    return this.xyxy;
  }
  get rgrb() {
    return this.xyxz;
  }
  get rgra() {
    return this.xyxw;
  }
  get rggr() {
    return this.xyyx;
  }
  get rggg() {
    return this.xyyy;
  }
  get rggb() {
    return this.xyyz;
  }
  get rgga() {
    return this.xyyw;
  }
  get rgbr() {
    return this.xyzx;
  }
  get rgbg() {
    return this.xyzy;
  }
  get rgbb() {
    return this.xyzz;
  }
  get rgba() {
    return this.xyzw;
  }
  get rgar() {
    return this.xywx;
  }
  get rgag() {
    return this.xywy;
  }
  get rgab() {
    return this.xywz;
  }
  get rgaa() {
    return this.xyww;
  }
  get rbrr() {
    return this.xzxx;
  }
  get rbrg() {
    return this.xzxy;
  }
  get rbrb() {
    return this.xzxz;
  }
  get rbra() {
    return this.xzxw;
  }
  get rbgr() {
    return this.xzyx;
  }
  get rbgg() {
    return this.xzyy;
  }
  get rbgb() {
    return this.xzyz;
  }
  get rbga() {
    return this.xzyw;
  }
  get rbbr() {
    return this.xzzx;
  }
  get rbbg() {
    return this.xzzy;
  }
  get rbbb() {
    return this.xzzz;
  }
  get rbba() {
    return this.xzzw;
  }
  get rbar() {
    return this.xzwx;
  }
  get rbag() {
    return this.xzwy;
  }
  get rbab() {
    return this.xzwz;
  }
  get rbaa() {
    return this.xzww;
  }
  get rarr() {
    return this.xwxx;
  }
  get rarg() {
    return this.xwxy;
  }
  get rarb() {
    return this.xwxz;
  }
  get rara() {
    return this.xwxw;
  }
  get ragr() {
    return this.xwyx;
  }
  get ragg() {
    return this.xwyy;
  }
  get ragb() {
    return this.xwyz;
  }
  get raga() {
    return this.xwyw;
  }
  get rabr() {
    return this.xwzx;
  }
  get rabg() {
    return this.xwzy;
  }
  get rabb() {
    return this.xwzz;
  }
  get raba() {
    return this.xwzw;
  }
  get raar() {
    return this.xwwx;
  }
  get raag() {
    return this.xwwy;
  }
  get raab() {
    return this.xwwz;
  }
  get raaa() {
    return this.xwww;
  }
  get grrr() {
    return this.yxxx;
  }
  get grrg() {
    return this.yxxy;
  }
  get grrb() {
    return this.yxxz;
  }
  get grra() {
    return this.yxxw;
  }
  get grgr() {
    return this.yxyx;
  }
  get grgg() {
    return this.yxyy;
  }
  get grgb() {
    return this.yxyz;
  }
  get grga() {
    return this.yxyw;
  }
  get grbr() {
    return this.yxzx;
  }
  get grbg() {
    return this.yxzy;
  }
  get grbb() {
    return this.yxzz;
  }
  get grba() {
    return this.yxzw;
  }
  get grar() {
    return this.yxwx;
  }
  get grag() {
    return this.yxwy;
  }
  get grab() {
    return this.yxwz;
  }
  get graa() {
    return this.yxww;
  }
  get ggrr() {
    return this.yyxx;
  }
  get ggrg() {
    return this.yyxy;
  }
  get ggrb() {
    return this.yyxz;
  }
  get ggra() {
    return this.yyxw;
  }
  get gggr() {
    return this.yyyx;
  }
  get gggg() {
    return this.yyyy;
  }
  get gggb() {
    return this.yyyz;
  }
  get ggga() {
    return this.yyyw;
  }
  get ggbr() {
    return this.yyzx;
  }
  get ggbg() {
    return this.yyzy;
  }
  get ggbb() {
    return this.yyzz;
  }
  get ggba() {
    return this.yyzw;
  }
  get ggar() {
    return this.yywx;
  }
  get ggag() {
    return this.yywy;
  }
  get ggab() {
    return this.yywz;
  }
  get ggaa() {
    return this.yyww;
  }
  get gbrr() {
    return this.yzxx;
  }
  get gbrg() {
    return this.yzxy;
  }
  get gbrb() {
    return this.yzxz;
  }
  get gbra() {
    return this.yzxw;
  }
  get gbgr() {
    return this.yzyx;
  }
  get gbgg() {
    return this.yzyy;
  }
  get gbgb() {
    return this.yzyz;
  }
  get gbga() {
    return this.yzyw;
  }
  get gbbr() {
    return this.yzzx;
  }
  get gbbg() {
    return this.yzzy;
  }
  get gbbb() {
    return this.yzzz;
  }
  get gbba() {
    return this.yzzw;
  }
  get gbar() {
    return this.yzwx;
  }
  get gbag() {
    return this.yzwy;
  }
  get gbab() {
    return this.yzwz;
  }
  get gbaa() {
    return this.yzww;
  }
  get garr() {
    return this.ywxx;
  }
  get garg() {
    return this.ywxy;
  }
  get garb() {
    return this.ywxz;
  }
  get gara() {
    return this.ywxw;
  }
  get gagr() {
    return this.ywyx;
  }
  get gagg() {
    return this.ywyy;
  }
  get gagb() {
    return this.ywyz;
  }
  get gaga() {
    return this.ywyw;
  }
  get gabr() {
    return this.ywzx;
  }
  get gabg() {
    return this.ywzy;
  }
  get gabb() {
    return this.ywzz;
  }
  get gaba() {
    return this.ywzw;
  }
  get gaar() {
    return this.ywwx;
  }
  get gaag() {
    return this.ywwy;
  }
  get gaab() {
    return this.ywwz;
  }
  get gaaa() {
    return this.ywww;
  }
  get brrr() {
    return this.zxxx;
  }
  get brrg() {
    return this.zxxy;
  }
  get brrb() {
    return this.zxxz;
  }
  get brra() {
    return this.zxxw;
  }
  get brgr() {
    return this.zxyx;
  }
  get brgg() {
    return this.zxyy;
  }
  get brgb() {
    return this.zxyz;
  }
  get brga() {
    return this.zxyw;
  }
  get brbr() {
    return this.zxzx;
  }
  get brbg() {
    return this.zxzy;
  }
  get brbb() {
    return this.zxzz;
  }
  get brba() {
    return this.zxzw;
  }
  get brar() {
    return this.zxwx;
  }
  get brag() {
    return this.zxwy;
  }
  get brab() {
    return this.zxwz;
  }
  get braa() {
    return this.zxww;
  }
  get bgrr() {
    return this.zyxx;
  }
  get bgrg() {
    return this.zyxy;
  }
  get bgrb() {
    return this.zyxz;
  }
  get bgra() {
    return this.zyxw;
  }
  get bggr() {
    return this.zyyx;
  }
  get bggg() {
    return this.zyyy;
  }
  get bggb() {
    return this.zyyz;
  }
  get bgga() {
    return this.zyyw;
  }
  get bgbr() {
    return this.zyzx;
  }
  get bgbg() {
    return this.zyzy;
  }
  get bgbb() {
    return this.zyzz;
  }
  get bgba() {
    return this.zyzw;
  }
  get bgar() {
    return this.zywx;
  }
  get bgag() {
    return this.zywy;
  }
  get bgab() {
    return this.zywz;
  }
  get bgaa() {
    return this.zyww;
  }
  get bbrr() {
    return this.zzxx;
  }
  get bbrg() {
    return this.zzxy;
  }
  get bbrb() {
    return this.zzxz;
  }
  get bbra() {
    return this.zzxw;
  }
  get bbgr() {
    return this.zzyx;
  }
  get bbgg() {
    return this.zzyy;
  }
  get bbgb() {
    return this.zzyz;
  }
  get bbga() {
    return this.zzyw;
  }
  get bbbr() {
    return this.zzzx;
  }
  get bbbg() {
    return this.zzzy;
  }
  get bbbb() {
    return this.zzzz;
  }
  get bbba() {
    return this.zzzw;
  }
  get bbar() {
    return this.zzwx;
  }
  get bbag() {
    return this.zzwy;
  }
  get bbab() {
    return this.zzwz;
  }
  get bbaa() {
    return this.zzww;
  }
  get barr() {
    return this.zwxx;
  }
  get barg() {
    return this.zwxy;
  }
  get barb() {
    return this.zwxz;
  }
  get bara() {
    return this.zwxw;
  }
  get bagr() {
    return this.zwyx;
  }
  get bagg() {
    return this.zwyy;
  }
  get bagb() {
    return this.zwyz;
  }
  get baga() {
    return this.zwyw;
  }
  get babr() {
    return this.zwzx;
  }
  get babg() {
    return this.zwzy;
  }
  get babb() {
    return this.zwzz;
  }
  get baba() {
    return this.zwzw;
  }
  get baar() {
    return this.zwwx;
  }
  get baag() {
    return this.zwwy;
  }
  get baab() {
    return this.zwwz;
  }
  get baaa() {
    return this.zwww;
  }
  get arrr() {
    return this.wxxx;
  }
  get arrg() {
    return this.wxxy;
  }
  get arrb() {
    return this.wxxz;
  }
  get arra() {
    return this.wxxw;
  }
  get argr() {
    return this.wxyx;
  }
  get argg() {
    return this.wxyy;
  }
  get argb() {
    return this.wxyz;
  }
  get arga() {
    return this.wxyw;
  }
  get arbr() {
    return this.wxzx;
  }
  get arbg() {
    return this.wxzy;
  }
  get arbb() {
    return this.wxzz;
  }
  get arba() {
    return this.wxzw;
  }
  get arar() {
    return this.wxwx;
  }
  get arag() {
    return this.wxwy;
  }
  get arab() {
    return this.wxwz;
  }
  get araa() {
    return this.wxww;
  }
  get agrr() {
    return this.wyxx;
  }
  get agrg() {
    return this.wyxy;
  }
  get agrb() {
    return this.wyxz;
  }
  get agra() {
    return this.wyxw;
  }
  get aggr() {
    return this.wyyx;
  }
  get aggg() {
    return this.wyyy;
  }
  get aggb() {
    return this.wyyz;
  }
  get agga() {
    return this.wyyw;
  }
  get agbr() {
    return this.wyzx;
  }
  get agbg() {
    return this.wyzy;
  }
  get agbb() {
    return this.wyzz;
  }
  get agba() {
    return this.wyzw;
  }
  get agar() {
    return this.wywx;
  }
  get agag() {
    return this.wywy;
  }
  get agab() {
    return this.wywz;
  }
  get agaa() {
    return this.wyww;
  }
  get abrr() {
    return this.wzxx;
  }
  get abrg() {
    return this.wzxy;
  }
  get abrb() {
    return this.wzxz;
  }
  get abra() {
    return this.wzxw;
  }
  get abgr() {
    return this.wzyx;
  }
  get abgg() {
    return this.wzyy;
  }
  get abgb() {
    return this.wzyz;
  }
  get abga() {
    return this.wzyw;
  }
  get abbr() {
    return this.wzzx;
  }
  get abbg() {
    return this.wzzy;
  }
  get abbb() {
    return this.wzzz;
  }
  get abba() {
    return this.wzzw;
  }
  get abar() {
    return this.wzwx;
  }
  get abag() {
    return this.wzwy;
  }
  get abab() {
    return this.wzwz;
  }
  get abaa() {
    return this.wzww;
  }
  get aarr() {
    return this.wwxx;
  }
  get aarg() {
    return this.wwxy;
  }
  get aarb() {
    return this.wwxz;
  }
  get aara() {
    return this.wwxw;
  }
  get aagr() {
    return this.wwyx;
  }
  get aagg() {
    return this.wwyy;
  }
  get aagb() {
    return this.wwyz;
  }
  get aaga() {
    return this.wwyw;
  }
  get aabr() {
    return this.wwzx;
  }
  get aabg() {
    return this.wwzy;
  }
  get aabb() {
    return this.wwzz;
  }
  get aaba() {
    return this.wwzw;
  }
  get aaar() {
    return this.wwwx;
  }
  get aaag() {
    return this.wwwy;
  }
  get aaab() {
    return this.wwwz;
  }
  get aaaa() {
    return this.wwww;
  }
  get ss() {
    return this.xx;
  }
  get st() {
    return this.xy;
  }
  get sp() {
    return this.xz;
  }
  get sq() {
    return this.xw;
  }
  get ts() {
    return this.yx;
  }
  get tt() {
    return this.yy;
  }
  get tp() {
    return this.yz;
  }
  get tq() {
    return this.yw;
  }
  get ps() {
    return this.zx;
  }
  get pt() {
    return this.zy;
  }
  get pp() {
    return this.zz;
  }
  get pq() {
    return this.zw;
  }
  get qs() {
    return this.wx;
  }
  get qt() {
    return this.wy;
  }
  get qp() {
    return this.wz;
  }
  get qq() {
    return this.ww;
  }
  get sss() {
    return this.xxx;
  }
  get sst() {
    return this.xxy;
  }
  get ssp() {
    return this.xxz;
  }
  get ssq() {
    return this.xxw;
  }
  get sts() {
    return this.xyx;
  }
  get stt() {
    return this.xyy;
  }
  get stp() {
    return this.xyz;
  }
  get stq() {
    return this.xyw;
  }
  get sps() {
    return this.xzx;
  }
  get spt() {
    return this.xzy;
  }
  get spp() {
    return this.xzz;
  }
  get spq() {
    return this.xzw;
  }
  get sqs() {
    return this.xwx;
  }
  get sqt() {
    return this.xwy;
  }
  get sqp() {
    return this.xwz;
  }
  get sqq() {
    return this.xww;
  }
  get tss() {
    return this.yxx;
  }
  get tst() {
    return this.yxy;
  }
  get tsp() {
    return this.yxz;
  }
  get tsq() {
    return this.yxw;
  }
  get tts() {
    return this.yyx;
  }
  get ttt() {
    return this.yyy;
  }
  get ttp() {
    return this.yyz;
  }
  get ttq() {
    return this.yyw;
  }
  get tps() {
    return this.yzx;
  }
  get tpt() {
    return this.yzy;
  }
  get tpp() {
    return this.yzz;
  }
  get tpq() {
    return this.yzw;
  }
  get tqs() {
    return this.ywx;
  }
  get tqt() {
    return this.ywy;
  }
  get tqp() {
    return this.ywz;
  }
  get tqq() {
    return this.yww;
  }
  get pss() {
    return this.zxx;
  }
  get pst() {
    return this.zxy;
  }
  get psp() {
    return this.zxz;
  }
  get psq() {
    return this.zxw;
  }
  get pts() {
    return this.zyx;
  }
  get ptt() {
    return this.zyy;
  }
  get ptp() {
    return this.zyz;
  }
  get ptq() {
    return this.zyw;
  }
  get pps() {
    return this.zzx;
  }
  get ppt() {
    return this.zzy;
  }
  get ppp() {
    return this.zzz;
  }
  get ppq() {
    return this.zzw;
  }
  get pqs() {
    return this.zwx;
  }
  get pqt() {
    return this.zwy;
  }
  get pqp() {
    return this.zwz;
  }
  get pqq() {
    return this.zww;
  }
  get qss() {
    return this.wxx;
  }
  get qst() {
    return this.wxy;
  }
  get qsp() {
    return this.wxz;
  }
  get qsq() {
    return this.wxw;
  }
  get qts() {
    return this.wyx;
  }
  get qtt() {
    return this.wyy;
  }
  get qtp() {
    return this.wyz;
  }
  get qtq() {
    return this.wyw;
  }
  get qps() {
    return this.wzx;
  }
  get qpt() {
    return this.wzy;
  }
  get qpp() {
    return this.wzz;
  }
  get qpq() {
    return this.wzw;
  }
  get qqs() {
    return this.wwx;
  }
  get qqt() {
    return this.wwy;
  }
  get qqp() {
    return this.wwz;
  }
  get qqq() {
    return this.www;
  }
  get ssss() {
    return this.xxxx;
  }
  get ssst() {
    return this.xxxy;
  }
  get sssp() {
    return this.xxxz;
  }
  get sssq() {
    return this.xxxw;
  }
  get ssts() {
    return this.xxyx;
  }
  get sstt() {
    return this.xxyy;
  }
  get sstp() {
    return this.xxyz;
  }
  get sstq() {
    return this.xxyw;
  }
  get ssps() {
    return this.xxzx;
  }
  get sspt() {
    return this.xxzy;
  }
  get sspp() {
    return this.xxzz;
  }
  get sspq() {
    return this.xxzw;
  }
  get ssqs() {
    return this.xxwx;
  }
  get ssqt() {
    return this.xxwy;
  }
  get ssqp() {
    return this.xxwz;
  }
  get ssqq() {
    return this.xxww;
  }
  get stss() {
    return this.xyxx;
  }
  get stst() {
    return this.xyxy;
  }
  get stsp() {
    return this.xyxz;
  }
  get stsq() {
    return this.xyxw;
  }
  get stts() {
    return this.xyyx;
  }
  get sttt() {
    return this.xyyy;
  }
  get sttp() {
    return this.xyyz;
  }
  get sttq() {
    return this.xyyw;
  }
  get stps() {
    return this.xyzx;
  }
  get stpt() {
    return this.xyzy;
  }
  get stpp() {
    return this.xyzz;
  }
  get stpq() {
    return this.xyzw;
  }
  get stqs() {
    return this.xywx;
  }
  get stqt() {
    return this.xywy;
  }
  get stqp() {
    return this.xywz;
  }
  get stqq() {
    return this.xyww;
  }
  get spss() {
    return this.xzxx;
  }
  get spst() {
    return this.xzxy;
  }
  get spsp() {
    return this.xzxz;
  }
  get spsq() {
    return this.xzxw;
  }
  get spts() {
    return this.xzyx;
  }
  get sptt() {
    return this.xzyy;
  }
  get sptp() {
    return this.xzyz;
  }
  get sptq() {
    return this.xzyw;
  }
  get spps() {
    return this.xzzx;
  }
  get sppt() {
    return this.xzzy;
  }
  get sppp() {
    return this.xzzz;
  }
  get sppq() {
    return this.xzzw;
  }
  get spqs() {
    return this.xzwx;
  }
  get spqt() {
    return this.xzwy;
  }
  get spqp() {
    return this.xzwz;
  }
  get spqq() {
    return this.xzww;
  }
  get sqss() {
    return this.xwxx;
  }
  get sqst() {
    return this.xwxy;
  }
  get sqsp() {
    return this.xwxz;
  }
  get sqsq() {
    return this.xwxw;
  }
  get sqts() {
    return this.xwyx;
  }
  get sqtt() {
    return this.xwyy;
  }
  get sqtp() {
    return this.xwyz;
  }
  get sqtq() {
    return this.xwyw;
  }
  get sqps() {
    return this.xwzx;
  }
  get sqpt() {
    return this.xwzy;
  }
  get sqpp() {
    return this.xwzz;
  }
  get sqpq() {
    return this.xwzw;
  }
  get sqqs() {
    return this.xwwx;
  }
  get sqqt() {
    return this.xwwy;
  }
  get sqqp() {
    return this.xwwz;
  }
  get sqqq() {
    return this.xwww;
  }
  get tsss() {
    return this.yxxx;
  }
  get tsst() {
    return this.yxxy;
  }
  get tssp() {
    return this.yxxz;
  }
  get tssq() {
    return this.yxxw;
  }
  get tsts() {
    return this.yxyx;
  }
  get tstt() {
    return this.yxyy;
  }
  get tstp() {
    return this.yxyz;
  }
  get tstq() {
    return this.yxyw;
  }
  get tsps() {
    return this.yxzx;
  }
  get tspt() {
    return this.yxzy;
  }
  get tspp() {
    return this.yxzz;
  }
  get tspq() {
    return this.yxzw;
  }
  get tsqs() {
    return this.yxwx;
  }
  get tsqt() {
    return this.yxwy;
  }
  get tsqp() {
    return this.yxwz;
  }
  get tsqq() {
    return this.yxww;
  }
  get ttss() {
    return this.yyxx;
  }
  get ttst() {
    return this.yyxy;
  }
  get ttsp() {
    return this.yyxz;
  }
  get ttsq() {
    return this.yyxw;
  }
  get ttts() {
    return this.yyyx;
  }
  get tttt() {
    return this.yyyy;
  }
  get tttp() {
    return this.yyyz;
  }
  get tttq() {
    return this.yyyw;
  }
  get ttps() {
    return this.yyzx;
  }
  get ttpt() {
    return this.yyzy;
  }
  get ttpp() {
    return this.yyzz;
  }
  get ttpq() {
    return this.yyzw;
  }
  get ttqs() {
    return this.yywx;
  }
  get ttqt() {
    return this.yywy;
  }
  get ttqp() {
    return this.yywz;
  }
  get ttqq() {
    return this.yyww;
  }
  get tpss() {
    return this.yzxx;
  }
  get tpst() {
    return this.yzxy;
  }
  get tpsp() {
    return this.yzxz;
  }
  get tpsq() {
    return this.yzxw;
  }
  get tpts() {
    return this.yzyx;
  }
  get tptt() {
    return this.yzyy;
  }
  get tptp() {
    return this.yzyz;
  }
  get tptq() {
    return this.yzyw;
  }
  get tpps() {
    return this.yzzx;
  }
  get tppt() {
    return this.yzzy;
  }
  get tppp() {
    return this.yzzz;
  }
  get tppq() {
    return this.yzzw;
  }
  get tpqs() {
    return this.yzwx;
  }
  get tpqt() {
    return this.yzwy;
  }
  get tpqp() {
    return this.yzwz;
  }
  get tpqq() {
    return this.yzww;
  }
  get tqss() {
    return this.ywxx;
  }
  get tqst() {
    return this.ywxy;
  }
  get tqsp() {
    return this.ywxz;
  }
  get tqsq() {
    return this.ywxw;
  }
  get tqts() {
    return this.ywyx;
  }
  get tqtt() {
    return this.ywyy;
  }
  get tqtp() {
    return this.ywyz;
  }
  get tqtq() {
    return this.ywyw;
  }
  get tqps() {
    return this.ywzx;
  }
  get tqpt() {
    return this.ywzy;
  }
  get tqpp() {
    return this.ywzz;
  }
  get tqpq() {
    return this.ywzw;
  }
  get tqqs() {
    return this.ywwx;
  }
  get tqqt() {
    return this.ywwy;
  }
  get tqqp() {
    return this.ywwz;
  }
  get tqqq() {
    return this.ywww;
  }
  get psss() {
    return this.zxxx;
  }
  get psst() {
    return this.zxxy;
  }
  get pssp() {
    return this.zxxz;
  }
  get pssq() {
    return this.zxxw;
  }
  get psts() {
    return this.zxyx;
  }
  get pstt() {
    return this.zxyy;
  }
  get pstp() {
    return this.zxyz;
  }
  get pstq() {
    return this.zxyw;
  }
  get psps() {
    return this.zxzx;
  }
  get pspt() {
    return this.zxzy;
  }
  get pspp() {
    return this.zxzz;
  }
  get pspq() {
    return this.zxzw;
  }
  get psqs() {
    return this.zxwx;
  }
  get psqt() {
    return this.zxwy;
  }
  get psqp() {
    return this.zxwz;
  }
  get psqq() {
    return this.zxww;
  }
  get ptss() {
    return this.zyxx;
  }
  get ptst() {
    return this.zyxy;
  }
  get ptsp() {
    return this.zyxz;
  }
  get ptsq() {
    return this.zyxw;
  }
  get ptts() {
    return this.zyyx;
  }
  get pttt() {
    return this.zyyy;
  }
  get pttp() {
    return this.zyyz;
  }
  get pttq() {
    return this.zyyw;
  }
  get ptps() {
    return this.zyzx;
  }
  get ptpt() {
    return this.zyzy;
  }
  get ptpp() {
    return this.zyzz;
  }
  get ptpq() {
    return this.zyzw;
  }
  get ptqs() {
    return this.zywx;
  }
  get ptqt() {
    return this.zywy;
  }
  get ptqp() {
    return this.zywz;
  }
  get ptqq() {
    return this.zyww;
  }
  get ppss() {
    return this.zzxx;
  }
  get ppst() {
    return this.zzxy;
  }
  get ppsp() {
    return this.zzxz;
  }
  get ppsq() {
    return this.zzxw;
  }
  get ppts() {
    return this.zzyx;
  }
  get pptt() {
    return this.zzyy;
  }
  get pptp() {
    return this.zzyz;
  }
  get pptq() {
    return this.zzyw;
  }
  get ppps() {
    return this.zzzx;
  }
  get pppt() {
    return this.zzzy;
  }
  get pppp() {
    return this.zzzz;
  }
  get pppq() {
    return this.zzzw;
  }
  get ppqs() {
    return this.zzwx;
  }
  get ppqt() {
    return this.zzwy;
  }
  get ppqp() {
    return this.zzwz;
  }
  get ppqq() {
    return this.zzww;
  }
  get pqss() {
    return this.zwxx;
  }
  get pqst() {
    return this.zwxy;
  }
  get pqsp() {
    return this.zwxz;
  }
  get pqsq() {
    return this.zwxw;
  }
  get pqts() {
    return this.zwyx;
  }
  get pqtt() {
    return this.zwyy;
  }
  get pqtp() {
    return this.zwyz;
  }
  get pqtq() {
    return this.zwyw;
  }
  get pqps() {
    return this.zwzx;
  }
  get pqpt() {
    return this.zwzy;
  }
  get pqpp() {
    return this.zwzz;
  }
  get pqpq() {
    return this.zwzw;
  }
  get pqqs() {
    return this.zwwx;
  }
  get pqqt() {
    return this.zwwy;
  }
  get pqqp() {
    return this.zwwz;
  }
  get pqqq() {
    return this.zwww;
  }
  get qsss() {
    return this.wxxx;
  }
  get qsst() {
    return this.wxxy;
  }
  get qssp() {
    return this.wxxz;
  }
  get qssq() {
    return this.wxxw;
  }
  get qsts() {
    return this.wxyx;
  }
  get qstt() {
    return this.wxyy;
  }
  get qstp() {
    return this.wxyz;
  }
  get qstq() {
    return this.wxyw;
  }
  get qsps() {
    return this.wxzx;
  }
  get qspt() {
    return this.wxzy;
  }
  get qspp() {
    return this.wxzz;
  }
  get qspq() {
    return this.wxzw;
  }
  get qsqs() {
    return this.wxwx;
  }
  get qsqt() {
    return this.wxwy;
  }
  get qsqp() {
    return this.wxwz;
  }
  get qsqq() {
    return this.wxww;
  }
  get qtss() {
    return this.wyxx;
  }
  get qtst() {
    return this.wyxy;
  }
  get qtsp() {
    return this.wyxz;
  }
  get qtsq() {
    return this.wyxw;
  }
  get qtts() {
    return this.wyyx;
  }
  get qttt() {
    return this.wyyy;
  }
  get qttp() {
    return this.wyyz;
  }
  get qttq() {
    return this.wyyw;
  }
  get qtps() {
    return this.wyzx;
  }
  get qtpt() {
    return this.wyzy;
  }
  get qtpp() {
    return this.wyzz;
  }
  get qtpq() {
    return this.wyzw;
  }
  get qtqs() {
    return this.wywx;
  }
  get qtqt() {
    return this.wywy;
  }
  get qtqp() {
    return this.wywz;
  }
  get qtqq() {
    return this.wyww;
  }
  get qpss() {
    return this.wzxx;
  }
  get qpst() {
    return this.wzxy;
  }
  get qpsp() {
    return this.wzxz;
  }
  get qpsq() {
    return this.wzxw;
  }
  get qpts() {
    return this.wzyx;
  }
  get qptt() {
    return this.wzyy;
  }
  get qptp() {
    return this.wzyz;
  }
  get qptq() {
    return this.wzyw;
  }
  get qpps() {
    return this.wzzx;
  }
  get qppt() {
    return this.wzzy;
  }
  get qppp() {
    return this.wzzz;
  }
  get qppq() {
    return this.wzzw;
  }
  get qpqs() {
    return this.wzwx;
  }
  get qpqt() {
    return this.wzwy;
  }
  get qpqp() {
    return this.wzwz;
  }
  get qpqq() {
    return this.wzww;
  }
  get qqss() {
    return this.wwxx;
  }
  get qqst() {
    return this.wwxy;
  }
  get qqsp() {
    return this.wwxz;
  }
  get qqsq() {
    return this.wwxw;
  }
  get qqts() {
    return this.wwyx;
  }
  get qqtt() {
    return this.wwyy;
  }
  get qqtp() {
    return this.wwyz;
  }
  get qqtq() {
    return this.wwyw;
  }
  get qqps() {
    return this.wwzx;
  }
  get qqpt() {
    return this.wwzy;
  }
  get qqpp() {
    return this.wwzz;
  }
  get qqpq() {
    return this.wwzw;
  }
  get qqqs() {
    return this.wwwx;
  }
  get qqqt() {
    return this.wwwy;
  }
  get qqqp() {
    return this.wwwz;
  }
  get qqqq() {
    return this.wwww;
  }
}
class yt {
  constructor(s, t) {
    a(this, "_v2storage");
    this._v2storage = [s, t];
  }
  set xy(s) {
    const t = s._v2storage;
    this._v2storage[0] = t[0], this._v2storage[1] = t[1];
  }
  set yx(s) {
    const t = s._v2storage;
    this._v2storage[1] = t[0], this._v2storage[0] = t[1];
  }
  set r(s) {
    this.x = s;
  }
  set g(s) {
    this.y = s;
  }
  set s(s) {
    this.x = s;
  }
  set t(s) {
    this.y = s;
  }
  set x(s) {
    this._v2storage[0] = s;
  }
  set y(s) {
    this._v2storage[1] = s;
  }
  set rg(s) {
    this.xy = s;
  }
  set gr(s) {
    this.yx = s;
  }
  set st(s) {
    this.xy = s;
  }
  set ts(s) {
    this.yx = s;
  }
  get xx() {
    return new yt(this._v2storage[0], this._v2storage[0]);
  }
  get xy() {
    return new yt(this._v2storage[0], this._v2storage[1]);
  }
  get yx() {
    return new yt(this._v2storage[1], this._v2storage[0]);
  }
  get yy() {
    return new yt(this._v2storage[1], this._v2storage[1]);
  }
  get xxx() {
    return new p(
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[0]
    );
  }
  get xxy() {
    return new p(
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[1]
    );
  }
  get xyx() {
    return new p(
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[0]
    );
  }
  get xyy() {
    return new p(
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[1]
    );
  }
  get yxx() {
    return new p(
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[0]
    );
  }
  get yxy() {
    return new p(
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[1]
    );
  }
  get yyx() {
    return new p(
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[0]
    );
  }
  get yyy() {
    return new p(
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[1]
    );
  }
  get xxxx() {
    return new i(
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[0]
    );
  }
  get xxxy() {
    return new i(
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[1]
    );
  }
  get xxyx() {
    return new i(
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[0]
    );
  }
  get xxyy() {
    return new i(
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[1]
    );
  }
  get xyxx() {
    return new i(
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[0]
    );
  }
  get xyxy() {
    return new i(
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[1]
    );
  }
  get xyyx() {
    return new i(
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[0]
    );
  }
  get xyyy() {
    return new i(
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[1]
    );
  }
  get yxxx() {
    return new i(
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[0]
    );
  }
  get yxxy() {
    return new i(
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[1]
    );
  }
  get yxyx() {
    return new i(
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[0]
    );
  }
  get yxyy() {
    return new i(
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[1]
    );
  }
  get yyxx() {
    return new i(
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[0]
    );
  }
  get yyxy() {
    return new i(
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[1]
    );
  }
  get yyyx() {
    return new i(
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[0]
    );
  }
  get yyyy() {
    return new i(
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[1]
    );
  }
  get r() {
    return this.x;
  }
  get g() {
    return this.y;
  }
  get s() {
    return this.x;
  }
  get t() {
    return this.y;
  }
  get x() {
    return this._v2storage[0];
  }
  get y() {
    return this._v2storage[1];
  }
  get rr() {
    return this.xx;
  }
  get rg() {
    return this.xy;
  }
  get gr() {
    return this.yx;
  }
  get gg() {
    return this.yy;
  }
  get rrr() {
    return this.xxx;
  }
  get rrg() {
    return this.xxy;
  }
  get rgr() {
    return this.xyx;
  }
  get rgg() {
    return this.xyy;
  }
  get grr() {
    return this.yxx;
  }
  get grg() {
    return this.yxy;
  }
  get ggr() {
    return this.yyx;
  }
  get ggg() {
    return this.yyy;
  }
  get rrrr() {
    return this.xxxx;
  }
  get rrrg() {
    return this.xxxy;
  }
  get rrgr() {
    return this.xxyx;
  }
  get rrgg() {
    return this.xxyy;
  }
  get rgrr() {
    return this.xyxx;
  }
  get rgrg() {
    return this.xyxy;
  }
  get rggr() {
    return this.xyyx;
  }
  get rggg() {
    return this.xyyy;
  }
  get grrr() {
    return this.yxxx;
  }
  get grrg() {
    return this.yxxy;
  }
  get grgr() {
    return this.yxyx;
  }
  get grgg() {
    return this.yxyy;
  }
  get ggrr() {
    return this.yyxx;
  }
  get ggrg() {
    return this.yyxy;
  }
  get gggr() {
    return this.yyyx;
  }
  get gggg() {
    return this.yyyy;
  }
  getss() {
    return this.xx;
  }
  getst() {
    return this.xy;
  }
  getts() {
    return this.yx;
  }
  gettt() {
    return this.yy;
  }
  get sss() {
    return this.xxx;
  }
  get sst() {
    return this.xxy;
  }
  get sts() {
    return this.xyx;
  }
  get stt() {
    return this.xyy;
  }
  get tss() {
    return this.yxx;
  }
  get tst() {
    return this.yxy;
  }
  get tts() {
    return this.yyx;
  }
  get ttt() {
    return this.yyy;
  }
  get ssss() {
    return this.xxxx;
  }
  get ssst() {
    return this.xxxy;
  }
  get ssts() {
    return this.xxyx;
  }
  get sstt() {
    return this.xxyy;
  }
  get stss() {
    return this.xyxx;
  }
  get stst() {
    return this.xyxy;
  }
  get stts() {
    return this.xyyx;
  }
  get sttt() {
    return this.xyyy;
  }
  get tsss() {
    return this.yxxx;
  }
  get tsst() {
    return this.yxxy;
  }
  get tsts() {
    return this.yxyx;
  }
  get tstt() {
    return this.yxyy;
  }
  get ttss() {
    return this.yyxx;
  }
  get ttst() {
    return this.yyxy;
  }
  get ttts() {
    return this.yyyx;
  }
  get tttt() {
    return this.yyyy;
  }
}
const E = yt;
class M {
  constructor(s, t, e) {
    a(this, "_v3storage");
    this._v3storage = [s, t, e];
  }
  get storage() {
    return this._v3storage;
  }
  static copy(s) {
    return new M(...s._v3storage);
  }
  setValues(s, t, e) {
    this._v3storage[0] = s, this._v3storage[1] = t, this._v3storage[2] = e;
  }
  setZero() {
    this._v3storage[0] = 0, this._v3storage[1] = 0, this._v3storage[2] = 0;
  }
  setFrom(s) {
    const t = s._v3storage;
    this._v3storage[0] = t[0], this._v3storage[1] = t[1], this._v3storage[2] = t[2];
  }
  splat(s) {
    this._v3storage[0] = s, this._v3storage[1] = s, this._v3storage[2] = s;
  }
  toString() {
    return `[${this._v3storage[0]},${this._v3storage[1]},${this._v3storage[2]}]`;
  }
  /**
   * Set the length of the vector. A negative `value` will change the vectors
   * orientation and a `value` of zero will set the vector to zero.
   */
  set length(s) {
    if (s === 0)
      this.setZero();
    else {
      let t = this.length;
      if (t === 0)
        return;
      t = s / t, this._v3storage[0] *= t, this._v3storage[1] *= t, this._v3storage[2] *= t;
    }
  }
  /**
   * Length.
   */
  get length() {
    return Math.sqrt(this.length2);
  }
  /**
   * Length squared.
   */
  get length2() {
    let s = 0;
    return s += this._v3storage[0] * this._v3storage[0], s += this._v3storage[1] * this._v3storage[1], s += this._v3storage[2] * this._v3storage[2], s;
  }
  /**
   * Normalizes this.
   */
  normalize() {
    const s = this.length;
    if (s === 0)
      return 0;
    const t = 1 / s;
    return this._v3storage[0] *= t, this._v3storage[1] *= t, this._v3storage[2] *= t, s;
  }
  /// Normalizes copy of this.
  normalized() {
    const s = M.copy(this);
    return s.normalize(), s;
  }
  /// Normalize vector into [out].
  normalizeInto(s) {
    return s.setFrom(this), s.normalize(), s;
  }
  /// Distance from this to [arg]
  distanceTo(s) {
    return Math.sqrt(this.distanceToSquared(s));
  }
  /// Squared distance from this to [arg]
  distanceToSquared(s) {
    const t = s._v3storage, e = this._v3storage[0] - t[0], r = this._v3storage[1] - t[1], h = this._v3storage[2] - t[2];
    return e * e + r * r + h * h;
  }
  /// Returns the angle between this vector and [other] in radians.
  angleTo(s) {
    const t = s._v3storage;
    if (this._v3storage[0] === t[0] && this._v3storage[1] === t[1] && this._v3storage[2] === t[2])
      return 0;
    const e = this.dot(s) / (this.length * s.length);
    return Math.acos(Math.min(Math.max(e, -1), 1));
  }
  /// Returns the signed angle between this and [other] around [normal]
  /// in radians.
  angleToSigned(s, t) {
    const e = this.angleTo(s);
    return this.cross(s).dot(t) < 0 ? -e : e;
  }
  /// Inner product.
  dot(s) {
    const t = s._v3storage;
    let e = 0;
    return e += this._v3storage[0] * t[0], e += this._v3storage[1] * t[1], e += this._v3storage[2] * t[2], e;
  }
  /**
   * Transforms this into the product of this as a row vector,
   * postmultiplied by matrix, [arg].
   * If [arg] is a rotation matrix, this is a computational shortcut for applying,
   * the inverse of the transformation.
   */
  postmultiply(s) {
    const t = s.storage, e = this._v3storage[0], r = this._v3storage[1], h = this._v3storage[2];
    this._v3storage[0] = e * t[0] + r * t[1] + h * t[2], this._v3storage[1] = e * t[3] + r * t[4] + h * t[5], this._v3storage[2] = e * t[6] + r * t[7] + h * t[8];
  }
  /// Cross product.
  cross(s) {
    const t = this._v3storage[0], e = this._v3storage[1], r = this._v3storage[2], h = s._v3storage, g = h[0], o = h[1], _ = h[2];
    return new M(e * _ - r * o, r * g - t * _, t * o - e * g);
  }
  /// Cross product. Stores result in [out].
  crossInto(s, t) {
    const e = this._v3storage[0], r = this._v3storage[1], h = this._v3storage[2], g = s._v3storage, o = g[0], _ = g[1], v = g[2], x = t._v3storage;
    return x[0] = r * v - h * _, x[1] = h * o - e * v, x[2] = e * _ - r * o, t;
  }
  reflected(s) {
    const t = this.clone();
    return t.reflect(s), t;
  }
  clone() {
    return M.copy(this);
  }
  reflect(s) {
    this.sub(s.scaled(2 * s.dot(this)));
  }
  /// Projects this using the projection matrix [arg]
  applyProjection(s) {
    const t = s._m4storage, e = this._v3storage[0], r = this._v3storage[1], h = this._v3storage[2], g = 1 / (t[3] * e + t[7] * r + t[11] * h + t[15]);
    this._v3storage[0] = (t[0] * e + t[4] * r + t[8] * h + t[12]) * g, this._v3storage[1] = (t[1] * e + t[5] * r + t[9] * h + t[13]) * g, this._v3storage[2] = (t[2] * e + t[6] * r + t[10] * h + t[14]) * g;
  }
  // /// Applies a rotation specified by [axis] and [angle].
  // void applyAxisAngle(Vector3 axis, double angle) {
  //   applyQuaternion(Quaternion.axisAngle(axis, angle));
  // }
  // /// Applies a quaternion transform.
  // void applyQuaternion(Quaternion arg) {
  //   final argStorage = arg._qStorage;
  //   final v0 = _v3storage[0];
  //   final v1 = _v3storage[1];
  //   final v2 = _v3storage[2];
  //   final qx = argStorage[0];
  //   final qy = argStorage[1];
  //   final qz = argStorage[2];
  //   final qw = argStorage[3];
  //   final ix = qw * v0 + qy * v2 - qz * v1;
  //   final iy = qw * v1 + qz * v0 - qx * v2;
  //   final iz = qw * v2 + qx * v1 - qy * v0;
  //   final iw = -qx * v0 - qy * v1 - qz * v2;
  //   _v3storage[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  //   _v3storage[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  //   _v3storage[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  // }
  /// Multiplies this by [arg].
  applyMatrix3(s) {
    const t = s.storage, e = this._v3storage[0], r = this._v3storage[1], h = this._v3storage[2];
    this._v3storage[0] = t[0] * e + t[3] * r + t[6] * h, this._v3storage[1] = t[1] * e + t[4] * r + t[7] * h, this._v3storage[2] = t[2] * e + t[5] * r + t[8] * h;
  }
  /// Multiplies this by a 4x3 subset of [arg]. Expects [arg] to be an affine
  /// transformation matrix.
  applyMatrix4(s) {
    const t = s._m4storage, e = this._v3storage[0], r = this._v3storage[1], h = this._v3storage[2];
    this._v3storage[0] = t[0] * e + t[4] * r + t[8] * h + t[12], this._v3storage[1] = t[1] * e + t[5] * r + t[9] * h + t[13], this._v3storage[2] = t[2] * e + t[6] * r + t[10] * h + t[14];
  }
  /// Relative error between this and [correct]
  relativeError(s) {
    const t = s.length, e = this.clone();
    return e.sub(s), e.length / t;
  }
  /// Absolute error between this and [correct]
  absoluteError(s) {
    const t = this.clone();
    return t.sub(s), t.length;
  }
  /**
   * Returns true if any component is infinite.
   */
  get isInfinite() {
    let s = !1;
    return s = s || !isFinite(this._v3storage[0]), s = s || !isFinite(this._v3storage[1]), s = s || !isFinite(this._v3storage[2]), s;
  }
  /**
   * Returns true if any component is NaN.
   */
  get isNaN() {
    let s = !1;
    return s = s || isNaN(this._v3storage[0]), s = s || isNaN(this._v3storage[1]), s = s || isNaN(this._v3storage[2]), s;
  }
  /**
   * Add `arg` to this vector.
   */
  add(s) {
    const t = s._v3storage;
    this._v3storage[0] += t[0], this._v3storage[1] += t[1], this._v3storage[2] += t[2];
  }
  /**
   * Add [arg] scaled by [factor] to this.
   */
  addScaled(s, t) {
    const e = s._v3storage;
    this._v3storage[0] += e[0] * t, this._v3storage[1] += e[1] * t, this._v3storage[2] += e[2] * t;
  }
  sub(s) {
    const t = s._v3storage;
    this._v3storage[0] -= t[0], this._v3storage[1] -= t[1], this._v3storage[2] -= t[2];
  }
  /**
   * Multiply entries in this with entries in [arg].
   */
  multiply(s) {
    const t = s._v3storage;
    this._v3storage[0] = this._v3storage[0] * t[0], this._v3storage[1] = this._v3storage[1] * t[1], this._v3storage[2] = this._v3storage[2] * t[2];
  }
  /**
   * Divide entries in this with entries in [arg].
   */
  divide(s) {
    const t = s._v3storage;
    this._v3storage[0] /= t[0], this._v3storage[1] /= t[1], this._v3storage[2] /= t[2];
  }
  /**
    Scale this.
  */
  scale(s) {
    this._v3storage[2] *= s, this._v3storage[1] *= s, this._v3storage[0] *= s;
  }
  /**
  
  Create a copy of this and scale it by [arg].
  */
  scaled(s) {
    const t = this.clone();
    return t.scale(s), t;
  }
  /**
   * Negate each component of this vector.
   */
  negate() {
    this._v3storage[2] = -this._v3storage[2], this._v3storage[1] = -this._v3storage[1], this._v3storage[0] = -this._v3storage[0];
  }
  /**
   * Absolute value.
   */
  absolute() {
    this._v3storage[0] = Math.abs(this._v3storage[0]), this._v3storage[1] = Math.abs(this._v3storage[1]), this._v3storage[2] = Math.abs(this._v3storage[2]);
  }
  /**
  
  Clamp each entry n in this in the range [min[n]]-[max[n]].
  */
  clamp(s, t) {
    const e = s.storage, r = t.storage;
    this._v3storage[0] = this._clamp(
      this._v3storage[0],
      e[0],
      r[0]
    ), this._v3storage[1] = this._clamp(
      this._v3storage[1],
      e[1],
      r[1]
    ), this._v3storage[2] = this._clamp(
      this._v3storage[2],
      e[2],
      r[2]
    );
  }
  /**
   * Clamp entries in this in the range [min]-[max].
   */
  clampScalar(s, t) {
    this._v3storage[0] = this._clamp(this._v3storage[0], s, t), this._v3storage[1] = this._clamp(this._v3storage[1], s, t), this._v3storage[2] = this._clamp(this._v3storage[2], s, t);
  }
  /**
  Floor entries in this.
  */
  floor() {
    this._v3storage[0] = Math.floor(this._v3storage[0]), this._v3storage[1] = Math.floor(this._v3storage[1]), this._v3storage[2] = Math.floor(this._v3storage[2]);
  }
  /**
  
  Ceil entries in this.
  */
  ceil() {
    this._v3storage[0] = Math.ceil(this._v3storage[0]), this._v3storage[1] = Math.ceil(this._v3storage[1]), this._v3storage[2] = Math.ceil(this._v3storage[2]);
  }
  /**
  Round entries in this.
  */
  round() {
    this._v3storage[0] = Math.round(this._v3storage[0]), this._v3storage[1] = Math.round(this._v3storage[1]), this._v3storage[2] = Math.round(this._v3storage[2]);
  }
  _clamp(s, t, e) {
    return Math.max(t, Math.min(e, s));
  }
  set xy(s) {
    const t = s._v2storage;
    this._v3storage[0] = t[0], this._v3storage[1] = t[1];
  }
  set xz(s) {
    const t = s._v2storage;
    this._v3storage[0] = t[0], this._v3storage[2] = t[1];
  }
  set yx(s) {
    const t = s._v2storage;
    this._v3storage[1] = t[0], this._v3storage[0] = t[1];
  }
  set yz(s) {
    const t = s._v2storage;
    this._v3storage[1] = t[0], this._v3storage[2] = t[1];
  }
  set zx(s) {
    const t = s._v2storage;
    this._v3storage[2] = t[0], this._v3storage[0] = t[1];
  }
  set zy(s) {
    const t = s._v2storage;
    this._v3storage[2] = t[0], this._v3storage[1] = t[1];
  }
  set xyz(s) {
    const t = s._v3storage;
    this._v3storage[0] = t[0], this._v3storage[1] = t[1], this._v3storage[2] = t[2];
  }
  set xzy(s) {
    const t = s._v3storage;
    this._v3storage[0] = t[0], this._v3storage[2] = t[1], this._v3storage[1] = t[2];
  }
  set yxz(s) {
    const t = s._v3storage;
    this._v3storage[1] = t[0], this._v3storage[0] = t[1], this._v3storage[2] = t[2];
  }
  set yzx(s) {
    const t = s._v3storage;
    this._v3storage[1] = t[0], this._v3storage[2] = t[1], this._v3storage[0] = t[2];
  }
  set zxy(s) {
    const t = s._v3storage;
    this._v3storage[2] = t[0], this._v3storage[0] = t[1], this._v3storage[1] = t[2];
  }
  set zyx(s) {
    const t = s._v3storage;
    this._v3storage[2] = t[0], this._v3storage[1] = t[1], this._v3storage[0] = t[2];
  }
  set r(s) {
    this.x = s;
  }
  set g(s) {
    this.y = s;
  }
  set b(s) {
    this.z = s;
  }
  set s(s) {
    this.x = s;
  }
  set t(s) {
    this.y = s;
  }
  set p(s) {
    this.z = s;
  }
  set x(s) {
    this._v3storage[0] = s;
  }
  set y(s) {
    this._v3storage[1] = s;
  }
  set z(s) {
    this._v3storage[2] = s;
  }
  set rg(s) {
    this.xy = s;
  }
  set rb(s) {
    this.xz = s;
  }
  set gr(s) {
    this.yx = s;
  }
  set gb(s) {
    this.yz = s;
  }
  set br(s) {
    this.zx = s;
  }
  set bg(s) {
    this.zy = s;
  }
  set rgb(s) {
    this.xyz = s;
  }
  set rbg(s) {
    this.xzy = s;
  }
  set grb(s) {
    this.yxz = s;
  }
  set gbr(s) {
    this.yzx = s;
  }
  set brg(s) {
    this.zxy = s;
  }
  set bgr(s) {
    this.zyx = s;
  }
  set st(s) {
    this.xy = s;
  }
  set sp(s) {
    this.xz = s;
  }
  set ts(s) {
    this.yx = s;
  }
  set tp(s) {
    this.yz = s;
  }
  set ps(s) {
    this.zx = s;
  }
  set pt(s) {
    this.zy = s;
  }
  set stp(s) {
    this.xyz = s;
  }
  set spt(s) {
    this.xzy = s;
  }
  set tsp(s) {
    this.yxz = s;
  }
  set tps(s) {
    this.yzx = s;
  }
  set pst(s) {
    this.zxy = s;
  }
  set pts(s) {
    this.zyx = s;
  }
  get xx() {
    return new E(this._v3storage[0], this._v3storage[0]);
  }
  get xy() {
    return new E(this._v3storage[0], this._v3storage[1]);
  }
  get xz() {
    return new E(this._v3storage[0], this._v3storage[2]);
  }
  get yx() {
    return new E(this._v3storage[1], this._v3storage[0]);
  }
  get yy() {
    return new E(this._v3storage[1], this._v3storage[1]);
  }
  get yz() {
    return new E(this._v3storage[1], this._v3storage[2]);
  }
  get zx() {
    return new E(this._v3storage[2], this._v3storage[0]);
  }
  get zy() {
    return new E(this._v3storage[2], this._v3storage[1]);
  }
  get zz() {
    return new E(this._v3storage[2], this._v3storage[2]);
  }
  get xxx() {
    return new M(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get xxy() {
    return new M(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get xxz() {
    return new M(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get xyx() {
    return new M(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get xyy() {
    return new M(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get xyz() {
    return new M(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get xzx() {
    return new M(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get xzy() {
    return new M(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get xzz() {
    return new M(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get yxx() {
    return new M(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get yxy() {
    return new M(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get yxz() {
    return new M(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get yyx() {
    return new M(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get yyy() {
    return new M(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get yyz() {
    return new M(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get yzx() {
    return new M(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get yzy() {
    return new M(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get yzz() {
    return new M(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get zxx() {
    return new M(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get zxy() {
    return new M(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get zxz() {
    return new M(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get zyx() {
    return new M(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get zyy() {
    return new M(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get zyz() {
    return new M(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get zzx() {
    return new M(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get zzy() {
    return new M(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get zzz() {
    return new M(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get xxxx() {
    return new i(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get xxxy() {
    return new i(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get xxxz() {
    return new i(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get xxyx() {
    return new i(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get xxyy() {
    return new i(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get xxyz() {
    return new i(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get xxzx() {
    return new i(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get xxzy() {
    return new i(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get xxzz() {
    return new i(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get xyxx() {
    return new i(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get xyxy() {
    return new i(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get xyxz() {
    return new i(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get xyyx() {
    return new i(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get xyyy() {
    return new i(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get xyyz() {
    return new i(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get xyzx() {
    return new i(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get xyzy() {
    return new i(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get xyzz() {
    return new i(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get xzxx() {
    return new i(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get xzxy() {
    return new i(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get xzxz() {
    return new i(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get xzyx() {
    return new i(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get xzyy() {
    return new i(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get xzyz() {
    return new i(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get xzzx() {
    return new i(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get xzzy() {
    return new i(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get xzzz() {
    return new i(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get yxxx() {
    return new i(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get yxxy() {
    return new i(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get yxxz() {
    return new i(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get yxyx() {
    return new i(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get yxyy() {
    return new i(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get yxyz() {
    return new i(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get yxzx() {
    return new i(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get yxzy() {
    return new i(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get yxzz() {
    return new i(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get yyxx() {
    return new i(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get yyxy() {
    return new i(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get yyxz() {
    return new i(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get yyyx() {
    return new i(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get yyyy() {
    return new i(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get yyyz() {
    return new i(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get yyzx() {
    return new i(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get yyzy() {
    return new i(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get yyzz() {
    return new i(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get yzxx() {
    return new i(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get yzxy() {
    return new i(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get yzxz() {
    return new i(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get yzyx() {
    return new i(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get yzyy() {
    return new i(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get yzyz() {
    return new i(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get yzzx() {
    return new i(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get yzzy() {
    return new i(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get yzzz() {
    return new i(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get zxxx() {
    return new i(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get zxxy() {
    return new i(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get zxxz() {
    return new i(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get zxyx() {
    return new i(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get zxyy() {
    return new i(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get zxyz() {
    return new i(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get zxzx() {
    return new i(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get zxzy() {
    return new i(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get zxzz() {
    return new i(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get zyxx() {
    return new i(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get zyxy() {
    return new i(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get zyxz() {
    return new i(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get zyyx() {
    return new i(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get zyyy() {
    return new i(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get zyyz() {
    return new i(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get zyzx() {
    return new i(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get zyzy() {
    return new i(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get zyzz() {
    return new i(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get zzxx() {
    return new i(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get zzxy() {
    return new i(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get zzxz() {
    return new i(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get zzyx() {
    return new i(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get zzyy() {
    return new i(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get zzyz() {
    return new i(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get zzzx() {
    return new i(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get zzzy() {
    return new i(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get zzzz() {
    return new i(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get r() {
    return this.x;
  }
  get g() {
    return this.y;
  }
  get b() {
    return this.z;
  }
  get s() {
    return this.x;
  }
  get t() {
    return this.y;
  }
  get p() {
    return this.z;
  }
  get x() {
    return this._v3storage[0];
  }
  get y() {
    return this._v3storage[1];
  }
  get z() {
    return this._v3storage[2];
  }
  get rr() {
    return this.xx;
  }
  get rg() {
    return this.xy;
  }
  get rb() {
    return this.xz;
  }
  get gr() {
    return this.yx;
  }
  get gg() {
    return this.yy;
  }
  get gb() {
    return this.yz;
  }
  get br() {
    return this.zx;
  }
  get bg() {
    return this.zy;
  }
  get bb() {
    return this.zz;
  }
  get rrr() {
    return this.xxx;
  }
  get rrg() {
    return this.xxy;
  }
  get rrb() {
    return this.xxz;
  }
  get rgr() {
    return this.xzx;
  }
  get rgg() {
    return this.xyy;
  }
  get rgb() {
    return this.xyz;
  }
  get rbr() {
    return this.xzx;
  }
  get rbg() {
    return this.xzy;
  }
  get rbb() {
    return this.xzz;
  }
  get grr() {
    return this.yxx;
  }
  get grg() {
    return this.yxy;
  }
  get grb() {
    return this.yxz;
  }
  get ggr() {
    return this.yyx;
  }
  get ggg() {
    return this.yyy;
  }
  get ggb() {
    return this.yyz;
  }
  get gbr() {
    return this.yxz;
  }
  get gbg() {
    return this.yzy;
  }
  get gbb() {
    return this.yzz;
  }
  get brr() {
    return this.zxx;
  }
  get brg() {
    return this.zxy;
  }
  get brb() {
    return this.zxz;
  }
  get bgr() {
    return this.zyx;
  }
  get bgg() {
    return this.zyy;
  }
  get bgb() {
    return this.zyz;
  }
  get bbr() {
    return this.zzx;
  }
  get bbg() {
    return this.zzy;
  }
  get bbb() {
    return this.zzz;
  }
  get rrrr() {
    return this.xxxx;
  }
  get rrrg() {
    return this.xxxy;
  }
  get rrrb() {
    return this.xxxz;
  }
  get rrgr() {
    return this.xxyx;
  }
  get rrgg() {
    return this.xxyy;
  }
  get rrgb() {
    return this.xxyz;
  }
  get rrbr() {
    return this.xxzx;
  }
  get rrbg() {
    return this.xxzy;
  }
  get rrbb() {
    return this.xxzz;
  }
  get rgrr() {
    return this.xyxx;
  }
  get rgrg() {
    return this.xyxy;
  }
  get rgrb() {
    return this.xyxz;
  }
  get rggr() {
    return this.xyyx;
  }
  get rggg() {
    return this.xyyy;
  }
  get rggb() {
    return this.xyyz;
  }
  get rgbr() {
    return this.xyzx;
  }
  get rgbg() {
    return this.xyzy;
  }
  get rgbb() {
    return this.xyzz;
  }
  get rbrr() {
    return this.xzxx;
  }
  get rbrg() {
    return this.xzxy;
  }
  get rbrb() {
    return this.xzxz;
  }
  get rbgr() {
    return this.xzyx;
  }
  get rbgg() {
    return this.xzyy;
  }
  get rbgb() {
    return this.xzyz;
  }
  get rbbr() {
    return this.xzzx;
  }
  get rbbg() {
    return this.xzzy;
  }
  get rbbb() {
    return this.xzzz;
  }
  get grrr() {
    return this.yxxx;
  }
  get grrg() {
    return this.yxxy;
  }
  get grrb() {
    return this.yxxz;
  }
  get grgr() {
    return this.yxyx;
  }
  get grgg() {
    return this.yxyy;
  }
  get grgb() {
    return this.yxyz;
  }
  get grbr() {
    return this.yxzx;
  }
  get grbg() {
    return this.yxzy;
  }
  get grbb() {
    return this.yxzz;
  }
  get ggrr() {
    return this.yyxx;
  }
  get ggrg() {
    return this.yyxy;
  }
  get ggrb() {
    return this.yyxz;
  }
  get gggr() {
    return this.yyyx;
  }
  get gggg() {
    return this.yyyy;
  }
  get gggb() {
    return this.yyyz;
  }
  get ggbr() {
    return this.yyzx;
  }
  get ggbg() {
    return this.yyzy;
  }
  get ggbb() {
    return this.yyzz;
  }
  get gbrr() {
    return this.yzxx;
  }
  get gbrg() {
    return this.yzxy;
  }
  get gbrb() {
    return this.yzxz;
  }
  get gbgr() {
    return this.yzyx;
  }
  get gbgg() {
    return this.yzyy;
  }
  get gbgb() {
    return this.yzyz;
  }
  get gbbr() {
    return this.yzzx;
  }
  get gbbg() {
    return this.yzzy;
  }
  get gbbb() {
    return this.yzzz;
  }
  get brrr() {
    return this.zxxx;
  }
  get brrg() {
    return this.zxxy;
  }
  get brrb() {
    return this.zxxz;
  }
  get brgr() {
    return this.zxyx;
  }
  get brgg() {
    return this.zxyy;
  }
  get brgb() {
    return this.zxyz;
  }
  get brbr() {
    return this.zxzx;
  }
  get brbg() {
    return this.zxzy;
  }
  get brbb() {
    return this.zxzz;
  }
  get bgrr() {
    return this.zyxx;
  }
  get bgrg() {
    return this.zyxy;
  }
  get bgrb() {
    return this.zyxz;
  }
  get bggr() {
    return this.zyyx;
  }
  get bggg() {
    return this.zyyy;
  }
  get bggb() {
    return this.zyyz;
  }
  get bgbr() {
    return this.zyzx;
  }
  get bgbg() {
    return this.zyzy;
  }
  get bgbb() {
    return this.zyzz;
  }
  get bbrr() {
    return this.zzxx;
  }
  get bbrg() {
    return this.zzxy;
  }
  get bbrb() {
    return this.zzxz;
  }
  get bbgr() {
    return this.zzyx;
  }
  get bbgg() {
    return this.zzyy;
  }
  get bbgb() {
    return this.zzyz;
  }
  get bbbr() {
    return this.zzzx;
  }
  get bbbg() {
    return this.zzzy;
  }
  get bbbb() {
    return this.zzzz;
  }
  get ss() {
    return this.xx;
  }
  get st() {
    return this.xy;
  }
  get sp() {
    return this.xz;
  }
  get ts() {
    return this.yx;
  }
  get tt() {
    return this.yy;
  }
  get tp() {
    return this.yz;
  }
  get ps() {
    return this.zx;
  }
  get pt() {
    return this.zy;
  }
  get pp() {
    return this.zz;
  }
  get sss() {
    return this.xxx;
  }
  get sst() {
    return this.xxy;
  }
  get ssp() {
    return this.xxz;
  }
  get sts() {
    return this.xyx;
  }
  get stt() {
    return this.xyy;
  }
  get stp() {
    return this.xyz;
  }
  get sps() {
    return this.xzx;
  }
  get spt() {
    return this.xzy;
  }
  get spp() {
    return this.xzz;
  }
  get tss() {
    return this.yxx;
  }
  get tst() {
    return this.yxy;
  }
  get tsp() {
    return this.yxz;
  }
  get tts() {
    return this.yyx;
  }
  get ttt() {
    return this.yyy;
  }
  get ttp() {
    return this.yyz;
  }
  get tps() {
    return this.yzx;
  }
  get tpt() {
    return this.yzy;
  }
  get tpp() {
    return this.yzz;
  }
  get pss() {
    return this.zxx;
  }
  get pst() {
    return this.zxy;
  }
  get psp() {
    return this.zxz;
  }
  get pts() {
    return this.zyx;
  }
  get ptt() {
    return this.zyy;
  }
  get ptp() {
    return this.zyz;
  }
  get pps() {
    return this.zzx;
  }
  get ppt() {
    return this.zzy;
  }
  get ppp() {
    return this.zzz;
  }
  get ssss() {
    return this.xxxx;
  }
  get ssst() {
    return this.xxxy;
  }
  get sssp() {
    return this.xxxz;
  }
  get ssts() {
    return this.xxyx;
  }
  get sstt() {
    return this.xxyy;
  }
  get sstp() {
    return this.xxyz;
  }
  get ssps() {
    return this.xxzx;
  }
  get sspt() {
    return this.xxzy;
  }
  get sspp() {
    return this.xxzz;
  }
  get stss() {
    return this.xyxx;
  }
  get stst() {
    return this.xyxy;
  }
  get stsp() {
    return this.xyxz;
  }
  get stts() {
    return this.xyyx;
  }
  get sttt() {
    return this.xyyy;
  }
  get sttp() {
    return this.xyyz;
  }
  get stps() {
    return this.xyzx;
  }
  get stpt() {
    return this.xyzy;
  }
  get stpp() {
    return this.xyzz;
  }
  get spss() {
    return this.xzxx;
  }
  get spst() {
    return this.xzxy;
  }
  get spsp() {
    return this.xzxz;
  }
  get spts() {
    return this.xzyx;
  }
  get sptt() {
    return this.xzyy;
  }
  get sptp() {
    return this.xzyz;
  }
  get spps() {
    return this.xzzx;
  }
  get sppt() {
    return this.xzzy;
  }
  get sppp() {
    return this.xzzz;
  }
  get tsss() {
    return this.yxxx;
  }
  get tsst() {
    return this.yxxy;
  }
  get tssp() {
    return this.yxxz;
  }
  get tsts() {
    return this.yxyx;
  }
  get tstt() {
    return this.yxyy;
  }
  get tstp() {
    return this.yxyz;
  }
  get tsps() {
    return this.yxzx;
  }
  get tspt() {
    return this.yxzy;
  }
  get tspp() {
    return this.yxzz;
  }
  get ttss() {
    return this.yyxx;
  }
  get ttst() {
    return this.yyxy;
  }
  get ttsp() {
    return this.yyxz;
  }
  get ttts() {
    return this.yyyx;
  }
  get tttt() {
    return this.yyyy;
  }
  get tttp() {
    return this.yyyz;
  }
  get ttps() {
    return this.yyzx;
  }
  get ttpt() {
    return this.yyzy;
  }
  get ttpp() {
    return this.yyzz;
  }
  get tpss() {
    return this.yzxx;
  }
  get tpst() {
    return this.yzxy;
  }
  get tpsp() {
    return this.yzxz;
  }
  get tpts() {
    return this.yzyx;
  }
  get tptt() {
    return this.yzyy;
  }
  get tptp() {
    return this.yzyz;
  }
  get tpps() {
    return this.yzzx;
  }
  get tppt() {
    return this.yzzy;
  }
  get tppp() {
    return this.yzzz;
  }
  get psss() {
    return this.zxxx;
  }
  get psst() {
    return this.zxxy;
  }
  get pssp() {
    return this.zxxz;
  }
  get psts() {
    return this.zxyx;
  }
  get pstt() {
    return this.zxyy;
  }
  get pstp() {
    return this.zxyz;
  }
  get psps() {
    return this.zxzx;
  }
  get pspt() {
    return this.zxzy;
  }
  get pspp() {
    return this.zxzz;
  }
  get ptss() {
    return this.zyxx;
  }
  get ptst() {
    return this.zyxy;
  }
  get ptsp() {
    return this.zyxz;
  }
  get ptts() {
    return this.zyyx;
  }
  get pttt() {
    return this.zyyy;
  }
  get pttp() {
    return this.zyyz;
  }
  get ptps() {
    return this.zyzx;
  }
  get ptpt() {
    return this.zyzy;
  }
  get ptpp() {
    return this.zyzz;
  }
  get ppss() {
    return this.zzxx;
  }
  get ppst() {
    return this.zzxy;
  }
  get ppsp() {
    return this.zzxz;
  }
  get ppts() {
    return this.zzyx;
  }
  get pptt() {
    return this.zzyy;
  }
  get pptp() {
    return this.zzyz;
  }
  get ppps() {
    return this.zzzx;
  }
  get pppt() {
    return this.zzzy;
  }
  get pppp() {
    return this.zzzz;
  }
}
const p = M;
class j extends ut {
  constructor(t, e, r, h, g, o, _, v, x, w, m, y, d, l, z, c) {
    super();
    // 4 x 4 matrix
    a(this, "_m4storage");
    this._m4storage = [
      t,
      e,
      r,
      h,
      g,
      o,
      _,
      v,
      x,
      w,
      m,
      y,
      d,
      l,
      z,
      c
    ];
  }
  get storage() {
    return this._m4storage;
  }
  get dimension() {
    return 4;
  }
  plus(t) {
    const e = this.clone();
    return e.add(t), e;
  }
  multiply(t) {
    const e = this.clone();
    return e._m4storage = e._m4storage.map((r) => r * t), e;
  }
  equals(t) {
    return this === t ? !0 : this.storage.every((e, r) => t._m4storage[r] === e);
  }
  /**
   * @deprecated The method should not be used
   */
  equal(t) {
    this.equals(t);
  }
  static zero() {
    return new j(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
  static copy(t) {
    return new j(...t.storage);
  }
  /**
   * Solve [A] * [x] = [b].
   */
  static solve2(t, e, r) {
    const h = t.entry(0, 0), g = t.entry(0, 1), o = t.entry(1, 0), _ = t.entry(1, 1), v = r.x - t._m4storage[8], x = r.y - t._m4storage[9];
    let w = h * _ - g * o;
    w != 0 && (w = 1 / w), e.x = w * (_ * v - g * x), e.y = w * (h * x - o * v);
  }
  /**
   * Solve [A] * [x] = [b].
   */
  static solve3(t, e, r) {
    const h = t.entry(0, 0), g = t.entry(1, 0), o = t.entry(2, 0), _ = t.entry(0, 1), v = t.entry(1, 1), x = t.entry(2, 1), w = t.entry(0, 2), m = t.entry(1, 2), y = t.entry(2, 2), d = r.x - t._m4storage[12], l = r.y - t._m4storage[13], z = r.z - t._m4storage[14];
    let c, b, n, q;
    c = v * y - x * m, b = x * w - _ * y, n = _ * m - v * w, q = h * c + g * b + o * n, q !== 0 && (q = 1 / q);
    const S = q * (d * c + l * b + z * n);
    c = -(m * z - y * l), b = -(y * d - w * z), n = -(w * l - m * d);
    const W = q * (h * c + g * b + o * n);
    c = -(l * x - z * v), b = -(z * _ - d * x), n = -(d * v - l * _);
    const F = q * (h * c + g * b + o * n);
    e.x = S, e.y = W, e.z = F;
  }
  /// Solve [A] * [x] = [b].
  static solve(t, e, r) {
    const h = t._m4storage[0], g = t._m4storage[1], o = t._m4storage[2], _ = t._m4storage[3], v = t._m4storage[4], x = t._m4storage[5], w = t._m4storage[6], m = t._m4storage[7], y = t._m4storage[8], d = t._m4storage[9], l = t._m4storage[10], z = t._m4storage[11], c = t._m4storage[12], b = t._m4storage[13], n = t._m4storage[14], q = t._m4storage[15], S = h * x - g * v, W = h * w - o * v, F = h * m - _ * v, H = g * w - o * x, U = g * m - _ * x, k = o * m - _ * w, f = y * b - d * c, R = y * n - l * c, C = y * q - z * c, O = d * n - l * b, P = d * q - z * b, I = l * q - z * n, L = r.storage[0], X = r.storage[1], $ = r.storage[2], ct = r.storage[3];
    let ht = S * I - W * P + F * O + H * C - U * R + k * f;
    ht != 0 && (ht = 1 / ht), e.x = ht * ((x * I - w * P + m * O) * L - (v * I - w * C + m * R) * X + (v * P - x * C + m * f) * $ - (v * O - x * R + w * f) * ct), e.y = ht * -((g * I - o * P + _ * O) * L - (h * I - o * C + _ * R) * X + (h * P - g * C + _ * f) * $ - (h * O - g * R + o * f) * ct), e.z = ht * ((b * k - n * U + q * H) * L - (c * k - n * F + q * W) * X + (c * U - b * F + q * S) * $ - (c * H - b * W + n * S) * ct), e.w = ht * -((d * k - l * U + z * H) * L - (y * k - l * F + z * W) * X + (y * U - d * F + z * S) * $ - (y * H - d * W + l * S) * ct);
  }
  /// Returns a matrix that is the inverse of [other] if [other] is invertible,
  /// otherwise `null`.
  static tryInvert(t) {
    const e = j.zero();
    return e.copyInverse(t) == 0 ? null : e;
  }
  static identity() {
    const t = j.zero();
    return t.setIdentity(), t;
  }
  static translation(t) {
    const e = j.zero();
    return e.setIdentity(), e.setTranslation(t), e;
  }
  static translationValues(t, e, r) {
    const h = j.zero();
    return h.setIdentity(), h.setTranslationRaw(t, e, r), h;
  }
  static diagonal3(t) {
    const e = j.zero(), r = e._m4storage, h = t._v3storage;
    return r[15] = 1, r[10] = h[2], r[5] = h[1], r[0] = h[0], e;
  }
  static diagonal3Values(t, e, r) {
    const h = j.zero();
    return h._m4storage[15] = 1, h._m4storage[10] = r, h._m4storage[5] = e, h._m4storage[0] = t, h;
  }
  static skewX(t) {
    const e = j.identity();
    return e._m4storage[4] = Math.tan(t), e;
  }
  static skewY(t) {
    const e = j.identity();
    return e._m4storage[1] = Math.tan(t), e;
  }
  static skew(t, e) {
    const r = j.identity();
    return r._m4storage[1] = Math.tan(e), r._m4storage[4] = Math.tan(t), r;
  }
  /**
  
  Return index in storage for [row], [col] value.
  */
  index(t, e) {
    return e * 4 + t;
  }
  /**
  
  Value at [row], [col].
  */
  entry(t, e) {
    if (t < 0 || t >= this.dimension || e < 0 || e >= this.dimension)
      throw new RangeError("Invalid row/column indices");
    return this._m4storage[this.index(t, e)];
  }
  /**
  
  Set value at [row], [col] to be [v].
  */
  setEntry(t, e, r) {
    if (t < 0 || t >= this.dimension || e < 0 || e >= this.dimension)
      throw new RangeError("Invalid row/column indices");
    this._m4storage[this.index(t, e)] = r;
  }
  /// Sets the diagonal to [arg]
  splatDiagonal(t) {
    this._m4storage[0] = t, this._m4storage[5] = t, this._m4storage[10] = t, this._m4storage[15] = t;
  }
  setValues(t, e, r, h, g, o, _, v, x, w, m, y, d, l, z, c) {
    this._m4storage[15] = c, this._m4storage[14] = z, this._m4storage[13] = l, this._m4storage[12] = d, this._m4storage[11] = y, this._m4storage[10] = m, this._m4storage[9] = w, this._m4storage[8] = x, this._m4storage[7] = v, this._m4storage[6] = _, this._m4storage[5] = o, this._m4storage[4] = g, this._m4storage[3] = h, this._m4storage[2] = r, this._m4storage[1] = e, this._m4storage[0] = t;
  }
  /**
   * Sets the entire matrix to the column values.
   */
  setColumns(t, e, r, h) {
    const g = t._v4storage, o = e._v4storage, _ = r._v4storage, v = h._v4storage;
    this._m4storage[0] = g[0], this._m4storage[1] = g[1], this._m4storage[2] = g[2], this._m4storage[3] = g[3], this._m4storage[4] = o[0], this._m4storage[5] = o[1], this._m4storage[6] = o[2], this._m4storage[7] = o[3], this._m4storage[8] = _[0], this._m4storage[9] = _[1], this._m4storage[10] = _[2], this._m4storage[11] = _[3], this._m4storage[12] = v[0], this._m4storage[13] = v[1], this._m4storage[14] = v[2], this._m4storage[15] = v[3];
  }
  /**
  
  Sets the entire matrix to the matrix in [arg].
  */
  setFrom(t) {
    const e = t._m4storage;
    this._m4storage[15] = e[15], this._m4storage[14] = e[14], this._m4storage[13] = e[13], this._m4storage[12] = e[12], this._m4storage[11] = e[11], this._m4storage[10] = e[10], this._m4storage[9] = e[9], this._m4storage[8] = e[8], this._m4storage[7] = e[7], this._m4storage[6] = e[6], this._m4storage[5] = e[5], this._m4storage[4] = e[4], this._m4storage[3] = e[3], this._m4storage[2] = e[2], this._m4storage[1] = e[1], this._m4storage[0] = e[0];
  }
  //   /// Sets the matrix from translation [arg0] and rotation [arg1].
  // void setFromTranslationRotation(Vector3 arg0, Quaternion arg1) {
  //   final arg1Storage = arg1._qStorage;
  //   final x = arg1Storage[0];
  //   final y = arg1Storage[1];
  //   final z = arg1Storage[2];
  //   final w = arg1Storage[3];
  //   final x2 = x + x;
  //   final y2 = y + y;
  //   final z2 = z + z;
  //   final xx = x * x2;
  //   final xy = x * y2;
  //   final xz = x * z2;
  //   final yy = y * y2;
  //   final yz = y * z2;
  //   final zz = z * z2;
  //   final wx = w * x2;
  //   final wy = w * y2;
  //   final wz = w * z2;
  //   final arg0Storage = arg0._v3storage;
  //   _m4storage[0] = 1.0 - (yy + zz);
  //   _m4storage[1] = xy + wz;
  //   _m4storage[2] = xz - wy;
  //   _m4storage[3] = 0.0;
  //   _m4storage[4] = xy - wz;
  //   _m4storage[5] = 1.0 - (xx + zz);
  //   _m4storage[6] = yz + wx;
  //   _m4storage[7] = 0.0;
  //   _m4storage[8] = xz + wy;
  //   _m4storage[9] = yz - wx;
  //   _m4storage[10] = 1.0 - (xx + yy);
  //   _m4storage[11] = 0.0;
  //   _m4storage[12] = arg0Storage[0];
  //   _m4storage[13] = arg0Storage[1];
  //   _m4storage[14] = arg0Storage[2];
  //   _m4storage[15] = 1.0;
  // }
  // /// Sets the matrix from [translation], [rotation] and [scale].
  // void setFromTranslationRotationScale(
  //     Vector3 translation, Quaternion rotation, Vector3 scale) {
  //   setFromTranslationRotation(translation, rotation);
  //   this.scale(scale);
  // }
  /// Sets the upper 2x2 of the matrix to be [arg].
  setUpper2x2(t) {
    const e = t._m2storage;
    this._m4storage[0] = e[0], this._m4storage[1] = e[1], this._m4storage[4] = e[2], this._m4storage[5] = e[3];
  }
  /// Sets the diagonal of the matrix to be [arg].
  setDiagonal(t) {
    const e = t._v4storage;
    this._m4storage[0] = e[0], this._m4storage[5] = e[1], this._m4storage[10] = e[2], this._m4storage[15] = e[3];
  }
  setOuter(t, e) {
    const r = t._v4storage, h = e._v4storage;
    this._m4storage[0] = r[0] * h[0], this._m4storage[1] = r[0] * h[1], this._m4storage[2] = r[0] * h[2], this._m4storage[3] = r[0] * h[3], this._m4storage[4] = r[1] * h[0], this._m4storage[5] = r[1] * h[1], this._m4storage[6] = r[1] * h[2], this._m4storage[7] = r[1] * h[3], this._m4storage[8] = r[2] * h[0], this._m4storage[9] = r[2] * h[1], this._m4storage[10] = r[2] * h[2], this._m4storage[11] = r[2] * h[3], this._m4storage[12] = r[3] * h[0], this._m4storage[13] = r[3] * h[1], this._m4storage[14] = r[3] * h[2], this._m4storage[15] = r[3] * h[3];
  }
  /** Returns row 0 */
  get row0() {
    return this.getRow(0);
  }
  /** Returns row 1 */
  get row1() {
    return this.getRow(1);
  }
  /** Returns row 2 */
  get row2() {
    return this.getRow(2);
  }
  /** Returns row 3 */
  get row3() {
    return this.getRow(3);
  }
  /** Sets row 0 to [arg] */
  set row0(t) {
    this.setRow(0, t);
  }
  /** Sets row 1 to [arg] */
  set row1(t) {
    this.setRow(1, t);
  }
  /** Sets row 2 to [arg] */
  set row2(t) {
    this.setRow(2, t);
  }
  /** Sets row 3 to [arg] */
  set row3(t) {
    this.setRow(3, t);
  }
  /** Assigns the [row] of the matrix [arg] */
  setRow(t, e) {
    const r = e._v4storage;
    this._m4storage[this.index(t, 0)] = r[0], this._m4storage[this.index(t, 1)] = r[1], this._m4storage[this.index(t, 2)] = r[2], this._m4storage[this.index(t, 3)] = r[3];
  }
  /** Gets the [row] of the matrix */
  getRow(t) {
    const e = i.zero(), r = e._v4storage;
    return r[0] = this._m4storage[this.index(t, 0)], r[1] = this._m4storage[this.index(t, 1)], r[2] = this._m4storage[this.index(t, 2)], r[3] = this._m4storage[this.index(t, 3)], e;
  }
  /**
   * Assigns the [column] of the matrix [arg]
   * @param column the column index
   * @param arg the vector to be assigned
   */
  setColumn(t, e) {
    const r = t * 4, h = e._v4storage;
    this._m4storage[r + 3] = h[3], this._m4storage[r + 2] = h[2], this._m4storage[r + 1] = h[1], this._m4storage[r + 0] = h[0];
  }
  /**
   * Gets the [column] of the matrix
   * @param column the column index
   * @returns the column as a Vector4
   */
  getColumn(t) {
    const e = i.zero(), r = e._v4storage, h = t * 4;
    return r[3] = this._m4storage[h + 3], r[2] = this._m4storage[h + 2], r[1] = this._m4storage[h + 1], r[0] = this._m4storage[h + 0], e;
  }
  /** Clone matrix. */
  clone() {
    return j.copy(this);
  }
  /**
   * Copy into [arg].
   */
  copyInto(t) {
    const e = t._m4storage;
    return e[0] = this._m4storage[0], e[1] = this._m4storage[1], e[2] = this._m4storage[2], e[3] = this._m4storage[3], e[4] = this._m4storage[4], e[5] = this._m4storage[5], e[6] = this._m4storage[6], e[7] = this._m4storage[7], e[8] = this._m4storage[8], e[9] = this._m4storage[9], e[10] = this._m4storage[10], e[11] = this._m4storage[11], e[12] = this._m4storage[12], e[13] = this._m4storage[13], e[14] = this._m4storage[14], e[15] = this._m4storage[15], t;
  }
  /**
   * Translate this matrix by a [Vector3], [Vector4], or x,y,z
   * @param x the x coordinate or Vector3/Vector4 to translate by.
   * @param y the y coordinate or undefined if `x` is a Vector3/Vector4.
   * @param z the z coordinate or undefined if `x` is a Vector3/Vector4.
   */
  translate(t, e, r) {
    let h, g, o;
    const _ = t instanceof i ? t.w : 1;
    if (t instanceof p)
      h = t.x, g = t.y, o = t.z;
    else if (t instanceof i)
      h = t.x, g = t.y, o = t.z;
    else if (typeof t == "number")
      h = t, g = e || 0, o = r || 0;
    else
      throw new Error("Unsupported argument type.");
    const v = this._m4storage[0] * h + this._m4storage[4] * g + this._m4storage[8] * o + this._m4storage[12] * _, x = this._m4storage[1] * h + this._m4storage[5] * g + this._m4storage[9] * o + this._m4storage[13] * _, w = this._m4storage[2] * h + this._m4storage[6] * g + this._m4storage[10] * o + this._m4storage[14] * _, m = this._m4storage[3] * h + this._m4storage[7] * g + this._m4storage[11] * o + this._m4storage[15] * _;
    return this._m4storage[12] = v, this._m4storage[13] = x, this._m4storage[14] = w, this._m4storage[15] = m, this;
  }
  translated(t, e, r) {
    return this.clone().translate(t, e, r);
  }
  /**
   * Multiplies this matrix by a translation from the left.
   * The translation can be specified with a [Vector3], [Vector4], or x, y, z.
   */
  leftTranslate(t, e = 0, r = 0) {
    let h, g, o;
    const _ = t instanceof i ? t.w : 1;
    if (t instanceof p)
      h = t.x, g = t.y, o = t.z;
    else if (t instanceof i)
      h = t.x, g = t.y, o = t.z;
    else if (typeof t == "number")
      h = t, g = e, o = r;
    else
      throw new Error("Invalid argument type");
    return this._m4storage[0] += h * this._m4storage[3], this._m4storage[1] += g * this._m4storage[3], this._m4storage[2] += o * this._m4storage[3], this._m4storage[3] = _ * this._m4storage[3], this._m4storage[4] += h * this._m4storage[7], this._m4storage[5] += g * this._m4storage[7], this._m4storage[6] += o * this._m4storage[7], this._m4storage[7] = _ * this._m4storage[7], this._m4storage[8] += h * this._m4storage[11], this._m4storage[9] += g * this._m4storage[11], this._m4storage[10] += o * this._m4storage[11], this._m4storage[11] = _ * this._m4storage[11], this._m4storage[12] += h * this._m4storage[15], this._m4storage[13] += g * this._m4storage[15], this._m4storage[14] += o * this._m4storage[15], this._m4storage[15] = _ * this._m4storage[15], this;
  }
  /**
  
  Rotate this matrix [angle] radians around [axis].
  */
  rotate(t, e) {
    const r = t.length, h = t._v3storage, g = h[0] / r, o = h[1] / r, _ = h[2] / r, v = Math.cos(e), x = Math.sin(e), w = 1 - v, m = g * g * w + v, y = g * o * w - _ * x, d = g * _ * w + o * x, l = o * g * w + _ * x, z = o * o * w + v, c = o * _ * w - g * x, b = _ * g * w - o * x, n = _ * o * w + g * x, q = _ * _ * w + v, S = this._m4storage[0] * m + this._m4storage[4] * l + this._m4storage[8] * b, W = this._m4storage[1] * m + this._m4storage[5] * l + this._m4storage[9] * b, F = this._m4storage[2] * m + this._m4storage[6] * l + this._m4storage[10] * b, H = this._m4storage[3] * m + this._m4storage[7] * l + this._m4storage[11] * b, U = this._m4storage[0] * y + this._m4storage[4] * z + this._m4storage[8] * n, k = this._m4storage[1] * y + this._m4storage[5] * z + this._m4storage[9] * n, f = this._m4storage[2] * y + this._m4storage[6] * z + this._m4storage[10] * n, R = this._m4storage[3] * y + this._m4storage[7] * z + this._m4storage[11] * n, C = this._m4storage[0] * d + this._m4storage[4] * c + this._m4storage[8] * q, O = this._m4storage[1] * d + this._m4storage[5] * c + this._m4storage[9] * q, P = this._m4storage[2] * d + this._m4storage[6] * c + this._m4storage[10] * q, I = this._m4storage[3] * d + this._m4storage[7] * c + this._m4storage[11] * q;
    return this._m4storage[0] = S, this._m4storage[1] = W, this._m4storage[2] = F, this._m4storage[3] = H, this._m4storage[4] = U, this._m4storage[5] = k, this._m4storage[6] = f, this._m4storage[7] = R, this._m4storage[8] = C, this._m4storage[9] = O, this._m4storage[10] = P, this._m4storage[11] = I, this;
  }
  /// Rotate this [angle] radians around X
  rotateX(t) {
    const e = Math.cos(t), r = Math.sin(t), h = this._m4storage[4] * e + this._m4storage[8] * r, g = this._m4storage[5] * e + this._m4storage[9] * r, o = this._m4storage[6] * e + this._m4storage[10] * r, _ = this._m4storage[7] * e + this._m4storage[11] * r, v = this._m4storage[4] * -r + this._m4storage[8] * e, x = this._m4storage[5] * -r + this._m4storage[9] * e, w = this._m4storage[6] * -r + this._m4storage[10] * e, m = this._m4storage[7] * -r + this._m4storage[11] * e;
    return this._m4storage[4] = h, this._m4storage[5] = g, this._m4storage[6] = o, this._m4storage[7] = _, this._m4storage[8] = v, this._m4storage[9] = x, this._m4storage[10] = w, this._m4storage[11] = m, this;
  }
  /**
   * Rotate this matrix [angle] radians around Y
   */
  rotateY(t) {
    const e = Math.cos(t), r = Math.sin(t), h = this._m4storage[0] * e + this._m4storage[8] * -r, g = this._m4storage[1] * e + this._m4storage[9] * -r, o = this._m4storage[2] * e + this._m4storage[10] * -r, _ = this._m4storage[3] * e + this._m4storage[11] * -r, v = this._m4storage[0] * r + this._m4storage[8] * e, x = this._m4storage[1] * r + this._m4storage[9] * e, w = this._m4storage[2] * r + this._m4storage[10] * e, m = this._m4storage[3] * r + this._m4storage[11] * e;
    return this._m4storage[0] = h, this._m4storage[1] = g, this._m4storage[2] = o, this._m4storage[3] = _, this._m4storage[8] = v, this._m4storage[9] = x, this._m4storage[10] = w, this._m4storage[11] = m, this;
  }
  /**
   * Rotate this matrix [angle] radians around Z
   */
  rotateZ(t) {
    const e = Math.cos(t), r = Math.sin(t), h = this._m4storage[0] * e + this._m4storage[4] * r, g = this._m4storage[1] * e + this._m4storage[5] * r, o = this._m4storage[2] * e + this._m4storage[6] * r, _ = this._m4storage[3] * e + this._m4storage[7] * r, v = this._m4storage[0] * -r + this._m4storage[4] * e, x = this._m4storage[1] * -r + this._m4storage[5] * e, w = this._m4storage[2] * -r + this._m4storage[6] * e, m = this._m4storage[3] * -r + this._m4storage[7] * e;
    return this._m4storage[0] = h, this._m4storage[1] = g, this._m4storage[2] = o, this._m4storage[3] = _, this._m4storage[4] = v, this._m4storage[5] = x, this._m4storage[6] = w, this._m4storage[7] = m, this;
  }
  /**
   * Scale this matrix by a Vector3, Vector4, or x,y,z
   */
  scale(t, e, r) {
    let h, g, o;
    const _ = t instanceof i ? t.w : 1;
    if (t instanceof p)
      h = t.x, g = t.y, o = t.z;
    else if (t instanceof i)
      h = t.x, g = t.y, o = t.z;
    else if (typeof t == "number")
      h = t, g = e ?? t, o = r ?? t;
    else
      throw new Error("Unsupported type for scale operation");
    return this._m4storage[0] *= h, this._m4storage[1] *= h, this._m4storage[2] *= h, this._m4storage[3] *= h, this._m4storage[4] *= g, this._m4storage[5] *= g, this._m4storage[6] *= g, this._m4storage[7] *= g, this._m4storage[8] *= o, this._m4storage[9] *= o, this._m4storage[10] *= o, this._m4storage[11] *= o, this._m4storage[12] *= _, this._m4storage[13] *= _, this._m4storage[14] *= _, this._m4storage[15] *= _, this;
  }
  /**
   * Create a copy of this scaled by a [Vector3], [Vector4] or [x],[y], and [z].
   */
  scaled(t, e, r) {
    const h = this.clone();
    return h.scale(t, e, r), h;
  }
  /// Zeros this.
  setZero() {
    this._m4storage[0] = 0, this._m4storage[1] = 0, this._m4storage[2] = 0, this._m4storage[3] = 0, this._m4storage[4] = 0, this._m4storage[5] = 0, this._m4storage[6] = 0, this._m4storage[7] = 0, this._m4storage[8] = 0, this._m4storage[9] = 0, this._m4storage[10] = 0, this._m4storage[11] = 0, this._m4storage[12] = 0, this._m4storage[13] = 0, this._m4storage[14] = 0, this._m4storage[15] = 0;
  }
  /// Makes this into the identity matrix.
  setIdentity() {
    this._m4storage[0] = 1, this._m4storage[1] = 0, this._m4storage[2] = 0, this._m4storage[3] = 0, this._m4storage[4] = 0, this._m4storage[5] = 1, this._m4storage[6] = 0, this._m4storage[7] = 0, this._m4storage[8] = 0, this._m4storage[9] = 0, this._m4storage[10] = 1, this._m4storage[11] = 0, this._m4storage[12] = 0, this._m4storage[13] = 0, this._m4storage[14] = 0, this._m4storage[15] = 1;
  }
  /// Returns the transpose of this.
  transposed() {
    const t = this.clone();
    return t.transpose(), t;
  }
  transpose() {
    let t;
    t = this._m4storage[4], this._m4storage[4] = this._m4storage[1], this._m4storage[1] = t, t = this._m4storage[8], this._m4storage[8] = this._m4storage[2], this._m4storage[2] = t, t = this._m4storage[12], this._m4storage[12] = this._m4storage[3], this._m4storage[3] = t, t = this._m4storage[9], this._m4storage[9] = this._m4storage[6], this._m4storage[6] = t, t = this._m4storage[13], this._m4storage[13] = this._m4storage[7], this._m4storage[7] = t, t = this._m4storage[14], this._m4storage[14] = this._m4storage[11], this._m4storage[11] = t;
  }
  /**
   * Returns the component wise absolute value of this.
   */
  absolute() {
    const t = j.zero(), e = t._m4storage;
    return e[0] = Math.abs(this._m4storage[0]), e[1] = Math.abs(this._m4storage[1]), e[2] = Math.abs(this._m4storage[2]), e[3] = Math.abs(this._m4storage[3]), e[4] = Math.abs(this._m4storage[4]), e[5] = Math.abs(this._m4storage[5]), e[6] = Math.abs(this._m4storage[6]), e[7] = Math.abs(this._m4storage[7]), e[8] = Math.abs(this._m4storage[8]), e[9] = Math.abs(this._m4storage[9]), e[10] = Math.abs(this._m4storage[10]), e[11] = Math.abs(this._m4storage[11]), e[12] = Math.abs(this._m4storage[12]), e[13] = Math.abs(this._m4storage[13]), e[14] = Math.abs(this._m4storage[14]), e[15] = Math.abs(this._m4storage[15]), t;
  }
  determinant() {
    const t = this._m4storage[0] * this._m4storage[5] - this._m4storage[1] * this._m4storage[4], e = this._m4storage[0] * this._m4storage[6] - this._m4storage[2] * this._m4storage[4], r = this._m4storage[0] * this._m4storage[7] - this._m4storage[3] * this._m4storage[4], h = this._m4storage[1] * this._m4storage[6] - this._m4storage[2] * this._m4storage[5], g = this._m4storage[1] * this._m4storage[7] - this._m4storage[3] * this._m4storage[5], o = this._m4storage[2] * this._m4storage[7] - this._m4storage[3] * this._m4storage[6], _ = this._m4storage[8] * h - this._m4storage[9] * e + this._m4storage[10] * t, v = this._m4storage[8] * g - this._m4storage[9] * r + this._m4storage[11] * t, x = this._m4storage[8] * o - this._m4storage[10] * r + this._m4storage[11] * e;
    return -(this._m4storage[9] * o - this._m4storage[10] * g + this._m4storage[11] * h) * this._m4storage[12] + x * this._m4storage[13] - v * this._m4storage[14] + _ * this._m4storage[15];
  }
  /** Returns the dot product of row [i] and [v]. */
  dotRow(t, e) {
    const r = e._v4storage;
    return this._m4storage[t] * r[0] + this._m4storage[4 + t] * r[1] + this._m4storage[8 + t] * r[2] + this._m4storage[12 + t] * r[3];
  }
  /** Returns the dot product of column [j] and [v]. */
  dotColumn(t, e) {
    const r = e._v4storage;
    return this._m4storage[t * 4] * r[0] + this._m4storage[t * 4 + 1] * r[1] + this._m4storage[t * 4 + 2] * r[2] + this._m4storage[t * 4 + 3] * r[3];
  }
  /** Returns the trace of the matrix. The trace of a matrix is the sum of the diagonal entries. */
  trace() {
    let t = 0;
    return t += this._m4storage[0], t += this._m4storage[5], t += this._m4storage[10], t += this._m4storage[15], t;
  }
  /**
   * Returns infinity norm of the matrix. Used for numerical analysis.
   */
  infinityNorm() {
    let t = 0;
    {
      let e = 0;
      e += Math.abs(this._m4storage[0]), e += Math.abs(this._m4storage[1]), e += Math.abs(this._m4storage[2]), e += Math.abs(this._m4storage[3]), t = e > t ? e : t;
    }
    {
      let e = 0;
      e += Math.abs(this._m4storage[4]), e += Math.abs(this._m4storage[5]), e += Math.abs(this._m4storage[6]), e += Math.abs(this._m4storage[7]), t = e > t ? e : t;
    }
    {
      let e = 0;
      e += Math.abs(this._m4storage[8]), e += Math.abs(this._m4storage[9]), e += Math.abs(this._m4storage[10]), e += Math.abs(this._m4storage[11]), t = e > t ? e : t;
    }
    {
      let e = 0;
      e += Math.abs(this._m4storage[12]), e += Math.abs(this._m4storage[13]), e += Math.abs(this._m4storage[14]), e += Math.abs(this._m4storage[15]), t = e > t ? e : t;
    }
    return t;
  }
  /// Returns relative error between this and [correct]
  relativeError(t) {
    t.sub(this);
    const e = t, r = t.infinityNorm();
    return e.infinityNorm() / r;
  }
  /**
   * Returns absolute error between this and [correct]
   */
  absoluteError(t) {
    const e = this.infinityNorm(), r = t.infinityNorm();
    return Math.abs(e - r);
  }
  getTranslation() {
    const t = this._m4storage[14], e = this._m4storage[13], r = this._m4storage[12];
    return new p(r, e, t);
  }
  /// Sets the translation vector in this homogeneous transformation matrix.
  setTranslation(t) {
    const e = t._v3storage, r = e[2], h = e[1], g = e[0];
    this._m4storage[14] = r, this._m4storage[13] = h, this._m4storage[12] = g;
  }
  /**
   * Sets the translation vector in this homogeneous transformation matrix.
   */
  setTranslationRaw(t, e, r) {
    this._m4storage[14] = r, this._m4storage[13] = e, this._m4storage[12] = t;
  }
  /// Returns the rotation matrix from this homogeneous transformation matrix.
  getRotation() {
    const t = It.zero();
    return this.copyRotation(t), t;
  }
  copyRotation(t) {
    const e = t._m3storage;
    e[0] = this._m4storage[0], e[1] = this._m4storage[1], e[2] = this._m4storage[2], e[3] = this._m4storage[4], e[4] = this._m4storage[5], e[5] = this._m4storage[6], e[6] = this._m4storage[8], e[7] = this._m4storage[9], e[8] = this._m4storage[10];
  }
  /// Sets the rotation matrix in this homogeneous transformation matrix.
  setRotation(t) {
    const e = t._m3storage;
    this._m4storage[0] = e[0], this._m4storage[1] = e[1], this._m4storage[2] = e[2], this._m4storage[4] = e[3], this._m4storage[5] = e[4], this._m4storage[6] = e[5], this._m4storage[8] = e[6], this._m4storage[9] = e[7], this._m4storage[10] = e[8];
  }
  /**
   * Returns the normal matrix from this homogeneous transformation matrix. The normal
   * matrix is the transpose of the inverse of the top-left 3x3 part of this 4x4 matrix.
   */
  // getNormalMatrix(): Matrix3 {
  //   const normalMatrix = Matrix3.identity();
  //   this.copyNormalMatrix(normalMatrix);
  //   return normalMatrix;
  // }
  /// Returns the max scale value of the 3 axes.
  getMaxScaleOnAxis() {
    const t = this._m4storage[0] * this._m4storage[0] + this._m4storage[1] * this._m4storage[1] + this._m4storage[2] * this._m4storage[2], e = this._m4storage[4] * this._m4storage[4] + this._m4storage[5] * this._m4storage[5] + this._m4storage[6] * this._m4storage[6], r = this._m4storage[8] * this._m4storage[8] + this._m4storage[9] * this._m4storage[9] + this._m4storage[10] * this._m4storage[10];
    return Math.sqrt(Math.max(t, Math.max(e, r)));
  }
  /// Transposes just the upper 3x3 rotation matrix.
  transposeRotation() {
    let t;
    t = this._m4storage[1], this._m4storage[1] = this._m4storage[4], this._m4storage[4] = t, t = this._m4storage[2], this._m4storage[2] = this._m4storage[8], this._m4storage[8] = t, t = this._m4storage[4], this._m4storage[4] = this._m4storage[1], this._m4storage[1] = t, t = this._m4storage[6], this._m4storage[6] = this._m4storage[9], this._m4storage[9] = t, t = this._m4storage[8], this._m4storage[8] = this._m4storage[2], this._m4storage[2] = t, t = this._m4storage[9], this._m4storage[9] = this._m4storage[6], this._m4storage[6] = t;
  }
  /// Invert this.
  invert() {
    return this.copyInverse(this);
  }
  // Set this matrix to be the inverse of [arg]
  copyInverse(t) {
    const e = t._m4storage, r = e[0], h = e[1], g = e[2], o = e[3], _ = e[4], v = e[5], x = e[6], w = e[7], m = e[8], y = e[9], d = e[10], l = e[11], z = e[12], c = e[13], b = e[14], n = e[15], q = r * v - h * _, S = r * x - g * _, W = r * w - o * _, F = h * x - g * v, H = h * w - o * v, U = g * w - o * x, k = m * c - y * z, f = m * b - d * z, R = m * n - l * z, C = y * b - d * c, O = y * n - l * c, P = d * n - l * b, I = q * P - S * O + W * C + F * R - H * f + U * k;
    if (I == 0)
      return this.setFrom(t), 0;
    const L = 1 / I;
    return this._m4storage[0] = (v * P - x * O + w * C) * L, this._m4storage[1] = (-h * P + g * O - o * C) * L, this._m4storage[2] = (c * U - b * H + n * F) * L, this._m4storage[3] = (-y * U + d * H - l * F) * L, this._m4storage[4] = (-_ * P + x * R - w * f) * L, this._m4storage[5] = (r * P - g * R + o * f) * L, this._m4storage[6] = (-z * U + b * W - n * S) * L, this._m4storage[7] = (m * U - d * W + l * S) * L, this._m4storage[8] = (_ * O - v * R + w * k) * L, this._m4storage[9] = (-r * O + h * R - o * k) * L, this._m4storage[10] = (z * H - c * W + n * q) * L, this._m4storage[11] = (-m * H + y * W - l * q) * L, this._m4storage[12] = (-_ * C + v * f - x * k) * L, this._m4storage[13] = (r * C - h * f + g * k) * L, this._m4storage[14] = (-z * F + c * S - b * q) * L, this._m4storage[15] = (m * F - y * S + d * q) * L, I;
  }
  invertRotation() {
    const t = this.determinant();
    if (t == 0)
      return 0;
    const e = 1 / t;
    let r, h, g, o, _, v, x, w, m;
    return r = e * (this._m4storage[5] * this._m4storage[10] - this._m4storage[6] * this._m4storage[9]), h = e * (this._m4storage[2] * this._m4storage[9] - this._m4storage[1] * this._m4storage[10]), g = e * (this._m4storage[1] * this._m4storage[6] - this._m4storage[2] * this._m4storage[5]), o = e * (this._m4storage[6] * this._m4storage[8] - this._m4storage[4] * this._m4storage[10]), _ = e * (this._m4storage[0] * this._m4storage[10] - this._m4storage[2] * this._m4storage[8]), v = e * (this._m4storage[2] * this._m4storage[4] - this._m4storage[0] * this._m4storage[6]), x = e * (this._m4storage[4] * this._m4storage[9] - this._m4storage[5] * this._m4storage[8]), w = e * (this._m4storage[1] * this._m4storage[8] - this._m4storage[0] * this._m4storage[9]), m = e * (this._m4storage[0] * this._m4storage[5] - this._m4storage[1] * this._m4storage[4]), this._m4storage[0] = r, this._m4storage[1] = h, this._m4storage[2] = g, this._m4storage[4] = o, this._m4storage[5] = _, this._m4storage[6] = v, this._m4storage[8] = x, this._m4storage[9] = w, this._m4storage[10] = m, t;
  }
  /// Sets the upper 3x3 to a rotation of [radians] around X
  setRotationX(t) {
    const e = Math.cos(t), r = Math.sin(t);
    this._m4storage[0] = 1, this._m4storage[1] = 0, this._m4storage[2] = 0, this._m4storage[4] = 0, this._m4storage[5] = e, this._m4storage[6] = r, this._m4storage[8] = 0, this._m4storage[9] = -r, this._m4storage[10] = e, this._m4storage[3] = 0, this._m4storage[7] = 0, this._m4storage[11] = 0;
  }
  /// Sets the upper 3x3 to a rotation of [radians] around Y
  setRotationY(t) {
    const e = Math.cos(t), r = Math.sin(t);
    this._m4storage[0] = e, this._m4storage[1] = 0, this._m4storage[2] = -r, this._m4storage[4] = 0, this._m4storage[5] = 1, this._m4storage[6] = 0, this._m4storage[8] = r, this._m4storage[9] = 0, this._m4storage[10] = e, this._m4storage[3] = 0, this._m4storage[7] = 0, this._m4storage[11] = 0;
  }
  /// Sets the upper 3x3 to a rotation of [radians] around Z
  setRotationZ(t) {
    const e = Math.cos(t), r = Math.sin(t);
    this._m4storage[0] = e, this._m4storage[1] = r, this._m4storage[2] = 0, this._m4storage[4] = -r, this._m4storage[5] = e, this._m4storage[6] = 0, this._m4storage[8] = 0, this._m4storage[9] = 0, this._m4storage[10] = 1, this._m4storage[3] = 0, this._m4storage[7] = 0, this._m4storage[11] = 0;
  }
  /// Converts into Adjugate matrix and scales by [scale]
  scaleAdjoint(t) {
    const e = this._m4storage[0], r = this._m4storage[4], h = this._m4storage[8], g = this._m4storage[12], o = this._m4storage[1], _ = this._m4storage[5], v = this._m4storage[9], x = this._m4storage[13], w = this._m4storage[2], m = this._m4storage[6], y = this._m4storage[10], d = this._m4storage[14], l = this._m4storage[3], z = this._m4storage[7], c = this._m4storage[11], b = this._m4storage[15];
    this._m4storage[0] = (_ * (y * b - c * d) - v * (m * b - z * d) + x * (m * c - z * y)) * t, this._m4storage[1] = -(o * (y * b - c * d) - v * (w * b - l * d) + x * (w * c - l * y)) * t, this._m4storage[2] = (o * (m * b - z * d) - _ * (w * b - l * d) + x * (w * z - l * m)) * t, this._m4storage[3] = -(o * (m * c - z * y) - _ * (w * c - l * y) + v * (w * z - l * m)) * t, this._m4storage[4] = -(r * (y * b - c * d) - h * (m * b - z * d) + g * (m * c - z * y)) * t, this._m4storage[5] = (e * (y * b - c * d) - h * (w * b - l * d) + g * (w * c - l * y)) * t, this._m4storage[6] = -(e * (m * b - z * d) - r * (w * b - l * d) + g * (w * z - l * m)) * t, this._m4storage[7] = (e * (m * c - z * y) - r * (w * c - l * y) + h * (w * z - l * m)) * t, this._m4storage[8] = (r * (v * b - c * x) - h * (_ * b - z * x) + g * (_ * c - z * v)) * t, this._m4storage[9] = -(e * (v * b - c * x) - h * (o * b - l * x) + g * (o * c - l * v)) * t, this._m4storage[10] = (e * (_ * b - z * x) - r * (o * b - l * x) + g * (o * z - l * _)) * t, this._m4storage[11] = -(e * (_ * c - z * v) - r * (o * c - l * v) + h * (o * z - l * _)) * t, this._m4storage[12] = -(r * (v * d - y * x) - h * (_ * d - m * x) + g * (_ * y - m * v)) * t, this._m4storage[13] = (e * (v * d - y * x) - h * (o * d - w * x) + g * (o * y - w * v)) * t, this._m4storage[14] = -(e * (_ * d - m * x) - r * (o * d - w * x) + g * (o * m - w * _)) * t, this._m4storage[15] = (e * (_ * y - m * v) - r * (o * y - w * v) + h * (o * m - w * _)) * t;
  }
  /// Rotates [arg] by the absolute rotation of this
  /// Returns [arg].
  /// Primarily used by AABB transformation code.
  absoluteRotate(t) {
    const e = Math.abs(this._m4storage[0]), r = Math.abs(this._m4storage[4]), h = Math.abs(this._m4storage[8]), g = Math.abs(this._m4storage[1]), o = Math.abs(this._m4storage[5]), _ = Math.abs(this._m4storage[9]), v = Math.abs(this._m4storage[2]), x = Math.abs(this._m4storage[6]), w = Math.abs(this._m4storage[10]), m = t._v3storage, y = m[0], d = m[1], l = m[2];
    return m[0] = y * e + d * r + l * h + 0 * 0, m[1] = y * g + d * o + l * _ + 0 * 0, m[2] = y * v + d * x + l * w + 0 * 0, t;
  }
  /// Adds [o] to this.
  add(t) {
    const e = t._m4storage;
    this._m4storage[0] = this._m4storage[0] + e[0], this._m4storage[1] = this._m4storage[1] + e[1], this._m4storage[2] = this._m4storage[2] + e[2], this._m4storage[3] = this._m4storage[3] + e[3], this._m4storage[4] = this._m4storage[4] + e[4], this._m4storage[5] = this._m4storage[5] + e[5], this._m4storage[6] = this._m4storage[6] + e[6], this._m4storage[7] = this._m4storage[7] + e[7], this._m4storage[8] = this._m4storage[8] + e[8], this._m4storage[9] = this._m4storage[9] + e[9], this._m4storage[10] = this._m4storage[10] + e[10], this._m4storage[11] = this._m4storage[11] + e[11], this._m4storage[12] = this._m4storage[12] + e[12], this._m4storage[13] = this._m4storage[13] + e[13], this._m4storage[14] = this._m4storage[14] + e[14], this._m4storage[15] = this._m4storage[15] + e[15];
  }
  /// Subtracts [o] from this.
  sub(t) {
    const e = t._m4storage;
    this._m4storage[0] = this._m4storage[0] - e[0], this._m4storage[1] = this._m4storage[1] - e[1], this._m4storage[2] = this._m4storage[2] - e[2], this._m4storage[3] = this._m4storage[3] - e[3], this._m4storage[4] = this._m4storage[4] - e[4], this._m4storage[5] = this._m4storage[5] - e[5], this._m4storage[6] = this._m4storage[6] - e[6], this._m4storage[7] = this._m4storage[7] - e[7], this._m4storage[8] = this._m4storage[8] - e[8], this._m4storage[9] = this._m4storage[9] - e[9], this._m4storage[10] = this._m4storage[10] - e[10], this._m4storage[11] = this._m4storage[11] - e[11], this._m4storage[12] = this._m4storage[12] - e[12], this._m4storage[13] = this._m4storage[13] - e[13], this._m4storage[14] = this._m4storage[14] - e[14], this._m4storage[15] = this._m4storage[15] - e[15];
  }
  /// Negate this.
  negate() {
    this._m4storage[0] = -this._m4storage[0], this._m4storage[1] = -this._m4storage[1], this._m4storage[2] = -this._m4storage[2], this._m4storage[3] = -this._m4storage[3], this._m4storage[4] = -this._m4storage[4], this._m4storage[5] = -this._m4storage[5], this._m4storage[6] = -this._m4storage[6], this._m4storage[7] = -this._m4storage[7], this._m4storage[8] = -this._m4storage[8], this._m4storage[9] = -this._m4storage[9], this._m4storage[10] = -this._m4storage[10], this._m4storage[11] = -this._m4storage[11], this._m4storage[12] = -this._m4storage[12], this._m4storage[13] = -this._m4storage[13], this._m4storage[14] = -this._m4storage[14], this._m4storage[15] = -this._m4storage[15];
  }
  /// Multiply this by [arg].
  multiplyMatrix(t) {
    const e = this._m4storage[0], r = this._m4storage[4], h = this._m4storage[8], g = this._m4storage[12], o = this._m4storage[1], _ = this._m4storage[5], v = this._m4storage[9], x = this._m4storage[13], w = this._m4storage[2], m = this._m4storage[6], y = this._m4storage[10], d = this._m4storage[14], l = this._m4storage[3], z = this._m4storage[7], c = this._m4storage[11], b = this._m4storage[15], n = t._m4storage, q = n[0], S = n[4], W = n[8], F = n[12], H = n[1], U = n[5], k = n[9], f = n[13], R = n[2], C = n[6], O = n[10], P = n[14], I = n[3], L = n[7], X = n[11], $ = n[15];
    this._m4storage[0] = e * q + r * H + h * R + g * I, this._m4storage[4] = e * S + r * U + h * C + g * L, this._m4storage[8] = e * W + r * k + h * O + g * X, this._m4storage[12] = e * F + r * f + h * P + g * $, this._m4storage[1] = o * q + _ * H + v * R + x * I, this._m4storage[5] = o * S + _ * U + v * C + x * L, this._m4storage[9] = o * W + _ * k + v * O + x * X, this._m4storage[13] = o * F + _ * f + v * P + x * $, this._m4storage[2] = w * q + m * H + y * R + d * I, this._m4storage[6] = w * S + m * U + y * C + d * L, this._m4storage[10] = w * W + m * k + y * O + d * X, this._m4storage[14] = w * F + m * f + y * P + d * $, this._m4storage[3] = l * q + z * H + c * R + b * I, this._m4storage[7] = l * S + z * U + c * C + b * L, this._m4storage[11] = l * W + z * k + c * O + b * X, this._m4storage[15] = l * F + z * f + c * P + b * $;
  }
  /// Multiply a copy of this with [arg].
  multipliedMatrix(t) {
    const e = this.clone();
    return e.multiplyMatrix(t), e;
  }
  /// Multiply a transposed this with [arg].
  transposeMultiply(t) {
    const e = this._m4storage[0], r = this._m4storage[1], h = this._m4storage[2], g = this._m4storage[3], o = this._m4storage[4], _ = this._m4storage[5], v = this._m4storage[6], x = this._m4storage[7], w = this._m4storage[8], m = this._m4storage[9], y = this._m4storage[10], d = this._m4storage[11], l = this._m4storage[12], z = this._m4storage[13], c = this._m4storage[14], b = this._m4storage[15], n = t._m4storage;
    this._m4storage[0] = e * n[0] + r * n[1] + h * n[2] + g * n[3], this._m4storage[4] = e * n[4] + r * n[5] + h * n[6] + g * n[7], this._m4storage[8] = e * n[8] + r * n[9] + h * n[10] + g * n[11], this._m4storage[12] = e * n[12] + r * n[13] + h * n[14] + g * n[15], this._m4storage[1] = o * n[0] + _ * n[1] + v * n[2] + x * n[3], this._m4storage[5] = o * n[4] + _ * n[5] + v * n[6] + x * n[7], this._m4storage[9] = o * n[8] + _ * n[9] + v * n[10] + x * n[11], this._m4storage[13] = o * n[12] + _ * n[13] + v * n[14] + x * n[15], this._m4storage[2] = w * n[0] + m * n[1] + y * n[2] + d * n[3], this._m4storage[6] = w * n[4] + m * n[5] + y * n[6] + d * n[7], this._m4storage[10] = w * n[8] + m * n[9] + y * n[10] + d * n[11], this._m4storage[14] = w * n[12] + m * n[13] + y * n[14] + d * n[15], this._m4storage[3] = l * n[0] + z * n[1] + c * n[2] + b * n[3], this._m4storage[7] = l * n[4] + z * n[5] + c * n[6] + b * n[7], this._m4storage[11] = l * n[8] + z * n[9] + c * n[10] + b * n[11], this._m4storage[15] = l * n[12] + z * n[13] + c * n[14] + b * n[15];
  }
  /// Multiply this with a transposed [arg].
  multiplyTranspose(t) {
    const e = this._m4storage[0], r = this._m4storage[4], h = this._m4storage[8], g = this._m4storage[12], o = this._m4storage[1], _ = this._m4storage[5], v = this._m4storage[9], x = this._m4storage[13], w = this._m4storage[2], m = this._m4storage[6], y = this._m4storage[10], d = this._m4storage[14], l = this._m4storage[3], z = this._m4storage[7], c = this._m4storage[11], b = this._m4storage[15], n = t._m4storage;
    this._m4storage[0] = e * n[0] + r * n[4] + h * n[8] + g * n[12], this._m4storage[4] = e * n[1] + r * n[5] + h * n[9] + g * n[13], this._m4storage[8] = e * n[2] + r * n[6] + h * n[10] + g * n[14], this._m4storage[12] = e * n[3] + r * n[7] + h * n[11] + g * n[15], this._m4storage[1] = o * n[0] + _ * n[4] + v * n[8] + x * n[12], this._m4storage[5] = o * n[1] + _ * n[5] + v * n[9] + x * n[13], this._m4storage[9] = o * n[2] + _ * n[6] + v * n[10] + x * n[14], this._m4storage[13] = o * n[3] + _ * n[7] + v * n[11] + x * n[15], this._m4storage[2] = w * n[0] + m * n[4] + y * n[8] + d * n[12], this._m4storage[6] = w * n[1] + m * n[5] + y * n[9] + d * n[13], this._m4storage[10] = w * n[2] + m * n[6] + y * n[10] + d * n[14], this._m4storage[14] = w * n[3] + m * n[7] + y * n[11] + d * n[15], this._m4storage[3] = l * n[0] + z * n[4] + c * n[8] + b * n[12], this._m4storage[7] = l * n[1] + z * n[5] + c * n[9] + b * n[13], this._m4storage[11] = l * n[2] + z * n[6] + c * n[10] + b * n[14], this._m4storage[15] = l * n[3] + z * n[7] + c * n[11] + b * n[15];
  }
  // /// Decomposes this into [translation], [rotation] and [scale] components.
  // void decompose(Vector3 translation, Quaternion rotation, Vector3 scale) {
  //   final v = _decomposeV ??= Vector3.zero();
  //   var sx = (v..setValues(_m4storage[0], _m4storage[1], _m4storage[2])).length;
  //   final sy =
  //       (v..setValues(_m4storage[4], _m4storage[5], _m4storage[6])).length;
  //   final sz =
  //       (v..setValues(_m4storage[8], _m4storage[9], _m4storage[10])).length;
  //   if (determinant() < 0) {
  //     sx = -sx;
  //   }
  //   translation._v3storage[0] = _m4storage[12];
  //   translation._v3storage[1] = _m4storage[13];
  //   translation._v3storage[2] = _m4storage[14];
  //   final invSX = 1.0 / sx;
  //   final invSY = 1.0 / sy;
  //   final invSZ = 1.0 / sz;
  //   final m = _decomposeM ??= Matrix4.zero();
  //   m.setFrom(this);
  //   m._m4storage[0] *= invSX;
  //   m._m4storage[1] *= invSX;
  //   m._m4storage[2] *= invSX;
  //   m._m4storage[4] *= invSY;
  //   m._m4storage[5] *= invSY;
  //   m._m4storage[6] *= invSY;
  //   m._m4storage[8] *= invSZ;
  //   m._m4storage[9] *= invSZ;
  //   m._m4storage[10] *= invSZ;
  //   final r = _decomposeR ??= Matrix3.zero();
  //   m.copyRotation(r);
  //   rotation.setFromRotation(r);
  //   scale._v3storage[0] = sx;
  //   scale._v3storage[1] = sy;
  //   scale._v3storage[2] = sz;
  // }
  /// Rotate [arg] of type [Vector3] using the rotation defined by this.
  rotate3(t) {
    const e = t._v3storage, r = this._m4storage[0] * e[0] + this._m4storage[4] * e[1] + this._m4storage[8] * e[2], h = this._m4storage[1] * e[0] + this._m4storage[5] * e[1] + this._m4storage[9] * e[2], g = this._m4storage[2] * e[0] + this._m4storage[6] * e[1] + this._m4storage[10] * e[2];
    return e[0] = r, e[1] = h, e[2] = g, t;
  }
  /// Transform [arg] of type [Vector4] using the transformation defined by
  /// this.
  transform(t) {
    const e = t._v4storage, r = this._m4storage[0] * e[0] + this._m4storage[4] * e[1] + this._m4storage[8] * e[2] + this._m4storage[12] * e[3], h = this._m4storage[1] * e[0] + this._m4storage[5] * e[1] + this._m4storage[9] * e[2] + this._m4storage[13] * e[3], g = this._m4storage[2] * e[0] + this._m4storage[6] * e[1] + this._m4storage[10] * e[2] + this._m4storage[14] * e[3], o = this._m4storage[3] * e[0] + this._m4storage[7] * e[1] + this._m4storage[11] * e[2] + this._m4storage[15] * e[3];
    return e[0] = r, e[1] = h, e[2] = g, e[3] = o, t;
  }
  /// Transform [arg] of type [Vector3] using the perspective transformation
  /// defined by this.
  perspectiveTransform(t) {
    const e = t._v3storage, r = this._m4storage[0] * e[0] + this._m4storage[4] * e[1] + this._m4storage[8] * e[2] + this._m4storage[12], h = this._m4storage[1] * e[0] + this._m4storage[5] * e[1] + this._m4storage[9] * e[2] + this._m4storage[13], g = this._m4storage[2] * e[0] + this._m4storage[6] * e[1] + this._m4storage[10] * e[2] + this._m4storage[14], o = 1 / (this._m4storage[3] * e[0] + this._m4storage[7] * e[1] + this._m4storage[11] * e[2] + this._m4storage[15]);
    return e[0] = r * o, e[1] = h * o, e[2] = g * o, t;
  }
  // Copies this into [array] starting at [offset].
  copyIntoArray(t, e = 0) {
    const r = e;
    t[r + 15] = this._m4storage[15], t[r + 14] = this._m4storage[14], t[r + 13] = this._m4storage[13], t[r + 12] = this._m4storage[12], t[r + 11] = this._m4storage[11], t[r + 10] = this._m4storage[10], t[r + 9] = this._m4storage[9], t[r + 8] = this._m4storage[8], t[r + 7] = this._m4storage[7], t[r + 6] = this._m4storage[6], t[r + 5] = this._m4storage[5], t[r + 4] = this._m4storage[4], t[r + 3] = this._m4storage[3], t[r + 2] = this._m4storage[2], t[r + 1] = this._m4storage[1], t[r + 0] = this._m4storage[0];
  }
  /**
   * Copies elements from `array` into this starting at `offset`.
   */
  copyFromArray(t, e = 0) {
    const r = e;
    this._m4storage[15] = t[r + 15], this._m4storage[14] = t[r + 14], this._m4storage[13] = t[r + 13], this._m4storage[12] = t[r + 12], this._m4storage[11] = t[r + 11], this._m4storage[10] = t[r + 10], this._m4storage[9] = t[r + 9], this._m4storage[8] = t[r + 8], this._m4storage[7] = t[r + 7], this._m4storage[6] = t[r + 6], this._m4storage[5] = t[r + 5], this._m4storage[4] = t[r + 4], this._m4storage[3] = t[r + 3], this._m4storage[2] = t[r + 2], this._m4storage[1] = t[r + 1], this._m4storage[0] = t[r + 0];
  }
  get right() {
    const t = this._m4storage[0], e = this._m4storage[1], r = this._m4storage[2];
    return new p(t, e, r);
  }
  get up() {
    const t = this._m4storage[4], e = this._m4storage[5], r = this._m4storage[6];
    return new p(t, e, r);
  }
  get forward() {
    const t = this._m4storage[8], e = this._m4storage[9], r = this._m4storage[10];
    return new p(t, e, r);
  }
  /// Is this the identity matrix?
  isIdentity() {
    return this._m4storage[0] == 1 && // col 1
    this._m4storage[1] == 0 && this._m4storage[2] == 0 && this._m4storage[3] == 0 && this._m4storage[4] == 0 && // col 2
    this._m4storage[5] == 1 && this._m4storage[6] == 0 && this._m4storage[7] == 0 && this._m4storage[8] == 0 && // col 3
    this._m4storage[9] == 0 && this._m4storage[10] == 1 && this._m4storage[11] == 0 && this._m4storage[12] == 0 && // col 4
    this._m4storage[13] == 0 && this._m4storage[14] == 0 && this._m4storage[15] == 1;
  }
  /// Is this the zero matrix?
  isZero() {
    return this._m4storage[0] == 0 && // col 1
    this._m4storage[1] == 0 && this._m4storage[2] == 0 && this._m4storage[3] == 0 && this._m4storage[4] == 0 && // col 2
    this._m4storage[5] == 0 && this._m4storage[6] == 0 && this._m4storage[7] == 0 && this._m4storage[8] == 0 && // col 3
    this._m4storage[9] == 0 && this._m4storage[10] == 0 && this._m4storage[11] == 0 && this._m4storage[12] == 0 && // col 4
    this._m4storage[13] == 0 && this._m4storage[14] == 0 && this._m4storage[15] == 0;
  }
}
const st = class st extends os {
  static all(s) {
    return this.only({
      topLeft: s,
      topRight: s,
      bottomLeft: s,
      bottomRight: s
    });
  }
  static circular(s) {
    return this.all(B.circular(s));
  }
  static vertical({
    top: s = B.zero,
    bottom: t = B.zero
  }) {
    return this.only({
      topLeft: s,
      topRight: s,
      bottomLeft: t,
      bottomRight: t
    });
  }
  static left({
    left: s = B.zero,
    right: t = B.zero
  }) {
    return this.only({
      topLeft: s,
      bottomLeft: s,
      topRight: t,
      bottomRight: t
    });
  }
  static only({
    topLeft: s = B.zero,
    topRight: t = B.zero,
    bottomLeft: e = B.zero,
    bottomRight: r = B.zero
  }) {
    return new st({
      topLeft: s,
      topRight: t,
      bottomLeft: e,
      bottomRight: r
    });
  }
  plus(s) {
    return new st({
      topLeft: this.topLeft.plus(s.topLeft),
      topRight: this.topRight.plus(s.topRight),
      bottomLeft: this.bottomLeft.plus(s.bottomLeft),
      bottomRight: this.bottomRight.plus(s.bottomRight)
    });
  }
  multiply(s) {
    return new st({
      topLeft: this.topLeft.multiply(s),
      topRight: this.topRight.multiply(s),
      bottomLeft: this.bottomLeft.multiply(s),
      bottomRight: this.bottomRight.multiply(s)
    });
  }
  copyWith({
    topLeft: s = this.topLeft,
    topRight: t = this.topRight,
    bottomLeft: e = this.bottomLeft,
    bottomRight: r = this.bottomRight
  }) {
    return st.only({
      topLeft: s,
      topRight: t,
      bottomLeft: e,
      bottomRight: r
    });
  }
  toRRect(s) {
    return ft.fromRectAndCorners({
      rect: s,
      topLeft: this.topLeft.clamp({ minimum: B.zero }),
      topRight: this.topRight.clamp({ minimum: B.zero }),
      bottomLeft: this.bottomLeft.clamp({ minimum: B.zero }),
      bottomRight: this.bottomRight.clamp({ minimum: B.zero })
    });
  }
};
a(st, "zero", st.all(B.zero));
let Et = st;
function ns(u) {
  return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
}
var _t = /* @__PURE__ */ ((u) => (u.left = "left", u.right = "right", u.center = "center", u.start = "start", u.end = "end", u))(_t || {}), nt = /* @__PURE__ */ ((u) => (u.clip = "clip", u.visible = "visible", u.ellipsis = "ellipsis", u))(nt || {}), mt = /* @__PURE__ */ ((u) => (u.parent = "parent", u.longestLine = "longestLine", u))(mt || {});
class qt {
  constructor({
    inherit: s = !0,
    color: t,
    fontSize: e,
    fontWeight: r,
    fontFamily: h,
    textBaseline: g,
    fontStyle: o,
    height: _
  } = {}) {
    a(this, "inherit");
    a(this, "color");
    a(this, "fontSize");
    a(this, "fontWeight");
    a(this, "fontFamily");
    a(this, "textBaseline");
    a(this, "fontStyle");
    /// The height of this text span, as a multiple of the font size.
    ///
    /// When [height] is null or omitted, the line height will be determined
    /// by the font's metrics directly, which may differ from the fontSize.
    /// When [height] is non-null, the line height of the span of text will be a
    /// multiple of [fontSize] and be exactly `fontSize * height` logical pixels
    /// tall.
    a(this, "height");
    this.inherit = s, this.color = t, this.fontSize = e, this.fontWeight = r, this.fontFamily = h, this.textBaseline = g, this.fontStyle = o, this.height = _;
  }
  equals(s) {
    return this === s ? !0 : this.inherit === s.inherit && this.color === s.color && this.fontSize === s.fontSize && this.fontWeight === s.fontWeight && this.fontFamily === s.fontFamily && this.textBaseline === s.textBaseline && this.fontStyle === s.fontStyle;
  }
  copyWidth({
    inherit: s = this.inherit,
    color: t = this.color,
    fontSize: e = this.fontSize,
    fontWeight: r = this.fontWeight,
    fontFamily: h = this.fontFamily,
    textBaseline: g = this.textBaseline,
    fontStyle: o = this.fontStyle,
    height: _ = this.height
  }) {
    return new qt({
      inherit: s,
      color: t,
      fontFamily: h,
      fontSize: e,
      fontWeight: r,
      textBaseline: g,
      fontStyle: o,
      height: _
    });
  }
  merge(s) {
    return s == null ? this : s.inherit ? this.copyWidth({
      ...s
    }) : s;
  }
  getParagraphStyle({
    textAlign: s,
    textDirection: t,
    maxLines: e,
    fontFamily: r = this.fontFamily,
    fontSize: h = this.fontSize,
    fontWeight: g = this.fontWeight,
    fontStyle: o = this.fontStyle,
    ellipsis: _,
    height: v = this.height,
    textScaleFactor: x = 1
  }) {
    return new _s({
      textAlign: s,
      textDirection: t,
      maxLines: e,
      fontFamily: r,
      fontStyle: o,
      fontWeight: g,
      ellipsis: _,
      height: v,
      fontSize: (h ?? 16) * x
    });
  }
}
class _s {
  constructor({
    textAlign: s,
    textDirection: t,
    maxLines: e,
    fontFamily: r,
    fontSize: h,
    fontStyle: g,
    fontWeight: o,
    ellipsis: _,
    height: v
  }) {
    a(this, "textAlign");
    a(this, "textDirection");
    a(this, "maxLines");
    a(this, "fontFamily");
    a(this, "fontSize");
    a(this, "fontWeight");
    a(this, "fontStyle");
    a(this, "ellipsis");
    a(this, "height");
    this.textAlign = s, this.textDirection = t, this.maxLines = e, this.fontFamily = r, this.fontSize = h, this.fontStyle = g, this.fontWeight = o, this.ellipsis = _, this.height = v;
  }
}
var At = /* @__PURE__ */ ((u) => (u.normal = "normal", u.italic = "italic", u))(At || {});
class Bt {
  constructor({ style: s }) {
    a(this, "style");
    this.style = s;
  }
  static equals(s, t) {
    return s.length !== t.length ? !1 : s.every((e, r) => t[r].eqauls(e));
  }
  eqauls(s) {
    return this.style != null || s.style != null ? this.style.equals(s.style) : this.style == null && s.style == null;
  }
  computeToPlainText() {
    throw new Error("Not implemented: computeToPlainText");
  }
  build(s, t) {
    throw new Error("Not implemented: build");
  }
  visitChildren(s) {
    throw new Error("Not implemented: visitChildren");
  }
  toPlainText() {
    return this.computeToPlainText();
  }
}
class us extends Bt {
  constructor({
    style: t = new qt(),
    text: e,
    children: r = []
  }) {
    super({ style: t });
    a(this, "text");
    a(this, "children");
    this.children = r, this.text = e;
  }
  eqauls(t) {
    return t === this ? !0 : this.text === t.text && Bt.equals(this.children, t.children);
  }
  visitChildren(t) {
    t(this), this.children.forEach((e) => e.visitChildren(t));
  }
  computeToPlainText() {
    return this.text || "";
  }
  build(t, e = this.style ?? new qt()) {
    const r = e.merge(this.style), { fontFamily: h, fontSize: g, fontStyle: o, fontWeight: _, color: v, height: x } = r;
    t.addText({
      fontFamily: h,
      fontSize: g,
      fontWeight: _,
      fontStyle: o,
      color: v,
      height: x,
      content: this.computeToPlainText()
    }), this.children.forEach((w) => {
      w.build(t, r);
    });
  }
}
var et, ot, lt;
class Mt {
  constructor({ isPainter: s }) {
    a(this, "isPainter");
    a(this, "ownerElement");
    a(this, "renderOwner");
    a(this, "parent");
    a(this, "needsPaint", !0);
    a(this, "needsLayout", !0);
    a(this, "clipId");
    a(this, "matrix", j.identity());
    a(this, "opacity", 0);
    a(this, "depth", 0);
    pt(this, et, void 0);
    /**
     * domOrder is used to rearrange dom order
     * it will be set by RenderOwner before flushPaint
     */
    pt(this, ot, void 0);
    pt(this, lt, !1);
    a(this, "type", this.constructor.name);
    a(this, "constraints", N.loose(A.maximum()));
    a(this, "_offset", T.zero());
    a(this, "_size", A.zero);
    a(this, "parentUsesSize", !1);
    this.isPainter = s;
  }
  get domOrder() {
    return Y(tt(this, ot) != null, "domOrder is not initialized"), tt(this, ot);
  }
  set domOrder(s) {
    s !== tt(this, ot) && (vt(this, lt, !0), vt(this, ot, s));
  }
  get domNode() {
    return Y(tt(this, et) != null, "domNode is not initialized"), tt(this, et);
  }
  set domNode(s) {
    vt(this, et, s);
  }
  get children() {
    return this.ownerElement.children.map((s) => s.renderObject);
  }
  get offset() {
    return this._offset;
  }
  set offset(s) {
    this.offset.x === s.x && this.offset.y === s.y || (this._offset = s);
  }
  get size() {
    return this._size;
  }
  set size(s) {
    this.size.height === s.height && this.size.width === s.width || (this._size = s);
  }
  layout(s, { parentUsesSize: t = !0 } = {}) {
    const e = s.normalize();
    this.constraints.equals(e) && !this.needsLayout || (this.constraints = e, this.parentUsesSize = t, this.preformLayout(), this.needsLayout = !1, this.markNeedsPaint());
  }
  paint(s, t, e = j.identity(), r = 1) {
    const h = e.translated(this.offset.x, this.offset.y);
    if (this.clipId === t && this.matrix.equals(h) && this.opacity === r && !this.needsPaint)
      return;
    if (this.matrix = h, this.clipId = t, this.opacity = r, this.isPainter) {
      const { svgEls: v, container: x } = this.resolveSvgEl();
      t && x.setAttribute("clip-path", `url(#${t})`), x.setAttribute("opacity", `${r}`), x.setAttribute("pointer-events", "none"), Object.values(v).forEach(
        (w) => this.setSvgTransform(w, this.matrix)
      ), this.needsPaint && this.performPaint(v, s);
    }
    this.needsPaint = !1;
    const g = this.getChildClipId(t), o = this.getChildMatrix4(this.matrix), _ = this.getChildOpacity(r);
    this.paintChildren(s, {
      clipId: g,
      matrix4: o,
      opacity: _
    });
  }
  paintChildren(s, {
    clipId: t,
    matrix4: e,
    opacity: r
  }) {
    this.children.forEach(
      (h) => h.paint(s, t, e, r)
    );
  }
  getChildMatrix4(s) {
    return s;
  }
  getChildOpacity(s) {
    return s;
  }
  setSvgTransform(s, t) {
    s.style.transform = `matrix3d(${t.storage.join(",")})`;
  }
  attach(s) {
    this.ownerElement = s, this.depth = s.depth, this.isPainter && (this.mountSvgEl(this.renderOwner.paintContext), this.renderOwner.didDomOrderChange());
  }
  dispose(s) {
    this.isPainter && (tt(this, et).remove(), this.renderOwner.didDomOrderChange());
  }
  getIntrinsicWidth(s) {
    return 0;
  }
  getIntrinsicHeight(s) {
    return 0;
  }
  mountSvgEl(s) {
    const { appendSvgEl: t } = s, e = this.createDefaultSvgEl(s);
    Object.entries(e).forEach(([g, o]) => {
      o.setAttribute("data-render-name", g);
    });
    const r = Object.values(e), h = s.createSvgEl("g");
    t(h), h.setAttribute("data-render-type", this.type), r.forEach((g) => {
      h.appendChild(g);
    }), vt(this, et, h);
  }
  resolveSvgEl() {
    const s = this.domNode, t = {};
    for (let e = 0; e < s.children.length; e++) {
      const r = s.children[e], h = r.getAttribute("data-render-name");
      t[h] = r;
    }
    return { svgEls: t, container: s };
  }
  rearrangeDomOrder() {
    tt(this, lt) && (this.isPainter && this.renderOwner.paintContext.insertSvgEl(this.domNode, this.domOrder), vt(this, lt, !1));
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createDefaultSvgEl(s) {
    throw { message: "not implemented defaultSvgEl" };
  }
  /*
   * Do not call this method directly. instead call layout
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  preformLayout() {
    throw { message: "not implemented performLayout" };
  }
  /*
   * Do not call this method directly. instead call paint
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  performPaint(s, t) {
  }
  getChildClipId(s) {
    return s;
  }
  layoutWithoutResize() {
    this.layout(this.constraints, { parentUsesSize: this.parentUsesSize });
  }
  paintWithoutLayout(s) {
    this.paint(s, this.clipId, this.matrix, this.opacity);
  }
  markNeedsParentLayout() {
    var s;
    (s = this.parent) == null || s.markNeedsLayout();
  }
  markNeedsLayout() {
    this.needsLayout = !0, this.parentUsesSize && this.parent != null ? this.markNeedsParentLayout() : (this.renderOwner.needsLayoutRenderObjects.push(this), this.renderOwner.requestVisualUpdate());
  }
  markNeedsPaint() {
    this.needsPaint = !0, this.renderOwner.needsPaintRenderObjects.push(this);
  }
  didChangeDomOrder() {
    this.renderOwner.didDomOrderChange();
  }
  localToGlobal(s = T.zero()) {
    return new T({
      x: this.matrix.storage[12] + s.x,
      y: this.matrix.storage[13] + s.y
    });
  }
  visitChildren(s) {
    this.children.forEach((t) => {
      s(t);
    });
  }
  /**
   *
   * It is currently only used on ZIndexRenderObject
   */
  accept(s) {
    s.visitGeneral(this);
  }
}
et = new WeakMap(), ot = new WeakMap(), lt = new WeakMap();
class vs extends Mt {
  constructor({ renderOwner: s }) {
    super({ isPainter: !1 }), this.renderOwner = s, this.renderOwner.renderView = this, this.constraints = N.tight({ width: 0, height: 0 });
  }
  preformLayout() {
    const s = this.constraints;
    if (!s.isTight)
      throw { message: "constraint must be tight on render view" };
    s.maxWidth === 0 || s.maxHeight === 0 || (this.size = new A({
      width: s.maxWidth,
      height: s.maxHeight
    }), this.children.forEach(
      (t) => t.layout(N.loose(this.size))
    ));
  }
  paint(s, t, e, r) {
    this.size.width === 0 || this.size.height === 0 || super.paint(s, t, e, r);
  }
}
class St {
  constructor(s) {
    a(this, "key");
    a(this, "runtimeType", this.constructor.name);
    this.key = s;
  }
  createElement() {
    throw { message: "not implemented" };
  }
  static canUpdate(s, t) {
    return s.runtimeType === t.runtimeType && s.key === t.key;
  }
  toJSON() {
    return {
      key: this.key,
      runtimeType: this.runtimeType
    };
  }
}
class xs {
  constructor({ onNeedVisualUpdate: s }) {
    a(this, "onNeedVisualUpdate");
    a(this, "dirtyElements", []);
    a(this, "globalKeyRegistry", /* @__PURE__ */ new WeakMap());
    this.onNeedVisualUpdate = () => s();
  }
  scheduleFor(s) {
    this.dirtyElements.push(s), this.requestVisualUpdate();
  }
  requestVisualUpdate() {
    this.onNeedVisualUpdate();
  }
  flushBuild() {
    const s = this.dirtyElements;
    this.dirtyElements = [], s.sort((t, e) => t.depth - e.depth).forEach((t) => {
      t.dirty && t.rebuild();
    });
  }
  registerGlobalKey(s, t) {
    s.buildOwner = this, this.globalKeyRegistry.set(s, t);
  }
  findByGlobalKey(s) {
    return this.globalKeyRegistry.get(s);
  }
}
class ys {
  constructor({
    onNeedVisualUpdate: s,
    paintContext: t
  }) {
    a(this, "paintContext");
    a(this, "onNeedVisualUpdate");
    a(this, "needsPaintRenderObjects", []);
    a(this, "needsLayoutRenderObjects", []);
    /*
     this will be set by RenderView
    */
    a(this, "renderView");
    a(this, "domOrderChanged", !0);
    this.onNeedVisualUpdate = s, this.paintContext = t;
  }
  requestVisualUpdate() {
    this.onNeedVisualUpdate();
  }
  drawFrame() {
    this.flushLayout(), this.rearrangeDomOrder(), this.flushPaint();
  }
  rearrangeDomOrder() {
    if (!this.domOrderChanged)
      return;
    this.domOrderChanged = !1;
    const s = new ws();
    this.renderView.accept(s);
    const t = s.getRenderObjectsByDomOrder();
    for (let e = t.length - 1; e >= 0; e--) {
      const r = t[e];
      r.domOrder = e, r.rearrangeDomOrder();
    }
  }
  didDomOrderChange() {
    this.domOrderChanged = !0;
  }
  flushLayout() {
    const s = this.needsLayoutRenderObjects;
    this.needsLayoutRenderObjects = [], s.sort((t, e) => t.depth - e.depth).forEach((t) => {
      t.needsLayout && t.layoutWithoutResize();
    });
  }
  flushPaint() {
    const s = this.needsPaintRenderObjects;
    this.needsPaintRenderObjects = [], s.sort((t, e) => t.depth - e.depth).forEach((t) => {
      t.needsPaint && t.paintWithoutLayout(this.paintContext);
    });
  }
}
class ws {
  constructor() {
    a(this, "collectedRenderObjects", []);
    a(this, "currentVisitedOrder", 0);
    a(this, "currentStackingContext", []);
  }
  visit(s, { willCollect: t }) {
    t && this.collectedRenderObjects.push({
      renderObject: s,
      contexts: this.currentStackingContext,
      visitedOrder: this.currentVisitedOrder++
    }), s.visitChildren((e) => {
      e.accept(this);
    });
  }
  visitGeneral(s) {
    this.visit(s, { willCollect: s.isPainter });
  }
  visitZIndex(s) {
    this.currentStackingContext = [...this.currentStackingContext], this.currentStackingContext.push({
      visitedOrder: this.currentVisitedOrder,
      zIndex: s.zIndex
    }), this.visit(s, { willCollect: !1 }), this.currentStackingContext = [...this.currentStackingContext], this.currentStackingContext.pop();
  }
  getRenderObjectsByDomOrder() {
    return this.collectedRenderObjects.sort((t, e) => {
      const r = Math.min(t.contexts.length, e.contexts.length);
      for (let h = 0; h < r; h++) {
        const g = t.contexts[h], o = e.contexts[h];
        if (g.zIndex !== o.zIndex)
          return g.zIndex - o.zIndex;
        if (g.visitedOrder !== o.visitedOrder)
          return g.visitedOrder - o.visitedOrder;
      }
      if (r > 0) {
        const h = t.contexts[r - 1];
        if (h.visitedOrder === t.visitedOrder || h.visitedOrder === e.visitedOrder)
          return t.visitedOrder - e.visitedOrder;
      }
      if (t.contexts.length !== e.contexts.length) {
        const h = t.contexts[r] ?? {
          visitedOrder: t.visitedOrder,
          zIndex: 0
        }, g = e.contexts[r] ?? {
          visitedOrder: e.visitedOrder,
          zIndex: 0
        };
        if (h.zIndex !== g.zIndex)
          return h.zIndex - g.zIndex;
        if (h.visitedOrder !== g.visitedOrder)
          return h.visitedOrder - g.visitedOrder;
      }
      return t.visitedOrder - e.visitedOrder;
    }).map(({ renderObject: t }) => t);
  }
}
class ms {
  constructor() {
    a(this, "phase");
    a(this, "persistenceCallbacks");
    a(this, "postFrameCallbacks");
    this.phase = 0, this.persistenceCallbacks = [], this.postFrameCallbacks = [];
  }
  schedule() {
    switch (this.phase) {
      case 0:
      case 2:
        this.performSchedule();
        break;
    }
  }
  performSchedule() {
    this.phase = 1, this.persistenceCallbacks.forEach((s) => {
      s();
    }), this.phase = 2, this.postFrameCallbacks.forEach((s) => {
      s();
    }), this.postFrameCallbacks = [], this.phase = 0;
  }
  addPersistenceCallbacks(s) {
    this.persistenceCallbacks.push(() => s());
  }
  addPostFrameCallbacks(s) {
    this.postFrameCallbacks.push(() => s());
  }
}
class ls {
  constructor({ onFrame: s } = {}) {
    a(this, "onFrame");
    this.onFrame = s;
  }
  setOnFrame(s) {
    this.onFrame = () => s();
  }
  // Actually we dont need to invoke browser to render because browser automatically render its own state periodically
  // so Here we just call onFrame callback.
  dispatch() {
    typeof window > "u" ? setTimeout(() => {
      var s;
      (s = this.onFrame) == null || s.call(this);
    }, 0) : window.requestAnimationFrame(() => {
      var s;
      (s = this.onFrame) == null || s.call(this);
    });
  }
}
class zs {
  constructor() {
    a(this, "buildOwner");
  }
  get currentContext() {
    return Y(
      this.buildOwner != null,
      "buildOwner is null, currentContext must be called after initState"
    ), this.buildOwner.findByGlobalKey(this);
  }
}
class $t {
  constructor(s) {
    a(this, "scheduler");
    a(this, "renderContext");
    a(this, "buildOwner");
    a(this, "widget");
    a(this, "parent");
    a(this, "dirty", !0);
    a(this, "depth", 0);
    this.widget = s;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitChildren(s) {
    throw { message: "not implemented" };
  }
  get renderObject() {
    let s = null;
    if (this.visitChildren((t) => {
      s = t.renderObject;
    }), s == null)
      throw { message: "can not find render object" };
    return s;
  }
  //There are 5 case
  // 1. child is not null, but widget is null
  // in this case, child must be unmounted
  // 2. child is null, widget is null
  // nothing happend
  // 3. child is null, widget is not null
  // newWidget would be inflated,
  // 4. child is not null, widget is not null, and widget can be update
  // in this case, just update widget configruation
  // 5. it is similar to 4 but widget can not be update,
  // in this case, child must be unmounted and newWidget would be inflated
  updateChild(s, t) {
    if (s != null && t == null)
      return s.unmount(), null;
    if (!(s == null && t == null))
      return s == null && t != null ? this.inflateWidget(t) : s != null && t != null && St.canUpdate(s.widget, t) ? (s.update(t), s) : (s.unmount(), this.inflateWidget(t));
  }
  unmount() {
    this.parent = void 0;
  }
  mount(s) {
    s && (this.renderContext = s.renderContext, this.buildOwner = s.buildOwner, this.depth = s.depth + 1, this.scheduler = s.scheduler), this.parent = s, this.widget.key instanceof zs && this.buildOwner.registerGlobalKey(this.widget.key, this);
  }
  update(s) {
    this.widget = s;
  }
  inflateWidget(s) {
    const t = s.createElement();
    return t.mount(this), t;
  }
  rebuild({ force: s = !1 } = {}) {
    !this.dirty && !s || (this.dirty = !1, this.performRebuild());
  }
  performRebuild() {
    throw new Error("not implemented performRebuild");
  }
  markNeedsBuild() {
    this.dirty = !0, this.buildOwner.scheduleFor(this);
  }
}
class Pt extends $t {
  constructor(t) {
    super(t);
    a(this, "children");
    a(this, "_renderObject");
    a(this, "ancestorRenderObjectElement");
  }
  createRenderObject() {
    return this.widget.createRenderObject();
  }
  get renderObject() {
    return this._renderObject;
  }
  unmount() {
    super.unmount(), this.renderObject.dispose(this.renderContext.paintContext), this.children.forEach((t) => {
      t.unmount();
    }), this._renderObject.markNeedsParentLayout();
  }
  mount(t) {
    var r;
    super.mount(t), this._renderObject = this.createRenderObject(), this.ancestorRenderObjectElement = this.findAncestorRenderObjectElement();
    const e = (r = this.ancestorRenderObjectElement) == null ? void 0 : r.renderObject;
    e && (this.renderObject.parent = e, this.renderObject.renderOwner = e.renderOwner), this.children = this.widget.children.map(
      (h) => this.inflateWidget(h)
    ), this._renderObject.attach(this), this._renderObject.markNeedsParentLayout();
  }
  update(t) {
    super.update(t), this.rebuild({ force: !0 });
  }
  updateChildren(t) {
    const e = [], r = this.children, h = t.map((g) => {
      const o = r.findIndex(
        (v, x) => !e.includes(x) && St.canUpdate(g, v.widget)
      );
      let _;
      return o === -1 ? _ = null : (_ = r[o], e.push(o)), this.updateChild(_, g);
    });
    r.forEach((g, o) => {
      e.includes(o) || this.updateChild(g, null);
    }), this.children = h;
  }
  performRebuild() {
    this.widget.updateRenderObject(this._renderObject);
    const t = this.widget.children;
    this.updateChildren(t);
  }
  visitChildren(t) {
    this.children.forEach((e) => t(e));
  }
  findAncestorRenderObjectElement() {
    let t = this.parent;
    for (; t != null && !(t instanceof Pt); )
      t = t.parent;
    return t;
  }
}
class Tt extends St {
  constructor({ children: t = [], key: e }) {
    super(e);
    a(this, "children");
    this.children = t;
  }
  createElement() {
    return new Pt(this);
  }
  createRenderObject() {
    throw { message: "not implemented createRenderObject" };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateRenderObject(t) {
    throw { message: "not implemented updatedRenderObject" };
  }
}
class ds extends Tt {
  constructor({
    app: t,
    renderOwner: e,
    buildOwner: r,
    renderContext: h,
    scheduler: g
  }) {
    super({ children: [t] });
    a(this, "renderOwner");
    a(this, "buildOwner");
    a(this, "renderContext");
    a(this, "scheduler");
    this.renderOwner = e, this.buildOwner = r, this.renderContext = h, this.scheduler = g;
  }
  createElement() {
    const t = super.createElement();
    return t.renderContext = this.renderContext, t.buildOwner = this.buildOwner, t.scheduler = this.scheduler, t;
  }
  createRenderObject() {
    return new vs({ renderOwner: this.renderOwner });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateRenderObject(t) {
  }
}
class cs {
  constructor({
    view: s,
    document: t = document,
    window: e = window,
    ssrSize: r
  }) {
    a(this, "root");
    a(this, "renderContext");
    a(this, "viewSize");
    a(this, "buildOwner");
    a(this, "renderOwner");
    a(this, "scheduler");
    a(this, "renderDispatcher");
    a(this, "didRun", !1);
    a(this, "widget");
    this.viewSize = r;
    const h = new ps({
      view: s,
      document: t,
      window: e
    }), g = new ls(), o = new xs({
      onNeedVisualUpdate: () => g.dispatch()
    }), _ = new ys({
      onNeedVisualUpdate: () => g.dispatch(),
      paintContext: h.paintContext
    }), v = new ms();
    v.addPersistenceCallbacks(() => o.flushBuild()), v.addPersistenceCallbacks(() => _.drawFrame()), g.setOnFrame(() => v.schedule()), this.buildOwner = o, this.renderOwner = _, this.scheduler = v, this.renderDispatcher = g, this.renderContext = h;
  }
  runApp(s) {
    return this.widget = s, this.viewSize == null ? "" : (this.root = new ds({
      app: s,
      buildOwner: this.buildOwner,
      renderOwner: this.renderOwner,
      renderContext: this.renderContext,
      scheduler: this.scheduler
    }).createElement(), this.root.mount(void 0), this.root.renderObject.constraints = N.tight(this.viewSize), this.didRun = !0, this.draw(), this.renderContext.view.innerHTML);
  }
  setConfig({
    document: s,
    window: t,
    view: e
  }) {
    s && (this.renderContext.document = s), t && (this.renderContext.window = t), e && (this.renderContext.view = e), this.renderOwner.paintContext = this.renderContext.paintContext;
  }
  onMount({
    view: s,
    resizeTarget: t
  }) {
    this.setConfig({
      view: s,
      window,
      document
    }), t && this.observeCanvasSize(t);
  }
  observeCanvasSize(s) {
    const t = (r) => {
      const { width: h, height: g } = r.target.getBoundingClientRect();
      this.renderContext.view.setAttribute("width", `${h}`), this.renderContext.view.setAttribute("height", `${g}`), this.viewSize = new A({ width: h, height: g });
    };
    new ResizeObserver((r) => {
      const h = r[0];
      t(h), this.didRun ? this.draw() : this.runApp(this.widget);
    }).observe(s);
  }
  draw() {
    this.layout(), this.paint();
  }
  rebuild() {
    this.root.children[0].rebuild();
  }
  layout() {
    this.root.renderObject.layout(N.tight(this.viewSize));
  }
  paint() {
    this.root.renderObject.paint(this.renderContext.paintContext);
  }
}
class ps {
  constructor({
    document: s,
    window: t,
    view: e
  }) {
    a(this, "document");
    a(this, "window");
    a(this, "view");
    this.document = s, this.window = t, this.view = e;
  }
  setConfig({
    document: s,
    window: t,
    view: e
  }) {
    this.document = s, this.window = t, this.view = e;
  }
  get paintContext() {
    const { document: s, view: t } = this;
    return {
      isOnBrowser: typeof this.window < "u",
      createSvgEl(e) {
        return s.createElementNS(
          "http://www.w3.org/2000/svg",
          e
        );
      },
      appendSvgEl(e) {
        t.appendChild(e);
      },
      insertSvgEl(e, r) {
        const h = t.children[r];
        if (h == null) {
          t.appendChild(e);
          return;
        }
        h.insertAdjacentElement("beforebegin", e);
      }
    };
  }
}
class bs extends $t {
  constructor(t) {
    super(t);
    a(this, "child");
    this.widget = t;
  }
  unmount() {
    super.unmount(), this.child.unmount();
  }
  mount(t) {
    super.mount(t), this._firstBuild();
  }
  update(t) {
    super.update(t), this.rebuild({ force: !0 });
  }
  initState() {
    throw new Error("not implemented initState on compoenent element");
  }
  build() {
    throw new Error("not implemented build on component element");
  }
  _firstBuild() {
    this.initState(), this.performRebuild();
  }
  performRebuild() {
    const t = this.build();
    this.child = this.updateChild(this.child, t);
  }
  visitChildren(t) {
    t(this.child);
  }
}
class fs extends bs {
  initState() {
    this.widget.initState(this);
  }
  build() {
    return this.widget.build(this);
  }
}
class Q extends Mt {
  get child() {
    return this.children[0];
  }
  preformLayout() {
    this.child == null ? this.size = this.computeSizeForNoChild(this.constraints) : (this.child.layout(this.constraints), this.size = this.constraints.constrain(this.child.size));
  }
  computeSizeForNoChild(s) {
    return s.constrain(A.zero);
  }
  getIntrinsicWidth(s) {
    var t;
    return ((t = this.child) == null ? void 0 : t.getIntrinsicWidth(s)) || 0;
  }
  getIntrinsicHeight(s) {
    var t;
    return ((t = this.child) == null ? void 0 : t.getIntrinsicHeight(s)) || 0;
  }
}
class V extends Tt {
  constructor({ child: t, key: e } = {}) {
    super({ children: [], key: e });
    a(this, "_child");
    this.child = t;
  }
  set child(t) {
    this._child = t, t ? this.children = [t] : this.children = [];
  }
  get child() {
    return this._child;
  }
  createRenderObject() {
    return new Q({ isPainter: !0 });
  }
}
class Rt extends St {
  createElement() {
    return new fs(this);
  }
  initState(s) {
  }
  build(s) {
    throw { message: "not implemented build on ComponentWidget" };
  }
}
class qs extends Q {
  constructor({
    alignment: t = rt.center,
    textDirection: e
  }) {
    super({
      isPainter: !1
    });
    a(this, "_alignment");
    a(this, "_textDirection");
    this._alignment = t, this._textDirection = e;
  }
  get alignment() {
    return this._alignment;
  }
  set alignment(t) {
    this._alignment.equals(t) || (this._alignment = t, this.markNeedsLayout());
  }
  get textDirection() {
    return this._textDirection;
  }
  set textDirection(t) {
    this._textDirection != t && (this._textDirection = t, this.markNeedsLayout());
  }
  get resolvedAlignment() {
    return this.alignment.resolve(this.textDirection);
  }
  alignChild() {
    if (this.child == null)
      throw Error("child must not be null");
    if (this.resolvedAlignment == null)
      throw Error("resolved alignment must not be null");
    this.child.offset = this.resolvedAlignment.alongOffset(
      T.raw({
        x: this.size.width - this.child.size.width,
        y: this.size.height - this.child.size.height
      })
    );
  }
}
var Yt = { exports: {} };
(function(u) {
  var s = (() => {
    var t = Object.defineProperty, e = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, h = Object.getOwnPropertySymbols, g = Object.prototype.hasOwnProperty, o = Object.prototype.propertyIsEnumerable, _ = (q, S, W) => S in q ? t(q, S, { enumerable: !0, configurable: !0, writable: !0, value: W }) : q[S] = W, v = (q, S) => {
      for (var W in S || (S = {}))
        g.call(S, W) && _(q, W, S[W]);
      if (h)
        for (var W of h(S))
          o.call(S, W) && _(q, W, S[W]);
      return q;
    }, x = (q, S) => {
      for (var W in S)
        t(q, W, { get: S[W], enumerable: !0 });
    }, w = (q, S, W, F) => {
      if (S && typeof S == "object" || typeof S == "function")
        for (let H of r(S))
          !g.call(q, H) && H !== W && t(q, H, { get: () => S[H], enumerable: !(F = e(S, H)) || F.enumerable });
      return q;
    }, m = (q) => w(t({}, "__esModule", { value: !0 }), q), y = (q, S, W) => (_(q, typeof S != "symbol" ? S + "" : S, W), W), d = {};
    x(d, {
      DEFAULT_OPTIONS: () => c,
      DEFAULT_UUID_LENGTH: () => z,
      default: () => n
    });
    var l = "5.0.3", z = 6, c = {
      dictionary: "alphanum",
      shuffle: !0,
      debug: !1,
      length: z,
      counter: 0
    }, b = class {
      constructor(S = {}) {
        y(this, "counter"), y(this, "debug"), y(this, "dict"), y(this, "version"), y(this, "dictIndex", 0), y(this, "dictRange", []), y(this, "lowerBound", 0), y(this, "upperBound", 0), y(this, "dictLength", 0), y(this, "uuidLength"), y(this, "_digit_first_ascii", 48), y(this, "_digit_last_ascii", 58), y(this, "_alpha_lower_first_ascii", 97), y(this, "_alpha_lower_last_ascii", 123), y(this, "_hex_last_ascii", 103), y(this, "_alpha_upper_first_ascii", 65), y(this, "_alpha_upper_last_ascii", 91), y(this, "_number_dict_ranges", {
          digits: [this._digit_first_ascii, this._digit_last_ascii]
        }), y(this, "_alpha_dict_ranges", {
          lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii],
          upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii]
        }), y(this, "_alpha_lower_dict_ranges", {
          lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii]
        }), y(this, "_alpha_upper_dict_ranges", {
          upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii]
        }), y(this, "_alphanum_dict_ranges", {
          digits: [this._digit_first_ascii, this._digit_last_ascii],
          lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii],
          upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii]
        }), y(this, "_alphanum_lower_dict_ranges", {
          digits: [this._digit_first_ascii, this._digit_last_ascii],
          lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii]
        }), y(this, "_alphanum_upper_dict_ranges", {
          digits: [this._digit_first_ascii, this._digit_last_ascii],
          upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii]
        }), y(this, "_hex_dict_ranges", {
          decDigits: [this._digit_first_ascii, this._digit_last_ascii],
          alphaDigits: [this._alpha_lower_first_ascii, this._hex_last_ascii]
        }), y(this, "_dict_ranges", {
          _number_dict_ranges: this._number_dict_ranges,
          _alpha_dict_ranges: this._alpha_dict_ranges,
          _alpha_lower_dict_ranges: this._alpha_lower_dict_ranges,
          _alpha_upper_dict_ranges: this._alpha_upper_dict_ranges,
          _alphanum_dict_ranges: this._alphanum_dict_ranges,
          _alphanum_lower_dict_ranges: this._alphanum_lower_dict_ranges,
          _alphanum_upper_dict_ranges: this._alphanum_upper_dict_ranges,
          _hex_dict_ranges: this._hex_dict_ranges
        }), y(this, "log", (...f) => {
          const R = [...f];
          if (R[0] = `[short-unique-id] ${f[0]}`, this.debug === !0 && typeof console < "u" && console !== null)
            return console.log(...R);
        }), y(this, "setDictionary", (f, R) => {
          let C;
          if (f && Array.isArray(f) && f.length > 1)
            C = f;
          else {
            C = [];
            let O;
            this.dictIndex = O = 0;
            const P = `_${f}_dict_ranges`, I = this._dict_ranges[P];
            Object.keys(I).forEach((L) => {
              const X = L;
              for (this.dictRange = I[X], this.lowerBound = this.dictRange[0], this.upperBound = this.dictRange[1], this.dictIndex = O = this.lowerBound; this.lowerBound <= this.upperBound ? O < this.upperBound : O > this.upperBound; this.dictIndex = this.lowerBound <= this.upperBound ? O += 1 : O -= 1)
                C.push(String.fromCharCode(this.dictIndex));
            });
          }
          R && (C = C.sort(() => Math.random() - 0.5)), this.dict = C, this.dictLength = this.dict.length, this.setCounter(0);
        }), y(this, "seq", () => this.sequentialUUID()), y(this, "sequentialUUID", () => {
          let f, R, C = "";
          f = this.counter;
          do
            R = f % this.dictLength, f = Math.trunc(f / this.dictLength), C += this.dict[R];
          while (f !== 0);
          return this.counter += 1, C;
        }), y(this, "rnd", (f = this.uuidLength || z) => this.randomUUID(f)), y(this, "randomUUID", (f = this.uuidLength || z) => {
          let R, C, O;
          if (f === null || typeof f > "u" || f < 1)
            throw new Error("Invalid UUID Length Provided");
          for (R = "", O = 0; O < f; O += 1)
            C = parseInt(
              (Math.random() * this.dictLength).toFixed(0),
              10
            ) % this.dictLength, R += this.dict[C];
          return R;
        }), y(this, "fmt", (f, R) => this.formattedUUID(f, R)), y(this, "formattedUUID", (f, R) => {
          const C = {
            $r: this.randomUUID,
            $s: this.sequentialUUID,
            $t: this.stamp
          };
          return f.replace(
            /\$[rs]\d{0,}|\$t0|\$t[1-9]\d{1,}/g,
            (P) => {
              const I = P.slice(0, 2), L = parseInt(P.slice(2), 10);
              return I === "$s" ? C[I]().padStart(L, "0") : I === "$t" && R ? C[I](L, R) : C[I](L);
            }
          );
        }), y(this, "availableUUIDs", (f = this.uuidLength) => parseFloat(
          Math.pow([...new Set(this.dict)].length, f).toFixed(0)
        )), y(this, "approxMaxBeforeCollision", (f = this.availableUUIDs(this.uuidLength)) => parseFloat(
          Math.sqrt(Math.PI / 2 * f).toFixed(20)
        )), y(this, "collisionProbability", (f = this.availableUUIDs(this.uuidLength), R = this.uuidLength) => parseFloat(
          (this.approxMaxBeforeCollision(f) / this.availableUUIDs(R)).toFixed(20)
        )), y(this, "uniqueness", (f = this.availableUUIDs(this.uuidLength)) => {
          const R = parseFloat(
            (1 - this.approxMaxBeforeCollision(f) / f).toFixed(20)
          );
          return R > 1 ? 1 : R < 0 ? 0 : R;
        }), y(this, "getVersion", () => this.version), y(this, "stamp", (f, R) => {
          const C = Math.floor(+(R || /* @__PURE__ */ new Date()) / 1e3).toString(16);
          if (typeof f == "number" && f === 0)
            return C;
          if (typeof f != "number" || f < 10)
            throw new Error(
              [
                "Param finalLength must be a number greater than or equal to 10,",
                "or 0 if you want the raw hexadecimal timestamp"
              ].join(`
`)
            );
          const O = f - 9, P = Math.round(Math.random() * (O > 15 ? 15 : O)), I = this.randomUUID(O);
          return `${I.substring(0, P)}${C}${I.substring(P)}${P.toString(16)}`;
        }), y(this, "parseStamp", (f, R) => {
          if (R && !/t0|t[1-9]\d{1,}/.test(R))
            throw new Error("Cannot extract date from a formated UUID with no timestamp in the format");
          const C = R ? R.replace(
            /\$[rs]\d{0,}|\$t0|\$t[1-9]\d{1,}/g,
            (P) => {
              const I = {
                $r: ($) => [...Array($)].map(() => "r").join(""),
                $s: ($) => [...Array($)].map(() => "s").join(""),
                $t: ($) => [...Array($)].map(() => "t").join("")
              }, L = P.slice(0, 2), X = parseInt(P.slice(2), 10);
              return I[L](X);
            }
          ).replace(
            /^(.*?)(t{8,})(.*)$/g,
            (P, I, L) => f.substring(I.length, I.length + L.length)
          ) : f;
          if (C.length === 8)
            return new Date(parseInt(C, 16) * 1e3);
          if (C.length < 10)
            throw new Error("Stamp length invalid");
          const O = parseInt(C.substring(C.length - 1), 16);
          return new Date(parseInt(C.substring(O, O + 8), 16) * 1e3);
        }), y(this, "setCounter", (f) => {
          this.counter = f;
        });
        const W = v(v({}, c), S);
        this.counter = 0, this.debug = !1, this.dict = [], this.version = l;
        const {
          dictionary: F,
          shuffle: H,
          length: U,
          counter: k
        } = W;
        return this.uuidLength = U, this.setDictionary(F, H), this.setCounter(k), this.debug = W.debug, this.log(this.dict), this.log(
          `Generator instantiated with Dictionary Size ${this.dictLength} and counter set to ${this.counter}`
        ), this.log = this.log.bind(this), this.setDictionary = this.setDictionary.bind(this), this.setCounter = this.setCounter.bind(this), this.seq = this.seq.bind(this), this.sequentialUUID = this.sequentialUUID.bind(this), this.rnd = this.rnd.bind(this), this.randomUUID = this.randomUUID.bind(this), this.fmt = this.fmt.bind(this), this.formattedUUID = this.formattedUUID.bind(this), this.availableUUIDs = this.availableUUIDs.bind(this), this.approxMaxBeforeCollision = this.approxMaxBeforeCollision.bind(this), this.collisionProbability = this.collisionProbability.bind(this), this.uniqueness = this.uniqueness.bind(this), this.getVersion = this.getVersion.bind(this), this.stamp = this.stamp.bind(this), this.parseStamp = this.parseStamp.bind(this), this;
      }
    };
    y(b, "default", b);
    var n = b;
    return m(d);
  })();
  u.exports = s.default, typeof window < "u" && (s = s.default);
})(Yt);
var Ss = Yt.exports;
const Rs = /* @__PURE__ */ ns(Ss), Cs = new Rs({ dictionary: "hex" });
class Ws extends V {
  constructor({
    child: t,
    clipper: e,
    key: r
  }) {
    super({ child: t, key: r });
    a(this, "clipper");
    this.clipper = e;
  }
  createRenderObject() {
    return new Os({ clipper: this.clipper });
  }
  updateRenderObject(t) {
    t.clipper = this.clipper;
  }
}
class Os extends Q {
  constructor({ clipper: t }) {
    super({ isPainter: !0 });
    a(this, "_clipper");
    a(this, "id", Cs.randomUUID(6));
    this._clipper = t;
  }
  get clipper() {
    return this._clipper;
  }
  set clipper(t) {
    this._clipper !== t && (this._clipper = t, this.markNeedsPaint());
  }
  getChildClipId(t) {
    return this.id;
  }
  performPaint({ clipPath: t }) {
    const e = t.getElementsByTagName("path")[0], r = this.clipper(this.size).getD();
    e.setAttribute("d", r);
  }
  createDefaultSvgEl({ createSvgEl: t }) {
    const e = t("clipPath");
    e.setAttribute("id", this.id);
    const r = t("path");
    return r.setAttribute("stroke-width", "0"), e.appendChild(r), {
      clipPath: e
    };
  }
  mountSvgEl(t) {
    const { appendSvgEl: e } = t, r = this.createDefaultSvgEl(t);
    Object.entries(r).forEach(([o, _]) => {
      _.setAttribute("data-render-name", o);
    });
    const g = Object.values(r)[0];
    g.setAttribute("data-render-type", this.type), e(g), this.domNode = g;
  }
  resolveSvgEl() {
    const t = this.domNode, e = {}, r = t.getAttribute("data-render-name");
    return e[r] = t, { svgEls: e, container: t };
  }
}
class Ls extends Rt {
  constructor({
    child: t,
    clipped: e = !0,
    key: r,
    clipper: h
  }) {
    super(r);
    a(this, "clipped");
    a(this, "child");
    a(this, "clipper");
    this.child = t, this.clipper = h, this.clipped = e;
  }
  build(t) {
    return this.clipped ? new Ws({ child: this.child, clipper: this.clipper }) : this.child;
  }
}
const Xt = dt(Ls);
function Is({
  child: u,
  clipper: s,
  clipped: t = !0,
  key: e
}) {
  return Xt({
    child: u,
    clipped: t,
    key: e,
    clipper: (r) => new Lt().addRect(s(r))
  });
}
let Ms = class extends V {
  constructor({
    flex: t = 1,
    child: e,
    fit: r = "loose",
    key: h
  } = {}) {
    super({ child: e, key: h });
    a(this, "flex");
    a(this, "fit");
    if (t < 0)
      throw { message: "flex must not be under zero" };
    this.flex = t, this.fit = r;
  }
  createRenderObject() {
    return new Ps({ flex: this.flex, fit: this.fit });
  }
  updateRenderObject(t) {
    t.flex = this.flex, t.fit = this.fit;
  }
};
class Ps extends Q {
  constructor({ flex: t, fit: e }) {
    super({ isPainter: !1 });
    a(this, "_flex");
    a(this, "_fit");
    this._flex = t, this._fit = e;
  }
  get flex() {
    return this._flex;
  }
  set flex(t) {
    this._flex !== t && (this._flex = t, this.markNeedsLayout());
  }
  get fit() {
    return this._fit;
  }
  set fit(t) {
    this._fit !== t && (this._fit = t, this.markNeedsLayout());
  }
}
function Ts({ fontSize: u }) {
  return u;
}
const bt = {
  fontFamily: "serif",
  fontSize: 16,
  fontWeight: "normal",
  fontColor: "black"
};
class Ds {
  constructor({
    text: s,
    textAlign: t = _t.start,
    textDirection: e,
    textScaleFactor: r = 1,
    maxLines: h,
    ellipsis: g,
    textWidthBasis: o = mt.parent
  }) {
    a(this, "text");
    a(this, "textAlign");
    a(this, "textDirection");
    a(this, "ellipsis");
    a(this, "textScaleFactor");
    a(this, "maxLines");
    a(this, "textWidthBasis");
    a(this, "paragraph");
    this.text = s, this.textAlign = t, this.textDirection = e, this.textScaleFactor = r, this.maxLines = h, this.ellipsis = g, this.textWidthBasis = o;
  }
  get plainText() {
    var s;
    return ((s = this.text) == null ? void 0 : s.toPlainText()) || "";
  }
  get width() {
    return this.paragraph == null ? 0 : this.paragraph.width;
  }
  get height() {
    return this.paragraph == null ? 0 : this.paragraph.height;
  }
  get intrinsicWidth() {
    return this.paragraph == null ? 0 : this.paragraph.intrinsicWidth;
  }
  get intrinsicHeight() {
    return this.paragraph == null ? 0 : this.paragraph.intrinsicHeight;
  }
  get longestLine() {
    return this.paragraph == null ? 0 : this.paragraph.longestLine;
  }
  paint(s, { createSvgEl: t }) {
    this.resetText(s), Y(this.paragraph != null, "paragraph should not be null"), this.paragraph.lines.forEach((e) => {
      e.spanBoxes.forEach(
        ({ offset: r, fontFamily: h, content: g, fontSize: o, fontWeight: _, color: v }) => {
          const x = t("tspan");
          x.setAttribute("x", `${r.x}`), x.setAttribute("y", `${r.y}`), x.setAttribute("text-anchor", "start"), x.setAttribute("dominant-baseline", "hanging"), x.setAttribute("fill", v), x.setAttribute("font-size", `${o}`), x.setAttribute("font-family", `${h}`), x.setAttribute("font-weight", _), x.textContent = g, s.appendChild(x);
        }
      );
    });
  }
  createParagraph(s) {
    return new Hs(s ?? null, {
      textAlign: this.textAlign,
      ellipsis: this.ellipsis,
      textDirection: this.textDirection || it.ltr
    });
  }
  resetText(s) {
    for (; s.firstChild; )
      s.removeChild(s.firstChild);
  }
  layout({
    minWidth: s = 0,
    maxWidth: t = 1 / 0
  } = {}) {
    this.paragraph = this.createParagraph(this.text), this.layoutParagraph({ minWidth: s, maxWidth: t });
  }
  layoutParagraph({
    minWidth: s = 0,
    maxWidth: t = 1 / 0
  }) {
    if (this.paragraph.layout(t), s !== t) {
      let e;
      switch (this.textWidthBasis) {
        case mt.longestLine:
          e = this.paragraph.longestLine;
          break;
        case mt.parent:
          e = this.intrinsicWidth;
          break;
      }
      e = G.clampDouble(e, s, t), e !== this.paragraph.width && this.paragraph.layout(e);
    }
  }
}
class Hs {
  constructor(s, {
    textAlign: t,
    ellipsis: e,
    textDirection: r
  }) {
    a(this, "ellipsis");
    a(this, "source", []);
    a(this, "lines", []);
    a(this, "textDirection");
    a(this, "textAlign");
    // It is only valid after layout call
    a(this, "width", 0);
    this.ellipsis = e, this.textAlign = t, this.textDirection = r, this.build(s);
  }
  build(s) {
    s == null || s.build(this);
  }
  get height() {
    return this.lines.reduce((s, t) => s + t.height, 0);
  }
  get longestLine() {
    return this.lines.reduce((s, t) => Math.max(s, t.width), 0);
  }
  get intrinsicWidth() {
    return this.lines.reduce((s, t) => s + t.width, 0);
  }
  get intrinsicHeight() {
    return this.lines.reduce((s, t) => Math.max(s + t.height), 0);
  }
  layout(s = 1 / 0) {
    this.width = s, this.lines = [];
    let t = new Nt();
    this.source.forEach(
      ({
        content: e,
        fontFamily: r,
        fontSize: h,
        fontStyle: g,
        fontWeight: o,
        color: _,
        height: v
      }) => {
        const x = e.split(/(\s|\n)/);
        let w = "", m = 0;
        const y = Ts({ fontSize: h }), d = `${o} ${h}px ${r}`;
        x.forEach((z) => {
          const c = as({
            text: z,
            font: d
          });
          t.width + m + c > this.width || z === `
` ? (l(), this.addLine(t), t = new Nt(), [" ", `
`].includes(z) ? (m = 0, w = "") : (m = c, w = z)) : (w += z, m += c);
        }), l();
        function l() {
          w && t.addSpanBox(
            new Fs({
              content: w,
              fontFamily: r,
              fontSize: h,
              fontStyle: g,
              fontWeight: o,
              color: _,
              height: v,
              size: {
                height: y,
                width: m
              }
            })
          );
        }
      }
    ), this.addLine(t), this.align();
  }
  addLine(s) {
    s.spanBoxes.length !== 0 && this.lines.push(s);
  }
  align() {
    let s = 0;
    this.lines.forEach((t) => {
      t.layout(this.resolvedTextAlign, {
        paragraphWidth: this.width,
        offsetY: s
      }), s += t.height;
    });
  }
  get resolvedTextAlign() {
    return this.textAlign === _t.start ? this.textDirection === it.ltr ? "left" : "right" : this.textAlign === _t.end ? this.textDirection === it.ltr ? "right" : "left" : this.textAlign;
  }
  addText({
    fontFamily: s = bt.fontFamily,
    fontSize: t = bt.fontSize,
    fontWeight: e = bt.fontWeight,
    content: r = "",
    height: h = 1.2,
    fontStyle: g = At.normal,
    color: o = bt.fontColor
  }) {
    this.source.push({
      height: h,
      fontFamily: s,
      fontSize: t,
      fontWeight: e,
      content: r,
      color: o,
      fontStyle: g
    });
  }
}
class Fs {
  constructor({
    fontFamily: s,
    fontSize: t,
    fontStyle: e,
    fontWeight: r,
    color: h,
    content: g,
    height: o,
    size: _
  }) {
    a(this, "fontSize");
    a(this, "fontFamily");
    a(this, "fontWeight");
    a(this, "fontStyle");
    a(this, "color");
    a(this, "content");
    a(this, "height");
    // this is line height
    a(this, "size");
    a(this, "offset", { x: 0, y: 0 });
    this.fontFamily = s, this.fontStyle = e, this.fontWeight = r, this.color = h, this.content = g, this.height = o, this.size = _, this.fontSize = t;
  }
}
class Nt {
  constructor() {
    a(this, "spanBoxes", []);
  }
  get height() {
    return this.spanBoxes.reduce(
      (s, { size: t, height: e }) => Math.max(s, t.height * e),
      0
    );
  }
  get width() {
    return this.spanBoxes.reduce((s, { size: t }) => s + t.width, 0);
  }
  layout(s, { paragraphWidth: t, offsetY: e }) {
    switch (this.spanBoxes.forEach((r) => {
      r.offset.y = e - r.size.height + this.height;
    }), s) {
      case "left":
        this.alignHorizontally(0);
        break;
      case "right":
        this.alignHorizontally(t - this.width);
        break;
      case "center":
        this.alignHorizontally((t - this.width) / 2);
        break;
    }
  }
  alignHorizontally(s) {
    let t = s;
    this.spanBoxes.forEach((e) => {
      e.offset.x = t, t += e.size.width;
    });
  }
  addSpanBox(s) {
    this.spanBoxes.push(s);
  }
}
let Es = class extends Tt {
  constructor({
    text: t,
    textAlign: e = _t.start,
    textDirection: r,
    softWrap: h = !0,
    overflow: g = nt.clip,
    textScaleFactor: o = 1,
    maxLines: _,
    textWidthBasis: v = mt.parent,
    key: x
  }) {
    super({ children: [], key: x });
    a(this, "text");
    a(this, "textAlign");
    a(this, "textDirection");
    a(this, "softWrap");
    a(this, "overflow");
    a(this, "textScaleFactor");
    a(this, "maxLines");
    a(this, "textWidthBasis");
    this.text = t, this.textAlign = e, this.textDirection = r, this.softWrap = h, this.overflow = g, this.textScaleFactor = o, this.maxLines = _, this.textWidthBasis = v;
  }
  createRenderObject() {
    return new Bs({
      text: this.text,
      textAlign: this.textAlign,
      textDirection: this.textDirection || it.ltr,
      softWrap: this.softWrap,
      overflow: this.overflow,
      textScaleFactor: this.textScaleFactor,
      maxLines: this.maxLines,
      textWidthBasis: this.textWidthBasis
    });
  }
  updateRenderObject(t) {
    t.softWrap = this.softWrap, t.overflow = this.overflow, t.textScaleFactor = this.textScaleFactor, t.maxLines = this.maxLines, t.textWidthBasis = this.textWidthBasis, t.text = this.text, t.textAlign = this.textAlign, t.textDirection = this.textDirection || it.ltr;
  }
};
class Bs extends Mt {
  constructor({
    text: t,
    textAlign: e = _t.start,
    textDirection: r,
    softWrap: h = !0,
    overflow: g = nt.clip,
    textScaleFactor: o = 1,
    maxLines: _,
    textWidthBasis: v = mt.parent
  }) {
    super({ isPainter: !0 });
    a(this, "_softWrap");
    a(this, "_overflow");
    a(this, "textPainter");
    a(this, "previousWidth");
    a(this, "previousHeight");
    a(this, "changedLayout");
    this._softWrap = h, this._overflow = g, this.textPainter = new Ds({
      text: t,
      textAlign: e,
      textDirection: r,
      textScaleFactor: o,
      maxLines: _,
      ellipsis: g == nt.ellipsis ? "…" : void 0,
      textWidthBasis: v
    });
  }
  get softWrap() {
    return this._softWrap;
  }
  set softWrap(t) {
    this._softWrap !== t && (this._softWrap = t, this.markNeedsLayout());
  }
  get overflow() {
    return this._overflow;
  }
  set overflow(t) {
    this._overflow !== t && (this._overflow = t, this.markNeedsLayout());
  }
  get text() {
    return this.textPainter.text;
  }
  set text(t) {
    this.textPainter.text.eqauls(t) || (this.textPainter.text = t, this.markNeedsLayout());
  }
  get textWidthBasis() {
    return this.textPainter.textWidthBasis;
  }
  set textWidthBasis(t) {
    this.textPainter.textWidthBasis !== t && (this.textPainter.textWidthBasis = t, this.markNeedsLayout());
  }
  get textAlign() {
    return this.textPainter.textAlign;
  }
  set textAlign(t) {
    this.textPainter.textAlign !== t && (this.textPainter.textAlign = t, this.markNeedsLayout());
  }
  get textDirection() {
    return this.textPainter.textDirection;
  }
  set textDirection(t) {
    this.textPainter.textDirection !== t && (this.textPainter.textDirection = t, this.markNeedsLayout());
  }
  get textScaleFactor() {
    return this.textPainter.textScaleFactor;
  }
  set textScaleFactor(t) {
    this.textPainter.textScaleFactor !== t && (this.textPainter.textScaleFactor = t, this.markNeedsLayout());
  }
  get maxLines() {
    return this.textPainter.maxLines;
  }
  set maxLines(t) {
    this.textPainter.maxLines !== t && (this.textPainter.maxLines = t, this.markNeedsLayout());
  }
  performPaint({
    text: t
  }, e) {
    if (e.isOnBrowser && typeof navigator < "u" && /^(?!.*Chrome).*Safari.*/i.test(navigator.userAgent)) {
      const r = e.createSvgEl("text");
      r.setAttribute("style", t.getAttribute("style")), r.setAttribute("data-render-name", "text"), t.parentNode.appendChild(r), t.remove(), this.textPainter.paint(r, e);
      return;
    }
    !this.needsPaint && !this.changedLayout || this.textPainter.paint(t, e);
  }
  preformLayout() {
    this.layoutText({
      maxWidth: this.constraints.maxWidth,
      minWidth: this.constraints.minWidth
    }), this.size = this.constraints.constrain(
      new A({
        width: this.textPainter.width,
        height: this.textPainter.height
      })
    );
  }
  layoutText({
    maxWidth: t = 1 / 0,
    minWidth: e = 0
  }) {
    const r = this.softWrap || this.overflow === nt.ellipsis;
    this.previousWidth = this.textPainter.width, this.previousHeight = this.textPainter.height, this.textPainter.layout({
      minWidth: e,
      maxWidth: r ? t : 1 / 0
    }), this.changedLayout = this.textPainter.width !== this.previousWidth || this.textPainter.height !== this.previousHeight;
  }
  getIntrinsicHeight() {
    return this.textPainter.layout(), this.textPainter.height;
  }
  getIntrinsicWidth() {
    return this.textPainter.layout(), this.textPainter.width;
  }
  createDefaultSvgEl({ createSvgEl: t }) {
    return {
      text: t("text")
    };
  }
}
class Ns extends Rt {
  constructor({
    overflow: t = nt.visible,
    key: e,
    ...r
  }) {
    super(e);
    a(this, "overflow");
    a(this, "rest");
    this.overflow = t, this.rest = r;
  }
  build() {
    return Is({
      clipped: this.overflow === nt.clip,
      clipper: (t) => K.fromLTWH({
        left: 0,
        top: 0,
        width: t.width,
        height: t.width
      }),
      child: new Es({
        overflow: this.overflow,
        ...this.rest
      })
    });
  }
}
const js = dt(Ns);
function Zt(u, s = {}) {
  return new Gt({ ...s, data: u });
}
Zt.rich = (u, s = {}) => new Gt({ ...s, textSpan: u });
class Gt extends Rt {
  constructor({
    data: t,
    textSpan: e,
    softWrap: r,
    textAlign: h,
    textDirection: g,
    textWidthBasis: o,
    style: _,
    overflow: v
  }) {
    super();
    a(this, "data");
    //This will be null if a data is provided instead
    a(this, "textSpan");
    a(this, "style");
    a(this, "textAlign");
    a(this, "textDirection");
    a(this, "softWrap");
    a(this, "textWidthBasis");
    a(this, "overflow");
    this.softWrap = r, this.textAlign = h, this.textDirection = g, this.textWidthBasis = o, this.style = _, this.overflow = v, this.data = t, this.textSpan = e;
  }
  build(t) {
    return js({
      textAlign: this.textAlign ?? _t.start,
      textDirection: this.textDirection,
      softWrap: this.softWrap,
      overflow: this.overflow,
      textWidthBasis: this.textWidthBasis,
      text: new us({
        style: this.style,
        text: this.data,
        children: this.textSpan && [this.textSpan]
      })
    });
  }
}
const Us = dt(Ms);
function ks({
  flex: u,
  child: s,
  key: t
}) {
  return Us({
    flex: u,
    child: s,
    fit: "tight",
    key: t
  });
}
class As extends V {
  constructor({
    child: t,
    constraints: e,
    key: r
  }) {
    super({ child: t, key: r });
    a(this, "constraints");
    this.constraints = e;
  }
  createRenderObject() {
    return new $s({ constraint: this.constraints });
  }
  updateRenderObject(t) {
    t.additionalConstraint = this.constraints;
  }
}
class $s extends Q {
  constructor({ constraint: t }) {
    super({ isPainter: !1 });
    a(this, "_additionalConstraint");
    this._additionalConstraint = t;
  }
  get additionalConstraint() {
    return this._additionalConstraint;
  }
  set additionalConstraint(t) {
    t.equals(this._additionalConstraint) || (this._additionalConstraint = t, this.markNeedsLayout());
  }
  preformLayout() {
    this.constraints = this.additionalConstraint.enforce(this.constraints);
    let t = A.zero;
    this.child != null && (this.child.layout(this.constraints), t = this.child.size), this.size = this.constraints.constrain(t);
  }
  getIntrinsicHeight(t) {
    if (this.additionalConstraint.hasBoundedHeight && this.additionalConstraint.hasTightHeight)
      return this.additionalConstraint.minHeight;
    const e = super.getIntrinsicHeight(t);
    return this.additionalConstraint.hasInfiniteHeight ? e : this.additionalConstraint.constrainHeight(e);
  }
  getIntrinsicWidth(t) {
    if (this.additionalConstraint.hasBoundedWidth && this.additionalConstraint.hasTightWidth)
      return this.additionalConstraint.minWidth;
    const e = super.getIntrinsicWidth(t);
    return this.additionalConstraint.hasInfiniteWidth ? e : this.additionalConstraint.constrainWidth(e);
  }
}
function jt(...u) {
  return new As(...u);
}
let Ys = class extends V {
  constructor({
    child: t,
    widthFactor: e,
    heightFactor: r,
    alignment: h = rt.center,
    key: g
  }) {
    super({ child: t, key: g });
    a(this, "widthFactor");
    a(this, "heightFactor");
    a(this, "alignment");
    this.alignment = h, this.widthFactor = e, this.heightFactor = r;
  }
  createRenderObject() {
    return new Xs({
      alignment: this.alignment,
      widthFactor: this.widthFactor,
      heightFactor: this.heightFactor
    });
  }
  updateRenderObject(t) {
    t.alignment = this.alignment, t.widthFactor = this.widthFactor, t.heightFactor = this.heightFactor;
  }
};
class Xs extends qs {
  constructor({
    alignment: t,
    widthFactor: e,
    heightFactor: r
  }) {
    super({ alignment: t, textDirection: it.ltr });
    a(this, "_widthFactor");
    a(this, "_heightFactor");
    if (e != null && e < 0)
      throw new Error("widthFactor must be greater than zero");
    if (r != null && r < 0)
      throw new Error("heightFactor must be greater than zero");
    this._widthFactor = e, this._heightFactor = r;
  }
  get widthFactor() {
    return this._widthFactor;
  }
  set widthFactor(t) {
    this._widthFactor !== t && (this._widthFactor = t, this.markNeedsLayout());
  }
  get heightFactor() {
    return this._heightFactor;
  }
  set heightFactor(t) {
    this._heightFactor !== t && (this._heightFactor = t, this.markNeedsLayout());
  }
  preformLayout() {
    const t = this.constraints, e = this.widthFactor != null || t.maxWidth == 1 / 0, r = this.heightFactor != null || t.maxHeight == 1 / 0;
    this.child != null ? (this.child.layout(t.loosen()), this.size = t.constrain(
      new A({
        width: e ? this.child.size.width * (this.widthFactor ?? 1) : 1 / 0,
        height: r ? this.child.size.height * (this.heightFactor ?? 1) : 1 / 0
      })
    ), this.alignChild()) : this.size = t.constrain(
      new A({
        width: e ? 0 : 1 / 0,
        height: r ? 0 : 1 / 0
      })
    );
  }
}
function Zs(...u) {
  return new Ys(...u);
}
let Gs = class extends V {
  constructor({
    color: t,
    child: e,
    key: r
  }) {
    super({ child: e, key: r });
    a(this, "color");
    this.color = t;
  }
  createRenderObject() {
    return new Ks({ color: this.color });
  }
  updateRenderObject(t) {
    t.color = this.color;
  }
};
class Ks extends Q {
  constructor({ color: t }) {
    super({ isPainter: !0 });
    a(this, "_color");
    this._color = t;
  }
  get color() {
    return this._color;
  }
  set color(t) {
    t !== this._color && (this._color = t, this.markNeedsPaint());
  }
  performPaint({ rect: t }) {
    t.setAttribute("fill", this.color), t.setAttribute("width", `${this.size.width}`), t.setAttribute("height", `${this.size.height}`);
  }
  createDefaultSvgEl({ createSvgEl: t }) {
    return {
      rect: t("rect")
    };
  }
}
function Qs(...u) {
  return new Gs(...u);
}
let Js = class extends V {
  constructor({
    decoration: t,
    child: e,
    key: r
  }) {
    super({ child: e, key: r });
    a(this, "decoration");
    this.decoration = t;
  }
  createRenderObject() {
    return new Vs({ decoration: this.decoration });
  }
  updateRenderObject(t) {
    t.decoration = this.decoration;
  }
};
class Vs extends Q {
  constructor({ decoration: t }) {
    super({ isPainter: !0 });
    a(this, "_decoration");
    this._decoration = t;
  }
  get decoration() {
    return this._decoration;
  }
  set decoration(t) {
    this.decoration.equal(t) || (this._decoration = t, this.markNeedsPaint());
  }
  performPaint(t) {
    this.decoration.createBoxPainter().paint(t, this.size);
  }
  createDefaultSvgEl({ createSvgEl: t }) {
    return {
      box: t("path"),
      topBorder: t("path"),
      leftBorder: t("path"),
      rightBorder: t("path"),
      bottomBorder: t("path")
    };
  }
}
function te(...u) {
  return new Js(...u);
}
class se extends V {
  constructor({
    child: t,
    maxHeight: e = 1 / 0,
    maxWidth: r = 1 / 0,
    key: h
  }) {
    super({ child: t, key: h });
    a(this, "maxWidth");
    a(this, "maxHeight");
    this.maxHeight = e, this.maxWidth = r;
  }
  createRenderObject() {
    return new ee({
      maxHeight: this.maxHeight,
      maxWidth: this.maxWidth
    });
  }
  updateRenderObject(t) {
    t.maxHeight = this.maxHeight, t.maxWidth = this.maxWidth;
  }
}
class ee extends Q {
  constructor({
    maxHeight: t = 1 / 0,
    maxWidth: e = 1 / 0
  }) {
    super({ isPainter: !1 });
    a(this, "_maxWidth");
    a(this, "_maxHeight");
    this._maxHeight = t, this._maxWidth = e;
  }
  get maxWidth() {
    return this._maxWidth;
  }
  set maxWidth(t) {
    this._maxWidth !== t && (this._maxWidth = t, this.markNeedsLayout());
  }
  get maxHeight() {
    return this._maxHeight;
  }
  set maxHeight(t) {
    this._maxHeight !== t && (this._maxHeight = t, this.markNeedsLayout());
  }
  preformLayout() {
    if (this.child == null) {
      this.size = this.limitConstraints(this.constraints).constrain(A.zero);
      return;
    }
    this.child.layout(this.limitConstraints(this.constraints)), this.size = this.child.size;
  }
  limitConstraints(t) {
    return new N({
      minHeight: t.minHeight,
      minWidth: t.minWidth,
      maxWidth: t.hasBoundedWidth ? t.maxWidth : t.constrainWidth(this.maxWidth),
      maxHeight: t.hasBoundedHeight ? t.maxHeight : t.constrainHeight(this.maxHeight)
    });
  }
}
const re = dt(se);
let ie = class extends V {
  constructor({
    padding: t = at.all(0),
    child: e,
    key: r
  }) {
    super({ child: e, key: r });
    a(this, "padding");
    this.padding = t;
  }
  createRenderObject() {
    return new he({
      padding: this.padding
    });
  }
  updateRenderObject(t) {
    t.padding = this.padding;
  }
};
class he extends Q {
  constructor({ padding: t }) {
    super({ isPainter: !1 });
    a(this, "_padding");
    this._padding = t;
  }
  get padding() {
    return this._padding;
  }
  set padding(t) {
    t.eqaul(this._padding) || (this._padding = t, this.markNeedsLayout());
  }
  preformLayout() {
    if (this.child == null)
      return;
    const { top: t, left: e, right: r, bottom: h } = this.padding, g = this.constraints.deflate(this.padding);
    this.child.layout(g);
    const { size: o } = this.child;
    this.size = this.constraints.constrain(
      new A({
        width: o.width + e + r,
        height: o.height + t + h
      })
    ), this.child.offset = new T({ x: e, y: t });
  }
  getIntrinsicWidth(t) {
    return super.getIntrinsicWidth(t) + this.padding.horizontal;
  }
  getIntrinsicHeight(t) {
    return super.getIntrinsicHeight(t) + this.padding.vertical;
  }
}
function Ut({
  padding: u = at.all(0),
  child: s,
  key: t
}) {
  if (s instanceof ks)
    throw { message: "Padding must not have a Expanded Widget" };
  return new ie({ padding: u, child: s, key: t });
}
let Ct = class J extends V {
  constructor({
    child: t,
    transform: e,
    origin: r,
    alignment: h = rt.center,
    key: g
  }) {
    super({ child: t, key: g });
    a(this, "origin");
    a(this, "alignment");
    a(this, "transform");
    this.transform = e, this.origin = r, this.alignment = h;
  }
  static rotate({
    angle: t,
    origin: e,
    alignment: r = rt.center,
    child: h,
    key: g
  }) {
    return new J({
      key: g,
      child: h,
      origin: e,
      alignment: r,
      transform: J._computeRotation(t)
    });
  }
  static translate({
    child: t,
    offset: e,
    key: r
  }) {
    return new J({
      child: t,
      key: r,
      transform: j.translationValues(e.x, e.y, 0),
      origin: void 0,
      alignment: void 0
    });
  }
  static scale({
    child: t,
    scale: e,
    scaleX: r,
    scaleY: h,
    origin: g,
    alignment: o = rt.center,
    key: _
  }) {
    return Y(
      !(e == null && r == null && h == null),
      "At least one of 'scale', 'scaleX' and 'scaleY' is required to be non-null"
    ), Y(
      e == null || r == null && h == null,
      "If 'scale' is non-null then 'scaleX' and 'scaleY' must be left null"
    ), new J({
      key: _,
      child: t,
      origin: g,
      alignment: o,
      transform: j.diagonal3Values(
        e ?? r ?? 1,
        e ?? h ?? 1,
        1
      )
    });
  }
  createRenderObject() {
    return new ge({
      transform: this.transform,
      origin: this.origin,
      alignment: this.alignment
    });
  }
  updateRenderObject(t) {
    t.transform = this.transform, t.origin = this.origin, t.alignment = this.alignment;
  }
  static _computeRotation(t) {
    if (t == 0)
      return j.identity();
    const e = Math.sin(t);
    if (e == 1)
      return J._createZRotation(1, 0);
    if (e == -1)
      return J._createZRotation(-1, 0);
    const r = Math.cos(t);
    return r == -1 ? J._createZRotation(0, -1) : J._createZRotation(e, r);
  }
  static _createZRotation(t, e) {
    const r = j.zero();
    return r.storage[0] = e, r.storage[1] = t, r.storage[4] = -t, r.storage[5] = e, r.storage[10] = 1, r.storage[15] = 1, r;
  }
};
class ge extends Q {
  constructor({
    origin: t,
    alignment: e,
    transform: r,
    textDirection: h = it.ltr
  }) {
    super({ isPainter: !1 });
    a(this, "_origin");
    a(this, "_alignment");
    a(this, "_transform");
    a(this, "_textDirection");
    this._transform = r, this._origin = t, this._alignment = e, this._textDirection = h;
  }
  get origin() {
    return this._origin;
  }
  set origin(t) {
    t == null && this._origin == null || t != null && this._origin != null && this._origin.x === t.x && this._origin.y === t.y || (this._origin = t, this.markNeedsLayout());
  }
  get alignment() {
    return this._alignment;
  }
  set alignment(t) {
    this._alignment.equal(t) || (this._alignment = t, this.markNeedsLayout());
  }
  get transform() {
    return this._transform;
  }
  set transform(t) {
    this.transform.equals(t) || (this._transform = t, this.markNeedsLayout());
  }
  get textDirection() {
    return this._textDirection;
  }
  set textDirection(t) {
    this._textDirection != t && (this._textDirection = t, this.markNeedsLayout());
  }
  get _effectiveTransform() {
    var o;
    const t = (o = this.alignment) == null ? void 0 : o.resolve(this.textDirection), e = (t == null ? void 0 : t.alongSize(this.size)) ?? {
      x: 0,
      y: 0
    }, r = this.origin ?? { x: 0, y: 0 }, h = {
      x: r.x + e.x,
      y: r.y + e.y
    }, g = j.identity();
    return g.translate(h.x, h.y), g.multiplyMatrix(this.transform), g.translate(-h.x, -h.y), g;
  }
  getChildMatrix4(t) {
    return t.multipliedMatrix(this._effectiveTransform);
  }
}
function Wt({
  child: u,
  transform: s,
  origin: t,
  alignment: e,
  key: r
}) {
  return new Ct({
    child: u,
    transform: s,
    alignment: e,
    origin: t,
    key: r
  });
}
Wt.rotate = Ct.rotate;
Wt.scale = Ct.scale;
Wt.translate = Ct.translate;
class ae extends Rt {
  constructor({
    key: t,
    padding: e,
    margin: r,
    width: h,
    height: g,
    color: o,
    decoration: _,
    child: v,
    alignment: x,
    clipped: w,
    constraints: m,
    transform: y,
    transformAlignment: d
  }) {
    super(t);
    a(this, "padding");
    a(this, "margin");
    a(this, "width");
    a(this, "height");
    a(this, "color");
    a(this, "decoration");
    a(this, "child");
    a(this, "alignment");
    a(this, "clipped");
    a(this, "constraints");
    a(this, "transform");
    a(this, "transformAlignment");
    this.padding = e, this.margin = r, this.width = h, this.height = g, this.color = o, this.decoration = _, this.child = v, this.alignment = x, this.clipped = w, this.constraints = m, this.transform = y, this.transformAlignment = d;
  }
  build(t) {
    const {
      padding: e,
      margin: r,
      width: h,
      height: g,
      color: o,
      decoration: _,
      child: v,
      alignment: x,
      clipped: w,
      transform: m,
      transformAlignment: y
    } = this;
    let d = this.constraints;
    d = h != null || g != null ? (d == null ? void 0 : d.tighten({ width: h, height: g })) ?? N.tightFor({ width: h, height: g }) : d, Y(
      o == null || _ == null,
      "Color must be null when decoration is defined"
    );
    let l = v;
    l == null && (d == null || !d.isTight) ? l = re({
      maxHeight: 0,
      maxWidth: 0,
      child: jt({
        constraints: N.expand()
      })
    }) : x != null && (l = Zs({ child: l, alignment: x }));
    let z;
    return _ == null || _.padding == null ? z = e : e == null ? z = _.padding : z = e.add(_.padding), z != null && (l = Ut({
      padding: z,
      child: l
    })), o != null && (l = Qs({
      color: o,
      child: l
    })), w && (Y(
      _ != null,
      "Decoration must not be null when clipped is true"
    ), l = Xt({
      clipper: (c) => _.getClipPath(
        K.fromLTWH({
          width: c.width,
          height: c.height,
          left: 0,
          top: 0
        })
      ),
      clipped: w,
      child: l
    })), _ != null && (l = te({
      decoration: _,
      child: l
    })), d != null && (l = jt({
      child: l,
      constraints: d
    })), r != null && (l = Ut({
      child: l,
      padding: r
    })), m != null && (l = Wt({
      transform: m,
      alignment: y,
      child: l
    })), l;
  }
}
const oe = dt(ae);
new T({ x: -1, y: -1 }), new T({ x: 0, y: -1 }), new T({ x: 1, y: -1 }), new T({ x: 0, y: 0 }), new T({ x: -1, y: 0 }), new T({ x: 1, y: 0 }), new T({ x: 0, y: 1 }), new T({ x: -1, y: 1 }), new T({ x: 1, y: 1 });
function de({
  width: u = "100%",
  height: s = "300px",
  widget: t = oe({
    width: 1 / 0,
    height: 1 / 0,
    alignment: rt.center,
    child: Zt("Hello World")
  })
}) {
  const e = Ft(null), r = Ft(null);
  return Jt(() => {
    const h = new cs({
      view: r.current,
      window,
      document
    });
    h.runApp(t), h.onMount({
      resizeTarget: e.current
    });
  }, []), /* @__PURE__ */ Ht("div", { style: { width: u, height: s }, ref: e, children: /* @__PURE__ */ Ht("svg", { ref: r }) });
}
export {
  de as default
};
