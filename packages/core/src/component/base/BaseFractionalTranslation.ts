import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Offset } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

type BriefOffset = { x: number; y: number };

class FractionalTranslation extends SingleChildRenderObjectWidget {
  translation: BriefOffset;
  constructor({
    child,
    translation,
    key,
  }: {
    child?: Widget;
    translation: BriefOffset;
    key?: any;
  }) {
    super({ child, key });
    this.translation = translation;
  }

  override createRenderObject(): SingleChildRenderObject {
    return new RenderFractionalTranslation({
      translation: this.translation,
    });
  }

  updateRenderObject(renderObject: RenderFractionalTranslation): void {
    renderObject.translation = this.translation;
  }
}

class RenderFractionalTranslation extends SingleChildRenderObject {
  _translation: BriefOffset;
  get translation() {
    return this._translation;
  }
  set translation(value: BriefOffset) {
    if (this._translation.x === value.x && this._translation.y === value.y)
      return;
    this._translation = value;
    this.markNeedsLayout;
  }
  constructor({ translation }: { translation: BriefOffset }) {
    super({ isPainter: false });
    this._translation = translation;
  }

  protected override preformLayout(): void {
    if (this.child != null) {
      this.child.layout(this.constraints);
      this.size = this.child.size;
      this.child.offset = new Offset({
        x: this.translation.x * this.size.width,
        y: this.translation.y * this.size.height,
      });
    }
  }
}

export default FractionalTranslation;
