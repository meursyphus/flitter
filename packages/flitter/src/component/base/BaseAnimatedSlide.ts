import type { Curve, Tween } from "../../animation";
import { CalculableTween } from "../../animation";
import type { Alignment, Data, Offset } from "../../type";
import type { Widget } from "../../widget";
import {
  ImplicitlyAnimatedWidget,
  AnimatedBaseWidgetState,
} from "../../widget/ImplicitlyAnimatedWidget";
import FractionalTranslation from "../FractionalTranslation";

class BaseAnimatedSlide extends ImplicitlyAnimatedWidget {
  offset: Offset;
  child?: Widget;

  constructor({
    child,
    curve,
    duration,
    key,
    offset,
  }: {
    key?: any;
    child?: Widget;
    curve?: Curve;
    duration: number;
    alignment?: Alignment;
    offset: Offset;
  }) {
    super({ key, curve, duration });
    this.child = child;
    this.offset = offset;
  }
  createState(): AnimatedBaseWidgetState<BaseAnimatedSlide> {
    return new BaseAnimatedSlideState();
  }
}

class BaseAnimatedSlideState extends AnimatedBaseWidgetState<BaseAnimatedSlide> {
  private offset: Tween<Offset>;

  forEachTween(
    visitor: <V extends number | Data, T extends Tween<V>>(props: {
      tween: T;
      targetValue: V;
      constructor: (value: V) => T;
    }) => T
  ): void {
    this.offset = visitor({
      tween: this.offset,
      targetValue: this.widget.offset,
      constructor: (value) => new CalculableTween({ begin: value }),
    })!;
  }

  build(): Widget {
    return FractionalTranslation({
      translation: this.offset.evaluate(this.animation),
      child: this.widget.child,
    });
  }
}

export default BaseAnimatedSlide;
