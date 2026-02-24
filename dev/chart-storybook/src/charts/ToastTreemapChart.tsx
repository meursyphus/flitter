
import Widget from "@flitterjs/react";
import { TreemapChart } from "flitter-chart";
import { TOAST_COLORS } from "./toastUtils";
import {
  Text,
  Container,
  EdgeInsets,
  TextStyle,
  BoxDecoration,
  Alignment,
  Column,
  MainAxisAlignment,
  CrossAxisAlignment,
  Expanded,
  Positioned,
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  Opacity,
  Transform,
  Stack,
} from "flitter-core";

const data = {
  nodes: [
    { label: "Documents", value: 45 },
    { label: "Photos", value: 30 },
    { label: "Videos", value: 25 },
    { label: "Music", value: 15 },
    { label: "Downloads", value: 12 },
    { label: "Apps", value: 10 },
    { label: "Cache", value: 8 },
    { label: "Other", value: 5 },
  ],
};

class AnimatedTreemapNode extends StatefulWidget {
  child: any;
  index: number;
  total: number;

  constructor({ child, index, total }: any) {
    super();
    this.child = child;
    this.index = index;
    this.total = total;
  }

  createState() {
    return new AnimatedTreemapNodeState();
  }
}

class AnimatedTreemapNodeState extends State<AnimatedTreemapNode> {
  animationController!: AnimationController;
  opacityAnim!: any;
  scaleAnim!: any;

  initState() {
    const { index } = this.widget as AnimatedTreemapNode;
    const staggerDelay = index * 60;
    this.animationController = new AnimationController({ duration: 400 });
    this.animationController.addListener(() => this.setState());
    this.opacityAnim = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    this.scaleAnim = new Tween({ begin: 0.8, end: 1 }).animated(
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
        child: (this.widget as AnimatedTreemapNode).child,
      }),
    });
  }
}

export default function ToastTreemapChart() {
  return (
    <Widget
      widget={TreemapChart({
        data,
        custom: {
          layout: ({ treemap }: any) =>
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
                  Expanded({
                    child: treemap,
                  }),
                ],
              }),
            }),
          node: ({ label, value, color, index, x, y, width, height }: any) =>
            Positioned({
              left: x,
              top: y,
              width: width,
              height: height,
              child: new AnimatedTreemapNode({
                index,
                total: data.nodes.length,
                child: Container({
                  decoration: new BoxDecoration({ color }),
                  alignment: Alignment.center,
                  child: Column({
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(label, {
                        style: new TextStyle({
                          fontFamily: "Noto Sans JP",
                          fontSize: 11,
                          fontWeight: "500",
                          color: "#ffffff",
                        }),
                      }),
                      Text(`${value}GB`, {
                        style: new TextStyle({
                          fontFamily: "Noto Sans JP",
                          fontSize: 10,
                          color: "rgba(255,255,255,0.8)",
                        }),
                      }),
                    ],
                  }),
                }),
              }),
            }),
        },
        colors: TOAST_COLORS,
      })}
      width="500px"
      height="350px"
      renderer="svg"
    />
  );
}
