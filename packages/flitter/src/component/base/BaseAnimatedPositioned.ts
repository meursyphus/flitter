import type { Curve } from "../../animation";
import { Tween } from "../../animation";
import type { Data } from "../../type";
import type { Nullable } from "../../utils/type";
import type { Widget } from "../../widget";
import Positioned from "../Positioned";
import {
  ImplicitlyAnimatedWidget,
  AnimatedBaseWidgetState,
} from "../../widget/ImplicitlyAnimatedWidget";

class BaseAnimatedPositioned extends ImplicitlyAnimatedWidget {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  child?: Widget;

  constructor({
    child,
    curve,
    duration,
    key,
    width,
    height,
    top,
    left,
    right,
    bottom,
  }: {
    key?: any;
    child?: Widget;
    curve?: Curve;
    duration: number;
    width?: number;
    height?: number;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  }) {
    super({ key, curve, duration });
    this.child = child;
    this.width = width;
    this.height = height;
    this.top = top;
    this.left = left;
    this.right = right;
    this.bottom = bottom;
  }
  createState(): AnimatedBaseWidgetState<BaseAnimatedPositioned> {
    return new BaseAnimatedPositionedState();
  }
}

class BaseAnimatedPositionedState extends AnimatedBaseWidgetState<BaseAnimatedPositioned> {
  private width: Tween<number> | Nullable;
  private height: Tween<number> | Nullable;
  private top: Tween<number> | Nullable;
  private left: Tween<number> | Nullable;
  private bottom: Tween<number> | Nullable;
  private right: Tween<number> | Nullable;

  forEachTween(
    visitor: <V extends number | Data, T extends Tween<V>>(props: {
      tween: T;
      targetValue: V;
      constructor: (value: V) => T;
    }) => T
  ): void {
    this.width = visitor({
      tween: this.width,
      targetValue: this.widget.width,
      constructor: (value) => new Tween({ begin: value }),
    });
    this.height = visitor({
      tween: this.height,
      targetValue: this.widget.height,
      constructor: (value) => new Tween({ begin: value }),
    });
    this.top = visitor({
      tween: this.top,
      targetValue: this.widget.top,
      constructor: (value) => new Tween({ begin: value }),
    });
    this.left = visitor({
      tween: this.left,
      targetValue: this.widget.left,
      constructor: (value) => new Tween({ begin: value }),
    });
    this.right = visitor({
      tween: this.right,
      targetValue: this.widget.right,
      constructor: (value) => new Tween({ begin: value }),
    });
    this.bottom = visitor({
      tween: this.bottom,
      targetValue: this.widget.bottom,
      constructor: (value) => new Tween({ begin: value }),
    });
  }

  build(): Widget {
    return Positioned({
      width: this.width?.evaluate(this.animation),
      height: this.height?.evaluate(this.animation),
      top: this.top?.evaluate(this.animation),
      left: this.left?.evaluate(this.animation),
      right: this.right?.evaluate(this.animation),
      bottom: this.bottom?.evaluate(this.animation),
      child: this.widget.child,
    });
  }
}

export default BaseAnimatedPositioned;
