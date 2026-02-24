
import Widget from "@flitterjs/react";
import { PieChart } from "flitter-chart";
import { TOAST_COLORS } from "./toastUtils";
import {
  Text,
  Container,
  EdgeInsets,
  TextStyle,
  Row,
  SizedBox,
  BoxDecoration,
  BorderRadius,
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  Transform,
  Opacity,
  Alignment,
  Column,
  CrossAxisAlignment,
  Expanded,
} from "flitter-core";

const data = {
  labels: ["Chrome", "Safari", "Firefox", "Edge", "Other"],
  values: [65, 18, 8, 5, 4],
};

class AnimatedPie extends StatefulWidget {
  pie: any;

  constructor({ pie }: any) {
    super();
    this.pie = pie;
  }

  createState() {
    return new AnimatedPieState();
  }
}

class AnimatedPieState extends State<AnimatedPie> {
  animationController!: AnimationController;
  scaleAnim!: any;
  opacityAnim!: any;

  initState() {
    this.animationController = new AnimationController({ duration: 700 });
    this.animationController.addListener(() => this.setState());
    this.scaleAnim = new Tween({ begin: 0, end: 1 }).animated(
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
    this.animationController.forward();
  }

  build() {
    const { pie } = this.widget as AnimatedPie;
    return Opacity({
      opacity: Math.min(this.opacityAnim.value, 1),
      child: Transform.scale({
        scale: this.scaleAnim.value,
        alignment: Alignment.center,
        child: pie,
      }),
    });
  }
}

export default function ToastPieChart() {
  return (
    <Widget
      widget={PieChart({
        data,
        custom: {
          layout: ({ pie }: any) =>
            Container({
              padding: EdgeInsets.all(20),
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
                  Expanded({ child: new AnimatedPie({ pie }) }),
                ],
              }),
            }),
          legend: ({ name, index }: any) =>
            Row({
              children: [
                Container({
                  width: 10,
                  height: 10,
                  decoration: new BoxDecoration({
                    color: TOAST_COLORS[index % TOAST_COLORS.length],
                    borderRadius: BorderRadius.circular(2),
                  }),
                }),
                SizedBox({ width: 6 }),
                Text(name, {
                  style: new TextStyle({
                    fontFamily: "Noto Sans JP",
                    fontSize: 12,
                    color: "#666666",
                  }),
                }),
              ],
            }),
        },
        colors: TOAST_COLORS.slice(0, data.labels.length),
      })}
      width="500px"
      height="350px"
      renderer="svg"
    />
  );
}
