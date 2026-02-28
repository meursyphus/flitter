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
  type Widget,
} from "flitter-core";
import type { BarChartContext, BarChartDirection } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "../config";

function IgnoreChildWidth({ child }: { child: Widget }): Widget {
  return Container({
    width: 0,
    child: ConstraintsTransformBox({
      constraintsTransform: ConstraintsTransformBox.unconstrained,
      alignment: Alignment.center,
      child,
    }),
  });
}

type AxisType = "label" | "value";

class _AnimatedXAxis extends StatefulWidget {
  line: Widget;
  labels: Widget[];
  tick: Widget;
  config: ToastStackedBarChartConfig;
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
    config: ToastStackedBarChartConfig;
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
    return new _AnimatedXAxisState();
  }
}

class _AnimatedXAxisState extends State<_AnimatedXAxis> {
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
    const tickCount = isLabel ? labels.length + 1 : labels.length;

    return Column({
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        line,
        FractionallySizedBox({
          widthFactor: animValue,
          alignment: Alignment.centerRight,
          child: Row({
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: Array.from({ length: tickCount }, (_, index) =>
              isLabel
                ? FractionalTranslation({
                    translation: new Offset({ x: index === 0 ? -0.5 : index === tickCount - 1 ? 0.5 : 0, y: 0 }),
                    child: tick,
                  })
                : FractionalTranslation({
                    translation: new Offset({ x: index === 0 ? -1 : 0, y: 0 }),
                    child: tick,
                  })
            ),
          }),
        }),
        SizedBox({ height: axis.label.gap }),
        FractionallySizedBox({
          widthFactor: animValue,
          alignment: Alignment.centerRight,
          child: Row({
            mainAxisAlignment: isLabel
              ? MainAxisAlignment.spaceAround
              : MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: labels.map((label) =>
              IgnoreChildWidth({ child: label })
            ),
          }),
        }),
      ],
    });
  }
}

export function toastXAxis(
  {
    line,
    labels,
    tick,
  }: { line: Widget; labels: Widget[]; tick: Widget },
  context: BarChartContext<ToastStackedBarChartConfig>
): Widget {
  const axisType: AxisType = context.direction === "vertical" ? "label" : "value";
  return new _AnimatedXAxis({ line, labels, tick, config: context.config, axisType });
}
