
import Widget from "@flitterjs/react";
import { Headless } from "flitter-chart";
import {
  Text,
  Container,
  EdgeInsets,
  TextStyle,
  Column,
  CrossAxisAlignment,
  Expanded,
  Center,
  AspectRatio,
  Stack,
  StackFit,
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
  Transform,
  Opacity,
  Alignment,
  CustomPaint,
  Path,
  Row,
  BoxDecoration,
  BorderRadius,
  MainAxisAlignment,
  SizedBox,
  type Widget as FlitterWidget,
} from "flitter-core";
import { TOAST_COLORS } from "./toastUtils";

const data = {
  labels: ["Attack", "Defense", "Speed", "HP", "Sp.Atk", "Sp.Def"],
  datasets: [
    { legend: "Pikachu", values: [55, 40, 90, 35, 50, 50] },
    { legend: "Bulbasaur", values: [49, 49, 45, 45, 65, 65] },
  ],
};

class AnimatedDataset extends StatefulWidget {
  child: FlitterWidget;
  index: number;

  constructor({ child, index }: { child: FlitterWidget; index: number }) {
    super();
    this.child = child;
    this.index = index;
  }

  createState() {
    return new AnimatedDatasetState();
  }
}

class AnimatedDatasetState extends State<AnimatedDataset> {
  animationController!: AnimationController;
  scaleAnim!: any;
  opacityAnim!: any;

  initState() {
    this.animationController = new AnimationController({ duration: 600 });
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
    const index = (this.widget as AnimatedDataset).index;
    setTimeout(() => this.animationController.forward(), index * 200);
  }

  build() {
    const { child } = this.widget as AnimatedDataset;
    return Opacity({
      opacity: Math.min(this.opacityAnim.value, 1),
      child: Transform.scale({
        scale: this.scaleAnim.value,
        alignment: Alignment.center,
        child: child,
      }),
    });
  }
}

function createDataPath(
  cx: number,
  cy: number,
  maxRadius: number,
  axisCount: number,
  values: number[],
  maxValue: number
) {
  const path = new Path();
  const angleStep = (2 * Math.PI) / axisCount;
  const startAngle = -Math.PI / 2;
  for (let i = 0; i <= axisCount; i++) {
    const idx = i % axisCount;
    const angle = startAngle + idx * angleStep;
    const ratio = Math.min(values[idx] / maxValue, 1);
    const radius = maxRadius * ratio;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) path.moveTo({ x, y });
    else path.lineTo({ x, y });
  }
  return path;
}

function datasetCustom(_args: any, config: any) {
  const { data: chartData, scale } = config;
  const axisCount = chartData.labels.length;
  const maxValue = scale?.max ?? Math.max(...chartData.datasets.flatMap((d: any) => d.values));

  const animatedDatasets = chartData.datasets.map((dataset: any, i: number) => {
    const fillColor = TOAST_COLORS[i % TOAST_COLORS.length] + "4D";
    const strokeColor = TOAST_COLORS[i % TOAST_COLORS.length];

    const paint = CustomPaint({
      painter: {
        svg: {
          createDefaultSvgEl: (context: any) => ({
            fill: context.createSvgEl("path"),
            stroke: context.createSvgEl("path"),
          }),
          paint: (els: any, { width, height }: any) => {
            const cx = width / 2;
            const cy = height / 2;
            const maxRadius = Math.min(cx, cy) * 0.8;
            const path = createDataPath(cx, cy, maxRadius, axisCount, dataset.values, maxValue);
            const d = path.getD();

            els.fill.setAttribute("d", d);
            els.fill.setAttribute("fill", fillColor);
            els.fill.setAttribute("stroke", "none");

            els.stroke.setAttribute("d", d);
            els.stroke.setAttribute("fill", "none");
            els.stroke.setAttribute("stroke", strokeColor);
            els.stroke.setAttribute("stroke-width", "2");
          },
        },
      },
    });

    return new AnimatedDataset({ child: paint, index: i });
  });

  return Stack({ fit: StackFit.expand, children: animatedDatasets });
}

export default function ToastRadarChart() {
  return (
    <Widget
      widget={Headless.RadarChart({
        data,
        custom: {
          layout: ({ radar, legends }: any) =>
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
                    child: Center({
                      child: AspectRatio({
                        aspectRatio: 1,
                        child: radar,
                      }),
                    }),
                  }),
                  SizedBox({ height: 8 }),
                  Row({
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: legends.flatMap((l: any, i: number) =>
                      i > 0 ? [SizedBox({ width: 16 }), l] : [l]
                    ),
                  }),
                ],
              }),
            }),
          radar: ({ grid, axes, datasets, axisLabels }: any) =>
            Stack({
              fit: StackFit.expand,
              children: [grid, axes, datasets, axisLabels],
            }),
          dataset: datasetCustom,
          legend: ({ name, index }: any) =>
            Row({
              children: [
                Container({
                  width: 10,
                  height: 10,
                  decoration: new BoxDecoration({
                    color: TOAST_COLORS[index % TOAST_COLORS.length],
                    borderRadius: BorderRadius.circular(2),
                  }),
                }),
                SizedBox({ width: 6 }),
                Text(name, {
                  style: new TextStyle({
                    fontFamily: "Noto Sans JP",
                    fontSize: 12,
                    color: "#666666",
                  }),
                }),
              ],
            }),
          axisLabel: ({ label }: any) =>
            Text(label, {
              style: new TextStyle({
                fontFamily: "Noto Sans JP",
                fontSize: 11,
                color: "#666666",
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
