
import Widget from "@flitterjs/react";
import { BarChart } from "flitter-chart";
import { cartesianToastCustom, TOAST_COLORS } from "./toastUtils";
import {
  Container,
  EdgeInsets,
  BoxDecoration,
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  ClipRect,
  Rect,
  Flex,
  Axis,
  CrossAxisAlignment,
  MainAxisAlignment,
  FractionallySizedBox,
  Alignment,
  Padding,
  Flexible,
} from "flitter-core";

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    { legend: "Seoul", values: [65, 59, 80, 81, 56, 55, 40] },
    { legend: "Seattle", values: [28, 48, 40, 19, 86, 27, 90] },
    { legend: "Sydney", values: [35, 25, 30, 45, 35, 40, 25] },
  ],
};

class AnimatedBarGroup extends StatefulWidget {
  bars: any[];
  values: number[];
  scale: any;
  groupIndex: number;

  constructor({ bars, values, scale, groupIndex }: any) {
    super();
    this.bars = bars;
    this.values = values;
    this.scale = scale;
    this.groupIndex = groupIndex;
  }

  createState() {
    return new AnimatedBarGroupState();
  }
}

class AnimatedBarGroupState extends State<AnimatedBarGroup> {
  animationController!: AnimationController;
  tweenAnimation!: any;

  initState() {
    const { groupIndex } = this.widget as AnimatedBarGroup;
    this.animationController = new AnimationController({ duration: 500 });
    this.animationController.addListener(() => this.setState());
    const tween = new Tween({ begin: 0, end: 1 });
    this.tweenAnimation = tween.animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    setTimeout(() => this.animationController.forward(), groupIndex * 60);
  }

  build() {
    const { bars, values, scale } = this.widget as AnimatedBarGroup;
    const total = scale.max - scale.min;
    const ratios = values.map((value: number) => value / total);

    return ClipRect({
      clipped: true,
      clipper: ({ width, height }: any) => {
        return Rect.fromLTRB({
          left: 0,
          top: height * (1 - this.tweenAnimation.value),
          right: width,
          bottom: height,
        });
      },
      child: Container({
        width: Infinity,
        height: Infinity,
        child: Flex({
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          direction: Axis.horizontal,
          children: bars.map((bar: any, index: number) =>
            Flexible({
              flex: 1,
              child: FractionallySizedBox({
                alignment: Alignment.centerLeft,
                heightFactor: ratios[index],
                child: Padding({
                  padding: EdgeInsets.symmetric({ horizontal: 2 }),
                  child: bar,
                }),
              }),
            })
          ),
        }),
      }),
    });
  }
}

export default function ToastBarChart() {
  return (
    <Widget
      widget={BarChart({
        data,
        custom: {
          ...cartesianToastCustom,
          barGroup: ({ bars, values, index }: any, { scale }: any) => {
            return new AnimatedBarGroup({ bars, values, scale, groupIndex: index });
          },
          bar: ({ legend }: any) => {
            const idx = data.datasets.findIndex((d) => d.legend === legend);
            return Container({
              margin: EdgeInsets.symmetric({ horizontal: 1 }),
              decoration: new BoxDecoration({
                color: TOAST_COLORS[idx % TOAST_COLORS.length],
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
