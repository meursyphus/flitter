"use client";

import Widget from "@flitterjs/react";
import { ToastBubbleChart as ToastBubbleChartWidget } from "shared/chart";

const defaultData = {
  datasets: [
    {
      legend: "Africa",
      data: [
        { x: 4200, y: 70.35, value: 32209101, label: "Morocco" },
        { x: 4200, y: 70.71, value: 76117421, label: "Egypt" },
        { x: 5900, y: 56.46, value: 1355246, label: "Gabon" },
        { x: 6600, y: 72.74, value: 32129324, label: "Algeria" },
        { x: 7100, y: 74.66, value: 9974722, label: "Tunisia" },
        { x: 12800, y: 72.09, value: 1220481, label: "Mauritius" },
        { x: 18200, y: 78.68, value: 396851, label: "Malta" },
      ],
    },
    {
      legend: "America",
      data: [
        { x: 4800, y: 74.64, value: 6191368, label: "Paraguay" },
        { x: 5600, y: 69.22, value: 2754430, label: "Peru" },
        { x: 6600, y: 71.43, value: 4231077, label: "Colombia" },
        { x: 8100, y: 71.41, value: 78410118, label: "Brazil" },
        { x: 9600, y: 74.94, value: 4495959, label: "Mexico" },
        { x: 12400, y: 75.7, value: 6914475, label: "Argentina" },
        { x: 31500, y: 79.96, value: 32507874, label: "Canada" },
        { x: 32100, y: 77.43, value: 89302754, label: "United States" },
      ],
    },
    {
      legend: "Asia",
      data: [
        { x: 5600, y: 71.96, value: 92988000, label: "China" },
        { x: 8100, y: 71.41, value: 14865523, label: "Thailand" },
        { x: 9700, y: 71.95, value: 23522482, label: "Malaysia" },
        { x: 12000, y: 75.23, value: 25795938, label: "Saudi Arabia" },
        { x: 19200, y: 75.58, value: 48598170, label: "Korea, South" },
        { x: 25300, y: 77.06, value: 22749838, label: "Taiwan" },
        { x: 27800, y: 81.53, value: 4353893, label: "Singapore" },
        { x: 29400, y: 81.04, value: 52733300, label: "Japan" },
        { x: 34200, y: 81.39, value: 6855125, label: "Hong Kong" },
      ],
    },
    {
      legend: "Europe",
      data: [
        { x: 9800, y: 66.39, value: 54378233, label: "Russia" },
        { x: 12000, y: 74.16, value: 38626349, label: "Poland" },
        { x: 23300, y: 79.37, value: 40280780, label: "Spain" },
        { x: 27700, y: 79.54, value: 58057477, label: "Italy" },
        { x: 28700, y: 78.54, value: 22424609, label: "Germany" },
        { x: 28700, y: 79.44, value: 30424213, label: "France" },
        { x: 29600, y: 78.27, value: 60270708, label: "United Kingdom" },
        { x: 33800, y: 80.31, value: 7450867, label: "Switzerland" },
      ],
    },
    {
      legend: "Oceania",
      data: [
        { x: 2200, y: 64.56, value: 5420280, label: "Papua New Guinea" },
        { x: 5900, y: 69.2, value: 880874, label: "Fiji" },
        { x: 23200, y: 78.49, value: 1993817, label: "New Zealand" },
        { x: 30700, y: 80.26, value: 5991314, label: "Australia" },
      ],
    },
  ],
};

export function DefaultToastBubbleChart() {
  return (
    <Widget
      widget={ToastBubbleChartWidget({
        data: defaultData,
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}

export function SmallBubblestoastBubbleChart() {
  return (
    <Widget
      widget={ToastBubbleChartWidget({
        data: defaultData,
        config: {
          bubble: { minRadius: 3, maxRadius: 25, opacity: 0.8 },
          colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

export function HighOpacityToastBubbleChart() {
  return (
    <Widget
      widget={ToastBubbleChartWidget({
        data: defaultData,
        config: {
          bubble: { opacity: 1.0 },
          colors: ["#dc2626", "#2563eb", "#059669", "#7c3aed", "#d97706"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const marketAnalysisData = {
  datasets: [
    {
      legend: "Technology",
      data: [
        { x: 120, y: 18, value: 850, label: "Cloud Services" },
        { x: 85, y: 25, value: 620, label: "AI/ML" },
        { x: 200, y: 8, value: 1200, label: "Enterprise Software" },
        { x: 45, y: 35, value: 300, label: "Cybersecurity" },
      ],
    },
    {
      legend: "Healthcare",
      data: [
        { x: 90, y: 12, value: 950, label: "Pharmaceuticals" },
        { x: 60, y: 22, value: 400, label: "Biotech" },
        { x: 150, y: 6, value: 1100, label: "Medical Devices" },
      ],
    },
    {
      legend: "Finance",
      data: [
        { x: 180, y: 5, value: 1500, label: "Banking" },
        { x: 70, y: 28, value: 350, label: "Fintech" },
        { x: 110, y: 10, value: 700, label: "Insurance" },
        { x: 40, y: 40, value: 200, label: "Crypto" },
      ],
    },
    {
      legend: "Energy",
      data: [
        { x: 250, y: 3, value: 2000, label: "Oil & Gas" },
        { x: 30, y: 45, value: 180, label: "Solar" },
        { x: 55, y: 30, value: 280, label: "Wind" },
      ],
    },
  ],
};

export function MarketAnalysisToastBubble() {
  return (
    <Widget
      widget={ToastBubbleChartWidget({
        data: marketAnalysisData,
        config: {
          bubble: { minRadius: 8, maxRadius: 45, opacity: 0.5 },
          colors: ["#0ea5e9", "#f97316", "#8b5cf6", "#10b981"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const cityComparisonData = {
  datasets: [
    {
      legend: "North America",
      data: [
        { x: 82, y: 7.8, value: 8300000, label: "New York" },
        { x: 75, y: 7.5, value: 3900000, label: "Los Angeles" },
        { x: 70, y: 8.1, value: 2700000, label: "Toronto" },
        { x: 65, y: 7.2, value: 2100000, label: "Houston" },
        { x: 78, y: 8.3, value: 680000, label: "San Francisco" },
      ],
    },
    {
      legend: "Europe",
      data: [
        { x: 88, y: 8.5, value: 9000000, label: "London" },
        { x: 76, y: 8.8, value: 2200000, label: "Paris" },
        { x: 72, y: 8.2, value: 3600000, label: "Berlin" },
        { x: 85, y: 8.9, value: 1400000, label: "Zurich" },
        { x: 60, y: 7.9, value: 5200000, label: "Madrid" },
      ],
    },
    {
      legend: "Asia Pacific",
      data: [
        { x: 95, y: 7.6, value: 13960000, label: "Tokyo" },
        { x: 55, y: 7.0, value: 7500000, label: "Bangkok" },
        { x: 90, y: 8.0, value: 5450000, label: "Singapore" },
        { x: 50, y: 6.5, value: 9700000, label: "Jakarta" },
      ],
    },
  ],
};

export function CityComparisonToastBubble() {
  return (
    <Widget
      widget={ToastBubbleChartWidget({
        data: cityComparisonData,
        config: {
          bubble: { minRadius: 10, maxRadius: 55, opacity: 0.65 },
          colors: ["#6366f1", "#ec4899", "#06b6d4"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const startupFundingData = {
  datasets: [
    {
      legend: "SaaS",
      data: [
        { x: 1, y: 8, value: 25, label: "Seed - TaskFlow" },
        { x: 2, y: 45, value: 80, label: "Series A - DataSync" },
        { x: 3, y: 180, value: 250, label: "Series B - CloudPeak" },
        { x: 4, y: 500, value: 600, label: "Series C - MetricHub" },
      ],
    },
    {
      legend: "Biotech",
      data: [
        { x: 1, y: 12, value: 15, label: "Seed - GeneCure" },
        { x: 2, y: 80, value: 45, label: "Series A - BioNova" },
        { x: 3, y: 350, value: 120, label: "Series B - MediGen" },
        { x: 4, y: 900, value: 300, label: "Series C - NeuroPath" },
      ],
    },
    {
      legend: "Clean Energy",
      data: [
        { x: 1, y: 5, value: 10, label: "Seed - SolarFlux" },
        { x: 2, y: 30, value: 55, label: "Series A - WindCore" },
        { x: 3, y: 120, value: 180, label: "Series B - HydroGen" },
        { x: 4, y: 400, value: 450, label: "Series C - FusionTech" },
      ],
    },
  ],
};

export function StartupFundingToastBubble() {
  return (
    <Widget
      widget={ToastBubbleChartWidget({
        data: startupFundingData,
        config: {
          bubble: { minRadius: 6, maxRadius: 40, opacity: 0.45 },
          colors: ["#10b981", "#f59e0b", "#ef4444"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
