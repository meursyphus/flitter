
import Widget from "@flitterjs/react";
import { Headless } from "flitter-chart";
import { cartesianToastCustom } from "./toastUtils";
import {
  Container,
  FractionallySizedBox,
  Alignment,
  EdgeInsets,
  Padding,
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

const WATERFALL_COLORS: Record<string, string> = {
  increase: "#00a9ff",
  decrease: "#ff5a46",
  total: "#00bd9f",
};

const data = {
  labels: ["Revenue", "COGS", "Gross Profit", "OpEx", "Tax", "Net Income"],
  values: [500, -200, 300, -150, -50, 100],
  totalIndices: [2, 5],
};

class AnimatedWaterfallBar extends StatefulWidget {
  child: any;
  index: number;

  constructor({ child, index }: any) {
    super();
    this.child = child;
    this.index = index;
  }

  createState() {
    return new AnimatedWaterfallBarState();
  }
}

class AnimatedWaterfallBarState extends State<AnimatedWaterfallBar> {
  animationController!: AnimationController;
  growAnim!: any;
  opacityAnim!: any;

  initState() {
    const { index } = this.widget as AnimatedWaterfallBar;
    const staggerDelay = index * 100;
    this.animationController = new AnimationController({ duration: 450 });
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
    return Opacity({
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
        child: (this.widget as AnimatedWaterfallBar).child,
      }),
    });
  }
}

export default function ToastWaterfallChart() {
  return (
    <Widget
      widget={Headless.WaterfallChart({
        data,
        custom: {
          ...cartesianToastCustom,
          bar: ({ value, cumulative, type, index }: any, { scale }: any) => {
            const total = scale.max - scale.min;
            const absValue = Math.abs(type === "total" ? cumulative : value);
            const heightRatio = absValue / total;

            let barBase: number;
            if (type === "total") {
              barBase = 0;
            } else if (value >= 0) {
              barBase = cumulative - value;
            } else {
              barBase = cumulative;
            }

            const bottomRatio = (barBase - scale.min) / total;

            return new AnimatedWaterfallBar({
              index,
              child: Container({
                width: Infinity,
                height: Infinity,
                alignment: Alignment.bottomCenter,
                child: FractionallySizedBox({
                  heightFactor: bottomRatio + heightRatio,
                  alignment: Alignment.bottomCenter,
                  child: Container({
                    alignment: Alignment.topCenter,
                    child: FractionallySizedBox({
                      heightFactor: heightRatio / (bottomRatio + heightRatio),
                      alignment: Alignment.topCenter,
                      child: Padding({
                        padding: EdgeInsets.symmetric({ horizontal: 4 }),
                        child: Container({
                          width: Infinity,
                          height: Infinity,
                          color: WATERFALL_COLORS[type],
                        }),
                      }),
                    }),
                  }),
                }),
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
