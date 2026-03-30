"use client";

import Widget from "@flitterjs/react";
import { PieChart } from "shared/chart";

const defaultData = {
  datasets: [
    { name: "Chrome", value: 65 },
    { name: "Safari", value: 18 },
    { name: "Firefox", value: 8 },
    { name: "Edge", value: 5 },
    { name: "Other", value: 4 },
  ],
};

export function BasicAgPieChart() {
  return (
    <Widget
      widget={PieChart({
        data: defaultData,
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}

export function DonutAgPieChart() {
  return (
    <Widget
      widget={PieChart({
        data: defaultData,
        config: {
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

export function MarketShareAgPieChart() {
  return (
    <Widget
      widget={PieChart({
        data: marketShareData,
        config: {},
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

export function ExpenseBreakdownAgPieChart() {
  return (
    <Widget
      widget={PieChart({
        data: expenseData,
        config: {
          pie: {
            innerRadiusRatio: 0.4,
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

export function EnergyMixAgPie() {
  return (
    <Widget
      widget={PieChart({
        data: energyMixData,
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}
