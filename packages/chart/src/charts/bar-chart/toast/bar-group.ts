import {
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  ClipRect,
  Rect,
  Container,
  Flex,
  Axis,
  CrossAxisAlignment,
  MainAxisAlignment,
  FractionallySizedBox,
  Alignment,
  Padding,
  EdgeInsets,
  Flexible,
  Expanded,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { BarChartContext, BarChartDirection } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

class _AnimatedBarGroup extends StatefulWidget {
  bars: Widget[];
  values: number[];
  scale: { min: number; max: number; step: number };
  groupIndex: number;
  animationConfig: ToastBarChartConfig["animation"];
  direction: BarChartDirection;

  constructor({
    bars,
    values,
    scale,
    groupIndex,
    animationConfig,
    direction,
  }: {
    bars: Widget[];
    values: number[];
    scale: { min: number; max: number; step: number };
    groupIndex: number;
    animationConfig: ToastBarChartConfig["animation"];
    direction: BarChartDirection;
  }) {
    super();
    this.bars = bars;
    this.values = values;
    this.scale = scale;
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
    const { bars, values, scale, direction } = this.widget;
    const isHorizontal = direction === "horizontal";
    const isVertical = !isHorizontal;
    const total = scale.max - scale.min;
    const hasNegative = scale.min < 0;

    return ClipRect({
      clipped: true,
      clipper: ({ width, height }: { width: number; height: number }) => {
        const v = this.tweenAnimation.value;
        return isHorizontal
          ? Rect.fromLTRB({ left: 0, top: 0, right: width * v, bottom: height })
          : Rect.fromLTRB({ left: 0, top: height * (1 - v), right: width, bottom: height });
      },
      child: Container({
        width: Infinity,
        height: Infinity,
        child: Flex({
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: isHorizontal ? CrossAxisAlignment.start : CrossAxisAlignment.end,
          direction: isHorizontal ? Axis.vertical : Axis.horizontal,
          children: bars.map((bar: Widget, index: number) => {
            const value = values[index];
            const barWidget = Padding({
              padding: EdgeInsets.symmetric(
                isHorizontal ? { vertical: 2 } : { horizontal: 2 }
              ),
              child: bar,
            });

            if (!hasNegative) {
              return Flexible({
                flex: 1,
                child: FractionallySizedBox({
                  alignment: isHorizontal ? Alignment.centerLeft : Alignment.bottomCenter,
                  widthFactor: isHorizontal ? value / total : undefined,
                  heightFactor: isVertical ? value / total : undefined,
                  child: barWidget,
                }),
              });
            }

            const positiveMax = scale.max;
            const negativeMax = Math.abs(scale.min);
            const isPositive = value >= 0;

            const positiveChild = isPositive
              ? FractionallySizedBox({
                  alignment: isVertical ? Alignment.bottomCenter : Alignment.centerLeft,
                  widthFactor: isHorizontal ? value / positiveMax : undefined,
                  heightFactor: isVertical ? value / positiveMax : undefined,
                  child: barWidget,
                })
              : SizedBox.shrink();

            const negativeChild = !isPositive
              ? FractionallySizedBox({
                  alignment: isVertical ? Alignment.topCenter : Alignment.centerRight,
                  widthFactor: isHorizontal ? Math.abs(value) / negativeMax : undefined,
                  heightFactor: isVertical ? Math.abs(value) / negativeMax : undefined,
                  child: barWidget,
                })
              : SizedBox.shrink();

            if (isVertical) {
              return Flexible({
                flex: 1,
                child: Flex({
                  direction: Axis.vertical,
                  children: [
                    Expanded({ flex: positiveMax, child: positiveChild }),
                    Expanded({ flex: negativeMax, child: negativeChild }),
                  ],
                }),
              });
            } else {
              return Flexible({
                flex: 1,
                child: Flex({
                  direction: Axis.horizontal,
                  children: [
                    Expanded({ flex: negativeMax, child: negativeChild }),
                    Expanded({ flex: positiveMax, child: positiveChild }),
                  ],
                }),
              });
            }
          }),
        }),
      }),
    });
  }
}

export function toastBarGroup(
  { bars, values, index }: { bars: Widget[]; index: number; label: string; values: number[] },
  context: BarChartContext<ToastBarChartConfig>
) {
  return new _AnimatedBarGroup({
    bars,
    values,
    scale: context.scale!,
    groupIndex: index,
    animationConfig: context.config.animation,
    direction: context.direction,
  });
}
