import type Vector from "./_vector";
import Vector3 from "./_vector3";
import Vector4 from "./_vector4";

export class Vector2 implements Vector {
  _v2storage: [number, number];

  constructor(arg0: number, arg1: number) {
    this._v2storage = [arg0, arg1];
  }

  set xy(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v2storage[0] = argStorage[0];
    this._v2storage[1] = argStorage[1];
  }

  set yx(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v2storage[1] = argStorage[0];
    this._v2storage[0] = argStorage[1];
  }

  set r(arg: number) {
    this.x = arg;
  }
  set g(arg: number) {
    this.y = arg;
  }
  set s(arg: number) {
    this.x = arg;
  }
  set t(arg: number) {
    this.y = arg;
  }
  set x(arg: number) {
    this._v2storage[0] = arg;
  }
  set y(arg: number) {
    this._v2storage[1] = arg;
  }
  set rg(arg: Vector2) {
    this.xy = arg;
  }
  set gr(arg: Vector2) {
    this.yx = arg;
  }
  set st(arg: Vector2) {
    this.xy = arg;
  }
  set ts(arg: Vector2) {
    this.yx = arg;
  }
  get xx() {
    return new Vector2(this._v2storage[0], this._v2storage[0]);
  }
  get xy() {
    return new Vector2(this._v2storage[0], this._v2storage[1]);
  }
  get yx() {
    return new Vector2(this._v2storage[1], this._v2storage[0]);
  }
  get yy() {
    return new Vector2(this._v2storage[1], this._v2storage[1]);
  }
  get xxx() {
    return new Vector3(
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[0]
    );
  }
  get xxy() {
    return new Vector3(
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[1]
    );
  }
  get xyx() {
    return new Vector3(
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[0]
    );
  }
  get xyy() {
    return new Vector3(
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[1]
    );
  }
  get yxx() {
    return new Vector3(
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[0]
    );
  }
  get yxy() {
    return new Vector3(
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[1]
    );
  }
  get yyx() {
    return new Vector3(
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[0]
    );
  }
  get yyy() {
    return new Vector3(
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[1]
    );
  }
  get xxxx() {
    return new Vector4(
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[0]
    );
  }
  get xxxy() {
    return new Vector4(
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[1]
    );
  }
  get xxyx() {
    return new Vector4(
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[0]
    );
  }
  get xxyy() {
    return new Vector4(
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[1]
    );
  }
  get xyxx() {
    return new Vector4(
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[0]
    );
  }
  get xyxy() {
    return new Vector4(
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[1]
    );
  }
  get xyyx() {
    return new Vector4(
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[0]
    );
  }
  get xyyy() {
    return new Vector4(
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[1]
    );
  }
  get yxxx() {
    return new Vector4(
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[0]
    );
  }
  get yxxy() {
    return new Vector4(
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[0],
      this._v2storage[1]
    );
  }
  get yxyx() {
    return new Vector4(
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[0]
    );
  }
  get yxyy() {
    return new Vector4(
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[1],
      this._v2storage[1]
    );
  }
  get yyxx() {
    return new Vector4(
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[0]
    );
  }
  get yyxy() {
    return new Vector4(
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[0],
      this._v2storage[1]
    );
  }
  get yyyx() {
    return new Vector4(
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[1],
      this._v2storage[0]
    );
  }
  get yyyy() {
    return new Vector4(
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

export default Vector2;
