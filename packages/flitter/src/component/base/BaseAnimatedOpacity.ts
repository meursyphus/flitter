import type { Curve } from "../../animation";
import { Tween } from "../../animation";
import type { Data } from "../../type";
import type { Nullable } from "../../utils/type";
import type { Widget } from "../../widget";
import Opacity from "../Opacity";
import {
  ImplicitlyAnimatedWidget,
  AnimatedBaseWidgetState,
} from "../../widget/ImplicitlyAnimatedWidget";

class BaseAnimatedOpacity extends ImplicitlyAnimatedWidget {
  opacity: number;
  child?: Widget;

  constructor({
    child,
    curve,
    duration,
    key,
    opacity,
  }: {
    key?: any;
    child?: Widget;
    curve?: Curve;
    duration: number;
    opacity: number;
  }) {
    super({ key, curve, duration });
    this.child = child;
    this.opacity = opacity;
  }
  createState(): AnimatedBaseWidgetState<BaseAnimatedOpacity> {
    return new BaseAnimatedOpacityState();
  }
}

class BaseAnimatedOpacityState extends AnimatedBaseWidgetState<BaseAnimatedOpacity> {
  private opacityTween: Tween<number> | Nullable;

  forEachTween(
    visitor: <V extends number | Data, T extends Tween<V>>(props: {
      tween: T;
      targetValue: V;
      constructor: (value: V) => T;
    }) => T
  ): void {
    this.opacityTween = visitor({
      tween: this.opacityTween,
      targetValue: this.widget.opacity,
      constructor: (value) => new Tween({ begin: value, end: value }),
    });
  }

  build(): Widget {
    return Opacity({
      opacity: this.opacityTween?.evaluate(this.animation) ?? 1,
      child: this.widget.child,
    });
  }
}

export default BaseAnimatedOpacity;
