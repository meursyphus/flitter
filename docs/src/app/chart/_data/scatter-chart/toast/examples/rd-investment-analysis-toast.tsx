"use client";

import Widget from "@flitterjs/react";
import {
  Container,
  BoxDecoration,
  EdgeInsets,
  Text,
  TextStyle,
  BorderRadius,
} from "flitter-ui";
import { ToastScatterChart as ToastScatterChartWidget } from "shared/chart";

export default function RdInvestmentAnalysisToast() {
  return (
    <Widget
      widget={ToastScatterChartWidget({
        data: {
          datasets: [
            {
              legend: "Pharmaceuticals",
              data: [
                { x: 4500, y: 128, label: "Pfizer" },
                { x: 6200, y: 195, label: "Roche" },
                { x: 3800, y: 102, label: "Merck" },
                { x: 8100, y: 248, label: "Johnson & Johnson" },
                { x: 5400, y: 167, label: "Novartis" },
                { x: 7300, y: 221, label: "AstraZeneca" },
              ],
            },
            {
              legend: "Tech",
              data: [
                { x: 12000, y: 385, label: "Alphabet" },
                { x: 15000, y: 510, label: "Microsoft" },
                { x: 9500, y: 298, label: "Meta" },
                { x: 18000, y: 620, label: "Amazon" },
                { x: 7800, y: 245, label: "Apple" },
                { x: 6200, y: 178, label: "Intel" },
              ],
            },
            {
              legend: "Automotive",
              data: [
                { x: 5800, y: 88, label: "Toyota" },
                { x: 7200, y: 112, label: "Volkswagen" },
                { x: 3500, y: 64, label: "GM" },
                { x: 4100, y: 75, label: "Ford" },
                { x: 9400, y: 156, label: "Tesla" },
                { x: 6600, y: 98, label: "BMW" },
              ],
            },
          ],
        },
        custom: {
          dataLabel: ({ label }: { label?: string }) =>
            Container({
              padding: EdgeInsets.symmetric({ horizontal: 5, vertical: 2 }),
              decoration: new BoxDecoration({
                color: "rgba(15, 23, 42, 0.75)",
                borderRadius: BorderRadius.circular(4),
              }),
              child: Text(label ?? "", {
                style: new TextStyle({ fontSize: 9, color: "#ffffff" }),
              }),
            }),
        },
        config: {
          title: { text: "R&D vs Patents", visible: true },
          scatter: { fill: true, size: 10, strokeWidth: 1 },
          colors: ["#2563eb", "#dc2626", "#059669"],
          axis: {
            label: {
              format: (name: string, _index: number, axis: "x" | "y") =>
                axis === "x" ? `$${(Number(name) / 1000).toFixed(0)}M` : `${name}`,
            },
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
