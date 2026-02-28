import {
  Container,
  Row,
  Column,
  StatefulWidget,
  State,
  AnimationController,
  CurvedAnimation,
  Curves,
  ConstraintsTransformBox,
  Alignment,
  FractionallySizedBox,
  FractionalTranslation,
  Offset,
  MainAxisSize,
  MainAxisAlignment,
  CrossAxisAlignment,
  SizedBox,
  Tween,
  VerticalDirection,
  type Widget,
} from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "./config";

function IgnoreChildHeight({ child }: { child: Widget }): Widget {
  return Container({
    height: 0,
    child: ConstraintsTransformBox({
      constraintsTransform: ConstraintsTransformBox.unconstrained,
      alignment: Alignment.center,
      child,
    }),
  });
}

class _AnimatedYAxis extends StatefulWidget {
  line: Widget;
  labels: Widget[];
  tick: Widget;
  config: ToastStackedAreaChartConfig;

  constructor({
    line,
    labels,
    tick,
    config,
  }: {
    line: Widget;
    labels: Widget[];
    tick: Widget;
    config: ToastStackedAreaChartConfig;
  }) {
    super();
    this.line = line;
    this.labels = labels;
    this.tick = tick;
    this.config = config;
  }

  createState() {
    return new _AnimatedYAxisState();
  }
}

class _AnimatedYAxisState extends State<_AnimatedYAxis> {
  animationController!: AnimationController;
  tweenAnimation!: { value: number };

  override initState() {
    const { config } = this.widget;
    this.animationController = new AnimationController({
      duration: config.animation.duration,
    });
    this.animationController.addListener(() => this.setState());
    const tween = new Tween({ begin: 0, end: 1 });
    this.tweenAnimation = tween.animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeInOut,
      }),
    );
    if (config.animation.enabled) {
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
    const { line, labels, tick } = this.widget;
    const { axis } = this.widget.config;
    const animValue = this.tweenAnimation.value;

    // Stacked area chart always has value y-axis
    const tickCount = labels.length;

    return Row({
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        FractionallySizedBox({
          heightFactor: animValue,
          alignment: Alignment.bottomCenter,
          child: Column({
            verticalDirection: VerticalDirection.up,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: labels.map((label) =>
              IgnoreChildHeight({ child: label }),
            ),
          }),
        }),
        SizedBox({ width: axis.label.gap }),
        FractionallySizedBox({
          heightFactor: animValue,
          alignment: Alignment.bottomCenter,
          child: Column({
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: Array.from({ length: tickCount }, (_, index) =>
              FractionalTranslation({
                translation: new Offset({
                  y: index === tickCount - 1 ? 1 : 0,
                  x: 0,
                }),
                child: tick,
              }),
            ),
          }),
        }),
        line,
      ],
    });
  }
}

export function createToastYAxis(vc: ToastStackedAreaChartConfig) {
  return function toastYAxis(
    ...[{ line, labels, tick }]: Parameters<StackedAreaChartCustom["yAxis"]>
  ): Widget {
    return new _AnimatedYAxis({ line, labels, tick, config: vc });
  };
}
