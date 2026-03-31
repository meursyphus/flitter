"use client";

import Widget from "@flitterjs/react";
import { ToastScatterChart as ToastScatterChartWidget } from "shared/chart";
import { Text, TextStyle, Transform, Alignment } from "flitter-ui";

export default function DefaultToastScatterChart() {
  return (
    <Widget
      widget={ToastScatterChartWidget({
        data: {
          datasets: [
            {
              legend: "Africa",
              data: [
                { x: 4200, y: 70.35, label: "Morocco" },
                { x: 4200, y: 70.71, label: "Egypt" },
                { x: 5900, y: 56.46, label: "Gabon" },
                { x: 6600, y: 72.74, label: "Algeria" },
                { x: 6700, y: 76.28, label: "Libya" },
                { x: 7100, y: 74.66, label: "Tunisia" },
                { x: 10500, y: 69.28, label: "Trinidad and Tobago" },
                { x: 12800, y: 72.09, label: "Mauritius" },
                { x: 18200, y: 78.68, label: "Malta" },
              ],
            },
            {
              legend: "America",
              data: [
                { x: 4800, y: 74.64, label: "Paraguay" },
                { x: 4900, y: 70.92, label: "El Salvador" },
                { x: 5600, y: 69.22, label: "Peru" },
                { x: 5800, y: 74.06, label: "Venezuela" },
                { x: 6600, y: 71.43, label: "Colombia" },
                { x: 8100, y: 71.41, label: "Brazil" },
                { x: 9600, y: 76.63, label: "Costa Rica" },
                { x: 9600, y: 74.94, label: "Mexico" },
                { x: 12400, y: 75.7, label: "Argentina" },
                { x: 31500, y: 79.96, label: "Canada" },
                { x: 32100, y: 77.43, label: "United States" },
              ],
            },
            {
              legend: "Asia",
              data: [
                { x: 5600, y: 71.96, label: "China" },
                { x: 7700, y: 69.66, label: "Iran" },
                { x: 8100, y: 71.41, label: "Thailand" },
                { x: 9700, y: 71.95, label: "Malaysia" },
                { x: 12000, y: 75.23, label: "Saudi Arabia" },
                { x: 19200, y: 75.58, label: "Korea, South" },
                { x: 25300, y: 77.06, label: "Taiwan" },
                { x: 27800, y: 81.53, label: "Singapore" },
                { x: 29400, y: 81.04, label: "Japan" },
                { x: 34200, y: 81.39, label: "Hong Kong" },
              ],
            },
            {
              legend: "Europe",
              data: [
                { x: 9800, y: 66.39, label: "Russia" },
                { x: 12000, y: 74.16, label: "Poland" },
                { x: 17900, y: 77.35, label: "Portugal" },
                { x: 23300, y: 79.37, label: "Spain" },
                { x: 27700, y: 79.54, label: "Italy" },
                { x: 28700, y: 78.54, label: "Germany" },
                { x: 28700, y: 79.44, label: "France" },
                { x: 29600, y: 78.27, label: "United Kingdom" },
                { x: 33800, y: 80.31, label: "Switzerland" },
              ],
            },
            {
              legend: "Oceania",
              data: [
                { x: 2200, y: 64.56, label: "Papua New Guinea" },
                { x: 5900, y: 69.2, label: "Fiji" },
                { x: 23200, y: 78.49, label: "New Zealand" },
                { x: 30700, y: 80.26, label: "Australia" },
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
            return Transform.rotate({
              angle: -Math.PI / 6,
              alignment: Alignment.centerRight,
              child: Text(`$${(Number(name) / 1000).toFixed(0)}K`, {
                style: new TextStyle({
                  fontFamily: font.family,
                  fontSize: 10,
                  color: "#64748b",
                }),
              }),
            });
          },
        },
        config: {
          title: { text: "GDP vs Life Expectancy", visible: true },
          scatter: { size: 8, strokeWidth: 2 },
          axis: {
            label: {
              format: (name: string, _index: number, axis: "x" | "y") =>
                axis === "y" ? `${name} yrs` : name,
            },
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
