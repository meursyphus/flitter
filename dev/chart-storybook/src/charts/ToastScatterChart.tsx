
import Widget from "@flitterjs/react";
import { Headless } from "flitter-chart";
import { cartesianToastCustom, TOAST_COLORS } from "./toastUtils";
import {
  Container,
  BoxDecoration,
  BorderRadius,
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  Transform,
  Opacity,
  CustomPaint,
  Path,
  SizedBox,
} from "flitter-core";

const data = {
  datasets: [
    {
      legend: "Asia",
      data: [
        { x: 12, y: 38, label: "A1" }, { x: 25, y: 55, label: "A2" }, { x: 42, y: 48, label: "A3" },
        { x: 55, y: 62, label: "A4" }, { x: 18, y: 72, label: "A5" }, { x: 38, y: 28, label: "A6" },
        { x: 65, y: 85, label: "A7" }, { x: 48, y: 42, label: "A8" },
      ],
    },
    {
      legend: "Europe",
      data: [
        { x: 30, y: 50, label: "E1" }, { x: 40, y: 32, label: "E2" }, { x: 58, y: 68, label: "E3" },
        { x: 72, y: 45, label: "E4" }, { x: 22, y: 18, label: "E5" }, { x: 85, y: 78, label: "E6" },
        { x: 35, y: 65, label: "E7" }, { x: 62, y: 22, label: "E8" },
      ],
    },
    {
      legend: "Americas",
      data: [
        { x: 20, y: 58, label: "M1" }, { x: 32, y: 25, label: "M2" }, { x: 50, y: 52, label: "M3" },
        { x: 78, y: 72, label: "M4" }, { x: 15, y: 45, label: "M5" }, { x: 68, y: 35, label: "M6" },
        { x: 45, y: 80, label: "M7" }, { x: 88, y: 55, label: "M8" },
      ],
    },
    {
      legend: "Africa",
      data: [
        { x: 10, y: 22, label: "F1" }, { x: 28, y: 42, label: "F2" }, { x: 52, y: 15, label: "F3" },
        { x: 75, y: 58, label: "F4" }, { x: 38, y: 75, label: "F5" }, { x: 82, y: 38, label: "F6" },
        { x: 60, y: 90, label: "F7" },
      ],
    },
    {
      legend: "Oceania",
      data: [
        { x: 42, y: 18, label: "O1" }, { x: 58, y: 78, label: "O2" }, { x: 22, y: 62, label: "O3" },
        { x: 90, y: 42, label: "O4" }, { x: 70, y: 55, label: "O5" }, { x: 35, y: 88, label: "O6" },
      ],
    },
  ],
};

const SHAPES = ["circle", "square", "triangle", "star", "diamond"] as const;

function makeShapePath(shape: string, w: number, h: number): string {
  const cx = w / 2, cy = h / 2;
  if (shape === "triangle") {
    return `M${cx},0 L${w},${h} L0,${h} Z`;
  }
  if (shape === "star") {
    const outerR = cx, innerR = cx * 0.4;
    let d = "";
    for (let i = 0; i < 5; i++) {
      const oa = (i * 72 - 90) * Math.PI / 180;
      const ia = ((i * 72 + 36) - 90) * Math.PI / 180;
      const ox = cx + outerR * Math.cos(oa), oy = cy + outerR * Math.sin(oa);
      const ix = cx + innerR * Math.cos(ia), iy = cy + innerR * Math.sin(ia);
      d += i === 0 ? `M${ox},${oy}` : `L${ox},${oy}`;
      d += `L${ix},${iy}`;
    }
    return d + "Z";
  }
  // diamond
  return `M${cx},0 L${w},${cy} L${cx},${h} L0,${cy} Z`;
}

let scatterCounter = 0;

class AnimatedScatter extends StatefulWidget {
  color: string;
  order: number;
  shape: string;

  constructor({ color, order, shape }: any) {
    super();
    this.color = color;
    this.order = order;
    this.shape = shape;
  }

  createState() {
    return new AnimatedScatterState();
  }
}

class AnimatedScatterState extends State<AnimatedScatter> {
  animationController!: AnimationController;
  scaleAnimation!: any;
  opacityAnimation!: any;

  initState() {
    const { order } = this.widget as AnimatedScatter;
    this.animationController = new AnimationController({ duration: 350 });
    this.animationController.addListener(() => this.setState());
    this.scaleAnimation = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    this.opacityAnimation = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeOut,
      })
    );
    setTimeout(() => this.animationController.forward(), order * 50);
  }

  build() {
    const { color, shape } = this.widget as AnimatedScatter;
    const size = 10;

    let child;
    if (shape === "circle") {
      child = Container({
        width: size,
        height: size,
        decoration: new BoxDecoration({
          color,
          borderRadius: BorderRadius.circular(size / 2),
        }),
      });
    } else if (shape === "square") {
      child = Container({
        width: size,
        height: size,
        decoration: new BoxDecoration({ color }),
      });
    } else {
      // triangle, star, diamond via SVG CustomPaint
      const pathD = makeShapePath(shape, size, size);
      child = SizedBox({
        width: size,
        height: size,
        child: CustomPaint({
          painter: {
            svg: {
              createDefaultSvgEl(context: any) {
                return { shape: context.createSvgEl("path") };
              },
              paint({ shape: el }: any) {
                el.setAttribute("d", pathD);
                el.setAttribute("fill", color);
              },
            },
          },
        }),
      });
    }

    return Opacity({
      opacity: Math.min(this.opacityAnimation.value, 1),
      child: Transform.scale({
        scale: this.scaleAnimation.value,
        child,
      }),
    });
  }
}

export default function ToastScatterChart() {
  scatterCounter = 0;
  return (
    <Widget
      widget={Headless.ScatterChart({
        data,
        custom: {
          ...cartesianToastCustom,
          scatter: ({ legend }: any) => {
            const idx = data.datasets.findIndex((d) => d.legend === legend);
            const color = TOAST_COLORS[idx % TOAST_COLORS.length];
            const shape = SHAPES[idx % SHAPES.length];
            const order = scatterCounter++;
            return new AnimatedScatter({ color, order, shape });
          },
        },
      })}
      width="500px"
      height="350px"
      renderer="svg"
    />
  );
}
