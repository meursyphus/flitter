"use client";

import Widget from "@flitterjs/react";
import { AreaChart } from "shared/chart";

const defaultData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Housing starts (MoM %)", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
    { legend: "Unemployment rate Δ (pp)", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
    { legend: "CPI MoM (1/10 index pts)", values: [0, 12.69, 13.78, 6.78, 1.52, -1.31, 5.25, 4.93, 6.70, 8.99, 8.97, 10.76] },
  ],
};

function AgAreaChart({ spline }: { spline?: boolean }) {
  return (
    <Widget
      widget={AreaChart({
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

export function DefaultAgAreaChart() {
  return <AgAreaChart />;
}

export function SplineAgAreaChart() {
  return (
    <Widget
      widget={AreaChart({
        data: defaultData,
        config: {
          colors: { fills: ["#7c3aed", "#0ea5e9"], strokes: ["#7c3aed", "#0ea5e9"] },
          grid: { dash: [4, 4] },
          area: {
            strokeWidth: 2,
            opacity: 0.2,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const cloudUsageData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Compute ($K)", values: [12.5, 13.2, 14.8, 16.1, 18.5, 21.0, 23.4, 25.8, 24.2, 22.0, 19.5, 17.8] },
    { legend: "Storage ($K)", values: [5.2, 5.5, 5.9, 6.4, 7.0, 7.6, 8.2, 8.8, 9.2, 9.6, 10.0, 10.4] },
    { legend: "Network ($K)", values: [3.1, 3.4, 3.8, 4.2, 4.9, 5.8, 6.5, 7.2, 6.8, 5.9, 5.0, 4.2] },
  ],
};

export function CloudUsageAgArea() {
  return (
    <Widget
      widget={AreaChart({
        data: cloudUsageData,
        config: {
          colors: { fills: ["#3b82f6", "#f59e0b", "#10b981"], strokes: ["#3b82f6", "#f59e0b", "#10b981"] },
          background: "#f8fafc",
          area: {
            strokeWidth: 2,
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

const appPerformanceData = {
  labels: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
           "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
  datasets: [
    { legend: "CPU (%)", values: [15, 12, 10, 8, 9, 11, 22, 45, 68, 72, 75, 78, 80, 76, 74, 70, 65, 58, 42, 35, 28, 22, 18, 16] },
    { legend: "Memory (%)", values: [42, 40, 38, 37, 37, 38, 45, 55, 65, 70, 72, 74, 75, 73, 72, 70, 68, 62, 55, 50, 48, 45, 43, 42] },
  ],
};

export function AppPerformanceAgArea() {
  return (
    <Widget
      widget={AreaChart({
        data: appPerformanceData,
        config: {
          colors: { fills: ["#ef4444", "#6366f1"], strokes: ["#ef4444", "#6366f1"] },
          grid: { dash: [2, 2] },
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

const quarterlyRevenueData = {
  labels: ["Q1 '22", "Q2 '22", "Q3 '22", "Q4 '22", "Q1 '23", "Q2 '23", "Q3 '23", "Q4 '23"],
  datasets: [
    { legend: "SaaS ($M)", values: [8.5, 9.2, 10.1, 11.5, 13.0, 14.8, 16.2, 18.5] },
    { legend: "On-Prem ($M)", values: [12.0, 11.5, 11.0, 10.2, 9.5, 8.8, 8.0, 7.2] },
  ],
};

export function QuarterlyRevenueAgArea() {
  return (
    <Widget
      widget={AreaChart({
        data: quarterlyRevenueData,
        config: {
          colors: { fills: ["#0d9488", "#d97706"], strokes: ["#0d9488", "#d97706"] },
          area: {
            strokeWidth: 2.5,
            opacity: 0.35,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
