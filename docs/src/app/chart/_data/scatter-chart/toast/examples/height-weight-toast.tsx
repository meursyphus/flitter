"use client";

import Widget from "@flitterjs/react";
import { ToastScatterChart as ToastScatterChartWidget } from "shared/chart";
import {
  Container,
  BoxDecoration,
  EdgeInsets,
  Text,
  TextStyle,
  Row,
  SizedBox,
  MainAxisSize,
  BorderRadius,
} from "flitter-ui";

const legendColors: Record<string, string> = {
  Male: "#3b82f6",
  Female: "#ec4899",
};

export default function HeightWeightToast() {
  return (
    <Widget
      widget={ToastScatterChartWidget({
        data: {
          datasets: [
            {
              legend: "Male",
              data: [
                { x: 170, y: 72, label: "M1" },
                { x: 175, y: 80, label: "M2" },
                { x: 180, y: 85, label: "M3" },
                { x: 168, y: 68, label: "M4" },
                { x: 183, y: 92, label: "M5" },
                { x: 177, y: 78, label: "M6" },
                { x: 185, y: 95, label: "M7" },
                { x: 172, y: 74, label: "M8" },
                { x: 190, y: 100, label: "M9" },
              ],
            },
            {
              legend: "Female",
              data: [
                { x: 155, y: 50, label: "F1" },
                { x: 160, y: 55, label: "F2" },
                { x: 165, y: 60, label: "F3" },
                { x: 158, y: 52, label: "F4" },
                { x: 170, y: 65, label: "F5" },
                { x: 163, y: 58, label: "F6" },
                { x: 168, y: 62, label: "F7" },
                { x: 157, y: 54, label: "F8" },
                { x: 172, y: 68, label: "F9" },
              ],
            },
          ],
        },
        custom: {
          legend: (
            { name }: { name: string; index: number },
            context: any,
          ) => {
            const { font } = context.config;
            const color = legendColors[name] ?? "#94a3b8";
            return Container({
              padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 3 }),
              decoration: new BoxDecoration({
                color: `${color}18`,
                borderRadius: BorderRadius.circular(12),
              }),
              child: Row({
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container({
                    width: 8,
                    height: 8,
                    decoration: new BoxDecoration({
                      color: color,
                      borderRadius: BorderRadius.circular(4),
                    }),
                  }),
                  SizedBox({ width: 5 }),
                  Text(name, {
                    style: new TextStyle({
                      fontFamily: font.family,
                      fontSize: 11,
                      fontWeight: "600",
                      color: color,
                    }),
                  }),
                ],
              }),
            });
          },
        },
        config: {
          title: { text: "Height vs Weight Distribution", visible: true },
          scatter: { size: 8, strokeWidth: 2 },
          colors: ["#3b82f6", "#ec4899"],
          axis: {
            label: {
              format: (name: string, _index: number, axis: "x" | "y") =>
                axis === "x" ? `${name} cm` : `${name} kg`,
            },
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
