import type { Curve, Tween } from "../../animation";
import { CalculableTween } from "../../animation";
import type { Data } from "../../type";
import type { Nullable } from "../../utils/type";
import type { Widget } from "../../widget";
import Padding from "../Padding";
import {
  ImplicitlyAnimatedWidget,
  AnimatedBaseWidgetState,
} from "../../widget/ImplicitlyAnimatedWidget";
import type { EdgeInsetsGeometry } from "../../type/_types/edge-insets";
import EdgeInsets from "../../type/_types/edge-insets";

class BaseAnimatedPadding extends ImplicitlyAnimatedWidget {
  opacity: number;
  padding: EdgeInsetsGeometry;
  child?: Widget;

  constructor({
    child,
    curve,
    duration,
    key,
    padding = EdgeInsets.all(0),
  }: {
    key?: any;
    child?: Widget;
    curve?: Curve;
    duration: number;
    padding?: EdgeInsetsGeometry;
  }) {
    super({ key, curve, duration });
    this.child = child;
    this.padding = padding;
  }
  createState(): AnimatedBaseWidgetState<BaseAnimatedPadding> {
    return new BaseAnimatedPaddingState();
  }
}

class BaseAnimatedPaddingState extends AnimatedBaseWidgetState<BaseAnimatedPadding> {
  private paddingTween: Tween<EdgeInsetsGeometry> | Nullable;

  forEachTween(
    visitor: <V extends number | Data, T extends Tween<V>>(props: {
      tween: T;
      targetValue: V;
      constructor: (value: V) => T;
    }) => T
  ): void {
    this.paddingTween = visitor({
      tween: this.paddingTween,
      targetValue: this.widget.padding,
      constructor: (value) => new CalculableTween({ begin: value, end: value }),
    });
  }

  build(): Widget {
    return Padding({
      padding: this.paddingTween?.evaluate(this.animation),
      child: this.widget.child,
    });
  }
}

export default BaseAnimatedPadding;
