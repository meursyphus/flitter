
import Widget from "@flitterjs/react";
import { StackedBarChart } from "flitter-chart";
import { cartesianToastCustom, TOAST_COLORS } from "./toastUtils";
import {
  Container,
  BoxDecoration,
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  ClipRect,
  Rect,
  FractionallySizedBox,
  Alignment,
  Flex,
  Axis,
  MainAxisAlignment,
  CrossAxisAlignment,
} from "flitter-core";

const data = {
  labels: ["June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Budget", values: [5000, 3000, 5000, 7000, 6000, 4000, 1000] },
    { legend: "Income", values: [8000, 4000, 7000, 2000, 6000, 3000, 5000] },
    {
      legend: "Expenses",
      values: [4000, 3000, 5000, 4000, 3000, 4000, 3000],
    },
    { legend: "Debt", values: [6000, 3000, 3000, 2000, 5000, 4000, 2000] },
  ],
  title: "Monthly Revenue",
};

class AnimatedStackedBar extends StatefulWidget {
  child: any;
  groupIndex: number;

  constructor({ child, groupIndex }: any) {
    super();
    this.child = child;
    this.groupIndex = groupIndex;
  }

  createState() {
    return new AnimatedStackedBarState();
  }
}

class AnimatedStackedBarState extends State<AnimatedStackedBar> {
  animationController!: AnimationController;
  growAnim!: any;

  initState() {
    const { groupIndex } = this.widget as AnimatedStackedBar;
    this.animationController = new AnimationController({ duration: 500 });
    this.animationController.addListener(() => this.setState());
    this.growAnim = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    setTimeout(() => this.animationController.forward(), groupIndex * 80);
  }

  build() {
    return ClipRect({
      clipped: true,
      clipper: ({ width, height }: any) =>
        Rect.fromLTRB({
          left: 0,
          top: 0,
          right: width * this.growAnim.value,
          bottom: height,
        }),
      child: (this.widget as AnimatedStackedBar).child,
    });
  }
}

export default function ToastStackedBarChart() {
  return (
    <Widget
      widget={StackedBarChart({
        data,
        direction: "horizontal",
        custom: {
          ...cartesianToastCustom,
          layout: undefined,
          legend: undefined,
          barGroup: ({ bars, values, index }: any, { scale }: any) => {
            const total = scale.max - scale.min;
            const ratios = values.map((v: number) => v / total);
            const stacked = Container({
              width: Infinity,
              height: Infinity,
              child: FractionallySizedBox({
                alignment: Alignment.centerLeft,
                heightFactor: 0.6,
                child: Flex({
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  direction: Axis.horizontal,
                  children: [...bars].reverse().map((bar: any, i: number) => {
                    const reversedIndex = bars.length - 1 - i;
                    return FractionallySizedBox({
                      alignment: Alignment.centerLeft,
                      widthFactor: ratios[reversedIndex],
                      child: bar,
                    });
                  }),
                }),
              }),
            });
            return new AnimatedStackedBar({
              groupIndex: index,
              child: stacked,
            });
          },
          bar: ({ legend }: any) => {
            const idx = data.datasets.findIndex((d) => d.legend === legend);
            return Container({
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
