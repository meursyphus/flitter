"use client";

import Widget from "@flitterjs/react";
import { ToastScatterChart as ToastScatterChartWidget } from "shared/chart";

const defaultData = {
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
};

export function DefaultToastScatterChart() {
  return (
    <Widget
      widget={ToastScatterChartWidget({
        data: defaultData,
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}

export function FilledToastScatterChart() {
  return (
    <Widget
      widget={ToastScatterChartWidget({
        data: defaultData,
        config: {
          scatter: { fill: true, size: 8 },
          colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

export function LargeToastScatterChart() {
  return (
    <Widget
      widget={ToastScatterChartWidget({
        data: defaultData,
        config: {
          scatter: { size: 16, strokeWidth: 3 },
          colors: ["#0d9488", "#d97706", "#dc2626", "#6366f1"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const salesVsMarketingData = {
  datasets: [
    {
      legend: "Electronics",
      data: [
        { x: 12, y: 85, label: "Q1" },
        { x: 18, y: 120, label: "Q2" },
        { x: 25, y: 155, label: "Q3" },
        { x: 30, y: 190, label: "Q4" },
        { x: 22, y: 140, label: "Q5" },
      ],
    },
    {
      legend: "Apparel",
      data: [
        { x: 8, y: 45, label: "Q1" },
        { x: 15, y: 78, label: "Q2" },
        { x: 20, y: 95, label: "Q3" },
        { x: 28, y: 130, label: "Q4" },
        { x: 35, y: 160, label: "Q5" },
      ],
    },
    {
      legend: "Food & Beverage",
      data: [
        { x: 5, y: 60, label: "Q1" },
        { x: 10, y: 90, label: "Q2" },
        { x: 14, y: 105, label: "Q3" },
        { x: 18, y: 125, label: "Q4" },
        { x: 24, y: 150, label: "Q5" },
        { x: 30, y: 180, label: "Q6" },
      ],
    },
    {
      legend: "Home & Garden",
      data: [
        { x: 6, y: 30, label: "Q1" },
        { x: 11, y: 55, label: "Q2" },
        { x: 16, y: 72, label: "Q3" },
        { x: 21, y: 88, label: "Q4" },
        { x: 27, y: 110, label: "Q5" },
      ],
    },
  ],
};

export function SalesVsMarketingToast() {
  return (
    <Widget
      widget={ToastScatterChartWidget({
        data: salesVsMarketingData,
        config: {
          scatter: { fill: true, size: 10, strokeWidth: 0 },
          colors: ["#3b82f6", "#f97316", "#8b5cf6", "#10b981"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const heightWeightData = {
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
};

export function HeightWeightToast() {
  return (
    <Widget
      widget={ToastScatterChartWidget({
        data: heightWeightData,
        config: {
          scatter: { size: 8, strokeWidth: 2 },
          colors: ["#3b82f6", "#ec4899"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const realEstateData = {
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
};

export function RealEstatePriceToast() {
  return (
    <Widget
      widget={ToastScatterChartWidget({
        data: realEstateData,
        config: {
          scatter: { fill: true, size: 12, strokeWidth: 1 },
          colors: ["#059669", "#d97706", "#7c3aed"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
