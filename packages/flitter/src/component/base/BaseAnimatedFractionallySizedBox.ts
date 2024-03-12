import type { Curve } from "../../animation";
import { CalculableTween, Tween } from "../../animation";
import type { Data } from "../../type";
import { Alignment } from "../../type";
import type { Nullable } from "../../utils/type";
import type { Widget } from "../../widget";
import FractionallySizedBox from "../FractionallySizedBox";
import {
  ImplicitlyAnimatedWidget,
  AnimatedBaseWidgetState,
} from "../../widget/ImplicitlyAnimatedWidget";

class BaseAnimatedFractionallySizedBox extends ImplicitlyAnimatedWidget {
  alignment: Alignment;
  widthFactor?: number;
  heightFactor?: number;
  child?: Widget;

  constructor({
    child,
    curve,
    duration,
    key,
    widthFactor,
    heightFactor,
    alignment = Alignment.center,
  }: {
    key?: any;
    child?: Widget;
    curve?: Curve;
    duration: number;
    widthFactor?: number;
    heightFactor?: number;
    alignment?: Alignment;
  }) {
    super({ key, curve, duration });
    this.child = child;
    this.widthFactor = widthFactor;
    this.heightFactor = heightFactor;
    this.alignment = alignment;
  }
  createState(): AnimatedBaseWidgetState<BaseAnimatedFractionallySizedBox> {
    return new BaseAnimatedFractionallySizedBoxState();
  }
}

class BaseAnimatedFractionallySizedBoxState extends AnimatedBaseWidgetState<BaseAnimatedFractionallySizedBox> {
  private widthFactor: Tween<number> | Nullable;
  private heightFactor: Tween<number> | Nullable;
  private alignment: Tween<Alignment> | Nullable;

  forEachTween(
    visitor: <V extends number | Data, T extends Tween<V>>(props: {
      tween: T;
      targetValue: V;
      constructor: (value: V) => T;
    }) => T
  ): void {
    this.alignment = visitor({
      tween: this.alignment,
      targetValue: this.widget.alignment,
      constructor: (value) => new CalculableTween({ begin: value, end: value }),
    });
    this.heightFactor = visitor({
      tween: this.heightFactor,
      targetValue: this.widget.heightFactor,
      constructor: (value) => new Tween({ begin: value, end: value }),
    });
    this.widthFactor = visitor({
      tween: this.widthFactor,
      targetValue: this.widget.widthFactor,
      constructor: (value) => new Tween({ begin: value, end: value }),
    });
  }

  build(): Widget {
    return FractionallySizedBox({
      widthFactor: this.widthFactor?.evaluate(this.animation),
      heightFactor: this.heightFactor?.evaluate(this.animation),
      alignment: this.alignment?.evaluate(this.animation),
      child: this.widget.child,
    });
  }
}

export default BaseAnimatedFractionallySizedBox;
