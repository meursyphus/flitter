
import Widget from "@flitterjs/react";
import { StackedAreaChart } from "flitter-chart";
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
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    { legend: "Organic", values: [40, 50, 60, 55, 70, 80] },
    { legend: "Paid", values: [30, 35, 40, 45, 50, 55] },
    { legend: "Referral", values: [20, 25, 20, 30, 25, 35] },
  ],
};

class AnimatedStackedArea extends StatefulWidget {
  values: number[];
  cumulativeValues: number[];
  index: number;
  scale: any;

  constructor({ values, cumulativeValues, index, scale }: any) {
    super();
    this.values = values;
    this.cumulativeValues = cumulativeValues;
    this.index = index;
    this.scale = scale;
  }

  createState() {
    return new AnimatedStackedAreaState();
  }
}

class AnimatedStackedAreaState extends State<AnimatedStackedArea> {
  animationController!: AnimationController;
  animation!: any;

  initState() {
    const { index } = this.widget as AnimatedStackedArea;
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
    const { values, cumulativeValues, index, scale } =
      this.widget as AnimatedStackedArea;
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
                areaPath: context.createSvgEl("path"),
                linePath: context.createSvgEl("path"),
              };
            },
            paint({ areaPath, linePath }: any, { width, height }: any) {
              const toY = (v: number) =>
                height -
                ((v - scale.min) / (scale.max - scale.min)) * height;
              const toX = (i: number) =>
                (i / (values.length - 1)) * width;

              const topPoints = cumulativeValues.map(
                (v: number, i: number) => ({
                  x: toX(i),
                  y: toY(v),
                })
              );
              const bottomValues = cumulativeValues.map(
                (v: number, i: number) => v - values[i]
              );
              const bottomPoints = bottomValues
                .map((v: number, i: number) => ({
                  x: toX(i),
                  y: toY(v),
                }))
                .reverse();

              const areaP = new Path();
              areaP.moveTo(topPoints[0]);
              topPoints.slice(1).forEach((p: any) => areaP.lineTo(p));
              bottomPoints.forEach((p: any) => areaP.lineTo(p));
              areaP.close();

              areaPath.setAttribute("fill", color);
              areaPath.setAttribute("opacity", "0.6");
              areaPath.setAttribute("d", areaP.getD());

              const lineP = new Path();
              lineP.moveTo(topPoints[0]);
              topPoints.slice(1).forEach((p: any) => lineP.lineTo(p));
              linePath.setAttribute("fill", "none");
              linePath.setAttribute("stroke", color);
              linePath.setAttribute("stroke-width", "2");
              linePath.setAttribute("d", lineP.getD());
            },
          },
        },
      }),
    });
  }
}

export default function ToastStackedAreaChart() {
  return (
    <Widget
      widget={StackedAreaChart({
        data,
        custom: {
          ...cartesianToastCustom,
          series: ({ areas }: any) =>
            Stack({
              children: areas.map((area: any) =>
                Positioned.fill({ child: area })
              ),
            }),
          area: (
            { values, cumulativeValues, index }: any,
            { scale }: any
          ) =>
            new AnimatedStackedArea({
              values,
              cumulativeValues,
              index,
              scale,
            }),
        },
      })}
      width="500px"
      height="350px"
      renderer="svg"
    />
  );
}
