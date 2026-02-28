import type Curve from "../../animation/Curve";
import Curves from "../../animation/Curves";
import { RenderAnimatedSize } from "../../renderobject/RenderAnimatedSize";
import { Alignment } from "../../type";
import type { Widget } from "../../widget";
import { SingleChildRenderObjectWidget } from "../../widget";

class BaseAnimatedSize extends SingleChildRenderObjectWidget {
  duration: number;
  curve: Curve;
  alignment: Alignment;

  constructor({
    child,
    duration,
    curve = Curves.linear,
    alignment = Alignment.center,
    key,
  }: {
    child?: Widget;
    duration: number;
    curve?: Curve;
    alignment?: Alignment;
    key?: any;
  }) {
    super({ child, key });
    this.duration = duration;
    this.curve = curve;
    this.alignment = alignment;
  }

  override createRenderObject(): RenderAnimatedSize {
    return new RenderAnimatedSize({
      duration: this.duration,
      curve: this.curve,
      alignment: this.alignment,
    });
  }

  override updateRenderObject(renderObject: RenderAnimatedSize) {
    renderObject.duration = this.duration;
    renderObject.curve = this.curve;
    renderObject.alignment = this.alignment;
  }
}

export default BaseAnimatedSize;
