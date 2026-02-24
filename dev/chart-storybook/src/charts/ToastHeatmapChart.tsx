
import Widget from "@flitterjs/react";
import { HeatmapChart } from "flitter-chart";
import {
  Text,
  Container,
  EdgeInsets,
  TextStyle,
  Padding,
  Column,
  CrossAxisAlignment,
  SizedBox,
  Expanded,
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  Opacity,
  Transform,
} from "flitter-core";

const data = {
  xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  yLabels: ["Seoul", "Seattle", "Sydney", "Moscow", "Jungfrau"],
  values: [
    [-3.5, -1.1, 4.0, 11.3, 17.5, 21.5, 24.9, 25.2, 20.4, 13.9, 6.6, -0.6],
    [3.8, 5.6, 7.0, 9.1, 12.4, 15.3, 17.5, 17.8, 15.0, 10.6, 6.4, 3.7],
    [22.1, 22.0, 20.9, 18.3, 15.2, 12.8, 11.8, 13.0, 15.2, 17.6, 19.4, 21.2],
    [-10.3, -9.1, -4.1, 4.4, 12.2, 16.3, 18.5, 16.7, 10.9, 4.2, -2.0, -7.5],
    [-13.2, -13.7, -13.1, -10.3, -6.1, -3.2, 0.0, -0.1, -1.8, -4.5, -9.0, -10.9],
  ],
};

class AnimatedHeatmapCell extends StatefulWidget {
  child: any;
  xIndex: number;
  yIndex: number;

  constructor({ child, xIndex, yIndex }: any) {
    super();
    this.child = child;
    this.xIndex = xIndex;
    this.yIndex = yIndex;
  }

  createState() {
    return new AnimatedHeatmapCellState();
  }
}

class AnimatedHeatmapCellState extends State<AnimatedHeatmapCell> {
  animationController!: AnimationController;
  opacityAnim!: any;
  scaleAnim!: any;

  initState() {
    const { xIndex, yIndex } = this.widget as AnimatedHeatmapCell;
    // Diagonal wave: delay based on sum of indices
    const staggerDelay = (xIndex + yIndex) * 30;
    this.animationController = new AnimationController({ duration: 350 });
    this.animationController.addListener(() => this.setState());
    this.opacityAnim = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    this.scaleAnim = new Tween({ begin: 0.5, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    setTimeout(() => this.animationController.forward(), staggerDelay);
  }

  build() {
    return Opacity({
      opacity: this.opacityAnim.value,
      child: Transform.scale({
        scale: this.scaleAnim.value,
        child: (this.widget as AnimatedHeatmapCell).child,
      }),
    });
  }
}

export default function ToastHeatmapChart() {
  return (
    <Widget
      widget={HeatmapChart({
        data,
        custom: {
          layout: ({ plot }: any) =>
            Container({
              padding: EdgeInsets.only({ left: 70, bottom: 30, top: 30, right: 30 }),
              child: Column({
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text("Inspired by Toast", {
                    style: new TextStyle({
                      fontSize: 13,
                      color: "#999999",
                      fontFamily: "Noto Sans JP",
                    }),
                  }),
                  SizedBox({ height: 4 }),
                  Expanded({ child: plot }),
                ],
              }),
            }),
          xAxisLabel: ({ name }: any) =>
            Padding({
              padding: EdgeInsets.only({ top: 1 }),
              child: Text(name, {
                style: new TextStyle({
                  fontFamily: "Noto Sans JP",
                  fontSize: 11,
                  color: "#666666",
                }),
              }),
            }),
          yAxisLabel: ({ name }: any) =>
            Padding({
              padding: EdgeInsets.only({ right: 1 }),
              child: Text(name, {
                style: new TextStyle({
                  fontFamily: "Noto Sans JP",
                  fontSize: 11,
                  color: "#666666",
                }),
              }),
            }),
          xAxisTick: () => Container({ height: 6, width: 1, color: "#DDDDDD" }),
          yAxisTick: () => Container({ height: 1, width: 6, color: "#DDDDDD" }),
          xAxisLine: () => Container({ color: "#BBBBBB", width: Infinity, height: 1 }),
          yAxisLine: () => Container({ color: "#BBBBBB", width: 1, height: Infinity }),
          segment: ({ value, xIndex, yIndex }: any, { scale }: any) => {
            const ratio = (value - scale.min) / (scale.max - scale.min);
            const r = Math.round(220 - 30 * ratio);
            const g = Math.round((220 - 30 * ratio) * (1 - ratio));
            const b = Math.round(30 * (1 - ratio));
            return new AnimatedHeatmapCell({
              xIndex,
              yIndex,
              child: Container({
                width: Infinity,
                height: Infinity,
                color: `rgba(${r}, ${g}, ${b}, 0.8)`,
              }),
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
