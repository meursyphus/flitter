class Matrix2 {
  get storage() {
    return this._m2storage;
  }
  _m2storage: Array4;

  constructor(arg1: number, arg2: number, arg3: number, arg4: number) {
    this._m2storage = [arg1, arg2, arg3, arg4];
  }
}

export default Matrix2;

type Array4 = [number, number, number, number];
