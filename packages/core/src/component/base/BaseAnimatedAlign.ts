import type { Curve } from "../../animation";
import { Tween, CalculableTween } from "../../animation";
import type { Alignment, Data } from "../../type";
import type { Nullable } from "../../utils/type";
import type { Widget } from "../../widget";
import Align from "../Align";
import {
  ImplicitlyAnimatedWidget,
  AnimatedBaseWidgetState,
} from "../../widget/ImplicitlyAnimatedWidget";

class BaseAnimatedAlignWidget extends ImplicitlyAnimatedWidget {
  alignment: Alignment;
  child?: Widget;
  widthFactor: number | Nullable;
  heightFactor: number | Nullable;

  constructor({
    child,
    curve,
    duration,
    key,
    alignment,
    widthFactor,
    heightFactor,
  }: {
    key?: any;
    child?: Widget;
    curve?: Curve;
    duration: number;
    widthFactor?: number;
    heightFactor?: number;
    alignment: Alignment;
  }) {
    super({ key, curve, duration });
    this.alignment = alignment;
    this.child = child;
    this.widthFactor = widthFactor;
    this.heightFactor = heightFactor;
  }
  createState(): AnimatedBaseWidgetState<BaseAnimatedAlignWidget> {
    return new BaseAnimatedAlignWidgetState();
  }
}

class BaseAnimatedAlignWidgetState extends AnimatedBaseWidgetState<BaseAnimatedAlignWidget> {
  private alignmentTween: Tween<Alignment> | Nullable;
  private widthFactorTween: Tween<number> | Nullable;
  private heightFactorTween: Tween<number> | Nullable;

  forEachTween(
    visitor: <V extends number | Data, T extends Tween<V>>({
      tween,
      targetValue,
      constructor,
    }: {
      tween: T;
      targetValue: V;
      constructor: (value: V) => T;
    }) => T,
  ): void {
    this.alignmentTween = visitor({
      tween: this.alignmentTween!,
      targetValue: this.widget.alignment,
      constructor: value => new CalculableTween({ begin: value, end: value }),
    });
    this.widthFactorTween = visitor({
      tween: this.widthFactorTween as Tween<number>,
      targetValue: this.widget.widthFactor as number,
      constructor: value => new Tween({ begin: value, end: value }),
    }) as Tween<number>;
    this.heightFactorTween = visitor({
      tween: this.heightFactorTween as Tween<number>,
      targetValue: this.widget.heightFactor as number,
      constructor: value => new Tween({ begin: value, end: value }),
    }) as Tween<number>;
  }

  build(): Widget {
    return Align({
      alignment: this.alignmentTween?.evaluate(this.animation),
      widthFactor: this.widthFactorTween?.evaluate(this.animation),
      heightFactor: this.heightFactorTween?.evaluate(this.animation),
      child: this.widget.child,
    });
  }
}

export default BaseAnimatedAlignWidget;
