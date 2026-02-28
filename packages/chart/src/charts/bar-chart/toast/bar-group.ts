import {
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  ClipRect,
  Rect,
  type Widget,
} from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

class _AnimatedBarGroup extends StatefulWidget {
  child: Widget;
  groupIndex: number;
  animationConfig: ToastBarChartConfig["animation"];
  direction: "vertical" | "horizontal";

  constructor({
    child,
    groupIndex,
    animationConfig,
    direction,
  }: {
    child: Widget;
    groupIndex: number;
    animationConfig: ToastBarChartConfig["animation"];
    direction: "vertical" | "horizontal";
  }) {
    super();
    this.child = child;
    this.groupIndex = groupIndex;
    this.animationConfig = animationConfig;
    this.direction = direction;
  }

  createState() {
    return new _AnimatedBarGroupState();
  }
}

class _AnimatedBarGroupState extends State<_AnimatedBarGroup> {
  animationController!: AnimationController;
  tweenAnimation!: { value: number };

  override initState() {
    const { groupIndex, animationConfig } = this.widget;
    this.animationController = new AnimationController({
      duration: animationConfig.duration,
    });
    this.animationController.addListener(() => this.setState());
    const tween = new Tween({ begin: 0, end: 1 });
    this.tweenAnimation = tween.animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    if (animationConfig.enabled) {
      setTimeout(
        () => this.animationController.forward(),
        groupIndex * animationConfig.staggerDelay
      );
    } else {
      this.animationController.duration = 0;
      this.animationController.forward();
    }
  }

  override dispose() {
    this.animationController.dispose();
  }

  override build() {
    const { child, direction } = this.widget;
    const isHorizontal = direction === "horizontal";

    return ClipRect({
      clipped: true,
      clipper: ({ width, height }: { width: number; height: number }) => {
        const v = this.tweenAnimation.value;
        return isHorizontal
          ? Rect.fromLTRB({ left: 0, top: 0, right: width * v, bottom: height })
          : Rect.fromLTRB({ left: 0, top: height * (1 - v), right: width, bottom: height });
      },
      child,
    });
  }
}

export function toastBarGroup(
  { child, index }: { child: Widget; index: number; label: string },
  context: BarChartContext<ToastBarChartConfig>
) {
  return new _AnimatedBarGroup({
    child,
    groupIndex: index,
    animationConfig: context.config.animation,
    direction: context.direction,
  });
}
