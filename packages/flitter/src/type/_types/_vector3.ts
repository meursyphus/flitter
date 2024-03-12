import type Matrix4 from "./_matrix4";
import type Matrix3 from "./_matrix3";
import type Vector from "./_vector";
import Vector2 from "./_vector2";
import Vector4 from "./_vector4";

export class Vector3 implements Vector {
  get storage() {
    return this._v3storage;
  }
  _v3storage: [number, number, number];

  constructor(arg0: number, arg1: number, arg2: number) {
    this._v3storage = [arg0, arg1, arg2];
  }

  static copy(arg: Vector3) {
    return new Vector3(...arg._v3storage);
  }

  setValues(x: number, y: number, z: number): void {
    this._v3storage[0] = x;
    this._v3storage[1] = y;
    this._v3storage[2] = z;
  }

  setZero(): void {
    this._v3storage[0] = 0.0;
    this._v3storage[1] = 0.0;
    this._v3storage[2] = 0.0;
  }

  setFrom(other: Vector3): void {
    const otherStorage = other._v3storage;
    this._v3storage[0] = otherStorage[0];
    this._v3storage[1] = otherStorage[1];
    this._v3storage[2] = otherStorage[2];
  }

  splat(arg: number): void {
    this._v3storage[0] = arg;
    this._v3storage[1] = arg;
    this._v3storage[2] = arg;
  }

  toString(): string {
    return `[${this._v3storage[0]},${this._v3storage[1]},${this._v3storage[2]}]`;
  }
  /**
   * Set the length of the vector. A negative `value` will change the vectors
   * orientation and a `value` of zero will set the vector to zero.
   */
  set length(value: number) {
    if (value === 0.0) {
      this.setZero();
    } else {
      let l = this.length;
      if (l === 0.0) {
        return;
      }
      l = value / l;
      this._v3storage[0] *= l;
      this._v3storage[1] *= l;
      this._v3storage[2] *= l;
    }
  }

  /**
   * Length.
   */
  get length(): number {
    return Math.sqrt(this.length2);
  }

  /**
   * Length squared.
   */
  get length2(): number {
    let sum = 0.0;
    sum += this._v3storage[0] * this._v3storage[0];
    sum += this._v3storage[1] * this._v3storage[1];
    sum += this._v3storage[2] * this._v3storage[2];
    return sum;
  }

  /**
   * Normalizes this.
   */
  normalize(): number {
    const l = this.length;
    if (l === 0.0) {
      return 0.0;
    }
    const d = 1.0 / l;
    this._v3storage[0] *= d;
    this._v3storage[1] *= d;
    this._v3storage[2] *= d;
    return l;
  }
  /// Normalizes copy of this.
  normalized(): Vector3 {
    const result = Vector3.copy(this);
    result.normalize();
    return result;
  }

  /// Normalize vector into [out].
  normalizeInto(out: Vector3): Vector3 {
    out.setFrom(this);
    out.normalize();
    return out;
  }

  /// Distance from this to [arg]
  distanceTo(arg: Vector3): number {
    return Math.sqrt(this.distanceToSquared(arg));
  }

  /// Squared distance from this to [arg]
  distanceToSquared(arg: Vector3): number {
    const argStorage = arg._v3storage;
    const dx = this._v3storage[0] - argStorage[0];
    const dy = this._v3storage[1] - argStorage[1];
    const dz = this._v3storage[2] - argStorage[2];
    return dx * dx + dy * dy + dz * dz;
  }

  /// Returns the angle between this vector and [other] in radians.
  angleTo(other: Vector3): number {
    const otherStorage = other._v3storage;
    if (
      this._v3storage[0] === otherStorage[0] &&
      this._v3storage[1] === otherStorage[1] &&
      this._v3storage[2] === otherStorage[2]
    ) {
      return 0.0;
    }
    const d = this.dot(other) / (this.length * other.length);
    return Math.acos(Math.min(Math.max(d, -1.0), 1.0));
  }

  /// Returns the signed angle between this and [other] around [normal]
  /// in radians.
  angleToSigned(other: Vector3, normal: Vector3): number {
    const angle = this.angleTo(other);
    const c = this.cross(other);
    const d = c.dot(normal);
    return d < 0.0 ? -angle : angle;
  }

  /// Inner product.
  dot(other: Vector3): number {
    const otherStorage = other._v3storage;
    let sum = 0.0;
    sum += this._v3storage[0] * otherStorage[0];
    sum += this._v3storage[1] * otherStorage[1];
    sum += this._v3storage[2] * otherStorage[2];
    return sum;
  }

  /**
   * Transforms this into the product of this as a row vector,
   * postmultiplied by matrix, [arg].
   * If [arg] is a rotation matrix, this is a computational shortcut for applying,
   * the inverse of the transformation.
   */
  postmultiply(arg: Matrix3): void {
    const argStorage = arg.storage;
    const v0 = this._v3storage[0];
    const v1 = this._v3storage[1];
    const v2 = this._v3storage[2];

    this._v3storage[0] =
      v0 * argStorage[0] + v1 * argStorage[1] + v2 * argStorage[2];
    this._v3storage[1] =
      v0 * argStorage[3] + v1 * argStorage[4] + v2 * argStorage[5];
    this._v3storage[2] =
      v0 * argStorage[6] + v1 * argStorage[7] + v2 * argStorage[8];
  }

  /// Cross product.
  cross(other: Vector3): Vector3 {
    const _x = this._v3storage[0];
    const _y = this._v3storage[1];
    const _z = this._v3storage[2];
    const otherStorage = other._v3storage;
    const ox = otherStorage[0];
    const oy = otherStorage[1];
    const oz = otherStorage[2];
    return new Vector3(_y * oz - _z * oy, _z * ox - _x * oz, _x * oy - _y * ox);
  }

  /// Cross product. Stores result in [out].
  crossInto(other: Vector3, out: Vector3): Vector3 {
    const x = this._v3storage[0];
    const y = this._v3storage[1];
    const z = this._v3storage[2];
    const otherStorage = other._v3storage;
    const ox = otherStorage[0];
    const oy = otherStorage[1];
    const oz = otherStorage[2];
    const outStorage = out._v3storage;
    outStorage[0] = y * oz - z * oy;
    outStorage[1] = z * ox - x * oz;
    outStorage[2] = x * oy - y * ox;
    return out;
  }

  reflected(normal: Vector3): Vector3 {
    const result = this.clone();
    result.reflect(normal);
    return result;
  }

  clone(): Vector3 {
    return Vector3.copy(this);
  }

  reflect(normal: Vector3): void {
    this.sub(normal.scaled(2.0 * normal.dot(this)));
  }

  /// Projects this using the projection matrix [arg]
  applyProjection(arg: Matrix4): void {
    const argStorage = arg._m4storage;
    const x = this._v3storage[0];
    const y = this._v3storage[1];
    const z = this._v3storage[2];
    const d =
      1.0 /
      (argStorage[3] * x +
        argStorage[7] * y +
        argStorage[11] * z +
        argStorage[15]);
    this._v3storage[0] =
      (argStorage[0] * x +
        argStorage[4] * y +
        argStorage[8] * z +
        argStorage[12]) *
      d;
    this._v3storage[1] =
      (argStorage[1] * x +
        argStorage[5] * y +
        argStorage[9] * z +
        argStorage[13]) *
      d;
    this._v3storage[2] =
      (argStorage[2] * x +
        argStorage[6] * y +
        argStorage[10] * z +
        argStorage[14]) *
      d;
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
  applyMatrix3(arg: Matrix3): void {
    const argStorage = arg.storage;
    const v0 = this._v3storage[0];
    const v1 = this._v3storage[1];
    const v2 = this._v3storage[2];
    this._v3storage[0] =
      argStorage[0] * v0 + argStorage[3] * v1 + argStorage[6] * v2;
    this._v3storage[1] =
      argStorage[1] * v0 + argStorage[4] * v1 + argStorage[7] * v2;
    this._v3storage[2] =
      argStorage[2] * v0 + argStorage[5] * v1 + argStorage[8] * v2;
  }

  /// Multiplies this by a 4x3 subset of [arg]. Expects [arg] to be an affine
  /// transformation matrix.
  applyMatrix4(arg: Matrix4): void {
    const argStorage = arg._m4storage;
    const v0 = this._v3storage[0];
    const v1 = this._v3storage[1];
    const v2 = this._v3storage[2];
    this._v3storage[0] =
      argStorage[0] * v0 +
      argStorage[4] * v1 +
      argStorage[8] * v2 +
      argStorage[12];
    this._v3storage[1] =
      argStorage[1] * v0 +
      argStorage[5] * v1 +
      argStorage[9] * v2 +
      argStorage[13];
    this._v3storage[2] =
      argStorage[2] * v0 +
      argStorage[6] * v1 +
      argStorage[10] * v2 +
      argStorage[14];
  }
  /// Relative error between this and [correct]
  relativeError(correct: Vector3): number {
    const correctNorm = correct.length;
    const cloned = this.clone();
    cloned.sub(correct);
    const diffNorm = cloned.length;
    return diffNorm / correctNorm;
  }
  /// Absolute error between this and [correct]
  absoluteError(correct: Vector3): number {
    const cloned = this.clone();
    cloned.sub(correct);
    return cloned.length;
  }
  /**
   * Returns true if any component is infinite.
   */
  get isInfinite(): boolean {
    let is_infinite = false;
    is_infinite = is_infinite || !isFinite(this._v3storage[0]);
    is_infinite = is_infinite || !isFinite(this._v3storage[1]);
    is_infinite = is_infinite || !isFinite(this._v3storage[2]);
    return is_infinite;
  }

  /**
   * Returns true if any component is NaN.
   */
  get isNaN(): boolean {
    let is_nan = false;
    is_nan = is_nan || isNaN(this._v3storage[0]);
    is_nan = is_nan || isNaN(this._v3storage[1]);
    is_nan = is_nan || isNaN(this._v3storage[2]);
    return is_nan;
  }

  /**
   * Add `arg` to this vector.
   */
  add(arg: Vector3): void {
    const argStorage = arg._v3storage;
    this._v3storage[0] += argStorage[0];
    this._v3storage[1] += argStorage[1];
    this._v3storage[2] += argStorage[2];
  }
  /**
   * Add [arg] scaled by [factor] to this.
   */
  addScaled(arg: Vector3, factor: number): void {
    const argStorage = arg._v3storage;
    this._v3storage[0] += argStorage[0] * factor;
    this._v3storage[1] += argStorage[1] * factor;
    this._v3storage[2] += argStorage[2] * factor;
  }
  sub(arg: Vector3): void {
    const argStorage = arg._v3storage;
    this._v3storage[0] -= argStorage[0];
    this._v3storage[1] -= argStorage[1];
    this._v3storage[2] -= argStorage[2];
  }
  /**
   * Multiply entries in this with entries in [arg].
   */
  multiply(arg: Vector3): void {
    const argStorage = arg._v3storage;
    this._v3storage[0] = this._v3storage[0] * argStorage[0];
    this._v3storage[1] = this._v3storage[1] * argStorage[1];
    this._v3storage[2] = this._v3storage[2] * argStorage[2];
  }
  /**
   * Divide entries in this with entries in [arg].
   */
  divide(arg: Vector3): void {
    const argStorage = arg._v3storage;
    this._v3storage[0] /= argStorage[0];
    this._v3storage[1] /= argStorage[1];
    this._v3storage[2] /= argStorage[2];
  }
  /**
    Scale this.
  */
  scale(arg: number): void {
    this._v3storage[2] *= arg;
    this._v3storage[1] *= arg;
    this._v3storage[0] *= arg;
  }
  /**

Create a copy of this and scale it by [arg].
*/
  scaled(arg: number): Vector3 {
    const result = this.clone();
    result.scale(arg);
    return result;
  }
  /**
   * Negate each component of this vector.
   */
  negate(): void {
    this._v3storage[2] = -this._v3storage[2];
    this._v3storage[1] = -this._v3storage[1];
    this._v3storage[0] = -this._v3storage[0];
  }
  /**
   * Absolute value.
   */
  absolute(): void {
    this._v3storage[0] = Math.abs(this._v3storage[0]);
    this._v3storage[1] = Math.abs(this._v3storage[1]);
    this._v3storage[2] = Math.abs(this._v3storage[2]);
  }
  /**

Clamp each entry n in this in the range [min[n]]-[max[n]].
*/
  clamp(min: Vector3, max: Vector3): void {
    const minStorage = min.storage;
    const maxStorage = max.storage;
    this._v3storage[0] = this._clamp(
      this._v3storage[0],
      minStorage[0],
      maxStorage[0]
    ) as number;
    this._v3storage[1] = this._clamp(
      this._v3storage[1],
      minStorage[1],
      maxStorage[1]
    ) as number;
    this._v3storage[2] = this._clamp(
      this._v3storage[2],
      minStorage[2],
      maxStorage[2]
    ) as number;
  }
  /**
   * Clamp entries in this in the range [min]-[max].
   */
  clampScalar(min: number, max: number): void {
    this._v3storage[0] = this._clamp(this._v3storage[0], min, max);
    this._v3storage[1] = this._clamp(this._v3storage[1], min, max);
    this._v3storage[2] = this._clamp(this._v3storage[2], min, max);
  }
  /**
  Floor entries in this.
  */
  floor(): void {
    this._v3storage[0] = Math.floor(this._v3storage[0]);
    this._v3storage[1] = Math.floor(this._v3storage[1]);
    this._v3storage[2] = Math.floor(this._v3storage[2]);
  }
  /**
  
  Ceil entries in this.
  */
  ceil(): void {
    this._v3storage[0] = Math.ceil(this._v3storage[0]);
    this._v3storage[1] = Math.ceil(this._v3storage[1]);
    this._v3storage[2] = Math.ceil(this._v3storage[2]);
  }
  /**
  Round entries in this.
  */
  round(): void {
    this._v3storage[0] = Math.round(this._v3storage[0]);
    this._v3storage[1] = Math.round(this._v3storage[1]);
    this._v3storage[2] = Math.round(this._v3storage[2]);
  }

  private _clamp(target: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, target));
  }
  set xy(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v3storage[0] = argStorage[0];
    this._v3storage[1] = argStorage[1];
  }

  set xz(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v3storage[0] = argStorage[0];
    this._v3storage[2] = argStorage[1];
  }

  set yx(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v3storage[1] = argStorage[0];
    this._v3storage[0] = argStorage[1];
  }

  set yz(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v3storage[1] = argStorage[0];
    this._v3storage[2] = argStorage[1];
  }

  set zx(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v3storage[2] = argStorage[0];
    this._v3storage[0] = argStorage[1];
  }

  set zy(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v3storage[2] = argStorage[0];
    this._v3storage[1] = argStorage[1];
  }

  set xyz(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v3storage[0] = argStorage[0];
    this._v3storage[1] = argStorage[1];
    this._v3storage[2] = argStorage[2];
  }

  set xzy(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v3storage[0] = argStorage[0];
    this._v3storage[2] = argStorage[1];
    this._v3storage[1] = argStorage[2];
  }

  set yxz(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v3storage[1] = argStorage[0];
    this._v3storage[0] = argStorage[1];
    this._v3storage[2] = argStorage[2];
  }

  set yzx(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v3storage[1] = argStorage[0];
    this._v3storage[2] = argStorage[1];
    this._v3storage[0] = argStorage[2];
  }

  set zxy(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v3storage[2] = argStorage[0];
    this._v3storage[0] = argStorage[1];
    this._v3storage[1] = argStorage[2];
  }

  set zyx(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v3storage[2] = argStorage[0];
    this._v3storage[1] = argStorage[1];
    this._v3storage[0] = argStorage[2];
  }

  set r(arg: number) {
    this.x = arg;
  }
  set g(arg: number) {
    this.y = arg;
  }
  set b(arg: number) {
    this.z = arg;
  }
  set s(arg: number) {
    this.x = arg;
  }
  set t(arg: number) {
    this.y = arg;
  }
  set p(arg: number) {
    this.z = arg;
  }
  set x(arg: number) {
    this._v3storage[0] = arg;
  }
  set y(arg: number) {
    this._v3storage[1] = arg;
  }
  set z(arg: number) {
    this._v3storage[2] = arg;
  }
  set rg(arg: Vector2) {
    this.xy = arg;
  }
  set rb(arg: Vector2) {
    this.xz = arg;
  }
  set gr(arg: Vector2) {
    this.yx = arg;
  }
  set gb(arg: Vector2) {
    this.yz = arg;
  }
  set br(arg: Vector2) {
    this.zx = arg;
  }
  set bg(arg: Vector2) {
    this.zy = arg;
  }
  set rgb(arg: Vector3) {
    this.xyz = arg;
  }
  set rbg(arg: Vector3) {
    this.xzy = arg;
  }
  set grb(arg: Vector3) {
    this.yxz = arg;
  }
  set gbr(arg: Vector3) {
    this.yzx = arg;
  }
  set brg(arg: Vector3) {
    this.zxy = arg;
  }
  set bgr(arg: Vector3) {
    this.zyx = arg;
  }
  set st(arg: Vector2) {
    this.xy = arg;
  }
  set sp(arg: Vector2) {
    this.xz = arg;
  }
  set ts(arg: Vector2) {
    this.yx = arg;
  }
  set tp(arg: Vector2) {
    this.yz = arg;
  }
  set ps(arg: Vector2) {
    this.zx = arg;
  }
  set pt(arg: Vector2) {
    this.zy = arg;
  }
  set stp(arg: Vector3) {
    this.xyz = arg;
  }
  set spt(arg: Vector3) {
    this.xzy = arg;
  }
  set tsp(arg: Vector3) {
    this.yxz = arg;
  }
  set tps(arg: Vector3) {
    this.yzx = arg;
  }
  set pst(arg: Vector3) {
    this.zxy = arg;
  }
  set pts(arg: Vector3) {
    this.zyx = arg;
  }
  get xx() {
    return new Vector2(this._v3storage[0], this._v3storage[0]);
  }
  get xy() {
    return new Vector2(this._v3storage[0], this._v3storage[1]);
  }
  get xz() {
    return new Vector2(this._v3storage[0], this._v3storage[2]);
  }
  get yx() {
    return new Vector2(this._v3storage[1], this._v3storage[0]);
  }
  get yy() {
    return new Vector2(this._v3storage[1], this._v3storage[1]);
  }
  get yz() {
    return new Vector2(this._v3storage[1], this._v3storage[2]);
  }
  get zx() {
    return new Vector2(this._v3storage[2], this._v3storage[0]);
  }
  get zy() {
    return new Vector2(this._v3storage[2], this._v3storage[1]);
  }
  get zz() {
    return new Vector2(this._v3storage[2], this._v3storage[2]);
  }
  get xxx() {
    return new Vector3(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get xxy() {
    return new Vector3(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get xxz() {
    return new Vector3(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get xyx() {
    return new Vector3(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get xyy() {
    return new Vector3(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get xyz() {
    return new Vector3(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get xzx() {
    return new Vector3(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get xzy() {
    return new Vector3(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get xzz() {
    return new Vector3(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get yxx() {
    return new Vector3(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get yxy() {
    return new Vector3(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get yxz() {
    return new Vector3(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get yyx() {
    return new Vector3(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get yyy() {
    return new Vector3(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get yyz() {
    return new Vector3(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get yzx() {
    return new Vector3(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get yzy() {
    return new Vector3(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get yzz() {
    return new Vector3(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get zxx() {
    return new Vector3(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get zxy() {
    return new Vector3(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get zxz() {
    return new Vector3(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get zyx() {
    return new Vector3(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get zyy() {
    return new Vector3(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get zyz() {
    return new Vector3(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get zzx() {
    return new Vector3(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get zzy() {
    return new Vector3(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get zzz() {
    return new Vector3(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get xxxx() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get xxxy() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get xxxz() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get xxyx() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get xxyy() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get xxyz() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get xxzx() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get xxzy() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get xxzz() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get xyxx() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get xyxy() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get xyxz() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get xyyx() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get xyyy() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get xyyz() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get xyzx() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get xyzy() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get xyzz() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get xzxx() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get xzxy() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get xzxz() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get xzyx() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get xzyy() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get xzyz() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get xzzx() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get xzzy() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get xzzz() {
    return new Vector4(
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get yxxx() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get yxxy() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get yxxz() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get yxyx() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get yxyy() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get yxyz() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get yxzx() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get yxzy() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get yxzz() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get yyxx() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get yyxy() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get yyxz() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get yyyx() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get yyyy() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get yyyz() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get yyzx() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get yyzy() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get yyzz() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get yzxx() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get yzxy() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get yzxz() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get yzyx() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get yzyy() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get yzyz() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get yzzx() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get yzzy() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get yzzz() {
    return new Vector4(
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get zxxx() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get zxxy() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get zxxz() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get zxyx() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get zxyy() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get zxyz() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get zxzx() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get zxzy() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get zxzz() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get zyxx() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get zyxy() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get zyxz() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get zyyx() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get zyyy() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get zyyz() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get zyzx() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get zyzy() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get zyzz() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2],
      this._v3storage[2]
    );
  }
  get zzxx() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[0]
    );
  }
  get zzxy() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[1]
    );
  }
  get zzxz() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0],
      this._v3storage[2]
    );
  }
  get zzyx() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[0]
    );
  }
  get zzyy() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[1]
    );
  }
  get zzyz() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1],
      this._v3storage[2]
    );
  }
  get zzzx() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[0]
    );
  }
  get zzzy() {
    return new Vector4(
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[2],
      this._v3storage[1]
    );
  }
  get zzzz() {
    return new Vector4(
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

export default Vector3;
