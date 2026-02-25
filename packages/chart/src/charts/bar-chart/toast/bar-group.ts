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
  type Widget,
} from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

class _AnimatedBarGroup extends StatefulWidget {
  bars: Widget[];
  values: number[];
  scale: { min: number; max: number; step: number };
  groupIndex: number;
  animationConfig: ToastBarChartConfig["animation"];

  constructor({
    bars,
    values,
    scale,
    groupIndex,
    animationConfig,
  }: {
    bars: Widget[];
    values: number[];
    scale: { min: number; max: number; step: number };
    groupIndex: number;
    animationConfig: ToastBarChartConfig["animation"];
  }) {
    super();
    this.bars = bars;
    this.values = values;
    this.scale = scale;
    this.groupIndex = groupIndex;
    this.animationConfig = animationConfig;
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
    const { bars, values, scale } = this.widget;
    const total = scale.max - scale.min;
    const ratios = values.map((value: number) => value / total);

    return ClipRect({
      clipped: true,
      clipper: ({ width, height }: { width: number; height: number }) => {
        return Rect.fromLTRB({
          left: 0,
          top: height * (1 - this.tweenAnimation.value),
          right: width,
          bottom: height,
        });
      },
      child: Container({
        width: Infinity,
        height: Infinity,
        child: Flex({
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          direction: Axis.horizontal,
          children: bars.map((bar: Widget, index: number) =>
            Flexible({
              flex: 1,
              child: FractionallySizedBox({
                alignment: Alignment.centerLeft,
                heightFactor: ratios[index],
                child: Padding({
                  padding: EdgeInsets.symmetric({ horizontal: 2 }),
                  child: bar,
                }),
              }),
            })
          ),
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
    scale: context.scale,
    groupIndex: index,
    animationConfig: context.config.animation,
  });
}
