class Matrix3 {
  get storage() {
    return this._m3storage;
  }
  _m3storage: Array9
  constructor(...args: Array9) {
    this._m3storage = args
  }

  static zero(): Matrix3 {
    return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0,0)
  }
}

export default Matrix3

type Array9 = [
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
