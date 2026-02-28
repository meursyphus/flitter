import {
  Container,
  BoxDecoration,
  Opacity,
  StatefulWidget,
  State,
  AnimationController,
  CurvedAnimation,
  Curves,
  Tween,
  Transform,
  Alignment,
  type Widget,
} from "flitter-core";
import type { BubbleChartCustom } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";

class _MountScale extends StatefulWidget {
  child: Widget;
  duration: number;

  constructor({ key, child, duration }: { key?: any; child: Widget; duration: number }) {
    super(key);
    this.child = child;
    this.duration = duration;
  }

  createState() {
    return new _MountScaleState();
  }
}

class _MountScaleState extends State<_MountScale> {
  controller!: AnimationController;
  tween!: { value: number };

  override initState() {
    this.controller = new AnimationController({ duration: this.widget.duration });
    this.controller.addListener(() => this.setState());
    this.tween = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({ parent: this.controller, curve: Curves.easeOut }),
    );
    this.controller.forward();
  }

  override dispose() {
    this.controller.dispose();
  }

  override build() {
    return Transform.scale({
      scale: this.tween.value,
      alignment: Alignment.center,
      child: this.widget.child,
    });
  }
}

export function toastBubble(
  ...[{ value, legend, label }, ctx]: Parameters<BubbleChartCustom<ToastBubbleChartConfig>["bubble"]>
) {
  const { colors, bubble: bubbleConfig, animation } = ctx.config;
  const idx = ctx.legends.indexOf(legend);
  const color = colors[idx % colors.length];

  const { scale } = ctx;
  const normValue = scale != null
    ? (value - scale.value.min) / (scale.value.max - scale.value.min || 1)
    : 0.5;
  const radius = bubbleConfig.minRadius + normValue * (bubbleConfig.maxRadius - bubbleConfig.minRadius);

  const bubble = Opacity({
    opacity: bubbleConfig.opacity,
    child: Container({
      width: radius * 2,
      height: radius * 2,
      decoration: new BoxDecoration({
        color,
        shape: "circle",
      }),
    }),
  });

  if (!animation.enabled) return bubble;

  return new _MountScale({
    key: `${legend}-${label}`,
    duration: animation.duration,
    child: bubble,
  });
}
