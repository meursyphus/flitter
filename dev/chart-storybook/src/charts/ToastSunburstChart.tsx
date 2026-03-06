
import Widget from "@flitterjs/react";
import { Headless } from "flitter-chart";
import type { StoryFrameProps } from "./storyTypes";
import {
  Text,
  Container,
  EdgeInsets,
  TextStyle,
  SizedBox,
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  Transform,
  Alignment,
  Opacity,
  Column,
  CrossAxisAlignment,
  Expanded,
  Center,
} from "flitter-core";

const data = {
  root: {
    label: "Company",
    children: [
      {
        label: "Engineering",
        children: [
          { label: "Frontend", value: 30 },
          { label: "Backend", value: 25 },
          { label: "DevOps", value: 10 },
        ],
      },
      {
        label: "Design",
        children: [
          { label: "UI/UX", value: 15 },
          { label: "Brand", value: 8 },
        ],
      },
      {
        label: "Sales",
        children: [
          { label: "Domestic", value: 20 },
          { label: "International", value: 12 },
        ],
      },
    ],
  },
};

class AnimatedSunburst extends StatefulWidget {
  child: any;

  constructor({ child }: any) {
    super();
    this.child = child;
  }

  createState() {
    return new AnimatedSunburstState();
  }
}

class AnimatedSunburstState extends State<AnimatedSunburst> {
  animationController!: AnimationController;
  scaleAnim!: any;
  opacityAnim!: any;

  initState() {
    this.animationController = new AnimationController({ duration: 800 });
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
    return Opacity({
      opacity: Math.min(this.opacityAnim.value * 2, 1),
      child: Transform.scale({
        scale: this.scaleAnim.value,
        alignment: Alignment.center,
        child: (this.widget as AnimatedSunburst).child,
      }),
    });
  }
}

export default function ToastSunburstChart({
  renderer = "svg",
  width = "500px",
  height = "350px",
}: StoryFrameProps) {
  return (
    <Widget
      widget={Headless.SunburstChart({
        data,
        custom: {
          layout: ({ sunburst }: any) =>
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
                    child: Center({
                      child: new AnimatedSunburst({ child: sunburst }),
                    }),
                  }),
                ],
              }),
            }),
        },
      })}
      width={width}
      height={height}
      renderer={renderer}
    />
  );
}
