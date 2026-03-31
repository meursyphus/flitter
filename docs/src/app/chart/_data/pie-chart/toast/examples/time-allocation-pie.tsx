"use client";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";
import {
  Row,
  Container,
  BoxDecoration,
  SizedBox,
  Text,
  TextStyle,
  CrossAxisAlignment,
} from "flitter-ui";

const pctData = [35, 25, 15, 15, 10];
const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

export default function TimeAllocationPie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: {
          datasets: [
            { name: "Coding", value: 35 },
            { name: "Meetings", value: 25 },
            { name: "Code Review", value: 15 },
            { name: "Planning", value: 15 },
            { name: "Break", value: 10 },
          ],
        },
        config: {
          colors,
          pie: {
            innerRadiusRatio: 0.5,
            strokeWidth: 3,
            strokeColor: "#f8fafc",
          },
          legend: {
            position: "right-center",
          },
        },
        custom: {
          legend: ({ name, index }: any) =>
            Row({
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container({
                  width: 10,
                  height: 10,
                  decoration: new BoxDecoration({
                    color: colors[index],
                    shape: "circle",
                  }),
                }),
                SizedBox({ width: 6 }),
                Text(name, {
                  style: new TextStyle({
                    fontSize: 11,
                    color: "#334155",
                  }),
                }),
                SizedBox({ width: 4 }),
                Text(`${pctData[index]}%`, {
                  style: new TextStyle({
                    fontSize: 11,
                    color: "#94a3b8",
                    fontWeight: "600",
                  }),
                }),
              ],
            }),
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
