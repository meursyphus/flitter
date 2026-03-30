"use client";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

const defaultData = {
  datasets: [
    { name: "Chrome", value: 65 },
    { name: "Safari", value: 18 },
    { name: "Firefox", value: 8 },
    { name: "Edge", value: 5 },
    { name: "Other", value: 4 },
  ],
};

export function BasicPieChart() {
  return (
    <Widget
      widget={ToastPieChart({
        data: defaultData,
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}

export function DonutPieChart() {
  return (
    <Widget
      widget={ToastPieChart({
        data: defaultData,
        config: {
          colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"],
          pie: {
            innerRadiusRatio: 0.5,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const marketShareData = {
  datasets: [
    { name: "Apple", value: 28 },
    { name: "Samsung", value: 22 },
    { name: "Xiaomi", value: 13 },
    { name: "Oppo", value: 9 },
    { name: "Vivo", value: 8 },
    { name: "Others", value: 20 },
  ],
};

export function MarketSharePieChart() {
  return (
    <Widget
      widget={ToastPieChart({
        data: marketShareData,
        config: {
          colors: ["#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ef4444", "#64748b"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const expenseData = {
  datasets: [
    { name: "Housing", value: 1800 },
    { name: "Food", value: 650 },
    { name: "Transport", value: 420 },
    { name: "Utilities", value: 280 },
    { name: "Healthcare", value: 350 },
    { name: "Entertainment", value: 200 },
    { name: "Education", value: 300 },
    { name: "Savings", value: 500 },
  ],
};

export function ExpenseBreakdownPieChart() {
  return (
    <Widget
      widget={ToastPieChart({
        data: expenseData,
        config: {
          colors: ["#0d9488", "#d97706", "#6366f1", "#ec4899", "#06b6d4", "#f43f5e", "#84cc16", "#a855f7"],
          pie: {
            innerRadiusRatio: 0.4,
            strokeWidth: 3,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const energyMixData = {
  datasets: [
    { name: "Coal", value: 27 },
    { name: "Natural Gas", value: 24 },
    { name: "Nuclear", value: 10 },
    { name: "Solar", value: 15 },
    { name: "Wind", value: 13 },
    { name: "Hydro", value: 11 },
  ],
};

export function EnergyMixPie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: energyMixData,
        config: {
          colors: ["#78716c", "#64748b", "#a855f7", "#eab308", "#22c55e", "#06b6d4"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const trafficSourceData = {
  datasets: [
    { name: "Organic", value: 38 },
    { name: "Direct", value: 22 },
    { name: "Social", value: 18 },
    { name: "Referral", value: 14 },
    { name: "Email", value: 8 },
  ],
};

export function TrafficSourcePie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: trafficSourceData,
        config: {
          colors: ["#3b82f6", "#10b981", "#f97316", "#ec4899", "#6366f1"],
          pie: {
            innerRadiusRatio: 0.55,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const programmingLanguageData = {
  datasets: [
    { name: "Python", value: 28 },
    { name: "JavaScript", value: 22 },
    { name: "TypeScript", value: 15 },
    { name: "Java", value: 14 },
    { name: "Go", value: 11 },
    { name: "Rust", value: 10 },
  ],
};

export function ProgrammingLanguagePie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: programmingLanguageData,
        config: {
          colors: ["#3572A5", "#f1e05a", "#3178c6", "#b07219", "#00ADD8", "#dea584"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const timeAllocationData = {
  datasets: [
    { name: "Meetings", value: 25 },
    { name: "Coding", value: 35 },
    { name: "Code Review", value: 15 },
    { name: "Planning", value: 15 },
    { name: "Break", value: 10 },
  ],
};

export function TimeAllocationPie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: timeAllocationData,
        config: {
          colors: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
          pie: {
            innerRadiusRatio: 0.45,
            strokeWidth: 3,
            strokeColor: "#f5f5f5",
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const revenueByRegionData = {
  datasets: [
    { name: "Americas", value: 42 },
    { name: "EMEA", value: 31 },
    { name: "APAC", value: 22 },
    { name: "Other", value: 5 },
  ],
};

export function RevenueByRegionPie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: revenueByRegionData,
        config: {
          colors: ["#2563eb", "#dc2626", "#059669", "#d97706"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const deviceData = {
  datasets: [
    { name: "Desktop", value: 52 },
    { name: "Mobile", value: 38 },
    { name: "Tablet", value: 10 },
  ],
};

export function DevicePie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: deviceData,
        config: {
          colors: ["#6366f1", "#06b6d4", "#f59e0b"],
          pie: {
            innerRadiusRatio: 0.5,
            strokeWidth: 4,
            strokeColor: "white",
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
