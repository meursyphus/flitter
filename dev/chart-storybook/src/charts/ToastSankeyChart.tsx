
import Widget from "@flitterjs/react";
import { SankeyChart } from "flitter-chart";
import {
  Text,
  Container,
  EdgeInsets,
  TextStyle,
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
  ClipRect,
  Rect,
  Opacity,
} from "flitter-core";
import type { Widget as FlitterWidget } from "flitter-core";

class AnimatedSankeyReveal extends StatefulWidget {
  child: FlitterWidget;

  constructor({ child }: { child: FlitterWidget }) {
    super();
    this.child = child;
  }

  createState(): AnimatedSankeyRevealState {
    return new AnimatedSankeyRevealState();
  }
}

class AnimatedSankeyRevealState extends State<AnimatedSankeyReveal> {
  animationController!: AnimationController;
  growAnim!: { value: number };
  opacityAnim!: { value: number };

  initState(): void {
    this.animationController = new AnimationController({
      duration: 800,
    });

    const curvedAnim = new CurvedAnimation({
      parent: this.animationController,
      curve: Curves.easeOut,
    });

    this.growAnim = new Tween({ begin: 0, end: 1 }).animated(curvedAnim);
    this.opacityAnim = new Tween({ begin: 0, end: 1 }).animated(curvedAnim);

    this.animationController.addListener(() => {
      this.setState();
    });

    this.animationController.forward();
  }

  build() {
    return Opacity({
      opacity: Math.min(this.opacityAnim.value * 2, 1),
      child: ClipRect({
        clipped: true,
        clipper: ({ width, height }: any) =>
          Rect.fromLTRB({
            left: 0,
            top: 0,
            right: width * this.growAnim.value,
            bottom: height,
          }),
        child: (this.widget as AnimatedSankeyReveal).child,
      }),
    });
  }
}

const data = {
  nodes: [
    { id: "solar", label: "Solar" },
    { id: "wind", label: "Wind" },
    { id: "hydro", label: "Hydro" },
    { id: "grid", label: "Grid" },
    { id: "home", label: "Home" },
    { id: "industry", label: "Industry" },
  ],
  links: [
    { source: "solar", target: "grid", value: 40 },
    { source: "wind", target: "grid", value: 30 },
    { source: "hydro", target: "grid", value: 20 },
    { source: "grid", target: "home", value: 50 },
    { source: "grid", target: "industry", value: 40 },
  ],
};

export default function ToastSankeyChart() {
  return (
    <Widget
      widget={SankeyChart({
        data,
        custom: {
          layout: ({ sankey }: any) =>
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
                  Expanded({ child: new AnimatedSankeyReveal({ child: sankey }) }),
                ],
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
