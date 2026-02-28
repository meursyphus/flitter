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
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";

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

class _AnimatedXAxis extends StatefulWidget {
  line: Widget;
  labels: Widget[];
  tick: Widget;
  config: ToastBubbleChartConfig;

  constructor({
    line,
    labels,
    tick,
    config,
  }: {
    line: Widget;
    labels: Widget[];
    tick: Widget;
    config: ToastBubbleChartConfig;
  }) {
    super();
    this.line = line;
    this.labels = labels;
    this.tick = tick;
    this.config = config;
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
    const { line, labels, tick } = this.widget;
    const { axis } = this.widget.config;
    const animValue = this.tweenAnimation.value;

    // Bubble chart x-axis is always "value" type (numeric)
    const tickCount = labels.length;

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
              FractionalTranslation({
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
  context: BubbleChartContext<ToastBubbleChartConfig>
): Widget {
  return new _AnimatedXAxis({ line, labels, tick, config: context.config });
}
