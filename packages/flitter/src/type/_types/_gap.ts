class Gap {
  x: number
  y: number
  constructor({ x = 0, y = 0 }: { x?: number; y?: number }) {
    this.x = x
    this.y = y
  }

  static only({ x = 0, y = 0 }: { x?: number; y?: number }) {
    return new Gap({ x, y })
  }

  static all(value: number) {
    return new Gap({ x: value, y: value })
  }
}

export default Gap
