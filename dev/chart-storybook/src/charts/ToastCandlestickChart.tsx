
import Widget from "@flitterjs/react";
import { Headless } from "flitter-chart";
import { cartesianToastCustom } from "./toastUtils";
import type { StoryFrameProps } from "./storyTypes";
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
  Container,
  Column,
  Expanded,
  FractionallySizedBox,
  Alignment,
  MainAxisAlignment,
  CrossAxisAlignment,
} from "flitter-core";

const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    { open: 100, high: 115, low: 95, close: 110 },
    { open: 110, high: 120, low: 105, close: 108 },
    { open: 108, high: 125, low: 100, close: 122 },
    { open: 122, high: 130, low: 118, close: 125 },
    { open: 125, high: 128, low: 110, close: 112 },
  ],
};

class AnimatedCandlestick extends StatefulWidget {
  child: any;
  index: number;

  constructor({ child, index }: any) {
    super();
    this.child = child;
    this.index = index;
  }

  createState() {
    return new AnimatedCandlestickState();
  }
}

class AnimatedCandlestickState extends State<AnimatedCandlestick> {
  animationController!: AnimationController;
  growAnim!: any;
  opacityAnim!: any;

  initState() {
    const { index } = this.widget as AnimatedCandlestick;
    const staggerDelay = index * 100;
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
        child: (this.widget as AnimatedCandlestick).child,
      }),
    });
  }
}

export default function ToastCandlestickChart({
  renderer = "svg",
  width = "500px",
  height = "350px",
}: StoryFrameProps) {
  return (
    <Widget
      widget={Headless.CandlestickChart({
        data,
        custom: {
          ...cartesianToastCustom,
          candlestick: ({ open, high, low, close, index }: any, { scale }: any) => {
            const total = scale.max - scale.min;
            const isUp = close >= open;
            const color = isUp ? "#4CAF50" : "#F44336";
            const wickColor = "#333333";
            const bodyTop = Math.max(open, close);
            const bodyBottom = Math.min(open, close);
            const topWickRatio = (high - bodyTop) / total;
            const bodyRatio = (bodyTop - bodyBottom) / total || 0.002;
            const bottomWickRatio = (bodyBottom - low) / total;
            const belowRatio = (low - scale.min) / total;
            const aboveRatio = (scale.max - high) / total;

            return new AnimatedCandlestick({
              index,
              child: Container({
                width: Infinity,
                height: Infinity,
                alignment: Alignment.center,
                child: FractionallySizedBox({
                  widthFactor: 0.6,
                  child: Column({
                    mainAxisAlignment: MainAxisAlignment.end,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      ...(aboveRatio > 0
                        ? [Expanded({ flex: Math.max(aboveRatio, 0.001), child: Container({}) })]
                        : []),
                      ...(topWickRatio > 0
                        ? [
                            Expanded({
                              flex: Math.max(topWickRatio, 0.001),
                              child: Container({ width: 1, color: wickColor }),
                            }),
                          ]
                        : []),
                      Expanded({
                        flex: Math.max(bodyRatio, 0.001),
                        child: Container({ width: Infinity, color }),
                      }),
                      ...(bottomWickRatio > 0
                        ? [
                            Expanded({
                              flex: Math.max(bottomWickRatio, 0.001),
                              child: Container({ width: 1, color: wickColor }),
                            }),
                          ]
                        : []),
                      ...(belowRatio > 0
                        ? [Expanded({ flex: Math.max(belowRatio, 0.001), child: Container({}) })]
                        : []),
                    ],
                  }),
                }),
              }),
            });
          },
        },
      })}
      width={width}
      height={height}
      renderer={renderer}
    />
  );
}
