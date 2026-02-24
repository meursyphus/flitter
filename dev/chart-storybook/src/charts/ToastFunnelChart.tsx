
import Widget from "@flitterjs/react";
import { FunnelChart } from "flitter-chart";
import {
  Text,
  TextStyle,
  Container,
  EdgeInsets,
  Column,
  CrossAxisAlignment,
  Expanded,
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  Opacity,
  Transform,
  Offset,
  SizedBox,
  FractionallySizedBox,
  BoxDecoration,
  BorderRadius,
  Row,
  MainAxisAlignment,
} from "flitter-core";

const data = {
  stages: [
    { label: "Visitors", value: 10000 },
    { label: "Leads", value: 5000 },
    { label: "Qualified", value: 2500 },
    { label: "Proposals", value: 1200 },
    { label: "Closed", value: 600 },
  ],
};

class AnimatedStage extends StatefulWidget {
  child: any;
  index: number;

  constructor({ child, index }: any) {
    super();
    this.child = child;
    this.index = index;
  }

  createState() {
    return new AnimatedStageState();
  }
}

class AnimatedStageState extends State<AnimatedStage> {
  animationController!: AnimationController;
  opacityAnim!: any;
  slideAnim!: any;

  initState() {
    const { index } = this.widget as AnimatedStage;
    const staggerDelay = index * 80;
    this.animationController = new AnimationController({ duration: 400 });
    this.animationController.addListener(() => this.setState());
    this.opacityAnim = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    this.slideAnim = new Tween({ begin: 30, end: 0 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    setTimeout(() => this.animationController.forward(), staggerDelay);
  }

  build() {
    return Transform.translate({
      offset: new Offset({ x: 0, y: this.slideAnim.value }),
      child: Opacity({
        opacity: this.opacityAnim.value,
        child: (this.widget as AnimatedStage).child,
      }),
    });
  }
}

export default function ToastFunnelChart() {
  return (
    <Widget
      widget={FunnelChart({
        data,
        custom: {
          layout: ({ funnel }: any) =>
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
                  Expanded({ child: funnel }),
                ],
              }),
            }),
          stage: ({ index, ratio, color, stageLabel, dataLabel }: any) =>
            new AnimatedStage({
              index,
              child: SizedBox({
                height: 40,
                child: FractionallySizedBox({
                  widthFactor: Math.max(ratio, 0.05),
                  child: Container({
                    decoration: new BoxDecoration({
                      color,
                      borderRadius: BorderRadius.circular(4),
                    }),
                    child: Row({
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container({
                          margin: EdgeInsets.only({ right: 8 }),
                          child: stageLabel,
                        }),
                        dataLabel,
                      ],
                    }),
                  }),
                }),
              }),
            }),
          stageLabel: ({ label }: any) =>
            Text(label, {
              style: new TextStyle({
                fontFamily: "Noto Sans JP",
                fontSize: 12,
                color: "#333333",
                fontWeight: "600",
              }),
            }),
          dataLabel: ({ value, percentage }: any) =>
            Text(`${value.toLocaleString()} (${percentage.toFixed(0)}%)`, {
              style: new TextStyle({
                fontFamily: "Noto Sans JP",
                fontSize: 11,
                color: "#666666",
              }),
            }),
        },
      })}
      width="500px"
      height="350px"
      renderer="svg"
    />
  );
}
