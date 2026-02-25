
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
  labels: ["plane", "helicopter", "boat", "train", "subway", "bus", "car", "moto", "bicycle", "horse", "skateboard", "others"],
  datasets: [
    { legend: "Norway", values: [600, 1000, 800, 1000, 500, 850, 600, 675, 720, 890, 700, 950] },
    { legend: "Germany", values: [565, 850, 734, 863, 268, 571, 396, 588, 442, 726, 640, 732] },
    { legend: "US", values: [435, 559, 482, 580, 167, 308, 255, 557, 437, 438, 543, 554] },
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
