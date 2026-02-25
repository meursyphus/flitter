
import Widget from "@flitterjs/react";
import { Headless } from "flitter-chart";
import { cartesianToastCustom, TOAST_COLORS } from "./toastUtils";
import {
  Container,
  BoxDecoration,
  Opacity,
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  Transform,
} from "flitter-core";

const data = {
  datasets: [
    {
      legend: "Asia",
      data: [
        { x: 12, y: 38, value: 30, label: "Korea" },
        { x: 40, y: 62, value: 50, label: "Japan" },
        { x: 58, y: 48, value: 65, label: "China" },
        { x: 25, y: 75, value: 20, label: "India" },
        { x: 72, y: 55, value: 35, label: "Thailand" },
      ],
    },
    {
      legend: "Europe",
      data: [
        { x: 30, y: 52, value: 40, label: "Germany" },
        { x: 55, y: 35, value: 28, label: "France" },
        { x: 78, y: 68, value: 18, label: "UK" },
        { x: 18, y: 22, value: 45, label: "Spain" },
        { x: 65, y: 80, value: 32, label: "Italy" },
      ],
    },
    {
      legend: "Americas",
      data: [
        { x: 22, y: 58, value: 55, label: "USA" },
        { x: 48, y: 28, value: 22, label: "Brazil" },
        { x: 82, y: 45, value: 38, label: "Canada" },
        { x: 35, y: 85, value: 15, label: "Mexico" },
        { x: 68, y: 18, value: 42, label: "Argentina" },
      ],
    },
    {
      legend: "Africa",
      data: [
        { x: 15, y: 42, value: 25, label: "Nigeria" },
        { x: 52, y: 72, value: 48, label: "Egypt" },
        { x: 85, y: 32, value: 20, label: "S.Africa" },
        { x: 38, y: 55, value: 35, label: "Kenya" },
      ],
    },
    {
      legend: "Oceania",
      data: [
        { x: 45, y: 15, value: 30, label: "Australia" },
        { x: 62, y: 88, value: 18, label: "N.Zealand" },
        { x: 28, y: 65, value: 22, label: "Fiji" },
        { x: 90, y: 58, value: 28, label: "Papua" },
      ],
    },
  ],
};

let bubbleCounter = 0;

class AnimatedBubble extends StatefulWidget {
  value: number;
  color: string;
  scale: any;
  order: number;

  constructor({ value, color, scale, order }: any) {
    super();
    this.value = value;
    this.color = color;
    this.scale = scale;
    this.order = order;
  }

  createState() {
    return new AnimatedBubbleState();
  }
}

class AnimatedBubbleState extends State<AnimatedBubble> {
  animationController!: AnimationController;
  scaleAnimation!: any;

  initState() {
    const { order } = this.widget as AnimatedBubble;
    this.animationController = new AnimationController({ duration: 500 });
    this.animationController.addListener(() => this.setState());
    this.scaleAnimation = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    setTimeout(() => this.animationController.forward(), order * 60);
  }

  build() {
    const { value, color, scale } = this.widget as AnimatedBubble;
    const normValue =
      (value - scale.value.min) / (scale.value.max - scale.value.min);
    const radius = 5 + normValue * 20;

    return Opacity({
      opacity: 0.75,
      child: Transform.scale({
        scale: this.scaleAnimation.value,
        child: Container({
          width: radius * 2,
          height: radius * 2,
          decoration: new BoxDecoration({
            color: color,
            shape: "circle",
          }),
        }),
      }),
    });
  }
}

export default function ToastBubbleChart() {
  bubbleCounter = 0;
  return (
    <Widget
      widget={Headless.BubbleChart({
        data,
        custom: {
          ...cartesianToastCustom,
          bubble: ({ value, legend }: any, { scale }: any) => {
            const legendIndex =
              data.datasets.findIndex((d) => d.legend === legend);
            const color =
              TOAST_COLORS[legendIndex >= 0 ? legendIndex % TOAST_COLORS.length : 0];
            const order = bubbleCounter++;
            return new AnimatedBubble({ value, color, scale, order });
          },
        },
      })}
      width="500px"
      height="350px"
      renderer="svg"
    />
  );
}
