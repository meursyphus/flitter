
import Widget from "@flitterjs/react";
import { Headless } from "flitter-chart";
import { cartesianToastCustom } from "./toastUtils";
import {
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  ClipRect,
  Rect,
  Opacity,
  Text,
  TextStyle,
  Container,
  EdgeInsets,
  Column,
  CrossAxisAlignment,
  MainAxisAlignment,
  Expanded,
  SizedBox,
  Flex,
  Axis,
} from "flitter-core";

const data = {
  labels: ["Math", "Science", "English", "History"],
  datasets: [
    {
      legend: "Scores",
      data: [
        { min: 45, q1: 60, median: 72, q3: 85, max: 98, outliers: [30] },
        { min: 50, q1: 65, median: 75, q3: 88, max: 95 },
        { min: 40, q1: 55, median: 68, q3: 80, max: 92, outliers: [25, 98] },
        { min: 55, q1: 62, median: 70, q3: 82, max: 90 },
      ],
    },
  ],
};

class AnimatedBoxPlotGroup extends StatefulWidget {
  children: any[];
  index: number;

  constructor({ children, index }: any) {
    super();
    this.children = children;
    this.index = index;
  }

  createState() {
    return new AnimatedBoxPlotGroupState();
  }
}

class AnimatedBoxPlotGroupState extends State<AnimatedBoxPlotGroup> {
  animationController!: AnimationController;
  growAnim!: any;
  opacityAnim!: any;

  initState() {
    const { index } = this.widget as AnimatedBoxPlotGroup;
    const staggerDelay = index * 120;
    this.animationController = new AnimationController({ duration: 500 });
    this.animationController.addListener(() => this.setState());
    this.growAnim = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    this.opacityAnim = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    setTimeout(() => this.animationController.forward(), staggerDelay);
  }

  build() {
    return Container({
      width: Infinity,
      height: Infinity,
      child: Opacity({
        opacity: this.opacityAnim.value,
        child: ClipRect({
          clipped: true,
          clipper: ({ width, height }: any) =>
            Rect.fromLTRB({
              left: 0,
              top: height * (1 - this.growAnim.value),
              right: width,
              bottom: height,
            }),
          child: Flex({
            direction: Axis.horizontal,
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: (this.widget as AnimatedBoxPlotGroup).children,
          }),
        }),
      }),
    });
  }
}

export default function ToastBoxPlotChart() {
  return (
    <Widget
      widget={Headless.BoxPlotChart({
        data,
        custom: {
          ...cartesianToastCustom,
          layout: ({ plot }: any) =>
            Container({
              padding: EdgeInsets.only({ left: 40, bottom: 30, top: 20, right: 15 }),
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
          boxPlotGroup: ({ boxPlots, index }: any) =>
            new AnimatedBoxPlotGroup({
              index,
              children: boxPlots,
            }),
        },
      })}
      width="500px"
      height="350px"
      renderer="svg"
    />
  );
}
