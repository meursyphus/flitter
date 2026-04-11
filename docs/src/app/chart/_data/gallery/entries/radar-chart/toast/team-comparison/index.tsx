"use client";

export const galleryTitle = "Pokémon Stats Battle";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

export function createWidget() {
  return ToastRadarChart({
    data: {
      labels: [
        "Attack",
        "Defense",
        "Speed",
        "HP",
        "Sp.Atk",
        "Sp.Def",
      ],
      datasets: [
        { legend: "Pikachu", values: [55, 30, 95, 35, 50, 40] },
        { legend: "Bulbasaur", values: [49, 65, 45, 80, 65, 65] },
        { legend: "Charmander", values: [85, 43, 65, 39, 80, 35] },
      ],
    },
    config: {
      title: { text: "Pokémon Stats Battle", visible: true },
    },
  });
}

export default function RadarChartToast() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
