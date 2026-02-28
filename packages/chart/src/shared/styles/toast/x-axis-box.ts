import {
  StatefulWidget,
  State,
  AnimationController,
  CurvedAnimation,
  Curves,
  Alignment,
  FractionallySizedBox,
  Tween,
  type Widget,
} from "flitter-core";
import type { ToastBaseConfig } from "./config";

class _AnimatedXAxisBox extends StatefulWidget {
  child: Widget;
  animationConfig: ToastBaseConfig["animation"];

  constructor({
    child,
    animationConfig,
  }: {
    child: Widget;
    animationConfig: ToastBaseConfig["animation"];
  }) {
    super();
    this.child = child;
    this.animationConfig = animationConfig;
  }

  createState() {
    return new _AnimatedXAxisBoxState();
  }
}

class _AnimatedXAxisBoxState extends State<_AnimatedXAxisBox> {
  animationController!: AnimationController;
  tweenAnimation!: { value: number };

  override initState() {
    const { animationConfig } = this.widget;
    this.animationController = new AnimationController({
      duration: animationConfig.duration,
    });
    this.animationController.addListener(() => this.setState());
    const tween = new Tween({ begin: 0, end: 1 });
    this.tweenAnimation = tween.animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeInOut,
      })
    );
    if (animationConfig.enabled) {
      this.animationController.forward();
    } else {
      this.animationController.duration = 0;
      this.animationController.forward();
    }
  }

  override dispose() {
    this.animationController.dispose();
  }

  override build() {
    const { child } = this.widget;
    return FractionallySizedBox({
      widthFactor: this.tweenAnimation.value,
      alignment: Alignment.centerLeft,
      child,
    });
  }
}

export function toastXAxisBox(
  { child }: { child: Widget },
  context: { config: ToastBaseConfig },
): Widget {
  return new _AnimatedXAxisBox({
    child,
    animationConfig: context.config.animation,
  });
}
