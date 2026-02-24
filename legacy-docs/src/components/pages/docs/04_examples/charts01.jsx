import Widget from "@meursyphus/flitter-react";
import { BarChart } from "@meursyphus/headless-chart";
import {
  Text,
  BoxDecoration,
  Column,
  Container,
  EdgeInsets,
  Row,
  SizedBox,
  TextStyle,
  Padding,
  MainAxisSize,
  MainAxisAlignment,
  Flexible,
  Stack,
  Positioned,
  CrossAxisAlignment,
  BorderRadius,
  Radius,
  Alignment,
  FractionalTranslation,
  BoxShadow,
} from "@meursyphus/flitter";
import CodeDrawer from './CodeDrawer';

const data = {
  labels: ["Africa", "America", "Asia", "Europe"],
  datasets: [
    {
      legend: "Year 1990",
      values: [631, 727, 3292, 721],
    },
    {
      legend: "Year 2000",
      values: [814, 841, 3714, 726],
    },
    {
      legend: "Year 2018",
      values: [1276, 1007, 4561, 746],
    },
  ],
};

const backgroundColors = [
  "rgb(99,190,255)",
  "rgb(147,143,255)",
  "rgb(77,237,157)",
];

const Layout = (...[{ legends, plot }]) =>
  Container({
    padding: EdgeInsets.only({ left: 60, bottom: 70, right: 60 }),
    child: Stack({
      children: [
        Positioned({
          top: 20,
          right: 0,
          child: Text("highchart 따라하기 :)", {
            style: new TextStyle({
              fontSize: 14,
              color: "#9ca3af",
              fontFamily: "Noto Sans JP",
            }),
          }),
        }),
        Positioned({
          top: 0,
          left: -60,
          child: Column({
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("Historic World Population by Region", {
                style: new TextStyle({
                  fontSize: 20,
                  fontWeight: "bold",
                  fontFamily: "Noto Sans JP",
                  color: "#f3f4f6",
                }),
              }),
              Text("Source: Wikipedia.org", {
                style: new TextStyle({
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#9ca3af",
                  fontFamily: "Noto Sans JP",
                }),
              }),
            ],
          }),
        }),
        Padding({
          padding: EdgeInsets.only({ top: 60 }),
          child: plot,
        }),
        Positioned({
          top: 90,
          right: 40,
          child: Container({
            padding: EdgeInsets.symmetric({ horizontal: 10, vertical: 8 }),
            decoration: new BoxDecoration({
              color: "rgba(31, 41, 55, 0.95)",
              boxShadow: [
                new BoxShadow({
                  color: "rgba(0, 0, 0, 0.3)",
                  offset: { x: 0, y: 0 },
                  blurRadius: 2,
                }),
              ],
            }),
            child: Column({
              mainAxisSize: MainAxisSize.min,
              children: legends,
            }),
          }),
        }),
      ],
    }),
  });

const XAxisLabel = (...[{ name }]) =>
  Padding({
    padding: EdgeInsets.only({ top: 10 }),
    child: Text(name, {
      style: new TextStyle({
        fontFamily: "Noto Sans JP",
        fontWeight: "600",
        fontSize: 14,
        color: "#d1d5db",
      }),
    }),
  });

const YAxisLabel = (...[{ name }]) =>
  Padding({
    padding: EdgeInsets.only({ right: 10 }),
    child: Text(name, {
      style: new TextStyle({
        fontFamily: "Noto Sans JP",
        fontWeight: "600",
        fontSize: 14,
        color: "#d1d5db",
      }),
    }),
  });

const xAxisLine = () =>
  Container({
    color: "#4b5563",
    height: 1,
    width: Infinity,
  });

const Legend = (...[{ name, index }]) =>
  Padding({
    padding: EdgeInsets.symmetric({ vertical: 2 }),
    child: Row({
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: [
        Container({
          width: 12,
          height: 12,
          decoration: new BoxDecoration({
            shape: "circle",
            color: backgroundColors[index],
          }),
        }),
        SizedBox({ width: 8 }),
        Text(name, {
          style: new TextStyle({
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: "500",
            color: "#e5e7eb",
          }),
        }),
      ],
    }),
  });

const Bar = (...[{ legend, value }, { data }]) => {
  const index = data.datasets.findIndex((d) => d.legend === legend);
  const backgroundColor = backgroundColors[index];
  return Container({
    width: Infinity,
    height: 14,
    alignment: Alignment.centerRight,
    decoration: new BoxDecoration({
      color: backgroundColor,
      borderRadius: BorderRadius.only({
        topRight: Radius.circular(7),
        bottomRight: Radius.circular(7),
      }),
    }),
    child: FractionalTranslation({
      translation: { x: 1, y: 0 },
      child: Padding({
        padding: EdgeInsets.only({ left: 6 }),
        child: Text(value.toLocaleString("ko-KR").replace(",", " "), {
          style: new TextStyle({
            fontFamily: "Noto Sans JP",
            fontSize: 12,
            fontWeight: "bold",
            color: "#111827",
          }),
        }),
      }),
    }),
  });
};

const chart = BarChart({
  data,
  direction: "horizontal",
  custom: {
    layout: Layout,
    xAxisLabel: XAxisLabel,
    yAxisLabel: YAxisLabel,
    xAxisLine: xAxisLine,
    yAxisTick: () => SizedBox.shrink(),
    xAxisTick: () => SizedBox.shrink(),
    legend: Legend,
    yAxisLine: () => SizedBox.shrink(),
    bar: Bar,
    gridYLine: () => SizedBox.shrink(),
    gridXLine: () => Container({ height: 1, color: "#374151" }),
  },
});

const fullCode = `import Widget from "@meursyphus/flitter-react";
import { BarChart } from "@meursyphus/headless-chart";
import {
  Text,
  BoxDecoration,
  Column,
  Container,
  EdgeInsets,
  Row,
  SizedBox,
  TextStyle,
  Padding,
  MainAxisSize,
  MainAxisAlignment,
  Flexible,
  Stack,
  Positioned,
  CrossAxisAlignment,
  BorderRadius,
  Radius,
  Alignment,
  FractionalTranslation,
  BoxShadow,
} from "@meursyphus/flitter";

const data = {
  labels: ["Africa", "America", "Asia", "Europe"],
  datasets: [
    {
      legend: "Year 1990",
      values: [631, 727, 3292, 721],
    },
    {
      legend: "Year 2000",
      values: [814, 841, 3714, 726],
    },
    {
      legend: "Year 2018",
      values: [1276, 1007, 4561, 746],
    },
  ],
};

const backgroundColors = [
  "rgb(99,190,255)",
  "rgb(147,143,255)",
  "rgb(77,237,157)",
];

const Layout = (...[{ legends, plot }]) =>
  Container({
    padding: EdgeInsets.only({ left: 60, bottom: 70, right: 60 }),
    child: Stack({
      children: [
        Positioned({
          top: 20,
          right: 0,
          child: Text("highchart 따라하기 :)", {
            style: new TextStyle({
              fontSize: 14,
              color: "#9ca3af",
              fontFamily: "Noto Sans JP",
            }),
          }),
        }),
        Positioned({
          top: 0,
          left: -60,
          child: Column({
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("Historic World Population by Region", {
                style: new TextStyle({
                  fontSize: 20,
                  fontWeight: "bold",
                  fontFamily: "Noto Sans JP",
                  color: "#f3f4f6",
                }),
              }),
              Text("Source: Wikipedia.org", {
                style: new TextStyle({
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#9ca3af",
                  fontFamily: "Noto Sans JP",
                }),
              }),
            ],
          }),
        }),
        Padding({
          padding: EdgeInsets.only({ top: 60 }),
          child: plot,
        }),
        Positioned({
          top: 90,
          right: 40,
          child: Container({
            padding: EdgeInsets.symmetric({ horizontal: 10, vertical: 8 }),
            decoration: new BoxDecoration({
              color: "rgba(31, 41, 55, 0.95)",
              boxShadow: [
                new BoxShadow({
                  color: "rgba(0, 0, 0, 0.3)",
                  offset: { x: 0, y: 0 },
                  blurRadius: 2,
                }),
              ],
            }),
            child: Column({
              mainAxisSize: MainAxisSize.min,
              children: legends,
            }),
          }),
        }),
      ],
    }),
  });

const XAxisLabel = (...[{ name }]) =>
  Padding({
    padding: EdgeInsets.only({ top: 10 }),
    child: Text(name, {
      style: new TextStyle({
        fontFamily: "Noto Sans JP",
        fontWeight: "600",
        fontSize: 14,
        color: "#d1d5db",
      }),
    }),
  });

const YAxisLabel = (...[{ name }]) =>
  Padding({
    padding: EdgeInsets.only({ right: 10 }),
    child: Text(name, {
      style: new TextStyle({
        fontFamily: "Noto Sans JP",
        fontWeight: "600",
        fontSize: 14,
        color: "#d1d5db",
      }),
    }),
  });

const xAxisLine = () =>
  Container({
    color: "#4b5563",
    height: 1,
    width: Infinity,
  });

const Legend = (...[{ name, index }]) =>
  Padding({
    padding: EdgeInsets.symmetric({ vertical: 2 }),
    child: Row({
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: [
        Container({
          width: 12,
          height: 12,
          decoration: new BoxDecoration({
            shape: "circle",
            color: backgroundColors[index],
          }),
        }),
        SizedBox({ width: 8 }),
        Text(name, {
          style: new TextStyle({
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: "500",
            color: "#e5e7eb",
          }),
        }),
      ],
    }),
  });

const Bar = (...[{ legend, value }, { data }]) => {
  const index = data.datasets.findIndex((d) => d.legend === legend);
  const backgroundColor = backgroundColors[index];
  return Container({
    width: Infinity,
    height: 14,
    alignment: Alignment.centerRight,
    decoration: new BoxDecoration({
      color: backgroundColor,
      borderRadius: BorderRadius.only({
        topRight: Radius.circular(7),
        bottomRight: Radius.circular(7),
      }),
    }),
    child: FractionalTranslation({
      translation: { x: 1, y: 0 },
      child: Padding({
        padding: EdgeInsets.only({ left: 6 }),
        child: Text(value.toLocaleString("ko-KR").replace(",", " "), {
          style: new TextStyle({
            fontFamily: "Noto Sans JP",
            fontSize: 12,
            fontWeight: "bold",
            color: "#111827",
          }),
        }),
      }),
    }),
  });
};

const chart = BarChart({
  data,
  direction: "horizontal",
  custom: {
    layout: Layout,
    xAxisLabel: XAxisLabel,
    yAxisLabel: YAxisLabel,
    xAxisLine: xAxisLine,
    yAxisTick: () => SizedBox.shrink(),
    xAxisTick: () => SizedBox.shrink(),
    legend: Legend,
    yAxisLine: () => SizedBox.shrink(),
    bar: Bar,
    gridYLine: () => SizedBox.shrink(),
    gridXLine: () => Container({ height: 1, color: "#374151" }),
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

export default function Charts01() {
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
      <CodeDrawer code={fullCode} title="Bar Chart 전체 구현 코드" />
    </div>
  );
}