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
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

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

type AxisType = "label" | "value";

class _AnimatedYAxis extends StatefulWidget {
  line: Widget;
  labels: Widget[];
  tick: Widget;
  config: ToastBarChartConfig;
  axisType: AxisType;

  constructor({
    line,
    labels,
    tick,
    config,
    axisType,
  }: {
    line: Widget;
    labels: Widget[];
    tick: Widget;
    config: ToastBarChartConfig;
    axisType: AxisType;
  }) {
    super();
    this.line = line;
    this.labels = labels;
    this.tick = tick;
    this.config = config;
    this.axisType = axisType;
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
      })
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
    const { line, labels, tick, axisType } = this.widget;
    const { axis } = this.widget.config;
    const animValue = this.tweenAnimation.value;

    const isLabel = axisType === "label";
    const tickCount = labels.length + (isLabel ? 1 : 0);

    return Row({
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        FractionallySizedBox({
          heightFactor: animValue,
          alignment: Alignment.bottomCenter,
          child: Column({
            verticalDirection: isLabel ? VerticalDirection.down : VerticalDirection.up,
            mainAxisAlignment: isLabel
              ? MainAxisAlignment.spaceAround
              : MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: labels.map((label) =>
              IgnoreChildHeight({ child: label })
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
              })
            ),
          }),
        }),
        line,
      ],
    });
  }
}

export function toastYAxis(
  {
    line,
    labels,
    tick,
  }: { line: Widget; labels: Widget[]; tick: Widget },
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const axisType: AxisType = context.direction === "vertical" ? "value" : "label";
  return new _AnimatedYAxis({ line, labels, tick, config: context.config, axisType });
}
