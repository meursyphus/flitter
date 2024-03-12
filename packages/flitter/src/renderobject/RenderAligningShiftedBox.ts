import type { TextDirection } from "../type";
import { Alignment, Offset } from "../type";
import SingleChildRenderObject from "./SingleChildRenderObject";

class RenderAligningShiftedBox extends SingleChildRenderObject {
  _alignment: Alignment;
  get alignment(): Alignment {
    return this._alignment;
  }
  set alignment(value: Alignment) {
    if (this._alignment.equals(value)) return;
    this._alignment = value;
    this.markNeedsLayout();
  }
  _textDirection: TextDirection;
  get textDirection(): TextDirection {
    return this._textDirection;
  }
  set textDirection(value) {
    if (this._textDirection == value) return;
    this._textDirection = value;
    this.markNeedsLayout();
  }
  constructor({
    alignment = Alignment.center,
    textDirection,
  }: {
    alignment?: Alignment;
    textDirection: TextDirection;
  }) {
    super({
      isPainter: false,
    });
    this._alignment = alignment;
    this._textDirection = textDirection;
  }

  private get resolvedAlignment(): Alignment | undefined {
    return this.alignment.resolve(this.textDirection);
  }

  alignChild() {
    if (this.child == null) throw Error("child must not be null");
    if (this.resolvedAlignment == null)
      throw Error("resolved alignment must not be null");
    this.child.offset = this.resolvedAlignment.alongOffset(
      Offset.raw({
        x: this.size.width - this.child.size.width,
        y: this.size.height - this.child.size.height,
      })
    );
  }
}

export default RenderAligningShiftedBox;
