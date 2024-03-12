import type { Curve } from "../../animation";
import { Tween } from "../../animation";
import type { Data } from "../../type";
import { Alignment } from "../../type";
import type { Nullable } from "../../utils/type";
import type { Widget } from "../../widget";
import Transform from "../Transform";
import {
  ImplicitlyAnimatedWidget,
  AnimatedBaseWidgetState,
} from "../../widget/ImplicitlyAnimatedWidget";

class BaseAnimatedScale extends ImplicitlyAnimatedWidget {
  scale: number;
  child?: Widget;
  alignment: Alignment;

  constructor({
    child,
    curve,
    duration,
    key,
    scale,
    alignment = Alignment.center,
  }: {
    key?: any;
    child?: Widget;
    curve?: Curve;
    duration: number;
    scale: number;
    alignment?: Alignment;
  }) {
    super({ key, curve, duration });
    this.child = child;
    this.scale = scale;
    this.alignment = alignment;
  }
  createState(): AnimatedBaseWidgetState<BaseAnimatedScale> {
    return new BaseAnimatedScaleState();
  }
}

class BaseAnimatedScaleState extends AnimatedBaseWidgetState<BaseAnimatedScale> {
  private scaleTween: Tween<number> | Nullable;

  forEachTween(
    visitor: <V extends number | Data, T extends Tween<V>>(props: {
      tween: T;
      targetValue: V;
      constructor: (value: V) => T;
    }) => T
  ): void {
    this.scaleTween = visitor({
      tween: this.scaleTween,
      targetValue: this.widget.scale,
      constructor: (value) => new Tween({ begin: value }),
    });
  }

  build(): Widget {
    return Transform.scale({
      scale: this.scaleTween?.evaluate(this.animation),
      alignment: this.widget.alignment,
      child: this.widget.child,
    });
  }
}

export default BaseAnimatedScale;
