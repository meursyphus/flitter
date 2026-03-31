"use client";

import Widget from "@flitterjs/react";
import { ToastScatterChart as ToastScatterChartWidget } from "shared/chart";
import { Text, TextStyle } from "flitter-ui";

export default function RealEstatePriceToast() {
  return (
    <Widget
      widget={ToastScatterChartWidget({
        data: {
          datasets: [
            {
              legend: "Downtown",
              data: [
                { x: 850, y: 420000, label: "Apt A" },
                { x: 1100, y: 580000, label: "Apt B" },
                { x: 1400, y: 720000, label: "Condo C" },
                { x: 1800, y: 950000, label: "Loft D" },
                { x: 2200, y: 1150000, label: "Penthouse E" },
                { x: 950, y: 490000, label: "Studio F" },
              ],
            },
            {
              legend: "Suburbs",
              data: [
                { x: 1200, y: 280000, label: "House A" },
                { x: 1600, y: 350000, label: "House B" },
                { x: 2000, y: 420000, label: "House C" },
                { x: 2500, y: 510000, label: "House D" },
                { x: 3000, y: 620000, label: "House E" },
                { x: 1800, y: 380000, label: "House F" },
              ],
            },
            {
              legend: "Waterfront",
              data: [
                { x: 1500, y: 650000, label: "Villa A" },
                { x: 2000, y: 890000, label: "Villa B" },
                { x: 2800, y: 1200000, label: "Estate C" },
                { x: 3500, y: 1500000, label: "Estate D" },
                { x: 1800, y: 750000, label: "Cottage E" },
              ],
            },
          ],
        },
        custom: {
          xAxisLabel: (
            { name }: { name: string; index: number },
            context: any,
          ) => {
            const { font } = context.config;
            return Text(`${name} ft\u00B2`, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: font.size,
                color: "#64748b",
              }),
            });
          },
          yAxisLabel: (
            { name }: { name: string; index: number },
            context: any,
          ) => {
            const { font } = context.config;
            const val = Number(name);
            const formatted = val >= 1000000
              ? `$${(val / 1000000).toFixed(1)}M`
              : `$${(val / 1000).toFixed(0)}K`;
            const isMillionPlus = val >= 1000000;
            return Text(formatted, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: font.size,
                fontWeight: isMillionPlus ? "bold" : "normal",
                color: isMillionPlus ? "#7c3aed" : "#64748b",
              }),
            });
          },
        },
        config: {
          scatter: { fill: true, size: 12, strokeWidth: 1 },
          colors: ["#059669", "#d97706", "#7c3aed"],
          title: { text: "Real Estate Pricing", visible: true },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
