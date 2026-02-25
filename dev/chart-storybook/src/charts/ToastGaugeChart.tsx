
import Widget from "@flitterjs/react";
import { Headless } from "flitter-chart";
import {
  Text,
  Container,
  EdgeInsets,
  TextStyle,
  Column,
  CrossAxisAlignment,
  MainAxisAlignment,
  Alignment,
  SizedBox,
  Stack,
  StackFit,
  Expanded,
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  ClipRect,
  Rect,
  Opacity,
} from "flitter-core";

class AnimatedGaugeSweep extends StatefulWidget {
  child: any;

  constructor({ child }: any) {
    super();
    this.child = child;
  }

  createState() {
    return new AnimatedGaugeSweepState();
  }
}

class AnimatedGaugeSweepState extends State<AnimatedGaugeSweep> {
  animationController!: AnimationController;
  sweepAnim!: any;

  initState() {
    this.animationController = new AnimationController({ duration: 1200 });
    this.animationController.addListener(() => this.setState());
    this.sweepAnim = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeInOut,
      })
    );
    this.animationController.forward();
  }

  build() {
    return ClipRect({
      clipped: true,
      clipper: ({ width, height }: any) =>
        Rect.fromLTRB({
          left: 0,
          top: 0,
          right: width * this.sweepAnim.value,
          bottom: height,
        }),
      child: (this.widget as AnimatedGaugeSweep).child,
    });
  }
}

class AnimatedValueLabel extends StatefulWidget {
  value: number;

  constructor({ value }: any) {
    super();
    this.value = value;
  }

  createState() {
    return new AnimatedValueLabelState();
  }
}

class AnimatedValueLabelState extends State<AnimatedValueLabel> {
  animationController!: AnimationController;
  fadeAnim!: any;

  initState() {
    this.animationController = new AnimationController({ duration: 500 });
    this.animationController.addListener(() => this.setState());
    this.fadeAnim = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    setTimeout(() => this.animationController.forward(), 800);
  }

  build() {
    const { value } = this.widget as AnimatedValueLabel;
    return Opacity({
      opacity: this.fadeAnim.value,
      child: Text(`${value}%`, {
        style: new TextStyle({
          fontFamily: "Noto Sans JP",
          fontSize: 24,
          fontWeight: "700",
          color: "#333333",
        }),
      }),
    });
  }
}

export default function ToastGaugeChart() {
  return (
    <Widget
      widget={Headless.GaugeChart({
        data: {
          value: 72,
          min: 0,
          max: 100,
          title: "CPU Usage",
          zones: [
            { min: 0, max: 50, color: "#00bd9f" },
            { min: 50, max: 80, color: "#ffb840" },
            { min: 80, max: 100, color: "#ff5a46" },
          ],
        },
        custom: {
          layout: ({ title, gauge, valueLabel }: any) =>
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
                  Expanded({
                    child: Column({
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        title,
                        SizedBox({ height: 10 }),
                        gauge,
                        SizedBox({ height: 10 }),
                        valueLabel,
                      ],
                    }),
                  }),
                ],
              }),
            }),
          title: ({ name }: any) =>
            Text(name, {
              style: new TextStyle({
                fontFamily: "Noto Sans JP",
                fontSize: 14,
                fontWeight: "500",
                color: "#333333",
              }),
            }),
          gauge: ({ needle, scale }: any) =>
            new AnimatedGaugeSweep({
              child: SizedBox({
                width: 250,
                height: 150,
                child: Stack({
                  fit: StackFit.expand,
                  alignment: Alignment.bottomCenter,
                  children: [scale, needle],
                }),
              }),
            }),
          valueLabel: ({ value }: any) => new AnimatedValueLabel({ value }),
        },
      })}
      width="500px"
      height="350px"
      renderer="svg"
    />
  );
}
