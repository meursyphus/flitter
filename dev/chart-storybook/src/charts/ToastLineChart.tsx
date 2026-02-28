
import Widget from "@flitterjs/react";
import { Headless } from "flitter-chart";
import { cartesianToastCustom, TOAST_COLORS } from "./toastUtils";
import {
  CustomPaint,
  Path,
  Stack,
  Positioned,
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  ClipRect,
  Rect,
} from "flitter-core";

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Housing starts (MoM %)", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
    { legend: "Unemployment rate Δ (pp)", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
    { legend: "CPI MoM (1/10 index pts)", values: [0, 12.69, 13.78, 6.78, 1.52, -1.31, 5.25, 4.93, 6.70, 8.99, 8.97, 10.76] },
  ],
};

class AnimatedLineClip extends StatefulWidget {
  child: any;
  index: number;

  constructor({ child, index }: any) {
    super();
    this.child = child;
    this.index = index;
  }

  createState() {
    return new AnimatedLineClipState();
  }
}

class AnimatedLineClipState extends State<AnimatedLineClip> {
  animationController!: AnimationController;
  animation!: any;

  initState() {
    const { index } = this.widget as AnimatedLineClip;
    this.animationController = new AnimationController({ duration: 800 });
    this.animationController.addListener(() => this.setState());
    this.animation = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeInOut,
      })
    );
    setTimeout(() => this.animationController.forward(), index * 200);
  }

  build() {
    const { child } = this.widget as AnimatedLineClip;
    return ClipRect({
      clipped: true,
      clipper: ({ width, height }: any) =>
        Rect.fromLTWH({
          left: 0,
          top: 0,
          width: width * this.animation.value,
          height,
        }),
      child,
    });
  }
}

export default function ToastLineChart() {
  return (
    <Widget
      widget={Headless.LineChart({
        data,
        custom: {
          ...cartesianToastCustom,
          series: ({ lines }: any) =>
            Stack({
              children: lines.map((line: any, i: number) =>
                Positioned.fill({
                  child: new AnimatedLineClip({ child: line, index: i }),
                })
              ),
            }),
          line: ({ values, index }: any, { scale }: any) => {
            return CustomPaint({
              painter: {
                svg: {
                  createDefaultSvgEl(context: any) {
                    return { line: context.createSvgEl("path") };
                  },
                  paint({ line }: any, { height, width }: any) {
                    const linePath = new Path();
                    const points = values.map((value: number, i: number) => ({
                      x: (i * width) / (values.length - 1),
                      y: height - (height * (value - scale.min)) / (scale.max - scale.min),
                    }));
                    linePath.moveTo(points[0]);
                    points.slice(1).forEach((p: any) => linePath.lineTo(p));
                    line.setAttribute("fill", "none");
                    line.setAttribute("stroke", TOAST_COLORS[index % TOAST_COLORS.length]);
                    line.setAttribute("stroke-width", "2");
                    line.setAttribute("d", linePath.getD());
                  },
                },
              },
            });
          },
        },
      })}
      width="500px"
      height="350px"
      renderer="svg"
    />
  );
}
