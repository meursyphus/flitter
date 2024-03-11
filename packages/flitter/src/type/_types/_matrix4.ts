/* eslint-disable prefer-const */
import Calculable from "./_calculable";
import type Matrix2 from "./_matrix2";
import Matrix3 from "./_matrix3";
import type Vector2 from "./_vector2";
import Vector3 from "./_vector3";
import Vector4 from "./_vector4";

type Array16 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

class Matrix4 extends Calculable {
  // 4 x 4 matrix
  _m4storage: Array16;
  get storage() {
    return this._m4storage;
  }

  get dimension() {
    return 4;
  }
  plus(other: Matrix4): Matrix4 {
    const cloned = this.clone();
    cloned.add(other);
    return cloned;
  }

  multiply(value: number): Matrix4 {
    const cloned = this.clone();
    cloned._m4storage = cloned._m4storage.map((v) => v * value) as Array16;
    return cloned;
  }

  equals(other: Matrix4): boolean {
    if (this === other) return true;

    return this.storage.every((value, i) => {
      return other._m4storage[i] === value;
    });
  }

  /**
   * @deprecated The method should not be used
   */
  equal(other: Matrix4) {
    this.equals(other);
  }

  static zero(): Matrix4 {
    return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }

  static copy(arg: Matrix4): Matrix4 {
    return new Matrix4(...arg.storage);
  }
  /**
   * Solve [A] * [x] = [b].
   */
  static solve2(A: Matrix4, x: Vector2, b: Vector2): void {
    const a11 = A.entry(0, 0);
    const a12 = A.entry(0, 1);
    const a21 = A.entry(1, 0);
    const a22 = A.entry(1, 1);
    const bx = b.x - A._m4storage[8];
    const by = b.y - A._m4storage[9];
    let det = a11 * a22 - a12 * a21;

    if (det != 0.0) {
      det = 1.0 / det;
    }

    x.x = det * (a22 * bx - a12 * by);
    x.y = det * (a11 * by - a21 * bx);
  }
  /**
   * Solve [A] * [x] = [b].
   */
  static solve3(A: Matrix4, x: Vector3, b: Vector3): void {
    const A0x = A.entry(0, 0);
    const A0y = A.entry(1, 0);
    const A0z = A.entry(2, 0);
    const A1x = A.entry(0, 1);
    const A1y = A.entry(1, 1);
    const A1z = A.entry(2, 1);
    const A2x = A.entry(0, 2);
    const A2y = A.entry(1, 2);
    const A2z = A.entry(2, 2);
    const bx = b.x - A._m4storage[12];
    const by = b.y - A._m4storage[13];
    const bz = b.z - A._m4storage[14];
    let rx, ry, rz;
    let det: number;

    // Column1 cross Column 2
    rx = A1y * A2z - A1z * A2y;
    ry = A1z * A2x - A1x * A2z;
    rz = A1x * A2y - A1y * A2x;

    // A.getColumn(0).dot(x)
    det = A0x * rx + A0y * ry + A0z * rz;
    if (det !== 0.0) {
      det = 1.0 / det;
    }

    // b dot [Column1 cross Column 2]
    const x_ = det * (bx * rx + by * ry + bz * rz);

    // Column2 cross b
    rx = -(A2y * bz - A2z * by);
    ry = -(A2z * bx - A2x * bz);
    rz = -(A2x * by - A2y * bx);
    // Column0 dot -[Column2 cross b (Column3)]
    const y_ = det * (A0x * rx + A0y * ry + A0z * rz);

    // b cross Column 1
    rx = -(by * A1z - bz * A1y);
    ry = -(bz * A1x - bx * A1z);
    rz = -(bx * A1y - by * A1x);
    // Column0 dot -[b cross Column 1]
    const z_ = det * (A0x * rx + A0y * ry + A0z * rz);

    x.x = x_;
    x.y = y_;
    x.z = z_;
  }
  /// Solve [A] * [x] = [b].
  static solve(A: Matrix4, x: Vector4, b: Vector4) {
    const a00 = A._m4storage[0];
    const a01 = A._m4storage[1];
    const a02 = A._m4storage[2];
    const a03 = A._m4storage[3];
    const a10 = A._m4storage[4];
    const a11 = A._m4storage[5];
    const a12 = A._m4storage[6];
    const a13 = A._m4storage[7];
    const a20 = A._m4storage[8];
    const a21 = A._m4storage[9];
    const a22 = A._m4storage[10];
    const a23 = A._m4storage[11];
    const a30 = A._m4storage[12];
    const a31 = A._m4storage[13];
    const a32 = A._m4storage[14];
    const a33 = A._m4storage[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    const bX = b.storage[0];
    const bY = b.storage[1];
    const bZ = b.storage[2];
    const bW = b.storage[3];

    let det =
      b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (det != 0.0) {
      det = 1.0 / det;
    }

    x.x =
      det *
      ((a11 * b11 - a12 * b10 + a13 * b09) * bX -
        (a10 * b11 - a12 * b08 + a13 * b07) * bY +
        (a10 * b10 - a11 * b08 + a13 * b06) * bZ -
        (a10 * b09 - a11 * b07 + a12 * b06) * bW);
    x.y =
      det *
      -(
        (a01 * b11 - a02 * b10 + a03 * b09) * bX -
        (a00 * b11 - a02 * b08 + a03 * b07) * bY +
        (a00 * b10 - a01 * b08 + a03 * b06) * bZ -
        (a00 * b09 - a01 * b07 + a02 * b06) * bW
      );
    x.z =
      det *
      ((a31 * b05 - a32 * b04 + a33 * b03) * bX -
        (a30 * b05 - a32 * b02 + a33 * b01) * bY +
        (a30 * b04 - a31 * b02 + a33 * b00) * bZ -
        (a30 * b03 - a31 * b01 + a32 * b00) * bW);
    x.w =
      det *
      -(
        (a21 * b05 - a22 * b04 + a23 * b03) * bX -
        (a20 * b05 - a22 * b02 + a23 * b01) * bY +
        (a20 * b04 - a21 * b02 + a23 * b00) * bZ -
        (a20 * b03 - a21 * b01 + a22 * b00) * bW
      );
  }
  /// Returns a matrix that is the inverse of [other] if [other] is invertible,
  /// otherwise `null`.
  static tryInvert(other: Matrix4): Matrix4 | null {
    const r = Matrix4.zero();
    const determinant = r.copyInverse(other);
    if (determinant == 0.0) {
      return null;
    }
    return r;
  }

  static identity() {
    const m = Matrix4.zero();
    m.setIdentity();
    return m;
  }

  static translation(translation: Vector3) {
    const m = Matrix4.zero();
    m.setIdentity();
    m.setTranslation(translation);
    return m;
  }

  static translationValues(x: number, y: number, z: number) {
    const m = Matrix4.zero();
    m.setIdentity();
    m.setTranslationRaw(x, y, z);
    return m;
  }

  static diagonal3(scale: Vector3) {
    const m = Matrix4.zero();
    const mStorage = m._m4storage;
    const scaleStorage = scale._v3storage;
    mStorage[15] = 1;
    mStorage[10] = scaleStorage[2];
    mStorage[5] = scaleStorage[1];
    mStorage[0] = scaleStorage[0];
    return m;
  }

  static diagonal3Values(x: number, y: number, z: number) {
    const m = Matrix4.zero();
    m._m4storage[15] = 1;
    m._m4storage[10] = z;
    m._m4storage[5] = y;
    m._m4storage[0] = x;
    return m;
  }

  static skewX(alpha: number) {
    const m = Matrix4.identity();
    m._m4storage[4] = Math.tan(alpha);
    return m;
  }

  static skewY(beta: number) {
    const m = Matrix4.identity();
    m._m4storage[1] = Math.tan(beta);
    return m;
  }

  static skew(alpha: number, beta: number) {
    const m = Matrix4.identity();
    m._m4storage[1] = Math.tan(beta);
    m._m4storage[4] = Math.tan(alpha);
    return m;
  }

  constructor(
    arg0: number,
    arg1: number,
    arg2: number,
    arg3: number,
    arg4: number,
    arg5: number,
    arg6: number,
    arg7: number,
    arg8: number,
    arg9: number,
    arg10: number,
    arg11: number,
    arg12: number,
    arg13: number,
    arg14: number,
    arg15: number
  ) {
    super();
    this._m4storage = [
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5,
      arg6,
      arg7,
      arg8,
      arg9,
      arg10,
      arg11,
      arg12,
      arg13,
      arg14,
      arg15,
    ];
  }
  /**

Return index in storage for [row], [col] value.
*/
  index(row: number, col: number): number {
    return col * 4 + row;
  }
  /**

Value at [row], [col].
*/
  entry(row: number, col: number): number {
    if (row < 0 || row >= this.dimension || col < 0 || col >= this.dimension) {
      throw new RangeError("Invalid row/column indices");
    }
    return this._m4storage[this.index(row, col)];
  }
  /**

Set value at [row], [col] to be [v].
*/
  setEntry(row: number, col: number, v: number): void {
    if (row < 0 || row >= this.dimension || col < 0 || col >= this.dimension) {
      throw new RangeError("Invalid row/column indices");
    }
    this._m4storage[this.index(row, col)] = v;
  }

  /// Sets the diagonal to [arg]
  splatDiagonal(arg: number) {
    this._m4storage[0] = arg;
    this._m4storage[5] = arg;
    this._m4storage[10] = arg;
    this._m4storage[15] = arg;
  }

  setValues(
    arg0: number,
    arg1: number,
    arg2: number,
    arg3: number,
    arg4: number,
    arg5: number,
    arg6: number,
    arg7: number,
    arg8: number,
    arg9: number,
    arg10: number,
    arg11: number,
    arg12: number,
    arg13: number,
    arg14: number,
    arg15: number
  ) {
    this._m4storage[15] = arg15;
    this._m4storage[14] = arg14;
    this._m4storage[13] = arg13;
    this._m4storage[12] = arg12;
    this._m4storage[11] = arg11;
    this._m4storage[10] = arg10;
    this._m4storage[9] = arg9;
    this._m4storage[8] = arg8;
    this._m4storage[7] = arg7;
    this._m4storage[6] = arg6;
    this._m4storage[5] = arg5;
    this._m4storage[4] = arg4;
    this._m4storage[3] = arg3;
    this._m4storage[2] = arg2;
    this._m4storage[1] = arg1;
    this._m4storage[0] = arg0;
  }
  /**
   * Sets the entire matrix to the column values.
   */
  setColumns(arg0: Vector4, arg1: Vector4, arg2: Vector4, arg3: Vector4): void {
    const arg0Storage = arg0._v4storage;
    const arg1Storage = arg1._v4storage;
    const arg2Storage = arg2._v4storage;
    const arg3Storage = arg3._v4storage;
    this._m4storage[0] = arg0Storage[0];
    this._m4storage[1] = arg0Storage[1];
    this._m4storage[2] = arg0Storage[2];
    this._m4storage[3] = arg0Storage[3];
    this._m4storage[4] = arg1Storage[0];
    this._m4storage[5] = arg1Storage[1];
    this._m4storage[6] = arg1Storage[2];
    this._m4storage[7] = arg1Storage[3];
    this._m4storage[8] = arg2Storage[0];
    this._m4storage[9] = arg2Storage[1];
    this._m4storage[10] = arg2Storage[2];
    this._m4storage[11] = arg2Storage[3];
    this._m4storage[12] = arg3Storage[0];
    this._m4storage[13] = arg3Storage[1];
    this._m4storage[14] = arg3Storage[2];
    this._m4storage[15] = arg3Storage[3];
  }
  /**

Sets the entire matrix to the matrix in [arg].
*/
  setFrom(arg: Matrix4): void {
    const argStorage = arg._m4storage;
    this._m4storage[15] = argStorage[15];
    this._m4storage[14] = argStorage[14];
    this._m4storage[13] = argStorage[13];
    this._m4storage[12] = argStorage[12];
    this._m4storage[11] = argStorage[11];
    this._m4storage[10] = argStorage[10];
    this._m4storage[9] = argStorage[9];
    this._m4storage[8] = argStorage[8];
    this._m4storage[7] = argStorage[7];
    this._m4storage[6] = argStorage[6];
    this._m4storage[5] = argStorage[5];
    this._m4storage[4] = argStorage[4];
    this._m4storage[3] = argStorage[3];
    this._m4storage[2] = argStorage[2];
    this._m4storage[1] = argStorage[1];
    this._m4storage[0] = argStorage[0];
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
  public setUpper2x2(arg: Matrix2): void {
    const argStorage = arg._m2storage;
    this._m4storage[0] = argStorage[0];
    this._m4storage[1] = argStorage[1];
    this._m4storage[4] = argStorage[2];
    this._m4storage[5] = argStorage[3];
  }
  /// Sets the diagonal of the matrix to be [arg].
  setDiagonal(arg: Vector4): void {
    const argStorage = arg._v4storage;
    this._m4storage[0] = argStorage[0];
    this._m4storage[5] = argStorage[1];
    this._m4storage[10] = argStorage[2];
    this._m4storage[15] = argStorage[3];
  }
  setOuter(u: Vector4, v: Vector4): void {
    const uStorage = u._v4storage;
    const vStorage = v._v4storage;
    this._m4storage[0] = uStorage[0] * vStorage[0];
    this._m4storage[1] = uStorage[0] * vStorage[1];
    this._m4storage[2] = uStorage[0] * vStorage[2];
    this._m4storage[3] = uStorage[0] * vStorage[3];
    this._m4storage[4] = uStorage[1] * vStorage[0];
    this._m4storage[5] = uStorage[1] * vStorage[1];
    this._m4storage[6] = uStorage[1] * vStorage[2];
    this._m4storage[7] = uStorage[1] * vStorage[3];
    this._m4storage[8] = uStorage[2] * vStorage[0];
    this._m4storage[9] = uStorage[2] * vStorage[1];
    this._m4storage[10] = uStorage[2] * vStorage[2];
    this._m4storage[11] = uStorage[2] * vStorage[3];
    this._m4storage[12] = uStorage[3] * vStorage[0];
    this._m4storage[13] = uStorage[3] * vStorage[1];
    this._m4storage[14] = uStorage[3] * vStorage[2];
    this._m4storage[15] = uStorage[3] * vStorage[3];
  }
  /** Returns row 0 */
  get row0(): Vector4 {
    return this.getRow(0);
  }

  /** Returns row 1 */
  get row1(): Vector4 {
    return this.getRow(1);
  }

  /** Returns row 2 */
  get row2(): Vector4 {
    return this.getRow(2);
  }

  /** Returns row 3 */
  get row3(): Vector4 {
    return this.getRow(3);
  }

  /** Sets row 0 to [arg] */
  set row0(arg: Vector4) {
    this.setRow(0, arg);
  }

  /** Sets row 1 to [arg] */
  set row1(arg: Vector4) {
    this.setRow(1, arg);
  }

  /** Sets row 2 to [arg] */
  set row2(arg: Vector4) {
    this.setRow(2, arg);
  }

  /** Sets row 3 to [arg] */
  set row3(arg: Vector4) {
    this.setRow(3, arg);
  }

  /** Assigns the [row] of the matrix [arg] */
  setRow(row: number, arg: Vector4): void {
    const argStorage = arg._v4storage;
    this._m4storage[this.index(row, 0)] = argStorage[0];
    this._m4storage[this.index(row, 1)] = argStorage[1];
    this._m4storage[this.index(row, 2)] = argStorage[2];
    this._m4storage[this.index(row, 3)] = argStorage[3];
  }

  /** Gets the [row] of the matrix */
  getRow(row: number): Vector4 {
    const r = Vector4.zero();
    const rStorage = r._v4storage;
    rStorage[0] = this._m4storage[this.index(row, 0)];
    rStorage[1] = this._m4storage[this.index(row, 1)];
    rStorage[2] = this._m4storage[this.index(row, 2)];
    rStorage[3] = this._m4storage[this.index(row, 3)];
    return r;
  }
  /**
   * Assigns the [column] of the matrix [arg]
   * @param column the column index
   * @param arg the vector to be assigned
   */
  public setColumn(column: number, arg: Vector4): void {
    const entry = column * 4;
    const argStorage = arg._v4storage;
    this._m4storage[entry + 3] = argStorage[3];
    this._m4storage[entry + 2] = argStorage[2];
    this._m4storage[entry + 1] = argStorage[1];
    this._m4storage[entry + 0] = argStorage[0];
  }

  /**
   * Gets the [column] of the matrix
   * @param column the column index
   * @returns the column as a Vector4
   */
  public getColumn(column: number): Vector4 {
    const r = Vector4.zero();
    const rStorage = r._v4storage;
    const entry = column * 4;
    rStorage[3] = this._m4storage[entry + 3];
    rStorage[2] = this._m4storage[entry + 2];
    rStorage[1] = this._m4storage[entry + 1];
    rStorage[0] = this._m4storage[entry + 0];
    return r;
  }

  /** Clone matrix. */
  public clone(): Matrix4 {
    return Matrix4.copy(this);
  }
  /**
   * Copy into [arg].
   */
  copyInto(arg: Matrix4): Matrix4 {
    const argStorage = arg._m4storage;
    argStorage[0] = this._m4storage[0];
    argStorage[1] = this._m4storage[1];
    argStorage[2] = this._m4storage[2];
    argStorage[3] = this._m4storage[3];
    argStorage[4] = this._m4storage[4];
    argStorage[5] = this._m4storage[5];
    argStorage[6] = this._m4storage[6];
    argStorage[7] = this._m4storage[7];
    argStorage[8] = this._m4storage[8];
    argStorage[9] = this._m4storage[9];
    argStorage[10] = this._m4storage[10];
    argStorage[11] = this._m4storage[11];
    argStorage[12] = this._m4storage[12];
    argStorage[13] = this._m4storage[13];
    argStorage[14] = this._m4storage[14];
    argStorage[15] = this._m4storage[15];
    return arg;
  }

  /**
   * Translate this matrix by a [Vector3], [Vector4], or x,y,z
   * @param x the x coordinate or Vector3/Vector4 to translate by.
   * @param y the y coordinate or undefined if `x` is a Vector3/Vector4.
   * @param z the z coordinate or undefined if `x` is a Vector3/Vector4.
   */
  translate(x: Vector3 | Vector4 | number, y?: number, z?: number) {
    let tx: number, ty: number, tz: number;
    const tw = x instanceof Vector4 ? x.w : 1.0;
    if (x instanceof Vector3) {
      tx = x.x;
      ty = x.y;
      tz = x.z;
    } else if (x instanceof Vector4) {
      tx = x.x;
      ty = x.y;
      tz = x.z;
    } else if (typeof x === "number") {
      tx = x;
      ty = y || 0.0;
      tz = z || 0.0;
    } else {
      throw new Error("Unsupported argument type.");
    }
    const t1 =
      this._m4storage[0] * tx +
      this._m4storage[4] * ty +
      this._m4storage[8] * tz +
      this._m4storage[12] * tw;
    const t2 =
      this._m4storage[1] * tx +
      this._m4storage[5] * ty +
      this._m4storage[9] * tz +
      this._m4storage[13] * tw;
    const t3 =
      this._m4storage[2] * tx +
      this._m4storage[6] * ty +
      this._m4storage[10] * tz +
      this._m4storage[14] * tw;
    const t4 =
      this._m4storage[3] * tx +
      this._m4storage[7] * ty +
      this._m4storage[11] * tz +
      this._m4storage[15] * tw;
    this._m4storage[12] = t1;
    this._m4storage[13] = t2;
    this._m4storage[14] = t3;
    this._m4storage[15] = t4;

    return this;
  }

  translated(x: Vector3 | Vector4 | number, y?: number, z?: number) {
    return this.clone().translate(x, y, z);
  }
  /**
   * Multiplies this matrix by a translation from the left.
   * The translation can be specified with a [Vector3], [Vector4], or x, y, z.
   */
  leftTranslate(x: Vector3 | Vector4 | number, y = 0.0, z = 0.0) {
    let tx, ty, tz;
    const tw = x instanceof Vector4 ? x.w : 1.0;

    if (x instanceof Vector3) {
      tx = x.x;
      ty = x.y;
      tz = x.z;
    } else if (x instanceof Vector4) {
      tx = x.x;
      ty = x.y;
      tz = x.z;
    } else if (typeof x === "number") {
      tx = x;
      ty = y;
      tz = z;
    } else {
      throw new Error("Invalid argument type");
    }

    // Column 1
    this._m4storage[0] += tx * this._m4storage[3];
    this._m4storage[1] += ty * this._m4storage[3];
    this._m4storage[2] += tz * this._m4storage[3];
    this._m4storage[3] = tw * this._m4storage[3];

    // Column 2
    this._m4storage[4] += tx * this._m4storage[7];
    this._m4storage[5] += ty * this._m4storage[7];
    this._m4storage[6] += tz * this._m4storage[7];
    this._m4storage[7] = tw * this._m4storage[7];

    // Column 3
    this._m4storage[8] += tx * this._m4storage[11];
    this._m4storage[9] += ty * this._m4storage[11];
    this._m4storage[10] += tz * this._m4storage[11];
    this._m4storage[11] = tw * this._m4storage[11];

    // Column 4
    this._m4storage[12] += tx * this._m4storage[15];
    this._m4storage[13] += ty * this._m4storage[15];
    this._m4storage[14] += tz * this._m4storage[15];
    this._m4storage[15] = tw * this._m4storage[15];

    return this;
  }
  /**

Rotate this matrix [angle] radians around [axis].
*/
  rotate(axis: Vector3, angle: number) {
    const len = axis.length;
    const axisStorage = axis._v3storage;
    const x = axisStorage[0] / len;
    const y = axisStorage[1] / len;
    const z = axisStorage[2] / len;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const C = 1.0 - c;
    const m11 = x * x * C + c;
    const m12 = x * y * C - z * s;
    const m13 = x * z * C + y * s;
    const m21 = y * x * C + z * s;
    const m22 = y * y * C + c;
    const m23 = y * z * C - x * s;
    const m31 = z * x * C - y * s;
    const m32 = z * y * C + x * s;
    const m33 = z * z * C + c;
    const t1 =
      this._m4storage[0] * m11 +
      this._m4storage[4] * m21 +
      this._m4storage[8] * m31;
    const t2 =
      this._m4storage[1] * m11 +
      this._m4storage[5] * m21 +
      this._m4storage[9] * m31;
    const t3 =
      this._m4storage[2] * m11 +
      this._m4storage[6] * m21 +
      this._m4storage[10] * m31;
    const t4 =
      this._m4storage[3] * m11 +
      this._m4storage[7] * m21 +
      this._m4storage[11] * m31;
    const t5 =
      this._m4storage[0] * m12 +
      this._m4storage[4] * m22 +
      this._m4storage[8] * m32;
    const t6 =
      this._m4storage[1] * m12 +
      this._m4storage[5] * m22 +
      this._m4storage[9] * m32;
    const t7 =
      this._m4storage[2] * m12 +
      this._m4storage[6] * m22 +
      this._m4storage[10] * m32;
    const t8 =
      this._m4storage[3] * m12 +
      this._m4storage[7] * m22 +
      this._m4storage[11] * m32;
    const t9 =
      this._m4storage[0] * m13 +
      this._m4storage[4] * m23 +
      this._m4storage[8] * m33;
    const t10 =
      this._m4storage[1] * m13 +
      this._m4storage[5] * m23 +
      this._m4storage[9] * m33;
    const t11 =
      this._m4storage[2] * m13 +
      this._m4storage[6] * m23 +
      this._m4storage[10] * m33;
    const t12 =
      this._m4storage[3] * m13 +
      this._m4storage[7] * m23 +
      this._m4storage[11] * m33;

    this._m4storage[0] = t1;
    this._m4storage[1] = t2;
    this._m4storage[2] = t3;
    this._m4storage[3] = t4;
    this._m4storage[4] = t5;
    this._m4storage[5] = t6;
    this._m4storage[6] = t7;
    this._m4storage[7] = t8;
    this._m4storage[8] = t9;
    this._m4storage[9] = t10;
    this._m4storage[10] = t11;
    this._m4storage[11] = t12;

    return this;
  }
  /// Rotate this [angle] radians around X
  rotateX(angle: number) {
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const t1 = this._m4storage[4] * cosAngle + this._m4storage[8] * sinAngle;
    const t2 = this._m4storage[5] * cosAngle + this._m4storage[9] * sinAngle;
    const t3 = this._m4storage[6] * cosAngle + this._m4storage[10] * sinAngle;
    const t4 = this._m4storage[7] * cosAngle + this._m4storage[11] * sinAngle;
    const t5 = this._m4storage[4] * -sinAngle + this._m4storage[8] * cosAngle;
    const t6 = this._m4storage[5] * -sinAngle + this._m4storage[9] * cosAngle;
    const t7 = this._m4storage[6] * -sinAngle + this._m4storage[10] * cosAngle;
    const t8 = this._m4storage[7] * -sinAngle + this._m4storage[11] * cosAngle;
    this._m4storage[4] = t1;
    this._m4storage[5] = t2;
    this._m4storage[6] = t3;
    this._m4storage[7] = t4;
    this._m4storage[8] = t5;
    this._m4storage[9] = t6;
    this._m4storage[10] = t7;
    this._m4storage[11] = t8;

    return this;
  }
  /**
   * Rotate this matrix [angle] radians around Y
   */
  rotateY(angle: number) {
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const t1 = this._m4storage[0] * cosAngle + this._m4storage[8] * -sinAngle;
    const t2 = this._m4storage[1] * cosAngle + this._m4storage[9] * -sinAngle;
    const t3 = this._m4storage[2] * cosAngle + this._m4storage[10] * -sinAngle;
    const t4 = this._m4storage[3] * cosAngle + this._m4storage[11] * -sinAngle;
    const t5 = this._m4storage[0] * sinAngle + this._m4storage[8] * cosAngle;
    const t6 = this._m4storage[1] * sinAngle + this._m4storage[9] * cosAngle;
    const t7 = this._m4storage[2] * sinAngle + this._m4storage[10] * cosAngle;
    const t8 = this._m4storage[3] * sinAngle + this._m4storage[11] * cosAngle;
    this._m4storage[0] = t1;
    this._m4storage[1] = t2;
    this._m4storage[2] = t3;
    this._m4storage[3] = t4;
    this._m4storage[8] = t5;
    this._m4storage[9] = t6;
    this._m4storage[10] = t7;
    this._m4storage[11] = t8;

    return this;
  }

  /**
   * Rotate this matrix [angle] radians around Z
   */
  rotateZ(angle: number) {
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const t1 = this._m4storage[0] * cosAngle + this._m4storage[4] * sinAngle;
    const t2 = this._m4storage[1] * cosAngle + this._m4storage[5] * sinAngle;
    const t3 = this._m4storage[2] * cosAngle + this._m4storage[6] * sinAngle;
    const t4 = this._m4storage[3] * cosAngle + this._m4storage[7] * sinAngle;
    const t5 = this._m4storage[0] * -sinAngle + this._m4storage[4] * cosAngle;
    const t6 = this._m4storage[1] * -sinAngle + this._m4storage[5] * cosAngle;
    const t7 = this._m4storage[2] * -sinAngle + this._m4storage[6] * cosAngle;
    const t8 = this._m4storage[3] * -sinAngle + this._m4storage[7] * cosAngle;
    this._m4storage[0] = t1;
    this._m4storage[1] = t2;
    this._m4storage[2] = t3;
    this._m4storage[3] = t4;
    this._m4storage[4] = t5;
    this._m4storage[5] = t6;
    this._m4storage[6] = t7;
    this._m4storage[7] = t8;

    return this;
  }
  /**
   * Scale this matrix by a Vector3, Vector4, or x,y,z
   */
  public scale(x: Vector3 | Vector4 | number, y?: number, z?: number) {
    let sx: number;
    let sy: number;
    let sz: number;
    const sw = x instanceof Vector4 ? x.w : 1.0;
    if (x instanceof Vector3) {
      sx = x.x;
      sy = x.y;
      sz = x.z;
    } else if (x instanceof Vector4) {
      sx = x.x;
      sy = x.y;
      sz = x.z;
    } else if (typeof x === "number") {
      sx = x;
      sy = y ?? x;
      sz = z ?? x;
    } else {
      throw new Error("Unsupported type for scale operation");
    }
    this._m4storage[0] *= sx;
    this._m4storage[1] *= sx;
    this._m4storage[2] *= sx;
    this._m4storage[3] *= sx;
    this._m4storage[4] *= sy;
    this._m4storage[5] *= sy;
    this._m4storage[6] *= sy;
    this._m4storage[7] *= sy;
    this._m4storage[8] *= sz;
    this._m4storage[9] *= sz;
    this._m4storage[10] *= sz;
    this._m4storage[11] *= sz;
    this._m4storage[12] *= sw;
    this._m4storage[13] *= sw;
    this._m4storage[14] *= sw;
    this._m4storage[15] *= sw;

    return this;
  }
  /**
   * Create a copy of this scaled by a [Vector3], [Vector4] or [x],[y], and [z].
   */
  public scaled(
    x: Vector3 | Vector4 | number,
    y?: number,
    z?: number
  ): Matrix4 {
    const result = this.clone();
    result.scale(x, y, z);
    return result;
  }
  /// Zeros this.
  setZero() {
    this._m4storage[0] = 0.0;
    this._m4storage[1] = 0.0;
    this._m4storage[2] = 0.0;
    this._m4storage[3] = 0.0;
    this._m4storage[4] = 0.0;
    this._m4storage[5] = 0.0;
    this._m4storage[6] = 0.0;
    this._m4storage[7] = 0.0;
    this._m4storage[8] = 0.0;
    this._m4storage[9] = 0.0;
    this._m4storage[10] = 0.0;
    this._m4storage[11] = 0.0;
    this._m4storage[12] = 0.0;
    this._m4storage[13] = 0.0;
    this._m4storage[14] = 0.0;
    this._m4storage[15] = 0.0;
  }

  /// Makes this into the identity matrix.
  setIdentity() {
    this._m4storage[0] = 1.0;
    this._m4storage[1] = 0.0;
    this._m4storage[2] = 0.0;
    this._m4storage[3] = 0.0;
    this._m4storage[4] = 0.0;
    this._m4storage[5] = 1.0;
    this._m4storage[6] = 0.0;
    this._m4storage[7] = 0.0;
    this._m4storage[8] = 0.0;
    this._m4storage[9] = 0.0;
    this._m4storage[10] = 1.0;
    this._m4storage[11] = 0.0;
    this._m4storage[12] = 0.0;
    this._m4storage[13] = 0.0;
    this._m4storage[14] = 0.0;
    this._m4storage[15] = 1.0;
  }
  /// Returns the transpose of this.
  transposed(): Matrix4 {
    const result = this.clone();
    result.transpose();
    return result;
  }

  transpose(): void {
    let temp: number;
    temp = this._m4storage[4];
    this._m4storage[4] = this._m4storage[1];
    this._m4storage[1] = temp;
    temp = this._m4storage[8];
    this._m4storage[8] = this._m4storage[2];
    this._m4storage[2] = temp;
    temp = this._m4storage[12];
    this._m4storage[12] = this._m4storage[3];
    this._m4storage[3] = temp;
    temp = this._m4storage[9];
    this._m4storage[9] = this._m4storage[6];
    this._m4storage[6] = temp;
    temp = this._m4storage[13];
    this._m4storage[13] = this._m4storage[7];
    this._m4storage[7] = temp;
    temp = this._m4storage[14];
    this._m4storage[14] = this._m4storage[11];
    this._m4storage[11] = temp;
  }

  /**
   * Returns the component wise absolute value of this.
   */
  public absolute(): Matrix4 {
    const r = Matrix4.zero();
    const rStorage = r._m4storage;
    rStorage[0] = Math.abs(this._m4storage[0]);
    rStorage[1] = Math.abs(this._m4storage[1]);
    rStorage[2] = Math.abs(this._m4storage[2]);
    rStorage[3] = Math.abs(this._m4storage[3]);
    rStorage[4] = Math.abs(this._m4storage[4]);
    rStorage[5] = Math.abs(this._m4storage[5]);
    rStorage[6] = Math.abs(this._m4storage[6]);
    rStorage[7] = Math.abs(this._m4storage[7]);
    rStorage[8] = Math.abs(this._m4storage[8]);
    rStorage[9] = Math.abs(this._m4storage[9]);
    rStorage[10] = Math.abs(this._m4storage[10]);
    rStorage[11] = Math.abs(this._m4storage[11]);
    rStorage[12] = Math.abs(this._m4storage[12]);
    rStorage[13] = Math.abs(this._m4storage[13]);
    rStorage[14] = Math.abs(this._m4storage[14]);
    rStorage[15] = Math.abs(this._m4storage[15]);
    return r;
  }
  determinant(): number {
    const det2_01_01 =
      this._m4storage[0] * this._m4storage[5] -
      this._m4storage[1] * this._m4storage[4];
    const det2_01_02 =
      this._m4storage[0] * this._m4storage[6] -
      this._m4storage[2] * this._m4storage[4];
    const det2_01_03 =
      this._m4storage[0] * this._m4storage[7] -
      this._m4storage[3] * this._m4storage[4];
    const det2_01_12 =
      this._m4storage[1] * this._m4storage[6] -
      this._m4storage[2] * this._m4storage[5];
    const det2_01_13 =
      this._m4storage[1] * this._m4storage[7] -
      this._m4storage[3] * this._m4storage[5];
    const det2_01_23 =
      this._m4storage[2] * this._m4storage[7] -
      this._m4storage[3] * this._m4storage[6];
    const det3_201_012 =
      this._m4storage[8] * det2_01_12 -
      this._m4storage[9] * det2_01_02 +
      this._m4storage[10] * det2_01_01;
    const det3_201_013 =
      this._m4storage[8] * det2_01_13 -
      this._m4storage[9] * det2_01_03 +
      this._m4storage[11] * det2_01_01;
    const det3_201_023 =
      this._m4storage[8] * det2_01_23 -
      this._m4storage[10] * det2_01_03 +
      this._m4storage[11] * det2_01_02;
    const det3_201_123 =
      this._m4storage[9] * det2_01_23 -
      this._m4storage[10] * det2_01_13 +
      this._m4storage[11] * det2_01_12;
    return (
      -det3_201_123 * this._m4storage[12] +
      det3_201_023 * this._m4storage[13] -
      det3_201_013 * this._m4storage[14] +
      det3_201_012 * this._m4storage[15]
    );
  }
  /** Returns the dot product of row [i] and [v]. */
  dotRow(i: number, v: Vector4): number {
    const vStorage = v._v4storage;
    return (
      this._m4storage[i] * vStorage[0] +
      this._m4storage[4 + i] * vStorage[1] +
      this._m4storage[8 + i] * vStorage[2] +
      this._m4storage[12 + i] * vStorage[3]
    );
  }

  /** Returns the dot product of column [j] and [v]. */
  dotColumn(j: number, v: Vector4): number {
    const vStorage = v._v4storage;
    return (
      this._m4storage[j * 4] * vStorage[0] +
      this._m4storage[j * 4 + 1] * vStorage[1] +
      this._m4storage[j * 4 + 2] * vStorage[2] +
      this._m4storage[j * 4 + 3] * vStorage[3]
    );
  }

  /** Returns the trace of the matrix. The trace of a matrix is the sum of the diagonal entries. */
  trace(): number {
    let t = 0.0;
    t += this._m4storage[0];
    t += this._m4storage[5];
    t += this._m4storage[10];
    t += this._m4storage[15];
    return t;
  }
  /**
   * Returns infinity norm of the matrix. Used for numerical analysis.
   */
  infinityNorm(): number {
    let norm = 0.0;
    {
      let row_norm = 0.0;
      row_norm += Math.abs(this._m4storage[0]);
      row_norm += Math.abs(this._m4storage[1]);
      row_norm += Math.abs(this._m4storage[2]);
      row_norm += Math.abs(this._m4storage[3]);
      norm = row_norm > norm ? row_norm : norm;
    }
    {
      let row_norm = 0.0;
      row_norm += Math.abs(this._m4storage[4]);
      row_norm += Math.abs(this._m4storage[5]);
      row_norm += Math.abs(this._m4storage[6]);
      row_norm += Math.abs(this._m4storage[7]);
      norm = row_norm > norm ? row_norm : norm;
    }
    {
      let row_norm = 0.0;
      row_norm += Math.abs(this._m4storage[8]);
      row_norm += Math.abs(this._m4storage[9]);
      row_norm += Math.abs(this._m4storage[10]);
      row_norm += Math.abs(this._m4storage[11]);
      norm = row_norm > norm ? row_norm : norm;
    }
    {
      let row_norm = 0.0;
      row_norm += Math.abs(this._m4storage[12]);
      row_norm += Math.abs(this._m4storage[13]);
      row_norm += Math.abs(this._m4storage[14]);
      row_norm += Math.abs(this._m4storage[15]);
      norm = row_norm > norm ? row_norm : norm;
    }
    return norm;
  }
  /// Returns relative error between this and [correct]
  relativeError(correct: Matrix4): number {
    correct.sub(this);
    const diff = correct;
    const correct_norm = correct.infinityNorm();
    const diff_norm = diff.infinityNorm();
    return diff_norm / correct_norm;
  }
  /**
   * Returns absolute error between this and [correct]
   */
  public absoluteError(correct: Matrix4): number {
    const thisNorm = this.infinityNorm();
    const correctNorm = correct.infinityNorm();
    const diffNorm = Math.abs(thisNorm - correctNorm);
    return diffNorm;
  }
  getTranslation(): Vector3 {
    const z = this._m4storage[14];
    const y = this._m4storage[13];
    const x = this._m4storage[12];
    return new Vector3(x, y, z);
  }
  /// Sets the translation vector in this homogeneous transformation matrix.
  setTranslation(t: Vector3): void {
    const tStorage = t._v3storage;
    const z = tStorage[2];
    const y = tStorage[1];
    const x = tStorage[0];
    this._m4storage[14] = z;
    this._m4storage[13] = y;
    this._m4storage[12] = x;
  }
  /**
   * Sets the translation vector in this homogeneous transformation matrix.
   */
  setTranslationRaw(x: number, y: number, z: number): void {
    this._m4storage[14] = z;
    this._m4storage[13] = y;
    this._m4storage[12] = x;
  }
  /// Returns the rotation matrix from this homogeneous transformation matrix.
  getRotation(): Matrix3 {
    const r = Matrix3.zero();
    this.copyRotation(r);
    return r;
  }
  copyRotation(rotation: Matrix3) {
    const rStorage = rotation._m3storage;
    rStorage[0] = this._m4storage[0];
    rStorage[1] = this._m4storage[1];
    rStorage[2] = this._m4storage[2];
    rStorage[3] = this._m4storage[4];
    rStorage[4] = this._m4storage[5];
    rStorage[5] = this._m4storage[6];
    rStorage[6] = this._m4storage[8];
    rStorage[7] = this._m4storage[9];
    rStorage[8] = this._m4storage[10];
  }
  /// Sets the rotation matrix in this homogeneous transformation matrix.
  setRotation(r: Matrix3) {
    const rStorage = r._m3storage;
    this._m4storage[0] = rStorage[0];
    this._m4storage[1] = rStorage[1];
    this._m4storage[2] = rStorage[2];
    this._m4storage[4] = rStorage[3];
    this._m4storage[5] = rStorage[4];
    this._m4storage[6] = rStorage[5];
    this._m4storage[8] = rStorage[6];
    this._m4storage[9] = rStorage[7];
    this._m4storage[10] = rStorage[8];
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
    const scaleXSq =
      this._m4storage[0] * this._m4storage[0] +
      this._m4storage[1] * this._m4storage[1] +
      this._m4storage[2] * this._m4storage[2];
    const scaleYSq =
      this._m4storage[4] * this._m4storage[4] +
      this._m4storage[5] * this._m4storage[5] +
      this._m4storage[6] * this._m4storage[6];
    const scaleZSq =
      this._m4storage[8] * this._m4storage[8] +
      this._m4storage[9] * this._m4storage[9] +
      this._m4storage[10] * this._m4storage[10];
    return Math.sqrt(Math.max(scaleXSq, Math.max(scaleYSq, scaleZSq)));
  }
  /// Transposes just the upper 3x3 rotation matrix.
  transposeRotation() {
    let temp: number;
    temp = this._m4storage[1];
    this._m4storage[1] = this._m4storage[4];
    this._m4storage[4] = temp;
    temp = this._m4storage[2];
    this._m4storage[2] = this._m4storage[8];
    this._m4storage[8] = temp;
    temp = this._m4storage[4];
    this._m4storage[4] = this._m4storage[1];
    this._m4storage[1] = temp;
    temp = this._m4storage[6];
    this._m4storage[6] = this._m4storage[9];
    this._m4storage[9] = temp;
    temp = this._m4storage[8];
    this._m4storage[8] = this._m4storage[2];
    this._m4storage[2] = temp;
    temp = this._m4storage[9];
    this._m4storage[9] = this._m4storage[6];
    this._m4storage[6] = temp;
  }
  /// Invert this.
  invert() {
    return this.copyInverse(this);
  }

  // Set this matrix to be the inverse of [arg]
  copyInverse(arg: Matrix4): number {
    const argStorage = arg._m4storage;
    const a00 = argStorage[0];
    const a01 = argStorage[1];
    const a02 = argStorage[2];
    const a03 = argStorage[3];
    const a10 = argStorage[4];
    const a11 = argStorage[5];
    const a12 = argStorage[6];
    const a13 = argStorage[7];
    const a20 = argStorage[8];
    const a21 = argStorage[9];
    const a22 = argStorage[10];
    const a23 = argStorage[11];
    const a30 = argStorage[12];
    const a31 = argStorage[13];
    const a32 = argStorage[14];
    const a33 = argStorage[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    const det =
      b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (det == 0.0) {
      this.setFrom(arg);
      return 0.0;
    }
    const invDet = 1.0 / det;
    this._m4storage[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    this._m4storage[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    this._m4storage[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    this._m4storage[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
    this._m4storage[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    this._m4storage[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    this._m4storage[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    this._m4storage[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
    this._m4storage[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    this._m4storage[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    this._m4storage[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    this._m4storage[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
    this._m4storage[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    this._m4storage[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    this._m4storage[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    this._m4storage[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
    return det;
  }
  invertRotation(): number {
    const det = this.determinant();
    if (det == 0.0) {
      return 0.0;
    }
    const invDet = 1.0 / det;
    let ix: number;
    let iy: number;
    let iz: number;
    let jx: number;
    let jy: number;
    let jz: number;
    let kx: number;
    let ky: number;
    let kz: number;
    ix =
      invDet *
      (this._m4storage[5] * this._m4storage[10] -
        this._m4storage[6] * this._m4storage[9]);
    iy =
      invDet *
      (this._m4storage[2] * this._m4storage[9] -
        this._m4storage[1] * this._m4storage[10]);
    iz =
      invDet *
      (this._m4storage[1] * this._m4storage[6] -
        this._m4storage[2] * this._m4storage[5]);
    jx =
      invDet *
      (this._m4storage[6] * this._m4storage[8] -
        this._m4storage[4] * this._m4storage[10]);
    jy =
      invDet *
      (this._m4storage[0] * this._m4storage[10] -
        this._m4storage[2] * this._m4storage[8]);
    jz =
      invDet *
      (this._m4storage[2] * this._m4storage[4] -
        this._m4storage[0] * this._m4storage[6]);
    kx =
      invDet *
      (this._m4storage[4] * this._m4storage[9] -
        this._m4storage[5] * this._m4storage[8]);
    ky =
      invDet *
      (this._m4storage[1] * this._m4storage[8] -
        this._m4storage[0] * this._m4storage[9]);
    kz =
      invDet *
      (this._m4storage[0] * this._m4storage[5] -
        this._m4storage[1] * this._m4storage[4]);
    this._m4storage[0] = ix;
    this._m4storage[1] = iy;
    this._m4storage[2] = iz;
    this._m4storage[4] = jx;
    this._m4storage[5] = jy;
    this._m4storage[6] = jz;
    this._m4storage[8] = kx;
    this._m4storage[9] = ky;
    this._m4storage[10] = kz;
    return det;
  }

  /// Sets the upper 3x3 to a rotation of [radians] around X
  setRotationX(radians: number) {
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    this._m4storage[0] = 1.0;
    this._m4storage[1] = 0.0;
    this._m4storage[2] = 0.0;
    this._m4storage[4] = 0.0;
    this._m4storage[5] = c;
    this._m4storage[6] = s;
    this._m4storage[8] = 0.0;
    this._m4storage[9] = -s;
    this._m4storage[10] = c;
    this._m4storage[3] = 0.0;
    this._m4storage[7] = 0.0;
    this._m4storage[11] = 0.0;
  }

  /// Sets the upper 3x3 to a rotation of [radians] around Y
  setRotationY(radians: number) {
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    this._m4storage[0] = c;
    this._m4storage[1] = 0.0;
    this._m4storage[2] = -s;
    this._m4storage[4] = 0.0;
    this._m4storage[5] = 1.0;
    this._m4storage[6] = 0.0;
    this._m4storage[8] = s;
    this._m4storage[9] = 0.0;
    this._m4storage[10] = c;
    this._m4storage[3] = 0.0;
    this._m4storage[7] = 0.0;
    this._m4storage[11] = 0.0;
  }

  /// Sets the upper 3x3 to a rotation of [radians] around Z
  setRotationZ(radians: number) {
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    this._m4storage[0] = c;
    this._m4storage[1] = s;
    this._m4storage[2] = 0.0;
    this._m4storage[4] = -s;
    this._m4storage[5] = c;
    this._m4storage[6] = 0.0;
    this._m4storage[8] = 0.0;
    this._m4storage[9] = 0.0;
    this._m4storage[10] = 1.0;
    this._m4storage[3] = 0.0;
    this._m4storage[7] = 0.0;
    this._m4storage[11] = 0.0;
  }
  /// Converts into Adjugate matrix and scales by [scale]
  scaleAdjoint(scale: number) {
    // Adapted from code by Richard Carling.
    const a1 = this._m4storage[0];
    const b1 = this._m4storage[4];
    const c1 = this._m4storage[8];
    const d1 = this._m4storage[12];
    const a2 = this._m4storage[1];
    const b2 = this._m4storage[5];
    const c2 = this._m4storage[9];
    const d2 = this._m4storage[13];
    const a3 = this._m4storage[2];
    const b3 = this._m4storage[6];
    const c3 = this._m4storage[10];
    const d3 = this._m4storage[14];
    const a4 = this._m4storage[3];
    const b4 = this._m4storage[7];
    const c4 = this._m4storage[11];
    const d4 = this._m4storage[15];
    this._m4storage[0] =
      (b2 * (c3 * d4 - c4 * d3) -
        c2 * (b3 * d4 - b4 * d3) +
        d2 * (b3 * c4 - b4 * c3)) *
      scale;
    this._m4storage[1] =
      -(
        a2 * (c3 * d4 - c4 * d3) -
        c2 * (a3 * d4 - a4 * d3) +
        d2 * (a3 * c4 - a4 * c3)
      ) * scale;
    this._m4storage[2] =
      (a2 * (b3 * d4 - b4 * d3) -
        b2 * (a3 * d4 - a4 * d3) +
        d2 * (a3 * b4 - a4 * b3)) *
      scale;
    this._m4storage[3] =
      -(
        a2 * (b3 * c4 - b4 * c3) -
        b2 * (a3 * c4 - a4 * c3) +
        c2 * (a3 * b4 - a4 * b3)
      ) * scale;
    this._m4storage[4] =
      -(
        b1 * (c3 * d4 - c4 * d3) -
        c1 * (b3 * d4 - b4 * d3) +
        d1 * (b3 * c4 - b4 * c3)
      ) * scale;
    this._m4storage[5] =
      (a1 * (c3 * d4 - c4 * d3) -
        c1 * (a3 * d4 - a4 * d3) +
        d1 * (a3 * c4 - a4 * c3)) *
      scale;
    this._m4storage[6] =
      -(
        a1 * (b3 * d4 - b4 * d3) -
        b1 * (a3 * d4 - a4 * d3) +
        d1 * (a3 * b4 - a4 * b3)
      ) * scale;
    this._m4storage[7] =
      (a1 * (b3 * c4 - b4 * c3) -
        b1 * (a3 * c4 - a4 * c3) +
        c1 * (a3 * b4 - a4 * b3)) *
      scale;
    this._m4storage[8] =
      (b1 * (c2 * d4 - c4 * d2) -
        c1 * (b2 * d4 - b4 * d2) +
        d1 * (b2 * c4 - b4 * c2)) *
      scale;
    this._m4storage[9] =
      -(
        a1 * (c2 * d4 - c4 * d2) -
        c1 * (a2 * d4 - a4 * d2) +
        d1 * (a2 * c4 - a4 * c2)
      ) * scale;
    this._m4storage[10] =
      (a1 * (b2 * d4 - b4 * d2) -
        b1 * (a2 * d4 - a4 * d2) +
        d1 * (a2 * b4 - a4 * b2)) *
      scale;
    this._m4storage[11] =
      -(
        a1 * (b2 * c4 - b4 * c2) -
        b1 * (a2 * c4 - a4 * c2) +
        c1 * (a2 * b4 - a4 * b2)
      ) * scale;
    this._m4storage[12] =
      -(
        b1 * (c2 * d3 - c3 * d2) -
        c1 * (b2 * d3 - b3 * d2) +
        d1 * (b2 * c3 - b3 * c2)
      ) * scale;
    this._m4storage[13] =
      (a1 * (c2 * d3 - c3 * d2) -
        c1 * (a2 * d3 - a3 * d2) +
        d1 * (a2 * c3 - a3 * c2)) *
      scale;
    this._m4storage[14] =
      -(
        a1 * (b2 * d3 - b3 * d2) -
        b1 * (a2 * d3 - a3 * d2) +
        d1 * (a2 * b3 - a3 * b2)
      ) * scale;
    this._m4storage[15] =
      (a1 * (b2 * c3 - b3 * c2) -
        b1 * (a2 * c3 - a3 * c2) +
        c1 * (a2 * b3 - a3 * b2)) *
      scale;
  }
  /// Rotates [arg] by the absolute rotation of this
  /// Returns [arg].
  /// Primarily used by AABB transformation code.
  absoluteRotate(arg: Vector3): Vector3 {
    const m00 = Math.abs(this._m4storage[0]);
    const m01 = Math.abs(this._m4storage[4]);
    const m02 = Math.abs(this._m4storage[8]);
    const m10 = Math.abs(this._m4storage[1]);
    const m11 = Math.abs(this._m4storage[5]);
    const m12 = Math.abs(this._m4storage[9]);
    const m20 = Math.abs(this._m4storage[2]);
    const m21 = Math.abs(this._m4storage[6]);
    const m22 = Math.abs(this._m4storage[10]);
    const argStorage = arg._v3storage;
    const x = argStorage[0];
    const y = argStorage[1];
    const z = argStorage[2];
    argStorage[0] = x * m00 + y * m01 + z * m02 + 0.0 * 0.0;
    argStorage[1] = x * m10 + y * m11 + z * m12 + 0.0 * 0.0;
    argStorage[2] = x * m20 + y * m21 + z * m22 + 0.0 * 0.0;
    return arg;
  }

  /// Adds [o] to this.
  add(o: Matrix4) {
    const oStorage = o._m4storage;
    this._m4storage[0] = this._m4storage[0] + oStorage[0];
    this._m4storage[1] = this._m4storage[1] + oStorage[1];
    this._m4storage[2] = this._m4storage[2] + oStorage[2];
    this._m4storage[3] = this._m4storage[3] + oStorage[3];
    this._m4storage[4] = this._m4storage[4] + oStorage[4];
    this._m4storage[5] = this._m4storage[5] + oStorage[5];
    this._m4storage[6] = this._m4storage[6] + oStorage[6];
    this._m4storage[7] = this._m4storage[7] + oStorage[7];
    this._m4storage[8] = this._m4storage[8] + oStorage[8];
    this._m4storage[9] = this._m4storage[9] + oStorage[9];
    this._m4storage[10] = this._m4storage[10] + oStorage[10];
    this._m4storage[11] = this._m4storage[11] + oStorage[11];
    this._m4storage[12] = this._m4storage[12] + oStorage[12];
    this._m4storage[13] = this._m4storage[13] + oStorage[13];
    this._m4storage[14] = this._m4storage[14] + oStorage[14];
    this._m4storage[15] = this._m4storage[15] + oStorage[15];
  }

  /// Subtracts [o] from this.
  sub(o: Matrix4) {
    const oStorage = o._m4storage;
    this._m4storage[0] = this._m4storage[0] - oStorage[0];
    this._m4storage[1] = this._m4storage[1] - oStorage[1];
    this._m4storage[2] = this._m4storage[2] - oStorage[2];
    this._m4storage[3] = this._m4storage[3] - oStorage[3];
    this._m4storage[4] = this._m4storage[4] - oStorage[4];
    this._m4storage[5] = this._m4storage[5] - oStorage[5];
    this._m4storage[6] = this._m4storage[6] - oStorage[6];
    this._m4storage[7] = this._m4storage[7] - oStorage[7];
    this._m4storage[8] = this._m4storage[8] - oStorage[8];
    this._m4storage[9] = this._m4storage[9] - oStorage[9];
    this._m4storage[10] = this._m4storage[10] - oStorage[10];
    this._m4storage[11] = this._m4storage[11] - oStorage[11];
    this._m4storage[12] = this._m4storage[12] - oStorage[12];
    this._m4storage[13] = this._m4storage[13] - oStorage[13];
    this._m4storage[14] = this._m4storage[14] - oStorage[14];
    this._m4storage[15] = this._m4storage[15] - oStorage[15];
  }

  /// Negate this.
  negate() {
    this._m4storage[0] = -this._m4storage[0];
    this._m4storage[1] = -this._m4storage[1];
    this._m4storage[2] = -this._m4storage[2];
    this._m4storage[3] = -this._m4storage[3];
    this._m4storage[4] = -this._m4storage[4];
    this._m4storage[5] = -this._m4storage[5];
    this._m4storage[6] = -this._m4storage[6];
    this._m4storage[7] = -this._m4storage[7];
    this._m4storage[8] = -this._m4storage[8];
    this._m4storage[9] = -this._m4storage[9];
    this._m4storage[10] = -this._m4storage[10];
    this._m4storage[11] = -this._m4storage[11];
    this._m4storage[12] = -this._m4storage[12];
    this._m4storage[13] = -this._m4storage[13];
    this._m4storage[14] = -this._m4storage[14];
    this._m4storage[15] = -this._m4storage[15];
  }

  /// Multiply this by [arg].
  multiplyMatrix(arg: Matrix4) {
    const m00 = this._m4storage[0];
    const m01 = this._m4storage[4];
    const m02 = this._m4storage[8];
    const m03 = this._m4storage[12];
    const m10 = this._m4storage[1];
    const m11 = this._m4storage[5];
    const m12 = this._m4storage[9];
    const m13 = this._m4storage[13];
    const m20 = this._m4storage[2];
    const m21 = this._m4storage[6];
    const m22 = this._m4storage[10];
    const m23 = this._m4storage[14];
    const m30 = this._m4storage[3];
    const m31 = this._m4storage[7];
    const m32 = this._m4storage[11];
    const m33 = this._m4storage[15];
    const argStorage = arg._m4storage;
    const n00 = argStorage[0];
    const n01 = argStorage[4];
    const n02 = argStorage[8];
    const n03 = argStorage[12];
    const n10 = argStorage[1];
    const n11 = argStorage[5];
    const n12 = argStorage[9];
    const n13 = argStorage[13];
    const n20 = argStorage[2];
    const n21 = argStorage[6];
    const n22 = argStorage[10];
    const n23 = argStorage[14];
    const n30 = argStorage[3];
    const n31 = argStorage[7];
    const n32 = argStorage[11];
    const n33 = argStorage[15];
    this._m4storage[0] = m00 * n00 + m01 * n10 + m02 * n20 + m03 * n30;
    this._m4storage[4] = m00 * n01 + m01 * n11 + m02 * n21 + m03 * n31;
    this._m4storage[8] = m00 * n02 + m01 * n12 + m02 * n22 + m03 * n32;
    this._m4storage[12] = m00 * n03 + m01 * n13 + m02 * n23 + m03 * n33;
    this._m4storage[1] = m10 * n00 + m11 * n10 + m12 * n20 + m13 * n30;
    this._m4storage[5] = m10 * n01 + m11 * n11 + m12 * n21 + m13 * n31;
    this._m4storage[9] = m10 * n02 + m11 * n12 + m12 * n22 + m13 * n32;
    this._m4storage[13] = m10 * n03 + m11 * n13 + m12 * n23 + m13 * n33;
    this._m4storage[2] = m20 * n00 + m21 * n10 + m22 * n20 + m23 * n30;
    this._m4storage[6] = m20 * n01 + m21 * n11 + m22 * n21 + m23 * n31;
    this._m4storage[10] = m20 * n02 + m21 * n12 + m22 * n22 + m23 * n32;
    this._m4storage[14] = m20 * n03 + m21 * n13 + m22 * n23 + m23 * n33;
    this._m4storage[3] = m30 * n00 + m31 * n10 + m32 * n20 + m33 * n30;
    this._m4storage[7] = m30 * n01 + m31 * n11 + m32 * n21 + m33 * n31;
    this._m4storage[11] = m30 * n02 + m31 * n12 + m32 * n22 + m33 * n32;
    this._m4storage[15] = m30 * n03 + m31 * n13 + m32 * n23 + m33 * n33;
  }
  /// Multiply a copy of this with [arg].
  multipliedMatrix(arg: Matrix4) {
    const result = this.clone();
    result.multiplyMatrix(arg);
    return result;
  }

  /// Multiply a transposed this with [arg].
  transposeMultiply(arg: Matrix4) {
    const m00 = this._m4storage[0];
    const m01 = this._m4storage[1];
    const m02 = this._m4storage[2];
    const m03 = this._m4storage[3];
    const m10 = this._m4storage[4];
    const m11 = this._m4storage[5];
    const m12 = this._m4storage[6];
    const m13 = this._m4storage[7];
    const m20 = this._m4storage[8];
    const m21 = this._m4storage[9];
    const m22 = this._m4storage[10];
    const m23 = this._m4storage[11];
    const m30 = this._m4storage[12];
    const m31 = this._m4storage[13];
    const m32 = this._m4storage[14];
    const m33 = this._m4storage[15];
    const argStorage = arg._m4storage;
    this._m4storage[0] =
      m00 * argStorage[0] +
      m01 * argStorage[1] +
      m02 * argStorage[2] +
      m03 * argStorage[3];
    this._m4storage[4] =
      m00 * argStorage[4] +
      m01 * argStorage[5] +
      m02 * argStorage[6] +
      m03 * argStorage[7];
    this._m4storage[8] =
      m00 * argStorage[8] +
      m01 * argStorage[9] +
      m02 * argStorage[10] +
      m03 * argStorage[11];
    this._m4storage[12] =
      m00 * argStorage[12] +
      m01 * argStorage[13] +
      m02 * argStorage[14] +
      m03 * argStorage[15];
    this._m4storage[1] =
      m10 * argStorage[0] +
      m11 * argStorage[1] +
      m12 * argStorage[2] +
      m13 * argStorage[3];
    this._m4storage[5] =
      m10 * argStorage[4] +
      m11 * argStorage[5] +
      m12 * argStorage[6] +
      m13 * argStorage[7];
    this._m4storage[9] =
      m10 * argStorage[8] +
      m11 * argStorage[9] +
      m12 * argStorage[10] +
      m13 * argStorage[11];
    this._m4storage[13] =
      m10 * argStorage[12] +
      m11 * argStorage[13] +
      m12 * argStorage[14] +
      m13 * argStorage[15];
    this._m4storage[2] =
      m20 * argStorage[0] +
      m21 * argStorage[1] +
      m22 * argStorage[2] +
      m23 * argStorage[3];
    this._m4storage[6] =
      m20 * argStorage[4] +
      m21 * argStorage[5] +
      m22 * argStorage[6] +
      m23 * argStorage[7];
    this._m4storage[10] =
      m20 * argStorage[8] +
      m21 * argStorage[9] +
      m22 * argStorage[10] +
      m23 * argStorage[11];
    this._m4storage[14] =
      m20 * argStorage[12] +
      m21 * argStorage[13] +
      m22 * argStorage[14] +
      m23 * argStorage[15];
    this._m4storage[3] =
      m30 * argStorage[0] +
      m31 * argStorage[1] +
      m32 * argStorage[2] +
      m33 * argStorage[3];
    this._m4storage[7] =
      m30 * argStorage[4] +
      m31 * argStorage[5] +
      m32 * argStorage[6] +
      m33 * argStorage[7];
    this._m4storage[11] =
      m30 * argStorage[8] +
      m31 * argStorage[9] +
      m32 * argStorage[10] +
      m33 * argStorage[11];
    this._m4storage[15] =
      m30 * argStorage[12] +
      m31 * argStorage[13] +
      m32 * argStorage[14] +
      m33 * argStorage[15];
  }
  /// Multiply this with a transposed [arg].
  multiplyTranspose(arg: Matrix4) {
    const m00 = this._m4storage[0];
    const m01 = this._m4storage[4];
    const m02 = this._m4storage[8];
    const m03 = this._m4storage[12];
    const m10 = this._m4storage[1];
    const m11 = this._m4storage[5];
    const m12 = this._m4storage[9];
    const m13 = this._m4storage[13];
    const m20 = this._m4storage[2];
    const m21 = this._m4storage[6];
    const m22 = this._m4storage[10];
    const m23 = this._m4storage[14];
    const m30 = this._m4storage[3];
    const m31 = this._m4storage[7];
    const m32 = this._m4storage[11];
    const m33 = this._m4storage[15];
    const argStorage = arg._m4storage;
    this._m4storage[0] =
      m00 * argStorage[0] +
      m01 * argStorage[4] +
      m02 * argStorage[8] +
      m03 * argStorage[12];
    this._m4storage[4] =
      m00 * argStorage[1] +
      m01 * argStorage[5] +
      m02 * argStorage[9] +
      m03 * argStorage[13];
    this._m4storage[8] =
      m00 * argStorage[2] +
      m01 * argStorage[6] +
      m02 * argStorage[10] +
      m03 * argStorage[14];
    this._m4storage[12] =
      m00 * argStorage[3] +
      m01 * argStorage[7] +
      m02 * argStorage[11] +
      m03 * argStorage[15];
    this._m4storage[1] =
      m10 * argStorage[0] +
      m11 * argStorage[4] +
      m12 * argStorage[8] +
      m13 * argStorage[12];
    this._m4storage[5] =
      m10 * argStorage[1] +
      m11 * argStorage[5] +
      m12 * argStorage[9] +
      m13 * argStorage[13];
    this._m4storage[9] =
      m10 * argStorage[2] +
      m11 * argStorage[6] +
      m12 * argStorage[10] +
      m13 * argStorage[14];
    this._m4storage[13] =
      m10 * argStorage[3] +
      m11 * argStorage[7] +
      m12 * argStorage[11] +
      m13 * argStorage[15];
    this._m4storage[2] =
      m20 * argStorage[0] +
      m21 * argStorage[4] +
      m22 * argStorage[8] +
      m23 * argStorage[12];
    this._m4storage[6] =
      m20 * argStorage[1] +
      m21 * argStorage[5] +
      m22 * argStorage[9] +
      m23 * argStorage[13];
    this._m4storage[10] =
      m20 * argStorage[2] +
      m21 * argStorage[6] +
      m22 * argStorage[10] +
      m23 * argStorage[14];
    this._m4storage[14] =
      m20 * argStorage[3] +
      m21 * argStorage[7] +
      m22 * argStorage[11] +
      m23 * argStorage[15];
    this._m4storage[3] =
      m30 * argStorage[0] +
      m31 * argStorage[4] +
      m32 * argStorage[8] +
      m33 * argStorage[12];
    this._m4storage[7] =
      m30 * argStorage[1] +
      m31 * argStorage[5] +
      m32 * argStorage[9] +
      m33 * argStorage[13];
    this._m4storage[11] =
      m30 * argStorage[2] +
      m31 * argStorage[6] +
      m32 * argStorage[10] +
      m33 * argStorage[14];
    this._m4storage[15] =
      m30 * argStorage[3] +
      m31 * argStorage[7] +
      m32 * argStorage[11] +
      m33 * argStorage[15];
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
  rotate3(arg: Vector3): Vector3 {
    const argStorage = arg._v3storage;
    const x =
      this._m4storage[0] * argStorage[0] +
      this._m4storage[4] * argStorage[1] +
      this._m4storage[8] * argStorage[2];
    const y =
      this._m4storage[1] * argStorage[0] +
      this._m4storage[5] * argStorage[1] +
      this._m4storage[9] * argStorage[2];
    const z =
      this._m4storage[2] * argStorage[0] +
      this._m4storage[6] * argStorage[1] +
      this._m4storage[10] * argStorage[2];
    argStorage[0] = x;
    argStorage[1] = y;
    argStorage[2] = z;
    return arg;
  }

  /// Transform [arg] of type [Vector4] using the transformation defined by
  /// this.
  transform(arg: Vector4): Vector4 {
    const argStorage = arg._v4storage;
    const x =
      this._m4storage[0] * argStorage[0] +
      this._m4storage[4] * argStorage[1] +
      this._m4storage[8] * argStorage[2] +
      this._m4storage[12] * argStorage[3];
    const y =
      this._m4storage[1] * argStorage[0] +
      this._m4storage[5] * argStorage[1] +
      this._m4storage[9] * argStorage[2] +
      this._m4storage[13] * argStorage[3];
    const z =
      this._m4storage[2] * argStorage[0] +
      this._m4storage[6] * argStorage[1] +
      this._m4storage[10] * argStorage[2] +
      this._m4storage[14] * argStorage[3];
    const w =
      this._m4storage[3] * argStorage[0] +
      this._m4storage[7] * argStorage[1] +
      this._m4storage[11] * argStorage[2] +
      this._m4storage[15] * argStorage[3];
    argStorage[0] = x;
    argStorage[1] = y;
    argStorage[2] = z;
    argStorage[3] = w;
    return arg;
  }

  /// Transform [arg] of type [Vector3] using the perspective transformation
  /// defined by this.
  perspectiveTransform(arg: Vector3): Vector3 {
    const argStorage = arg._v3storage;
    const x_ =
      this._m4storage[0] * argStorage[0] +
      this._m4storage[4] * argStorage[1] +
      this._m4storage[8] * argStorage[2] +
      this._m4storage[12];
    const y_ =
      this._m4storage[1] * argStorage[0] +
      this._m4storage[5] * argStorage[1] +
      this._m4storage[9] * argStorage[2] +
      this._m4storage[13];
    const z_ =
      this._m4storage[2] * argStorage[0] +
      this._m4storage[6] * argStorage[1] +
      this._m4storage[10] * argStorage[2] +
      this._m4storage[14];
    const w_ =
      1.0 /
      (this._m4storage[3] * argStorage[0] +
        this._m4storage[7] * argStorage[1] +
        this._m4storage[11] * argStorage[2] +
        this._m4storage[15]);
    argStorage[0] = x_ * w_;
    argStorage[1] = y_ * w_;
    argStorage[2] = z_ * w_;
    return arg;
  }
  // Copies this into [array] starting at [offset].
  copyIntoArray(array: number[], offset: number = 0): void {
    const i = offset;
    array[i + 15] = this._m4storage[15];
    array[i + 14] = this._m4storage[14];
    array[i + 13] = this._m4storage[13];
    array[i + 12] = this._m4storage[12];
    array[i + 11] = this._m4storage[11];
    array[i + 10] = this._m4storage[10];
    array[i + 9] = this._m4storage[9];
    array[i + 8] = this._m4storage[8];
    array[i + 7] = this._m4storage[7];
    array[i + 6] = this._m4storage[6];
    array[i + 5] = this._m4storage[5];
    array[i + 4] = this._m4storage[4];
    array[i + 3] = this._m4storage[3];
    array[i + 2] = this._m4storage[2];
    array[i + 1] = this._m4storage[1];
    array[i + 0] = this._m4storage[0];
  }
  /**
   * Copies elements from `array` into this starting at `offset`.
   */
  copyFromArray(array: number[], offset = 0): void {
    const i = offset;
    this._m4storage[15] = array[i + 15];
    this._m4storage[14] = array[i + 14];
    this._m4storage[13] = array[i + 13];
    this._m4storage[12] = array[i + 12];
    this._m4storage[11] = array[i + 11];
    this._m4storage[10] = array[i + 10];
    this._m4storage[9] = array[i + 9];
    this._m4storage[8] = array[i + 8];
    this._m4storage[7] = array[i + 7];
    this._m4storage[6] = array[i + 6];
    this._m4storage[5] = array[i + 5];
    this._m4storage[4] = array[i + 4];
    this._m4storage[3] = array[i + 3];
    this._m4storage[2] = array[i + 2];
    this._m4storage[1] = array[i + 1];
    this._m4storage[0] = array[i + 0];
  }
  get right(): Vector3 {
    const x = this._m4storage[0];
    const y = this._m4storage[1];
    const z = this._m4storage[2];
    return new Vector3(x, y, z);
  }

  get up(): Vector3 {
    const x = this._m4storage[4];
    const y = this._m4storage[5];
    const z = this._m4storage[6];
    return new Vector3(x, y, z);
  }

  get forward(): Vector3 {
    const x = this._m4storage[8];
    const y = this._m4storage[9];
    const z = this._m4storage[10];
    return new Vector3(x, y, z);
  }
  /// Is this the identity matrix?
  isIdentity() {
    return (
      this._m4storage[0] == 1.0 && // col 1
      this._m4storage[1] == 0.0 &&
      this._m4storage[2] == 0.0 &&
      this._m4storage[3] == 0.0 &&
      this._m4storage[4] == 0.0 && // col 2
      this._m4storage[5] == 1.0 &&
      this._m4storage[6] == 0.0 &&
      this._m4storage[7] == 0.0 &&
      this._m4storage[8] == 0.0 && // col 3
      this._m4storage[9] == 0.0 &&
      this._m4storage[10] == 1.0 &&
      this._m4storage[11] == 0.0 &&
      this._m4storage[12] == 0.0 && // col 4
      this._m4storage[13] == 0.0 &&
      this._m4storage[14] == 0.0 &&
      this._m4storage[15] == 1.0
    );
  }

  /// Is this the zero matrix?
  isZero() {
    return (
      this._m4storage[0] == 0.0 && // col 1
      this._m4storage[1] == 0.0 &&
      this._m4storage[2] == 0.0 &&
      this._m4storage[3] == 0.0 &&
      this._m4storage[4] == 0.0 && // col 2
      this._m4storage[5] == 0.0 &&
      this._m4storage[6] == 0.0 &&
      this._m4storage[7] == 0.0 &&
      this._m4storage[8] == 0.0 && // col 3
      this._m4storage[9] == 0.0 &&
      this._m4storage[10] == 0.0 &&
      this._m4storage[11] == 0.0 &&
      this._m4storage[12] == 0.0 && // col 4
      this._m4storage[13] == 0.0 &&
      this._m4storage[14] == 0.0 &&
      this._m4storage[15] == 0.0
    );
  }
}

export default Matrix4;
