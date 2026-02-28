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
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "../config";

class _AnimatedYAxisBox extends StatefulWidget {
  child: Widget;
  animationConfig: ToastBarChartConfig["animation"];

  constructor({
    child,
    animationConfig,
  }: {
    child: Widget;
    animationConfig: ToastBarChartConfig["animation"];
  }) {
    super();
    this.child = child;
    this.animationConfig = animationConfig;
  }

  createState() {
    return new _AnimatedYAxisBoxState();
  }
}

class _AnimatedYAxisBoxState extends State<_AnimatedYAxisBox> {
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
      heightFactor: this.tweenAnimation.value,
      alignment: Alignment.bottomCenter,
      child,
    });
  }
}

export function toastYAxisBox(
  { child }: { child: Widget },
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  return new _AnimatedYAxisBox({
    child,
    animationConfig: context.config.animation,
  });
}
