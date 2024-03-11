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

class BaseAnimatedRotation extends ImplicitlyAnimatedWidget {
  turns: number;
  child?: Widget;
  alignment: Alignment;

  constructor({
    child,
    curve,
    duration,
    key,
    turns,
    alignment = Alignment.center,
  }: {
    key?: any;
    child?: Widget;
    curve?: Curve;
    duration: number;
    alignment?: Alignment;
    turns: number;
  }) {
    super({ key, curve, duration });
    this.child = child;
    this.turns = turns;
    this.alignment = alignment;
  }
  createState(): AnimatedBaseWidgetState<BaseAnimatedRotation> {
    return new BaseAnimatedRotationState();
  }
}

class BaseAnimatedRotationState extends AnimatedBaseWidgetState<BaseAnimatedRotation> {
  private turns: Tween<number> | Nullable;

  forEachTween(
    visitor: <V extends number | Data, T extends Tween<V>>(props: {
      tween: T;
      targetValue: V;
      constructor: (value: V) => T;
    }) => T
  ): void {
    this.turns = visitor({
      tween: this.turns,
      targetValue: this.widget.turns,
      constructor: (value) => new Tween({ begin: value }),
    });
  }

  build(): Widget {
    return Transform.rotate({
      angle: (this.turns?.evaluate(this.animation) ?? 0) * Math.PI * 2,
      alignment: this.widget.alignment,
      child: this.widget.child,
    });
  }
}

export default BaseAnimatedRotation;
