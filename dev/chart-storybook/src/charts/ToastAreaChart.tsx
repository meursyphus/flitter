
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

class AnimatedArea extends StatefulWidget {
  values: number[];
  index: number;
  scale: any;

  constructor({ values, index, scale }: any) {
    super();
    this.values = values;
    this.index = index;
    this.scale = scale;
  }

  createState() {
    return new AnimatedAreaState();
  }
}

class AnimatedAreaState extends State<AnimatedArea> {
  animationController!: AnimationController;
  animation!: any;

  initState() {
    const { index } = this.widget as AnimatedArea;
    this.animationController = new AnimationController({ duration: 700 });
    this.animationController.addListener(() => this.setState());
    this.animation = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    setTimeout(() => this.animationController.forward(), index * 120);
  }

  build() {
    const { values, index, scale } = this.widget as AnimatedArea;
    const progress = this.animation.value;
    const color = TOAST_COLORS[index % TOAST_COLORS.length];

    return ClipRect({
      clipped: true,
      clipper: ({ width, height }: any) =>
        Rect.fromLTWH({
          left: 0,
          top: 0,
          width: width * progress,
          height,
        }),
      child: CustomPaint({
        painter: {
          svg: {
            createDefaultSvgEl(context: any) {
              return {
                linePath: context.createSvgEl("path"),
                areaPath: context.createSvgEl("path"),
              };
            },
            paint({ linePath, areaPath }: any, { width, height }: any) {
              const path = new Path();
              const points = values.map((val: number, i: number) => ({
                x: (i / (values.length - 1)) * width,
                y: height - ((val - scale.min) / (scale.max - scale.min)) * height,
              }));
              path.moveTo(points[0]);
              points.slice(1).forEach((p: any) => path.lineTo(p));

              linePath.setAttribute("stroke", color);
              linePath.setAttribute("fill", "none");
              linePath.setAttribute("stroke-width", "2");
              linePath.setAttribute("d", path.getD());

              const zeroY = height - ((0 - scale.min) / (scale.max - scale.min)) * height;
              path.lineTo({ x: width, y: zeroY }).lineTo({ x: 0, y: zeroY }).close();
              areaPath.setAttribute("fill", color);
              areaPath.setAttribute("opacity", "0.3");
              areaPath.setAttribute("d", path.getD());
            },
          },
        },
      }),
    });
  }
}

export default function ToastAreaChart() {
  return (
    <Widget
      widget={Headless.AreaChart({
        data,
        custom: {
          ...cartesianToastCustom,
          series: ({ areas }: any) =>
            Stack({
              children: areas.map((area: any) =>
                Positioned.fill({ child: area })
              ),
            }),
          area: ({ values, index }: any, { scale }: any) =>
            new AnimatedArea({ values, index, scale }),
        },
      })}
      width="500px"
      height="350px"
      renderer="svg"
    />
  );
}
