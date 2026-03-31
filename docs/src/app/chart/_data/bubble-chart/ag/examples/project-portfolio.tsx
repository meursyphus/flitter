"use client";

import Widget from "@flitterjs/react";
import { BubbleChart } from "shared/chart";

export default function ProjectPortfolioAgBubble() {
  return (
    <Widget
      widget={BubbleChart({
        data: {
          datasets: [
            {
              legend: "Conservative",
              data: [
                { x: 2, y: 5, value: 500000, label: "Gov Bonds" },
                { x: 3, y: 6, value: 300000, label: "Blue Chip" },
                { x: 1, y: 4, value: 800000, label: "Treasury" },
                { x: 4, y: 7, value: 200000, label: "Corp Bonds" },
              ],
            },
            {
              legend: "Balanced",
              data: [
                { x: 5, y: 10, value: 400000, label: "Index Fund" },
                { x: 6, y: 12, value: 350000, label: "REITs" },
                { x: 4, y: 8, value: 600000, label: "Growth ETF" },
                { x: 7, y: 14, value: 250000, label: "Dividend" },
              ],
            },
            {
              legend: "Aggressive",
              data: [
                { x: 9, y: 22, value: 150000, label: "Tech Startup" },
                { x: 8, y: 18, value: 280000, label: "Emerging Mkt" },
                { x: 10, y: 25, value: 100000, label: "Crypto Fund" },
                { x: 7, y: 15, value: 320000, label: "Small Cap" },
              ],
            },
          ],
        },
        config: {
          title: { text: "Investment Portfolio", visible: true },
          subtitle: { visible: true, text: "Risk vs return, sized by allocation" },
          bubble: { minRadius: 4, maxRadius: 35, opacity: 0.55 },
          colors: {
            fills: ["#059669", "#dc2626", "#6366f1"],
            strokes: ["#059669", "#dc2626", "#6366f1"],
          },
          background: "#f8fafc",
          axis: {
            label: {
              format: (name: string, _index: number, axis: string) => {
                if (axis === "x") return `Risk ${name}`;
                return `${name}%`;
              },
            },
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
