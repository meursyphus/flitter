import Offset from "./_offset";

/* eslint-disable @typescript-eslint/no-unused-vars */
type SizeProps = {
  width: number;
  height: number;
};

class Size {
  readonly width: number;
  readonly height: number;
  constructor({ width, height }: SizeProps) {
    this.width = width;
    this.height = height;
  }

  equal(other: Size): boolean {
    if (this === other) return true;
    return this.width === other.width && this.height === other.height;
  }

  static zero = new Size({ width: 0, height: 0 });

  static maximum(): Size {
    return new Size({ width: Infinity, height: Infinity });
  }

  //depricated because javascript is vernerable for unexpected mutating variable
  static infinite: Size = new Size({ width: Infinity, height: Infinity });

  get isFinite(): boolean {
    return Number.isFinite(this.width) && Number.isFinite(this.height);
  }

  get shortest() {
    return Math.min(this.width, this.height);
  }

  get longest() {
    return Math.max(this.width, this.height);
  }

  minus(other: Size): Offset {
    return new Offset({
      x: this.width - other.width,
      y: this.height - other.height,
    });
  }
}

export default Size;
