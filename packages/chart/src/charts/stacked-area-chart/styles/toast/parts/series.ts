import {
  StatefulWidget,
  State,
  AnimationController,
  CurvedAnimation,
  Curves,
  Tween,
  ClipRect,
  Stack,
  Positioned,
  type Widget,
  Rect,
} from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";

class _MountReveal extends StatefulWidget {
  child: Widget;
  duration: number;

  constructor({ child, duration }: { child: Widget; duration: number }) {
    super();
    this.child = child;
    this.duration = duration;
  }

  createState() {
    return new _MountRevealState();
  }
}

class _MountRevealState extends State<_MountReveal> {
  controller!: AnimationController;
  tween!: { value: number };

  override initState() {
    this.controller = new AnimationController({ duration: this.widget.duration });
    this.controller.addListener(() => this.setState());
    this.tween = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({ parent: this.controller, curve: Curves.easeInOut }),
    );
    this.controller.forward();
  }

  override dispose() {
    this.controller.dispose();
  }

  override build() {
    const t = this.tween.value;
    return ClipRect({
      clipper: (size) =>
        Rect.fromLTRB({
          left: 0,
          top: 0,
          right: size.width * t,
          bottom: size.height,
        }),
      child: this.widget.child,
    });
  }
}

export function toastSeries(
  ...[args, ctx]: Parameters<StackedAreaChartCustom<ToastStackedAreaChartConfig>["series"]>
) {
  const { areas } = args;
  const datasets = ctx.data.datasets;
  const { animation } = ctx.config;

  const stack = Stack({
    children: areas.map((area, i) =>
      Positioned({
        key: datasets[i]?.legend ?? i,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        child: area,
      }),
    ),
  });

  if (!animation.enabled) return stack;

  return new _MountReveal({
    child: stack,
    duration: animation.duration,
  });
}
