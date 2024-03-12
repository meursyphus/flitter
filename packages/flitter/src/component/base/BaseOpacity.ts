import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { assert } from "../../utils";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class Opacity extends SingleChildRenderObjectWidget {
  opacity: number;
  constructor({
    child,
    opacity,
    key,
  }: {
    child?: Widget;
    opacity: number;
    key?: any;
  }) {
    super({ child, key });
    this.opacity = opacity;
  }

  override createRenderObject(): SingleChildRenderObject {
    return new RenderOpacity({
      opacity: this.opacity,
    });
  }

  updateRenderObject(renderObject: RenderOpacity): void {
    renderObject.opacityProp = this.opacity;
  }
}

class RenderOpacity extends SingleChildRenderObject {
  _opacityProp!: number;
  get opacityProp(): number {
    return this._opacityProp;
  }
  set opacityProp(value: number) {
    assert(value >= 0 && value <= 1.0);
    this._opacityProp = value;
    this.markNeedsPaint();
  }

  constructor({ opacity }: { opacity: number }) {
    super({ isPainter: false });
    this._opacityProp = opacity;
  }

  protected override preformLayout(): void {
    if (this.child != null) {
      this.child.layout(this.constraints);
      this.size = this.child.size;
    }
  }

  getChildOpacity(parentOpacity: number): number {
    return parentOpacity * this.opacityProp;
  }
}

export default Opacity;
