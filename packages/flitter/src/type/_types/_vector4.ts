import type Vector from "./_vector";
import Vector2 from "./_vector2";
import Vector3 from "./_vector3";

export class Vector4 implements Vector {
  _v4storage: [number, number, number, number];
  get storage() {
    return this._v4storage;
  }
  constructor(arg0: number, arg1: number, arg2: number, arg3: number) {
    this._v4storage = [arg0, arg1, arg2, arg3];
  }

  static zero() {
    return new Vector4(0, 0, 0, 0);
  }

  set xy(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[1] = argStorage[1];
  }
  set xz(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[2] = argStorage[1];
  }
  set xw(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[3] = argStorage[1];
  }
  set yx(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[0] = argStorage[1];
  }
  set yz(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[2] = argStorage[1];
  }
  set yw(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[3] = argStorage[1];
  }
  set zx(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[0] = argStorage[1];
  }
  set zy(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[1] = argStorage[1];
  }
  set zw(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[3] = argStorage[1];
  }
  set wx(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[0] = argStorage[1];
  }

  set wy(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[1] = argStorage[1];
  }

  set wz(arg: Vector2) {
    const argStorage = arg._v2storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[2] = argStorage[1];
  }

  set xyz(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[1] = argStorage[1];
    this._v4storage[2] = argStorage[2];
  }

  set xyw(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[1] = argStorage[1];
    this._v4storage[3] = argStorage[2];
  }

  set xzy(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[2] = argStorage[1];
    this._v4storage[1] = argStorage[2];
  }

  set xzw(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[2] = argStorage[1];
    this._v4storage[3] = argStorage[2];
  }

  set xwy(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[3] = argStorage[1];
    this._v4storage[1] = argStorage[2];
  }

  set xwz(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[3] = argStorage[1];
    this._v4storage[2] = argStorage[2];
  }

  set yxz(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[0] = argStorage[1];
    this._v4storage[2] = argStorage[2];
  }

  set yxw(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[0] = argStorage[1];
    this._v4storage[3] = argStorage[2];
  }

  set yzx(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[2] = argStorage[1];
    this._v4storage[0] = argStorage[2];
  }

  set yzw(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[2] = argStorage[1];
    this._v4storage[3] = argStorage[2];
  }

  set ywx(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[3] = argStorage[1];
    this._v4storage[0] = argStorage[2];
  }

  set ywz(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[3] = argStorage[1];
    this._v4storage[2] = argStorage[2];
  }

  set zxy(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[0] = argStorage[1];
    this._v4storage[1] = argStorage[2];
  }

  set zxw(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[0] = argStorage[1];
    this._v4storage[3] = argStorage[2];
  }

  set zyx(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[1] = argStorage[1];
    this._v4storage[0] = argStorage[2];
  }

  set zyw(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[1] = argStorage[1];
    this._v4storage[3] = argStorage[2];
  }

  set zwx(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[3] = argStorage[1];
    this._v4storage[0] = argStorage[2];
  }

  set zwy(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[3] = argStorage[1];
    this._v4storage[1] = argStorage[2];
  }

  set wxy(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[0] = argStorage[1];
    this._v4storage[1] = argStorage[2];
  }

  set wxz(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[0] = argStorage[1];
    this._v4storage[2] = argStorage[2];
  }

  set wyx(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[1] = argStorage[1];
    this._v4storage[0] = argStorage[2];
  }

  set wyz(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[1] = argStorage[1];
    this._v4storage[2] = argStorage[2];
  }

  set wzx(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[2] = argStorage[1];
    this._v4storage[0] = argStorage[2];
  }

  set wzy(arg: Vector3) {
    const argStorage = arg._v3storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[2] = argStorage[1];
    this._v4storage[1] = argStorage[2];
  }
  set xyzw(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[1] = argStorage[1];
    this._v4storage[2] = argStorage[2];
    this._v4storage[3] = argStorage[3];
  }

  set xywz(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[1] = argStorage[1];
    this._v4storage[3] = argStorage[2];
    this._v4storage[2] = argStorage[3];
  }

  set xzyw(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[2] = argStorage[1];
    this._v4storage[1] = argStorage[2];
    this._v4storage[3] = argStorage[3];
  }

  set xzwy(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[2] = argStorage[1];
    this._v4storage[3] = argStorage[2];
    this._v4storage[1] = argStorage[3];
  }

  set xwyz(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[3] = argStorage[1];
    this._v4storage[1] = argStorage[2];
    this._v4storage[2] = argStorage[3];
  }

  set xwzy(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[0] = argStorage[0];
    this._v4storage[3] = argStorage[1];
    this._v4storage[2] = argStorage[2];
    this._v4storage[1] = argStorage[3];
  }

  set yxzw(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[0] = argStorage[1];
    this._v4storage[2] = argStorage[2];
    this._v4storage[3] = argStorage[3];
  }

  set yxwz(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[0] = argStorage[1];
    this._v4storage[3] = argStorage[2];
    this._v4storage[2] = argStorage[3];
  }

  set yzxw(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[2] = argStorage[1];
    this._v4storage[0] = argStorage[2];
    this._v4storage[3] = argStorage[3];
  }

  set yzwx(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[2] = argStorage[1];
    this._v4storage[3] = argStorage[2];
    this._v4storage[0] = argStorage[3];
  }

  set ywxz(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[3] = argStorage[1];
    this._v4storage[0] = argStorage[2];
    this._v4storage[2] = argStorage[3];
  }

  set ywzx(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[1] = argStorage[0];
    this._v4storage[3] = argStorage[1];
    this._v4storage[2] = argStorage[2];
    this._v4storage[0] = argStorage[3];
  }

  set zxyw(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[0] = argStorage[1];
    this._v4storage[1] = argStorage[2];
    this._v4storage[3] = argStorage[3];
  }

  set zxwy(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[0] = argStorage[1];
    this._v4storage[3] = argStorage[2];
    this._v4storage[1] = argStorage[3];
  }

  set zyxw(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[1] = argStorage[1];
    this._v4storage[0] = argStorage[2];
    this._v4storage[3] = argStorage[3];
  }

  set zywx(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[1] = argStorage[1];
    this._v4storage[3] = argStorage[2];
    this._v4storage[0] = argStorage[3];
  }

  set zwxy(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[3] = argStorage[1];
    this._v4storage[0] = argStorage[2];
    this._v4storage[1] = argStorage[3];
  }

  set zwyx(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[2] = argStorage[0];
    this._v4storage[3] = argStorage[1];
    this._v4storage[1] = argStorage[2];
    this._v4storage[0] = argStorage[3];
  }

  set wxyz(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[0] = argStorage[1];
    this._v4storage[1] = argStorage[2];
    this._v4storage[2] = argStorage[3];
  }

  set wxzy(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[0] = argStorage[1];
    this._v4storage[2] = argStorage[2];
    this._v4storage[1] = argStorage[3];
  }

  set wyxz(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[1] = argStorage[1];
    this._v4storage[0] = argStorage[2];
    this._v4storage[2] = argStorage[3];
  }

  set wyzx(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[1] = argStorage[1];
    this._v4storage[2] = argStorage[2];
    this._v4storage[0] = argStorage[3];
  }

  set wzxy(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[2] = argStorage[1];
    this._v4storage[0] = argStorage[2];
    this._v4storage[1] = argStorage[3];
  }

  set wzyx(arg: Vector4) {
    const argStorage = arg._v4storage;
    this._v4storage[3] = argStorage[0];
    this._v4storage[2] = argStorage[1];
    this._v4storage[1] = argStorage[2];
    this._v4storage[0] = argStorage[3];
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
  set a(arg: number) {
    this.w = arg;
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
  set q(arg: number) {
    this.w = arg;
  }
  set x(arg: number) {
    this._v4storage[0] = arg;
  }
  set y(arg: number) {
    this._v4storage[1] = arg;
  }
  set z(arg: number) {
    this._v4storage[2] = arg;
  }
  set w(arg: number) {
    this._v4storage[3] = arg;
  }
  set rg(arg: Vector2) {
    this.xy = arg;
  }
  set rb(arg: Vector2) {
    this.xz = arg;
  }
  set ra(arg: Vector2) {
    this.xw = arg;
  }
  set gr(arg: Vector2) {
    this.yx = arg;
  }
  set gb(arg: Vector2) {
    this.yz = arg;
  }
  set ga(arg: Vector2) {
    this.yw = arg;
  }
  set br(arg: Vector2) {
    this.zx = arg;
  }
  set bg(arg: Vector2) {
    this.zy = arg;
  }
  set ba(arg: Vector2) {
    this.zw = arg;
  }
  set ar(arg: Vector2) {
    this.wx = arg;
  }
  set ag(arg: Vector2) {
    this.wy = arg;
  }
  set ab(arg: Vector2) {
    this.wz = arg;
  }
  set rgb(arg: Vector3) {
    this.xyz = arg;
  }
  set rga(arg: Vector3) {
    this.xyw = arg;
  }
  set rbg(arg: Vector3) {
    this.xzy = arg;
  }
  set rba(arg: Vector3) {
    this.xzw = arg;
  }
  set rag(arg: Vector3) {
    this.xwy = arg;
  }
  set rab(arg: Vector3) {
    this.xwz = arg;
  }
  set grb(arg: Vector3) {
    this.yxz = arg;
  }
  set gra(arg: Vector3) {
    this.yxw = arg;
  }
  set gbr(arg: Vector3) {
    this.yzx = arg;
  }
  set gba(arg: Vector3) {
    this.yzw = arg;
  }
  set gar(arg: Vector3) {
    this.ywx = arg;
  }
  set gab(arg: Vector3) {
    this.ywz = arg;
  }
  set brg(arg: Vector3) {
    this.zxy = arg;
  }
  set bra(arg: Vector3) {
    this.zxw = arg;
  }
  set bgr(arg: Vector3) {
    this.zyx = arg;
  }
  set bga(arg: Vector3) {
    this.zyw = arg;
  }
  set bar(arg: Vector3) {
    this.zwx = arg;
  }
  set bag(arg: Vector3) {
    this.zwy = arg;
  }
  set arg(arg: Vector3) {
    this.wxy = arg;
  }
  set arb(arg: Vector3) {
    this.wxz = arg;
  }
  set agr(arg: Vector3) {
    this.wyx = arg;
  }
  set agb(arg: Vector3) {
    this.wyz = arg;
  }
  set abr(arg: Vector3) {
    this.wzx = arg;
  }
  set abg(arg: Vector3) {
    this.wzy = arg;
  }
  set rgba(arg: Vector4) {
    this.xyzw = arg;
  }
  set rgab(arg: Vector4) {
    this.xywz = arg;
  }
  set rbga(arg: Vector4) {
    this.xzyw = arg;
  }
  set rbag(arg: Vector4) {
    this.xzwy = arg;
  }
  set ragb(arg: Vector4) {
    this.xwyz = arg;
  }
  set rabg(arg: Vector4) {
    this.xwzy = arg;
  }
  set grba(arg: Vector4) {
    this.yxzw = arg;
  }
  set grab(arg: Vector4) {
    this.yxwz = arg;
  }
  set gbra(arg: Vector4) {
    this.yzxw = arg;
  }
  set gbar(arg: Vector4) {
    this.yzwx = arg;
  }
  set garb(arg: Vector4) {
    this.ywxz = arg;
  }
  set gabr(arg: Vector4) {
    this.ywzx = arg;
  }
  set brga(arg: Vector4) {
    this.zxyw = arg;
  }
  set brag(arg: Vector4) {
    this.zxwy = arg;
  }
  set bgra(arg: Vector4) {
    this.zyxw = arg;
  }
  set bgar(arg: Vector4) {
    this.zywx = arg;
  }
  set barg(arg: Vector4) {
    this.zwxy = arg;
  }
  set bagr(arg: Vector4) {
    this.zwyx = arg;
  }
  set argb(arg: Vector4) {
    this.wxyz = arg;
  }
  set arbg(arg: Vector4) {
    this.wxzy = arg;
  }
  set agrb(arg: Vector4) {
    this.wyxz = arg;
  }
  set agbr(arg: Vector4) {
    this.wyzx = arg;
  }
  set abrg(arg: Vector4) {
    this.wzxy = arg;
  }
  set abgr(arg: Vector4) {
    this.wzyx = arg;
  }
  set st(arg: Vector2) {
    this.xy = arg;
  }
  set sp(arg: Vector2) {
    this.xz = arg;
  }
  set sq(arg: Vector2) {
    this.xw = arg;
  }
  set ts(arg: Vector2) {
    this.yx = arg;
  }
  set tp(arg: Vector2) {
    this.yz = arg;
  }
  set tq(arg: Vector2) {
    this.yw = arg;
  }
  set ps(arg: Vector2) {
    this.zx = arg;
  }
  set pt(arg: Vector2) {
    this.zy = arg;
  }
  set pq(arg: Vector2) {
    this.zw = arg;
  }
  set qs(arg: Vector2) {
    this.wx = arg;
  }
  set qt(arg: Vector2) {
    this.wy = arg;
  }
  set qp(arg: Vector2) {
    this.wz = arg;
  }
  set stp(arg: Vector3) {
    this.xyz = arg;
  }
  set stq(arg: Vector3) {
    this.xyw = arg;
  }
  set spt(arg: Vector3) {
    this.xzy = arg;
  }
  set spq(arg: Vector3) {
    this.xzw = arg;
  }
  set sqt(arg: Vector3) {
    this.xwy = arg;
  }
  set sqp(arg: Vector3) {
    this.xwz = arg;
  }
  set tsp(arg: Vector3) {
    this.yxz = arg;
  }
  set tsq(arg: Vector3) {
    this.yxw = arg;
  }
  set tps(arg: Vector3) {
    this.yzx = arg;
  }
  set tpq(arg: Vector3) {
    this.yzw = arg;
  }
  set tqs(arg: Vector3) {
    this.ywx = arg;
  }
  set tqp(arg: Vector3) {
    this.ywz = arg;
  }
  set pst(arg: Vector3) {
    this.zxy = arg;
  }
  set psq(arg: Vector3) {
    this.zxw = arg;
  }
  set pts(arg: Vector3) {
    this.zyx = arg;
  }
  set ptq(arg: Vector3) {
    this.zyw = arg;
  }
  set pqs(arg: Vector3) {
    this.zwx = arg;
  }
  set pqt(arg: Vector3) {
    this.zwy = arg;
  }
  set qst(arg: Vector3) {
    this.wxy = arg;
  }
  set qsp(arg: Vector3) {
    this.wxz = arg;
  }
  set qts(arg: Vector3) {
    this.wyx = arg;
  }
  set qtp(arg: Vector3) {
    this.wyz = arg;
  }
  set qps(arg: Vector3) {
    this.wzx = arg;
  }
  set qpt(arg: Vector3) {
    this.wzy = arg;
  }
  set stpq(arg: Vector4) {
    this.xyzw = arg;
  }
  set stqp(arg: Vector4) {
    this.xywz = arg;
  }
  set sptq(arg: Vector4) {
    this.xzyw = arg;
  }
  set spqt(arg: Vector4) {
    this.xzwy = arg;
  }
  set sqtp(arg: Vector4) {
    this.xwyz = arg;
  }
  set sqpt(arg: Vector4) {
    this.xwzy = arg;
  }
  set tspq(arg: Vector4) {
    this.yxzw = arg;
  }
  set tsqp(arg: Vector4) {
    this.yxwz = arg;
  }
  set tpsq(arg: Vector4) {
    this.yzxw = arg;
  }
  set tpqs(arg: Vector4) {
    this.yzwx = arg;
  }
  set tqsp(arg: Vector4) {
    this.ywxz = arg;
  }
  set tqps(arg: Vector4) {
    this.ywzx = arg;
  }
  set pstq(arg: Vector4) {
    this.zxyw = arg;
  }
  set psqt(arg: Vector4) {
    this.zxwy = arg;
  }
  set ptsq(arg: Vector4) {
    this.zyxw = arg;
  }
  set ptqs(arg: Vector4) {
    this.zywx = arg;
  }
  set pqst(arg: Vector4) {
    this.zwxy = arg;
  }
  set pqts(arg: Vector4) {
    this.zwyx = arg;
  }
  set qstp(arg: Vector4) {
    this.wxyz = arg;
  }
  set qspt(arg: Vector4) {
    this.wxzy = arg;
  }
  set qtsp(arg: Vector4) {
    this.wyxz = arg;
  }
  set qtps(arg: Vector4) {
    this.wyzx = arg;
  }
  set qpst(arg: Vector4) {
    this.wzxy = arg;
  }
  set qpts(arg: Vector4) {
    this.wzyx = arg;
  }
  get xx() {
    return new Vector2(this._v4storage[0], this._v4storage[0]);
  }
  get xy() {
    return new Vector2(this._v4storage[0], this._v4storage[1]);
  }
  get xz() {
    return new Vector2(this._v4storage[0], this._v4storage[2]);
  }
  get xw() {
    return new Vector2(this._v4storage[0], this._v4storage[3]);
  }
  get yx() {
    return new Vector2(this._v4storage[1], this._v4storage[0]);
  }
  get yy() {
    return new Vector2(this._v4storage[1], this._v4storage[1]);
  }
  get yz() {
    return new Vector2(this._v4storage[1], this._v4storage[2]);
  }
  get yw() {
    return new Vector2(this._v4storage[1], this._v4storage[3]);
  }
  get zx() {
    return new Vector2(this._v4storage[2], this._v4storage[0]);
  }
  get zy() {
    return new Vector2(this._v4storage[2], this._v4storage[1]);
  }
  get zz() {
    return new Vector2(this._v4storage[2], this._v4storage[2]);
  }
  get zw() {
    return new Vector2(this._v4storage[2], this._v4storage[3]);
  }
  get wx() {
    return new Vector2(this._v4storage[3], this._v4storage[0]);
  }
  get wy() {
    return new Vector2(this._v4storage[3], this._v4storage[1]);
  }
  get wz() {
    return new Vector2(this._v4storage[3], this._v4storage[2]);
  }
  get ww() {
    return new Vector2(this._v4storage[3], this._v4storage[3]);
  }
  get xxx() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get xxy() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get xxz() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get xxw() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get xyx() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get xyy() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get xyz() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get xyw() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get xzx() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get xzy() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get xzz() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get xzw() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get xwx() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get xwy() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get xwz() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get xww() {
    return new Vector3(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get yxx() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get yxy() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get yxz() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get yxw() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get yyx() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get yyy() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get yyz() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get yyw() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get yzx() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get yzy() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get yzz() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get yzw() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get ywx() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get ywy() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get ywz() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get yww() {
    return new Vector3(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get zxx() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get zxy() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get zxz() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get zxw() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get zyx() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get zyy() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get zyz() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get zyw() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get zzx() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get zzy() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get zzz() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get zzw() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get zwx() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get zwy() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get zwz() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get zww() {
    return new Vector3(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get wxx() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get wxy() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get wxz() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get wxw() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get wyx() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get wyy() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get wyz() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get wyw() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get wzx() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get wzy() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get wzz() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get wzw() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get wwx() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get wwy() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get wwz() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get www() {
    return new Vector3(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get xxxx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get xxxy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get xxxz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get xxxw() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get xxyx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get xxyy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get xxyz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get xxyw() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get xxzx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get xxzy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get xxzz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get xxzw() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get xxwx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get xxwy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get xxwz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get xxww() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get xyxx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get xyxy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get xyxz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get xyxw() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get xyyx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get xyyy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get xyyz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get xyyw() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get xyzx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get xyzy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get xyzz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get xyzw() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get xywx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get xywy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get xywz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get xyww() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get xzxx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get xzxy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get xzxz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get xzxw() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get xzyx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get xzyy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get xzyz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get xzyw() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get xzzx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get xzzy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get xzzz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get xzzw() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get xzwx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get xzwy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get xzwz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get xzww() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get xwxx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get xwxy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get xwxz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get xwxw() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get xwyx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get xwyy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get xwyz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get xwyw() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get xwzx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get xwzy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get xwzz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get xwzw() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get xwwx() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get xwwy() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get xwwz() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get xwww() {
    return new Vector4(
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get yxxx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get yxxy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get yxxz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get yxxw() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get yxyx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get yxyy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get yxyz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get yxyw() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get yxzx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get yxzy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get yxzz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get yxzw() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get yxwx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get yxwy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get yxwz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get yxww() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get yyxx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get yyxy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get yyxz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get yyxw() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get yyyx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get yyyy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get yyyz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get yyyw() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get yyzx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get yyzy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get yyzz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get yyzw() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get yywx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get yywy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get yywz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get yyww() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get yzxx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get yzxy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get yzxz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get yzxw() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get yzyx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get yzyy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get yzyz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get yzyw() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get yzzx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get yzzy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get yzzz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get yzzw() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get yzwx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get yzwy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get yzwz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get yzww() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get ywxx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get ywxy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get ywxz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get ywxw() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get ywyx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get ywyy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get ywyz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get ywyw() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get ywzx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get ywzy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get ywzz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get ywzw() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get ywwx() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get ywwy() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get ywwz() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get ywww() {
    return new Vector4(
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get zxxx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get zxxy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get zxxz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get zxxw() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get zxyx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get zxyy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get zxyz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get zxyw() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get zxzx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get zxzy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get zxzz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get zxzw() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get zxwx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get zxwy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get zxwz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get zxww() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get zyxx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get zyxy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get zyxz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get zyxw() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get zyyx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get zyyy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get zyyz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get zyyw() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get zyzx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get zyzy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get zyzz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get zyzw() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get zywx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get zywy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get zywz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get zyww() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get zzxx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get zzxy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get zzxz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get zzxw() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get zzyx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get zzyy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get zzyz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get zzyw() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get zzzx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get zzzy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get zzzz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get zzzw() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get zzwx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get zzwy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get zzwz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get zzww() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get zwxx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get zwxy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get zwxz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get zwxw() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get zwyx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get zwyy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get zwyz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get zwyw() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get zwzx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get zwzy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get zwzz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get zwzw() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get zwwx() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get zwwy() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get zwwz() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get zwww() {
    return new Vector4(
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get wxxx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get wxxy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get wxxz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get wxxw() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get wxyx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get wxyy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get wxyz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get wxyw() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get wxzx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get wxzy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get wxzz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get wxzw() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get wxwx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get wxwy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get wxwz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get wxww() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get wyxx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get wyxy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get wyxz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get wyxw() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get wyyx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get wyyy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get wyyz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get wyyw() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get wyzx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get wyzy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get wyzz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get wyzw() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get wywx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get wywy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get wywz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get wyww() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get wzxx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get wzxy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get wzxz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get wzxw() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get wzyx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get wzyy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get wzyz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get wzyw() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get wzzx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get wzzy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get wzzz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get wzzw() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get wzwx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get wzwy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get wzwz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get wzww() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3],
      this._v4storage[3]
    );
  }
  get wwxx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[0]
    );
  }
  get wwxy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[1]
    );
  }
  get wwxz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[2]
    );
  }
  get wwxw() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0],
      this._v4storage[3]
    );
  }
  get wwyx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[0]
    );
  }
  get wwyy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[1]
    );
  }
  get wwyz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[2]
    );
  }
  get wwyw() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1],
      this._v4storage[3]
    );
  }
  get wwzx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[0]
    );
  }
  get wwzy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[1]
    );
  }
  get wwzz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[2]
    );
  }
  get wwzw() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2],
      this._v4storage[3]
    );
  }
  get wwwx() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[0]
    );
  }
  get wwwy() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[1]
    );
  }
  get wwwz() {
    return new Vector4(
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[3],
      this._v4storage[2]
    );
  }
  get wwww() {
    return new Vector4(
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

export default Vector4;
