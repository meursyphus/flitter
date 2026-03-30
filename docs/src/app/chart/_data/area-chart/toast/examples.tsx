"use client";

import Widget from "@flitterjs/react";
import { ToastAreaChart as ToastAreaChartWidget } from "shared/chart";

const defaultData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Housing starts (MoM %)", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
    { legend: "Unemployment rate Δ (pp)", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
    { legend: "CPI MoM (1/10 index pts)", values: [0, 12.69, 13.78, 6.78, 1.52, -1.31, 5.25, 4.93, 6.70, 8.99, 8.97, 10.76] },
  ],
};

function ToastAreaChart({ spline }: { spline?: boolean }) {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: defaultData,
        config: {
          area: {
            strokeWidth: 2,
            opacity: 0.3,
            spline: spline ?? false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

export function DefaultToastAreaChart() {
  return <ToastAreaChart />;
}

export function SplineToastAreaChart() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: defaultData,
        config: {
          colors: ["#8b5cf6", "#06b6d4"],
          area: {
            opacity: 0.2,
            spline: true,
            strokeWidth: 2,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const revenueGrowthData = {
  labels: ["Q1 '23", "Q2 '23", "Q3 '23", "Q4 '23", "Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24"],
  datasets: [
    { legend: "Revenue ($M)", values: [4.2, 4.8, 5.1, 5.9, 6.3, 7.0, 7.5, 8.2] },
    { legend: "Costs ($M)", values: [3.1, 3.4, 3.6, 3.8, 4.0, 4.2, 4.3, 4.5] },
  ],
};

export function RevenueGrowthToastArea() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: revenueGrowthData,
        config: {
          colors: ["#10b981", "#f43f5e"],
          area: {
            strokeWidth: 2,
            opacity: 0.4,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const networkTrafficData = {
  labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
  datasets: [
    { legend: "Inbound (Gbps)", values: [2.1, 1.4, 0.8, 0.6, 1.8, 4.5, 6.2, 7.8, 8.1, 6.9, 5.2, 3.4] },
    { legend: "Outbound (Gbps)", values: [1.8, 1.1, 0.5, 0.4, 1.5, 3.8, 5.5, 6.9, 7.2, 6.1, 4.5, 2.9] },
  ],
};

export function NetworkTrafficToastArea() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: networkTrafficData,
        config: {
          colors: ["#3b82f6", "#f97316"],
          area: {
            strokeWidth: 1.5,
            opacity: 0.15,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const userEngagementData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "DAU (K)", values: [12, 14, 15, 18, 22, 25, 28, 30, 27, 32, 35, 40] },
    { legend: "WAU (K)", values: [45, 50, 55, 62, 70, 78, 85, 90, 82, 95, 102, 115] },
    { legend: "MAU (K)", values: [120, 130, 140, 155, 175, 195, 210, 225, 215, 240, 260, 290] },
  ],
};

export function UserEngagementToastArea() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: userEngagementData,
        config: {
          colors: ["#6366f1", "#ec4899", "#f59e0b"],
          legend: { position: "right-top" },
          area: {
            strokeWidth: 2.5,
            opacity: 0.25,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const energyData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Solar (MWh)", values: [120, 145, 210, 310, 420, 480, 510, 470, 350, 230, 150, 110] },
    { legend: "Wind (MWh)", values: [380, 350, 310, 280, 220, 180, 160, 170, 240, 300, 360, 390] },
    { legend: "Grid (MWh)", values: [500, 480, 440, 380, 320, 290, 280, 300, 370, 430, 470, 510] },
  ],
};

export function EnergyConsumptionToastArea() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: energyData,
        config: {
          colors: ["#eab308", "#22c55e", "#64748b"],
          area: {
            strokeWidth: 2,
            opacity: 0.35,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
