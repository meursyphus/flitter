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
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastLineChartConfig } from "../config";

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
  config: ToastLineChartConfig;

  constructor({
    line,
    labels,
    tick,
    config,
  }: {
    line: Widget;
    labels: Widget[];
    tick: Widget;
    config: ToastLineChartConfig;
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

    // Line chart x-axis is always label axis
    const tickCount = labels.length + 1;

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
                translation: new Offset({ x: index === 0 ? -0.5 : index === tickCount - 1 ? 0.5 : 0, y: 0 }),
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
            mainAxisAlignment: MainAxisAlignment.spaceAround,
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
  context: LineChartContext<ToastLineChartConfig>
): Widget {
  return new _AnimatedXAxis({ line, labels, tick, config: context.config });
}
