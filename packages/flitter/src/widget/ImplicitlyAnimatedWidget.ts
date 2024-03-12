import {
  AnimationController,
  type Curve,
  CurvedAnimation,
  Curves,
  type Tween,
} from "../animation";
import { State } from "../element/StatefulElement";
import type { BuildContext } from "../element";
import type { Calculable, Data } from "../type";
import type { Nullable } from "../utils/type";
import StatefulWidget from "./StatefulWidget";

export class ImplicitlyAnimatedWidget extends StatefulWidget {
  curve: Curve;
  duration: number;
  constructor({
    key,
    curve = Curves.linear,
    duration,
  }: {
    key?: any;
    curve?: Curve;
    duration: number;
  }) {
    super(key);
    this.curve = curve;
    this.duration = duration;
  }

  createState(): State<StatefulWidget> {
    return new ImplicitlyAnimatedWidgetState();
  }
}

export default ImplicitlyAnimatedWidget;

export class ImplicitlyAnimatedWidgetState<
  T extends ImplicitlyAnimatedWidget
> extends State<T> {
  protected controller: AnimationController;
  protected animation: CurvedAnimation;

  constructor() {
    super();
  }

  initState(context: BuildContext): void {
    super.initState(context);

    this.controller = new AnimationController({
      duration: this.widget.duration,
    });
    this.animation = this.createCurve();
    this.constructTweens();
    this.didUpdateTweens();
  }

  didUpdateWidget(oldWidget: T): void {
    super.didUpdateWidget(oldWidget);
    if (this.widget.curve !== oldWidget.curve) {
      this.animation.dispose();
      this.animation = this.createCurve();
    }
    this.controller.duration = this.widget.duration;
    if (this.constructTweens()) {
      this.controller.reset();
      this.controller.forward();
      this.didUpdateTweens();
    }
  }

  private createCurve() {
    return new CurvedAnimation({
      curve: this.widget?.curve,
      parent: this.controller,
    });
  }

  private constructTweens() {
    let shouldStartAnimation = false;
    this.forEachTween(({ tween, targetValue, constructor }) => {
      if (targetValue == null) {
        return null;
      }

      if (tween == null) {
        return constructor(targetValue);
      }

      if (this.shouldAnimateTween(tween, targetValue)) {
        shouldStartAnimation = true;
        this.updateTween(tween, targetValue);
      }

      return tween as any;
    });

    return shouldStartAnimation;
  }

  private updateTween(
    tween: Tween<Data | number>,
    targetValue: Data | number
  ): void {
    tween.begin = tween.evaluate(this.animation);
    tween.end = targetValue;
  }

  private shouldAnimateTween(
    tween: Tween<Data | number>,
    targetValue: Data | number
  ): boolean {
    const { end } = tween;
    if (typeof end === "number") {
      const target = targetValue as number;
      return end !== target;
    } else {
      const target = targetValue as Calculable;
      return !end.equals(target);
    }
  }

  didUpdateTweens() {}

  forEachTween(
    _: <V extends Data | number, T extends Tween<V>>(props: {
      tween: T | Nullable;
      targetValue: V | Nullable;
      constructor: (value: V) => T;
    }) => T | Nullable
  ) {
    throw new Error("forEachTween must be implemented");
  }

  dispose(): void {
    super.dispose();
    this.controller.dispose();
  }
}

export class AnimatedBaseWidgetState<
  T extends ImplicitlyAnimatedWidget
> extends ImplicitlyAnimatedWidgetState<T> {
  initState(context: BuildContext): void {
    super.initState(context);
    this.controller.addListener(() => {
      this.handleChange();
    });
  }
  private handleChange() {
    this.setState(() => {});
  }
}
