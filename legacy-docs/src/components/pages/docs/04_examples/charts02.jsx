import Widget from "@meursyphus/flitter-react";
import { LineChart } from "@meursyphus/headless-chart";
import {
  Text,
  CustomPaint,
  Path,
  Rect,
  Offset,
  BoxDecoration,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  Row,
  SizedBox,
  TextStyle,
  Flexible,
  Padding,
  MainAxisSize,
  MainAxisAlignment,
  Stack,
  Positioned
} from "@meursyphus/flitter";
import CodeDrawer from './CodeDrawer';

const colors = [
  "#86efac", "#fbbf24", "#facc15", "#fb7185", "#fdba74"
];

const data = {
  labels: ["plane","helicopter","boat","train","subway","bus","car","moto","bicycle","horse","skateboard","others"],
  datasets: [
    {
      legend: "norway",
      values: [600, 1000, 800, 1000, 500, 850, 600, 675, 720, 890, 700, 950],
    },
    
    {
      legend: "germany",
      values: [565, 850, 734, 863, 268, 571, 396, 588, 442, 726, 640, 732],
    },
    {
      legend: "us",
      values: [435, 559, 482, 580, 167, 308, 255, 557, 437, 438, 543, 554],
    },
    {
      legend: "france",
      values: [242, 405, 262, 418, 109, 224, 216, 339, 428, 284, 247, 416],
    },
    {
      legend: "japan",
      values: [126, 166, 238, 122, 102, 120, 70, 281, 234, 59, 213, 289],
    },
  ],
};

const chart = LineChart({
  data,
  getScale: () => ({
    min: 0,
    max: 1000,
    step: 100,
  }),
  custom: {
    layout: (...[{ legends, plot, title }]) => 
      Container({
        padding: EdgeInsets.only({ top:50, left: 50, bottom: 70 }),
        child: Stack({
          children: [
            Positioned({
              top: -20,
              right: 0,
              child: Text("Inspired by Nivo", {
                style: new TextStyle({
                  fontSize: 14,
                  color: "#9ca3af",
                  fontFamily: "Noto Sans JP",
                }),
              }),
            }),
           Row({
            children: [
              Flexible({ flex: 1, child: plot }),
              SizedBox({ width: 20 }),
              Column({ 
               mainAxisAlignment: MainAxisAlignment.end,
               crossAxisAlignment: CrossAxisAlignment.start,
               children: legends,
              })
            ]
           })
          ],
        }),
      }),
    line: (...[{ values, index }, { scale }]) => {
      return CustomPaint({
        painter: {
          svg: {
            createDefaultSvgEl(context) {
              return {
                line: context.createSvgEl("path"),
                point: context.createSvgEl("path"),
              };
            },
            paint({ line, point }, { height, width }) {
              const linePath = new Path();
              const pointPath = new Path();
              const points = values.map((value, index) => {
                const y = height - (height * (value - scale.min)) / (scale.max - scale.min);
                const x = (index * width) / (values.length - 1);
                return { x, y };
              });

              linePath.moveTo(points[0]);
              points.slice(1).forEach((point) => {
                linePath.lineTo(point);
              });

              points.forEach((point) => {
                pointPath.addOval(
                  Rect.fromCircle({ center: new Offset(point), radius: 5 })
                );
              });

              line.setAttribute("fill", "none");
              line.setAttribute("stroke", colors[index]);
              line.setAttribute("stroke-width", "2");
              line.setAttribute("d", linePath.getD());
              point.setAttribute("fill", "#1f2937");
              point.setAttribute("stroke", colors[index]);
              point.setAttribute("stroke-width", "1");
              point.setAttribute("d", pointPath.getD());
            },
          },
        },
      });
    },
    xAxisLabel: (...[{ name }]) => Padding({
      padding: EdgeInsets.only({ top: 1 }),
      child: Text(name, {
        style: new TextStyle({
          fontFamily: "Noto Sans JP",
          fontSize: 12,
          color: "#d1d5db",
        }),
      }),
    }),
    yAxisLabel: (...[{ name }]) => Padding({
      padding: EdgeInsets.only({ right: 1 }),
      child: Text(name, {
        style: new TextStyle({
          fontFamily: "Noto Sans JP",
          fontSize: 12,
          color: "#d1d5db",
        }),
      }),
    }),
    xAxisTick: () => Container({
      height: 6,
      width: 1,
      color: "#6b7280",
    }),
    yAxisTick: () => Container({
      height: 1,
      width: 6,
      color: "#6b7280",
    }),
    yAxisLine: () => Container({
      color: "#6b7280",
      width: 1,
    }),
    xAxisLine: () => Container({
      color: "#6b7280",
      height: 1,
    }),
    legend: (...[{ name, index }]) => {
        const colors = ["#86efac", "#fbbf24", "#facc15", "#fb7185", "#fdba74"]; 
        const color = colors[index] || "#CCCCCC";

        return Row({
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
                Container({
                    width: 15,
                    height: 15,
                    decoration: new BoxDecoration({
                        color, 
                        shape: "circle", 
                    }),
                }),
            SizedBox({ width: 8 }), 
            Text(name, {
                style: new TextStyle({
                fontFamily: "Noto Sans JP",
                fontSize: 14,
                color: "#d1d5db", // 텍스트 색상
                    }),
                }),
            ],
        });
    },
    gridXLine: () => Container({ height: 1, color: "#374151" }),
    gridYLine: () => Container({ width: 1, color: "#374151" }),
  },
});

const fullCode = `import Widget from "@meursyphus/flitter-react";
import { LineChart } from "@meursyphus/headless-chart";
import {
  Text,
  CustomPaint,
  Path,
  Rect,
  Offset,
  BoxDecoration,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  Row,
  SizedBox,
  TextStyle,
  Flexible,
  Padding,
  MainAxisSize,
  MainAxisAlignment,
  Stack,
  Positioned
} from "@meursyphus/flitter";

const colors = [
  "#86efac", "#fbbf24", "#facc15", "#fb7185", "#fdba74"
];

const data = {
  labels: ["plane","helicopter","boat","train","subway","bus","car","moto","bicycle","horse","skateboard","others"],
  datasets: [
    {
      legend: "norway",
      values: [600, 1000, 800, 1000, 500, 850, 600, 675, 720, 890, 700, 950],
    },
    {
      legend: "germany",
      values: [565, 850, 734, 863, 268, 571, 396, 588, 442, 726, 640, 732],
    },
    {
      legend: "us",
      values: [435, 559, 482, 580, 167, 308, 255, 557, 437, 438, 543, 554],
    },
    {
      legend: "france",
      values: [242, 405, 262, 418, 109, 224, 216, 339, 428, 284, 247, 416],
    },
    {
      legend: "japan",
      values: [126, 166, 238, 122, 102, 120, 70, 281, 234, 59, 213, 289],
    },
  ],
};

const chart = LineChart({
  data,
  getScale: () => ({
    min: 0,
    max: 1000,
    step: 100,
  }),
  custom: {
    layout: (...[{ legends, plot, title }]) => 
      Container({
        padding: EdgeInsets.only({ top:50, left: 50, bottom: 70 }),
        child: Stack({
          children: [
            Positioned({
              top: -20,
              right: 0,
              child: Text("Inspired by Nivo", {
                style: new TextStyle({
                  fontSize: 14,
                  color: "#9ca3af",
                  fontFamily: "Noto Sans JP",
                }),
              }),
            }),
           Row({
            children: [
              Flexible({ flex: 1, child: plot }),
              SizedBox({ width: 20 }),
              Column({ 
               mainAxisAlignment: MainAxisAlignment.end,
               crossAxisAlignment: CrossAxisAlignment.start,
               children: legends,
              })
            ]
           })
          ],
        }),
      }),
    line: (...[{ values, index }, { scale }]) => {
      return CustomPaint({
        painter: {
          svg: {
            createDefaultSvgEl(context) {
              return {
                line: context.createSvgEl("path"),
                point: context.createSvgEl("path"),
              };
            },
            paint({ line, point }, { height, width }) {
              const linePath = new Path();
              const pointPath = new Path();
              const points = values.map((value, index) => {
                const y = height - (height * (value - scale.min)) / (scale.max - scale.min);
                const x = (index * width) / (values.length - 1);
                return { x, y };
              });

              linePath.moveTo(points[0]);
              points.slice(1).forEach((point) => {
                linePath.lineTo(point);
              });

              points.forEach((point) => {
                pointPath.addOval(
                  Rect.fromCircle({ center: new Offset(point), radius: 5 })
                );
              });

              line.setAttribute("fill", "none");
              line.setAttribute("stroke", colors[index]);
              line.setAttribute("stroke-width", "2");
              line.setAttribute("d", linePath.getD());
              point.setAttribute("fill", "#1f2937");
              point.setAttribute("stroke", colors[index]);
              point.setAttribute("stroke-width", "1");
              point.setAttribute("d", pointPath.getD());
            },
          },
        },
      });
    },
    xAxisLabel: (...[{ name }]) => Padding({
      padding: EdgeInsets.only({ top: 1 }),
      child: Text(name, {
        style: new TextStyle({
          fontFamily: "Noto Sans JP",
          fontSize: 12,
          color: "#d1d5db",
        }),
      }),
    }),
    yAxisLabel: (...[{ name }]) => Padding({
      padding: EdgeInsets.only({ right: 1 }),
      child: Text(name, {
        style: new TextStyle({
          fontFamily: "Noto Sans JP",
          fontSize: 12,
          color: "#d1d5db",
        }),
      }),
    }),
    xAxisTick: () => Container({
      height: 6,
      width: 1,
      color: "#6b7280",
    }),
    yAxisTick: () => Container({
      height: 1,
      width: 6,
      color: "#6b7280",
    }),
    yAxisLine: () => Container({
      color: "#6b7280",
      width: 1,
    }),
    xAxisLine: () => Container({
      color: "#6b7280",
      height: 1,
    }),
    legend: (...[{ name, index }]) => {
        const colors = ["#86efac", "#fbbf24", "#facc15", "#fb7185", "#fdba74"]; 
        const color = colors[index] || "#CCCCCC";

        return Row({
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
                Container({
                    width: 15,
                    height: 15,
                    decoration: new BoxDecoration({
                        color, 
                        shape: "circle", 
                    }),
                }),
            SizedBox({ width: 8 }), 
            Text(name, {
                style: new TextStyle({
                fontFamily: "Noto Sans JP",
                fontSize: 14,
                color: "#d1d5db",
                    }),
                }),
            ],
        });
    },
    gridXLine: () => Container({ height: 1, color: "#374151" }),
    gridYLine: () => Container({ width: 1, color: "#374151" }),
  },
});

export default function App() {
  return (
    <Widget
      width="auto"
      height="400px"
      widget={chart}
      renderer="svg"
    />
  );
}`;

export default function Charts02() {
  return (
    <div>
      <div className="bg-gray-900 p-6 rounded-lg my-8">
        <Widget
          width="auto"
          height="400px"
          widget={chart}
          renderer="svg"
        />
      </div>
      <CodeDrawer code={fullCode} title="Line Chart 전체 구현 코드" />
    </div>
  );
}