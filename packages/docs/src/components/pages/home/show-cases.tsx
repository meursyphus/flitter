import Flicking from "@egjs/react-flicking";
import ReactWidget from "@meursyphus/flitter-react";
import {
  Text,
  Border,
  BoxDecoration,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  GestureDetector,
  MainAxisSize,
  Row,
  TextStyle,
  CustomPaint,
  Path,
} from "@meursyphus/flitter";
import {
  BarChart,
  BubbleChart,
  LineChart,
  ScatterChart,
  StackedBarChart,
} from "@meursyphus/flitter-chart";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Check = ({ color = "white" }: { color?: string } = {}) => {
  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl({ createSvgEl }) {
          const check = createSvgEl("path");
          return {
            check,
          };
        },
        paint({ check }, size) {
          const path = new Path();
          path.moveTo({ x: size.width * 0.2, y: size.height * 0.5 });
          path.lineTo({ x: size.width * 0.4, y: size.height * 0.7 });
          path.lineTo({ x: size.width * 0.8, y: size.height * 0.3 });

          check.setAttribute("fill", "none");
          check.setAttribute("stroke", color);
          check.setAttribute("stroke-width", "1");
          check.setAttribute("d", path.getD());
        },
      },
      canvas: {
        paint({ canvas }, size) {
          const path = new Path();
          path.moveTo({ x: size.width * 0.2, y: size.height * 0.5 });
          path.lineTo({ x: size.width * 0.4, y: size.height * 0.7 });
          path.lineTo({ x: size.width * 0.8, y: size.height * 0.3 });
          canvas.strokeStyle = color;
          canvas.lineWidth = 1; // 선의 두께
          canvas.stroke(path.toCanvasPath());
        },
      },
    },
  });
};

type LegendProps = {
  legendStates: {
    color: string;
    label: string;
    visible: boolean;
  }[];
  style: TextStyle;
  margin?: EdgeInsets;
  gap?: number;
};

export default function Legend({
  legendStates,
  style,
  margin = EdgeInsets.only({ top: 5 }),
  gap = 20,
}: LegendProps) {
  return Container({
    margin,
    child: Row({
      mainAxisSize: MainAxisSize.min,
      children: legendStates.map((state) => {
        const { label, visible, color } = state;
        return Container({
          padding: EdgeInsets.symmetric({ horizontal: gap }),
          child: GestureDetector({
            onClick() {
              state.visible = !state.visible;
            },
            child: Row({
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container({
                  width: style.fontSize ? style.fontSize + 2 : 13,
                  height: style.fontSize ? style.fontSize + 2 : 13,
                  padding: EdgeInsets.all(1),
                  decoration: new BoxDecoration({
                    border: Border.all({ width: 1, color: "grey" }),
                  }),
                  child: visible ? Check() : undefined,
                }),
                Container({
                  margin: EdgeInsets.symmetric({ horizontal: 4 }),
                  width: style.fontSize ?? 11,
                  height: style.fontSize ?? 11,
                  color,
                }),
                Text(label, { style }),
              ],
            }),
          }),
        });
      }),
    }),
  });
}

const barChartProps = {
  data: {
    labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        legend: "Budget",
        data: [5000, 3000, 5000, 7000, 6000, 4000, 1000],
      },
      {
        legend: "Income",
        data: [8000, 4000, 7000, 2000, 6000, 3000, 5000],
      },
      {
        legend: "Expenses",
        data: [4000, 4000, 6000, 3000, 4000, 5000, 7000],
      },
      {
        legend: "Debt",
        data: [3000, 4000, 3000, 1000, 2000, 4000, 3000],
      },
    ],
    title: "Monthly Revenue",
  },
};

const commonCustoms = {
  layout: {
    type: "config",
    backgroundColor: "transparent",
  },
  xAxis: {
    type: "config",
    color: "white",
  },
  xAxisTick: {
    type: "config",
    color: "white",
  },
  xAxisLabel: {
    type: "config",
    font: {
      color: "white",
    },
  },
  yAxis: {
    type: "config",
    color: "white",
  },
  yAxisTick: {
    type: "config",
    color: "white",
  },
  yAxisLabel: {
    type: "config",
    font: {
      color: "white",
    },
  },
  plot: {
    type: "config",
    verticalLine: {
      color: "grey",
    },
    horizontalLine: {
      color: "grey",
    },
  },
  legend: {
    type: "custom",
    Custom(
      _: never,
      { legendStates }: { legendStates: LegendProps["legendStates"] },
    ) {
      return Legend({
        legendStates,
        style: new TextStyle({
          color: "white",
          fontSize: 12,
          fontFamily: "Noto sans JP",
        }),
      });
    },
  },
  title: {
    type: "config",
    font: {
      color: "white",
    },
  },
} as any;

const barChart = BarChart({
  ...barChartProps,
  custom: {
    ...commonCustoms,
  },
});

const stackedBarChart = StackedBarChart({
  ...barChartProps,
  custom: {
    chart: {
      type: "config",
      direction: "horizontal",
    },
    bar: {
      type: "config",
      thickness: 30,
    },
    ...commonCustoms,
  },
});

const bubbleChart = BubbleChart({
  theme: {
    border: {
      width: 1,
    },
  },
  scale: {
    x: {
      min: 0,
      step: 5000,
    },
    y: {
      min: 55,
      step: 5,
    },
  },
  data: {
    title: "Population",
    datasets: [
      {
        legend: "Africa",
        data: [
          { x: 4200, y: 70.35, value: 32209101, label: "Morocco" },
          { x: 4200, y: 70.71, value: 76117421, label: "Egypt" },
          { x: 5900, y: 56.46, value: 1355246, label: "Gabon" },
          { x: 6600, y: 72.74, value: 32129324, label: "Algeria" },
          { x: 6700, y: 76.28, value: 5631585, label: "Libya" },
          { x: 7100, y: 74.66, value: 9974722, label: "Tunisia" },
          { x: 10500, y: 69.28, value: 1096585, label: "Trinidad and Tobago" },
          { x: 12800, y: 72.09, value: 1220481, label: "Mauritius" },
          { x: 18200, y: 78.68, value: 396851, label: "Malta" },
        ],
      },
      {
        legend: "America",
        data: [
          { x: 4800, y: 74.64, value: 6191368, label: "Paraguay" },
          { x: 4900, y: 70.92, value: 6587541, label: "El Salvador" },
          { x: 5600, y: 69.22, value: 2754430, label: "Peru" },
          { x: 5800, y: 74.06, value: 2501738, label: "Venezuela" },
          { x: 6300, y: 67.63, value: 8833634, label: "Dominican Republic" },
          { x: 6500, y: 67.43, value: 272945, label: "Belize" },
          { x: 6600, y: 71.43, value: 4231077, label: "Colombia" },
          { x: 6900, y: 72.14, value: 3000463, label: "Panama" },
          { x: 8100, y: 71.41, value: 78410118, label: "Brazil" },
          { x: 9600, y: 76.63, value: 3956507, label: "Costa Rica" },
          { x: 9600, y: 74.94, value: 4495959, label: "Mexico" },
          { x: 12400, y: 75.7, value: 6914475, label: "Argentina" },
          { x: 14500, y: 75.92, value: 3399237, label: "Uruguay" },
          { x: 16400, y: 71.64, value: 278289, label: "Barbados" },
          { x: 17700, y: 65.63, value: 299697, label: "Bahamas, The" },
          { x: 17700, y: 77.49, value: 3897960, label: "Puerto Rico" },
          { x: 31500, y: 79.96, value: 32507874, label: "Canada" },
          { x: 32100, y: 77.43, value: 89302754, label: "United States" },
        ],
      },
      {
        legend: "Asia",
        data: [
          { x: 5600, y: 71.96, value: 92988000, label: "China" },
          { x: 5700, y: 61.29, value: 4863169, label: "Turkmenistan" },
          { x: 7700, y: 69.66, value: 19018924, label: "Iran" },
          { x: 7800, y: 66.07, value: 1514370, label: "Kazakhstan" },
          { x: 8100, y: 71.41, value: 14865523, label: "Thailand" },
          { x: 9700, y: 71.95, value: 23522482, label: "Malaysia" },
          { x: 12000, y: 75.23, value: 25795938, label: "Saudi Arabia" },
          { x: 13100, y: 72.85, value: 2903165, label: "Oman" },
          { x: 19200, y: 75.58, value: 48598170, label: "Korea, South" },
          { x: 19200, y: 73.98, value: 677886, label: "Bahrain" },
          { x: 20800, y: 79.17, value: 6199008, label: "Israel" },
          { x: 21300, y: 76.84, value: 2257549, label: "Kuwait" },
          { x: 23200, y: 73.4, value: 840290, label: "Qatar" },
          { x: 25200, y: 74.99, value: 2523915, label: "United Arab Emirates" },
          { x: 25300, y: 77.06, value: 22749838, label: "Taiwan" },
          { x: 27800, y: 81.53, value: 4353893, label: "Singapore" },
          { x: 29400, y: 81.04, value: 52733300, label: "Japan" },
          { x: 34200, y: 81.39, value: 6855125, label: "Hong Kong" },
        ],
      },
      {
        legend: "Europe",
        data: [
          { x: 7700, y: 71.12, value: 2235555, label: "Romania" },
          { x: 8200, y: 71.75, value: 7517973, label: "Bulgaria" },
          { x: 9800, y: 66.39, value: 54378233, label: "Russia" },
          { x: 10700, y: 76.38, value: 1582395, label: "Chile" },
          { x: 11200, y: 74.14, value: 4496869, label: "Croatia" },
          { x: 11500, y: 70.86, value: 2306306, label: "Latvia" },
          { x: 12000, y: 74.16, value: 38626349, label: "Poland" },
          { x: 12500, y: 73.46, value: 3607899, label: "Lithuania" },
          { x: 14300, y: 71.38, value: 1341664, label: "Estonia" },
          { x: 14500, y: 74.19, value: 5423567, label: "Slovakia" },
          { x: 14900, y: 72.25, value: 1003237, label: "Hungary" },
          { x: 16800, y: 75.78, value: 1024617, label: "Czech Republic" },
          { x: 17900, y: 77.35, value: 1052414, label: "Portugal" },
          { x: 19600, y: 75.93, value: 2011473, label: "Slovenia" },
          { x: 21300, y: 78.94, value: 10647529, label: "Greece" },
          { x: 23300, y: 79.37, value: 40280780, label: "Spain" },
          { x: 27700, y: 79.54, value: 58057477, label: "Italy" },
          { x: 28400, y: 80.3, value: 898640, label: "Sweden" },
          { x: 28700, y: 78.54, value: 22424609, label: "Germany" },
          { x: 28700, y: 79.44, value: 30424213, label: "France" },
          { x: 29000, y: 78.24, value: 5214512, label: "Finland" },
          { x: 29500, y: 78.68, value: 16318199, label: "Netherlands" },
          { x: 29600, y: 78.27, value: 60270708, label: "United Kingdom" },
          { x: 30600, y: 78.44, value: 10348276, label: "Belgium" },
          { x: 31300, y: 78.87, value: 8174762, label: "Austria" },
          { x: 31900, y: 77.36, value: 3969558, label: "Ireland" },
          { x: 31900, y: 80.18, value: 293966, label: "Iceland" },
          { x: 32200, y: 77.44, value: 5413392, label: "Denmark" },
          { x: 33800, y: 80.31, value: 7450867, label: "Switzerland" },
        ],
      },
      {
        legend: "Oceania",
        data: [
          { x: 2200, y: 64.56, value: 5420280, label: "Papua New Guinea" },
          { x: 2700, y: 61.32, value: 100798, label: "Kiribati" },
          { x: 5900, y: 69.2, value: 880874, label: "Fiji" },
          { x: 14500, y: 78.75, value: 108775, label: "Virgin Islands" },
          { x: 23200, y: 78.49, value: 1993817, label: "New Zealand" },
          { x: 30700, y: 80.26, value: 5991314, label: "Australia" },
        ],
      },
    ],
  },
  custom: {
    ...commonCustoms,
  },
});

const scatterChart = ScatterChart({
  data: {
    title: "Body Mass Index",
    datasets: [
      {
        legend: "male",
        data: [
          { x: 174, y: 65.6 },
          { x: 175.3, y: 71.8 },
          { x: 193.5, y: 80.7 },
          { x: 186.5, y: 72.6 },
          { x: 187.2, y: 78.8 },
          { x: 181.5, y: 74.8 },
          { x: 184, y: 86.4 },
          { x: 184.5, y: 78.4 },
          { x: 175, y: 62 },
          { x: 184, y: 81.6 },
          { x: 180, y: 76.6 },
          { x: 177.8, y: 83.6 },
          { x: 192, y: 90 },
          { x: 176, y: 74.6 },
          { x: 174, y: 71 },
          { x: 184, y: 79.6 },
          { x: 192.7, y: 93.8 },
          { x: 171.5, y: 70 },
          { x: 173, y: 72.4 },
          { x: 176, y: 85.9 },
          { x: 176, y: 78.8 },
          { x: 180.5, y: 77.8 },
          { x: 172.7, y: 66.2 },
          { x: 176, y: 86.4 },
          { x: 173.5, y: 81.8 },
          { x: 178, y: 89.6 },
          { x: 180.3, y: 82.8 },
          { x: 180.3, y: 76.4 },
          { x: 164.5, y: 63.2 },
          { x: 173, y: 60.9 },
          { x: 183.5, y: 74.8 },
          { x: 175.5, y: 70 },
          { x: 188, y: 72.4 },
          { x: 189.2, y: 84.1 },
          { x: 172.8, y: 69.1 },
          { x: 170, y: 59.5 },
          { x: 182, y: 67.2 },
          { x: 170, y: 61.3 },
          { x: 177.8, y: 68.6 },
          { x: 184.2, y: 80.1 },
          { x: 186.7, y: 87.8 },
          { x: 171.4, y: 84.7 },
          { x: 172.7, y: 73.4 },
          { x: 175.3, y: 72.1 },
          { x: 180.3, y: 82.6 },
          { x: 182.9, y: 88.7 },
          { x: 188, y: 84.1 },
          { x: 177.2, y: 94.1 },
          { x: 172.1, y: 74.9 },
          { x: 167, y: 59.1 },
          { x: 169.5, y: 75.6 },
          { x: 174, y: 86.2 },
          { x: 172.7, y: 75.3 },
          { x: 182.2, y: 87.1 },
          { x: 164.1, y: 55.2 },
          { x: 163, y: 57 },
          { x: 171.5, y: 61.4 },
          { x: 184.2, y: 76.8 },
          { x: 174, y: 86.8 },
          { x: 174, y: 72.2 },
          { x: 177, y: 71.6 },
          { x: 186, y: 84.8 },
          { x: 167, y: 68.2 },
          { x: 171.8, y: 66.1 },
          { x: 182, y: 72 },
          { x: 167, y: 64.6 },
          { x: 177.8, y: 74.8 },
          { x: 164.5, y: 70 },
          { x: 192, y: 101.6 },
          { x: 175.5, y: 63.2 },
          { x: 171.2, y: 79.1 },
          { x: 181.6, y: 78.9 },
          { x: 167.4, y: 67.7 },
          { x: 181.1, y: 66 },
          { x: 177, y: 68.2 },
          { x: 174.5, y: 63.9 },
          { x: 177.5, y: 72 },
          { x: 170.5, y: 56.8 },
          { x: 182.4, y: 74.5 },
          { x: 197.1, y: 90.9 },
          { x: 180.1, y: 93 },
          { x: 175.5, y: 80.9 },
          { x: 180.6, y: 72.7 },
          { x: 184.4, y: 68 },
          { x: 175.5, y: 70.9 },
          { x: 180.6, y: 72.5 },
          { x: 177, y: 72.5 },
          { x: 177.1, y: 83.4 },
          { x: 181.6, y: 75.5 },
          { x: 176.5, y: 73 },
          { x: 175, y: 70.2 },
          { x: 174, y: 73.4 },
          { x: 165.1, y: 70.5 },
          { x: 177, y: 68.9 },
          { x: 192, y: 102.3 },
          { x: 176.5, y: 68.4 },
          { x: 169.4, y: 65.9 },
          { x: 182.1, y: 75.7 },
          { x: 179.8, y: 84.5 },
          { x: 175.3, y: 87.7 },
          { x: 184.9, y: 86.4 },
          { x: 177.3, y: 73.2 },
          { x: 167.4, y: 53.9 },
          { x: 178.1, y: 72 },
          { x: 168.9, y: 55.5 },
          { x: 157.2, y: 58.4 },
          { x: 180.3, y: 83.2 },
          { x: 170.2, y: 72.7 },
          { x: 177.8, y: 64.1 },
          { x: 172.7, y: 72.3 },
          { x: 165.1, y: 65 },
          { x: 186.7, y: 86.4 },
          { x: 165.1, y: 65 },
          { x: 174, y: 88.6 },
          { x: 175.3, y: 84.1 },
          { x: 185.4, y: 66.8 },
          { x: 177.8, y: 75.5 },
          { x: 180.3, y: 93.2 },
          { x: 180.3, y: 82.7 },
          { x: 177.8, y: 58 },
          { x: 177.8, y: 79.5 },
          { x: 177.8, y: 78.6 },
          { x: 177.8, y: 71.8 },
          { x: 177.8, y: 116.4 },
          { x: 163.8, y: 72.2 },
          { x: 188, y: 83.6 },
          { x: 198.1, y: 85.5 },
          { x: 175.3, y: 90.9 },
          { x: 166.4, y: 85.9 },
          { x: 190.5, y: 89.1 },
          { x: 166.4, y: 75 },
          { x: 177.8, y: 77.7 },
          { x: 179.7, y: 86.4 },
          { x: 172.7, y: 90.9 },
          { x: 190.5, y: 73.6 },
          { x: 185.4, y: 76.4 },
          { x: 168.9, y: 69.1 },
          { x: 167.6, y: 84.5 },
          { x: 175.3, y: 64.5 },
          { x: 170.2, y: 69.1 },
          { x: 190.5, y: 108.6 },
          { x: 177.8, y: 86.4 },
          { x: 190.5, y: 80.9 },
          { x: 177.8, y: 87.7 },
          { x: 184.2, y: 94.5 },
          { x: 176.5, y: 80.2 },
          { x: 177.8, y: 72 },
          { x: 180.3, y: 71.4 },
          { x: 171.4, y: 72.7 },
          { x: 172.7, y: 84.1 },
          { x: 172.7, y: 76.8 },
          { x: 177.8, y: 63.6 },
          { x: 177.8, y: 80.9 },
          { x: 182.9, y: 80.9 },
          { x: 170.2, y: 85.5 },
          { x: 167.6, y: 68.6 },
          { x: 175.3, y: 67.7 },
          { x: 165.1, y: 66.4 },
          { x: 185.4, y: 102.3 },
          { x: 181.6, y: 70.5 },
          { x: 172.7, y: 95.9 },
          { x: 190.5, y: 84.1 },
          { x: 179.1, y: 87.3 },
          { x: 175.3, y: 71.8 },
          { x: 170.2, y: 65.9 },
          { x: 193, y: 95.9 },
          { x: 171.4, y: 91.4 },
          { x: 177.8, y: 81.8 },
          { x: 177.8, y: 96.8 },
          { x: 167.6, y: 69.1 },
          { x: 167.6, y: 82.7 },
          { x: 180.3, y: 75.5 },
          { x: 182.9, y: 79.5 },
          { x: 176.5, y: 73.6 },
          { x: 186.7, y: 91.8 },
          { x: 188, y: 84.1 },
          { x: 188, y: 85.9 },
          { x: 177.8, y: 81.8 },
          { x: 174, y: 82.5 },
          { x: 177.8, y: 80.5 },
          { x: 171.4, y: 70 },
          { x: 185.4, y: 81.8 },
          { x: 185.4, y: 84.1 },
          { x: 188, y: 90.5 },
          { x: 188, y: 91.4 },
          { x: 182.9, y: 89.1 },
          { x: 176.5, y: 85 },
          { x: 175.3, y: 69.1 },
          { x: 175.3, y: 73.6 },
          { x: 188, y: 80.5 },
          { x: 188, y: 82.7 },
          { x: 175.3, y: 86.4 },
          { x: 170.5, y: 67.7 },
          { x: 179.1, y: 92.7 },
          { x: 177.8, y: 93.6 },
          { x: 175.3, y: 70.9 },
          { x: 182.9, y: 75 },
          { x: 170.8, y: 93.2 },
          { x: 188, y: 93.2 },
          { x: 180.3, y: 77.7 },
          { x: 177.8, y: 61.4 },
          { x: 185.4, y: 94.1 },
          { x: 168.9, y: 75 },
          { x: 185.4, y: 83.6 },
          { x: 180.3, y: 85.5 },
          { x: 174, y: 73.9 },
          { x: 167.6, y: 66.8 },
          { x: 182.9, y: 87.3 },
          { x: 160, y: 72.3 },
          { x: 180.3, y: 88.6 },
          { x: 167.6, y: 75.5 },
          { x: 186.7, y: 101.4 },
          { x: 175.3, y: 91.1 },
          { x: 175.3, y: 67.3 },
          { x: 175.9, y: 77.7 },
          { x: 175.3, y: 81.8 },
          { x: 179.1, y: 75.5 },
          { x: 181.6, y: 84.5 },
          { x: 177.8, y: 76.6 },
          { x: 182.9, y: 85 },
          { x: 177.8, y: 102.5 },
          { x: 184.2, y: 77.3 },
          { x: 179.1, y: 71.8 },
          { x: 176.5, y: 87.9 },
          { x: 188, y: 94.3 },
          { x: 174, y: 70.9 },
          { x: 167.6, y: 64.5 },
          { x: 170.2, y: 77.3 },
          { x: 167.6, y: 72.3 },
          { x: 188, y: 87.3 },
          { x: 174, y: 80 },
          { x: 176.5, y: 82.3 },
          { x: 180.3, y: 73.6 },
          { x: 167.6, y: 74.1 },
          { x: 188, y: 85.9 },
          { x: 180.3, y: 73.2 },
          { x: 167.6, y: 76.3 },
          { x: 183, y: 65.9 },
          { x: 183, y: 90.9 },
          { x: 179.1, y: 89.1 },
          { x: 170.2, y: 62.3 },
          { x: 177.8, y: 82.7 },
          { x: 179.1, y: 79.1 },
          { x: 190.5, y: 98.2 },
          { x: 177.8, y: 84.1 },
          { x: 180.3, y: 83.2 },
          { x: 180.3, y: 83.2 },
        ],
      },
      {
        legend: "female",
        data: [
          { x: 161.2, y: 51.6 },
          { x: 167.5, y: 59 },
          { x: 159.5, y: 49.2 },
          { x: 157, y: 63 },
          { x: 155.8, y: 53.6 },
          { x: 170, y: 59 },
          { x: 159.1, y: 47.6 },
          { x: 166, y: 69.8 },
          { x: 176.2, y: 66.8 },
          { x: 160.2, y: 75.2 },
          { x: 172.5, y: 55.2 },
          { x: 170.9, y: 54.2 },
          { x: 172.9, y: 62.5 },
          { x: 153.4, y: 42 },
          { x: 160, y: 50 },
          { x: 147.2, y: 49.8 },
          { x: 168.2, y: 49.2 },
          { x: 175, y: 73.2 },
          { x: 157, y: 47.8 },
          { x: 167.6, y: 68.8 },
          { x: 159.5, y: 50.6 },
          { x: 175, y: 82.5 },
          { x: 166.8, y: 57.2 },
          { x: 176.5, y: 87.8 },
          { x: 170.2, y: 72.8 },
          { x: 174, y: 54.5 },
          { x: 173, y: 59.8 },
          { x: 179.9, y: 67.3 },
          { x: 170.5, y: 67.8 },
          { x: 160, y: 47 },
          { x: 154.4, y: 46.2 },
          { x: 162, y: 55 },
          { x: 176.5, y: 83 },
          { x: 160, y: 54.4 },
          { x: 152, y: 45.8 },
          { x: 162.1, y: 53.6 },
          { x: 170, y: 73.2 },
          { x: 160.2, y: 52.1 },
          { x: 161.3, y: 67.9 },
          { x: 166.4, y: 56.6 },
          { x: 168.9, y: 62.3 },
          { x: 163.8, y: 58.5 },
          { x: 167.6, y: 54.5 },
          { x: 160, y: 50.2 },
          { x: 161.3, y: 60.3 },
          { x: 167.6, y: 58.3 },
          { x: 165.1, y: 56.2 },
          { x: 160, y: 50.2 },
          { x: 170, y: 72.9 },
          { x: 157.5, y: 59.8 },
          { x: 167.6, y: 61 },
          { x: 160.7, y: 69.1 },
          { x: 163.2, y: 55.9 },
          { x: 152.4, y: 46.5 },
          { x: 157.5, y: 54.3 },
          { x: 168.3, y: 54.8 },
          { x: 180.3, y: 60.7 },
          { x: 165.5, y: 60 },
          { x: 165, y: 62 },
          { x: 164.5, y: 60.3 },
          { x: 156, y: 52.7 },
          { x: 160, y: 74.3 },
          { x: 163, y: 62 },
          { x: 165.7, y: 73.1 },
          { x: 161, y: 80 },
          { x: 162, y: 54.7 },
          { x: 166, y: 53.2 },
          { x: 174, y: 75.7 },
          { x: 172.7, y: 61.1 },
          { x: 167.6, y: 55.7 },
          { x: 151.1, y: 48.7 },
          { x: 164.5, y: 52.3 },
          { x: 163.5, y: 50 },
          { x: 152, y: 59.3 },
          { x: 169, y: 62.5 },
          { x: 164, y: 55.7 },
          { x: 161.2, y: 54.8 },
          { x: 155, y: 45.9 },
          { x: 170, y: 70.6 },
          { x: 176.2, y: 67.2 },
          { x: 170, y: 69.4 },
          { x: 162.5, y: 58.2 },
          { x: 170.3, y: 64.8 },
          { x: 164.1, y: 71.6 },
          { x: 169.5, y: 52.8 },
          { x: 163.2, y: 59.8 },
          { x: 154.5, y: 49 },
          { x: 159.8, y: 50 },
          { x: 173.2, y: 69.2 },
          { x: 170, y: 55.9 },
          { x: 161.4, y: 63.4 },
          { x: 169, y: 58.2 },
          { x: 166.2, y: 58.6 },
          { x: 159.4, y: 45.7 },
          { x: 162.5, y: 52.2 },
          { x: 159, y: 48.6 },
          { x: 162.8, y: 57.8 },
          { x: 159, y: 55.6 },
          { x: 179.8, y: 66.8 },
          { x: 162.9, y: 59.4 },
          { x: 161, y: 53.6 },
          { x: 151.1, y: 73.2 },
          { x: 168.2, y: 53.4 },
          { x: 168.9, y: 69 },
          { x: 173.2, y: 58.4 },
          { x: 171.8, y: 56.2 },
          { x: 178, y: 70.6 },
          { x: 164.3, y: 59.8 },
          { x: 163, y: 72 },
          { x: 168.5, y: 65.2 },
          { x: 166.8, y: 56.6 },
          { x: 172.7, y: 105.2 },
          { x: 163.5, y: 51.8 },
          { x: 169.4, y: 63.4 },
          { x: 167.8, y: 59 },
          { x: 159.5, y: 47.6 },
          { x: 167.6, y: 63 },
          { x: 161.2, y: 55.2 },
          { x: 160, y: 45 },
          { x: 163.2, y: 54 },
          { x: 162.2, y: 50.2 },
          { x: 161.3, y: 60.2 },
          { x: 149.5, y: 44.8 },
          { x: 157.5, y: 58.8 },
          { x: 163.2, y: 56.4 },
          { x: 172.7, y: 62 },
          { x: 155, y: 49.2 },
          { x: 156.5, y: 67.2 },
          { x: 164, y: 53.8 },
          { x: 160.9, y: 54.4 },
          { x: 162.8, y: 58 },
          { x: 167, y: 59.8 },
          { x: 160, y: 54.8 },
          { x: 160, y: 43.2 },
          { x: 168.9, y: 60.5 },
          { x: 158.2, y: 46.4 },
          { x: 156, y: 64.4 },
          { x: 160, y: 48.8 },
          { x: 167.1, y: 62.2 },
          { x: 158, y: 55.5 },
          { x: 167.6, y: 57.8 },
          { x: 156, y: 54.6 },
          { x: 162.1, y: 59.2 },
          { x: 173.4, y: 52.7 },
          { x: 159.8, y: 53.2 },
          { x: 170.5, y: 64.5 },
          { x: 159.2, y: 51.8 },
          { x: 157.5, y: 56 },
          { x: 161.3, y: 63.6 },
          { x: 162.6, y: 63.2 },
          { x: 160, y: 59.5 },
          { x: 168.9, y: 56.8 },
          { x: 165.1, y: 64.1 },
          { x: 162.6, y: 50 },
          { x: 165.1, y: 72.3 },
          { x: 166.4, y: 55 },
          { x: 160, y: 55.9 },
          { x: 152.4, y: 60.4 },
          { x: 170.2, y: 69.1 },
          { x: 162.6, y: 84.5 },
          { x: 170.2, y: 55.9 },
          { x: 158.8, y: 55.5 },
          { x: 172.7, y: 69.5 },
          { x: 167.6, y: 76.4 },
          { x: 162.6, y: 61.4 },
          { x: 167.6, y: 65.9 },
          { x: 156.2, y: 58.6 },
          { x: 175.2, y: 66.8 },
          { x: 172.1, y: 56.6 },
          { x: 162.6, y: 58.6 },
          { x: 160, y: 55.9 },
          { x: 165.1, y: 59.1 },
          { x: 182.9, y: 81.8 },
          { x: 166.4, y: 70.7 },
          { x: 165.1, y: 56.8 },
          { x: 177.8, y: 60 },
          { x: 165.1, y: 58.2 },
          { x: 175.3, y: 72.7 },
          { x: 154.9, y: 54.1 },
          { x: 158.8, y: 49.1 },
          { x: 172.7, y: 75.9 },
          { x: 168.9, y: 55 },
          { x: 161.3, y: 57.3 },
          { x: 167.6, y: 55 },
          { x: 165.1, y: 65.5 },
          { x: 175.3, y: 65.5 },
          { x: 157.5, y: 48.6 },
          { x: 163.8, y: 58.6 },
          { x: 167.6, y: 63.6 },
          { x: 165.1, y: 55.2 },
          { x: 165.1, y: 62.7 },
          { x: 168.9, y: 56.6 },
          { x: 162.6, y: 53.9 },
          { x: 164.5, y: 63.2 },
          { x: 176.5, y: 73.6 },
          { x: 168.9, y: 62 },
          { x: 175.3, y: 63.6 },
          { x: 159.4, y: 53.2 },
          { x: 160, y: 53.4 },
          { x: 170.2, y: 55 },
          { x: 162.6, y: 70.5 },
          { x: 167.6, y: 54.5 },
          { x: 162.6, y: 54.5 },
          { x: 160.7, y: 55.9 },
          { x: 160, y: 59 },
          { x: 157.5, y: 63.6 },
          { x: 162.6, y: 54.5 },
          { x: 152.4, y: 47.3 },
          { x: 170.2, y: 67.7 },
          { x: 165.1, y: 80.9 },
          { x: 172.7, y: 70.5 },
          { x: 165.1, y: 60.9 },
          { x: 170.2, y: 63.6 },
          { x: 170.2, y: 54.5 },
          { x: 170.2, y: 59.1 },
          { x: 161.3, y: 70.5 },
          { x: 167.6, y: 52.7 },
          { x: 167.6, y: 62.7 },
          { x: 165.1, y: 86.3 },
          { x: 162.6, y: 66.4 },
          { x: 152.4, y: 67.3 },
          { x: 168.9, y: 63 },
          { x: 170.2, y: 73.6 },
          { x: 175.2, y: 62.3 },
          { x: 175.2, y: 57.7 },
          { x: 160, y: 55.4 },
          { x: 165.1, y: 104.1 },
          { x: 174, y: 55.5 },
          { x: 170.2, y: 77.3 },
          { x: 160, y: 80.5 },
          { x: 167.6, y: 64.5 },
          { x: 167.6, y: 72.3 },
          { x: 167.6, y: 61.4 },
          { x: 154.9, y: 58.2 },
          { x: 162.6, y: 81.8 },
          { x: 175.3, y: 63.6 },
          { x: 171.4, y: 53.4 },
          { x: 157.5, y: 54.5 },
          { x: 165.1, y: 53.6 },
          { x: 160, y: 60 },
          { x: 174, y: 73.6 },
          { x: 162.6, y: 61.4 },
          { x: 174, y: 55.5 },
          { x: 162.6, y: 63.6 },
          { x: 161.3, y: 60.9 },
          { x: 156.2, y: 60 },
          { x: 149.9, y: 46.8 },
          { x: 169.5, y: 57.3 },
          { x: 160, y: 64.1 },
          { x: 175.3, y: 63.6 },
          { x: 169.5, y: 67.3 },
          { x: 160, y: 75.5 },
          { x: 172.7, y: 68.2 },
          { x: 162.6, y: 61.4 },
          { x: 157.5, y: 76.8 },
          { x: 176.5, y: 71.8 },
          { x: 164.4, y: 55.5 },
          { x: 160.7, y: 48.6 },
          { x: 174, y: 66.4 },
          { x: 163.8, y: 67.3 },
        ],
      },
    ],
  },
  custom: {
    ...commonCustoms,
  },
});

const lineChart = LineChart({
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        legend: "Seoul",
        data: [20, 40, 25, 50, 15, 45, 33, 34, 20, 30, 22, 13],
      },
      {
        legend: "Sydney",
        data: [5, 30, 21, 18, 59, 50, 28, 33, 7, 20, 10, 30],
      },
      {
        legend: "Moscow",
        data: [30, 5, 18, 21, 33, 41, 29, 15, 30, 10, 33, 5],
      },
    ],
    title: "Average Temperature",
  },
  custom: {
    ...commonCustoms,
  },
});

export const Chart = {
  Bar: () => (
    <ReactWidget
      width="100%"
      height="100%"
      renderer="canvas"
      widget={barChart}
    />
  ),
  Bubble: () => (
    <ReactWidget
      width="100%"
      height="100%"
      widget={bubbleChart}
      renderer="svg"
    />
  ),
  StackedBar: () => (
    <ReactWidget
      width="100%"
      height="100%"
      widget={stackedBarChart}
      renderer="canvas"
    />
  ),
  Scatter: () => (
    <ReactWidget
      width="100%"
      height="100%"
      widget={scatterChart}
      renderer="svg"
    />
  ),
  Line: () => (
    <ReactWidget
      width="100%"
      height="100%"
      widget={lineChart}
      renderer="canvas"
    />
  ),
};

export const Banner = () => {
  const controller = useRef<Flicking | null>(null);
  const [visible, setVisible] = useState(false);

  const panels = visible
    ? [
        <Chart.StackedBar />,
        <Chart.Line />,
        <Chart.Bubble />,
        <Chart.Bar />,
        <Chart.Scatter />,
      ]
    : [<Chart.StackedBar />];

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (el == null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      {
        threshold: 0.5,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const ct = controller.current;
    if (ct == null) return;

    const axes = ct.control.controller.axes;
    const playhead = { x: 0 };
    const instance = gsap.to(playhead, {
      scrollTrigger: {
        trigger: container.current,
        start: "center-=100px bottom",
        end: "bottom top",
        scrub: 2,
      },
      x: 800,
      onUpdate: () => {
        axes.setTo({ flick: playhead.x });
      },
    });

    return () => {
      instance.kill();
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const ct = controller.current;
    if (ct == null) return;
  }, [visible]);

  return (
    <div ref={container} className="flex w-full flex-col">
      <Flicking
        changeOnHold
        duration={1500}
        ref={controller}
        align="prev"
        circular
      >
        {panels.map((panel, i) => (
          <div key={i} className="panel">
            {panel}
          </div>
        ))}
      </Flicking>
    </div>
  );
};
