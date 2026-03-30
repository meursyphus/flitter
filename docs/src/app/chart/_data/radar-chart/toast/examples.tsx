"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

const skillData = {
  labels: ["JavaScript", "TypeScript", "React", "Node.js", "CSS", "GraphQL", "Testing", "DevOps"],
  datasets: [
    { legend: "Senior Dev", values: [95, 90, 85, 80, 70, 75, 80, 65] },
    { legend: "Junior Dev", values: [70, 50, 60, 40, 65, 30, 35, 20] },
    { legend: "Full Stack", values: [80, 75, 70, 85, 60, 65, 70, 80] },
  ],
};

export function BasicRadarChart() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: skillData,
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}

const skillComparisonData = {
  labels: ["Leadership", "Problem Solving", "Communication", "Technical", "Creativity", "Teamwork"],
  datasets: [
    { legend: "Alice", values: [90, 85, 95, 70, 80, 92] },
    { legend: "Bob", values: [75, 92, 60, 95, 65, 78] },
  ],
};

export function SkillComparisonRadarChart() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: skillComparisonData,
        config: {
          colors: ["#3b82f6", "#ef4444"],
          radar: { fillOpacity: 0.15, strokeWidth: 2.5 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const productReviewData = {
  labels: ["Price", "Quality", "Design", "Durability", "Support"],
  datasets: [
    { legend: "Product A", values: [60, 90, 85, 95, 70] },
    { legend: "Product B", values: [85, 70, 75, 60, 90] },
    { legend: "Product C", values: [75, 80, 90, 80, 65] },
  ],
};

export function ProductReviewRadarChart() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: productReviewData,
        config: {
          colors: ["#10b981", "#f97316", "#8b5cf6"],
          radar: { fillOpacity: 0.2 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const teamPerformanceData = {
  labels: ["Speed", "Quality", "Communication", "Innovation", "Reliability"],
  datasets: [
    { legend: "Frontend", values: [88, 82, 90, 85, 78] },
    { legend: "Backend", values: [75, 95, 72, 70, 92] },
    { legend: "DevOps", values: [80, 88, 68, 75, 98] },
  ],
};

export function TeamPerformanceRadarChart() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: teamPerformanceData,
        config: {
          colors: ["#6366f1", "#ec4899", "#06b6d4"],
          radar: { fillOpacity: 0.25, strokeWidth: 3 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const athleteProfileData = {
  labels: ["Speed", "Strength", "Endurance", "Agility", "Flexibility"],
  datasets: [
    { legend: "Sprinter", values: [98, 75, 50, 90, 60] },
    { legend: "Marathoner", values: [70, 55, 98, 65, 75] },
    { legend: "Gymnast", values: [72, 68, 60, 95, 98] },
  ],
};

export function AthleteProfileRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: athleteProfileData,
        config: {
          colors: ["#ef4444", "#3b82f6", "#10b981"],
          radar: { fillOpacity: 0.1, strokeWidth: 3 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const restaurantRatingData = {
  labels: ["Food", "Service", "Ambiance", "Value", "Location"],
  datasets: [
    { legend: "Chez Marie", values: [95, 88, 92, 65, 78] },
    { legend: "Tokyo Ramen", values: [90, 72, 68, 92, 85] },
    { legend: "Burger Joint", values: [78, 80, 55, 95, 90] },
  ],
};

export function RestaurantRatingRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: restaurantRatingData,
        config: {
          colors: ["#d97706", "#dc2626", "#059669"],
          radar: { fillOpacity: 0.35, strokeWidth: 2 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const carComparisonData = {
  labels: ["Performance", "Comfort", "Safety", "Fuel Economy", "Price"],
  datasets: [
    { legend: "Sedan", values: [70, 90, 88, 82, 75] },
    { legend: "SUV", values: [80, 85, 92, 55, 60] },
    { legend: "EV", values: [92, 78, 90, 95, 50] },
  ],
};

export function CarComparisonRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: carComparisonData,
        config: {
          colors: ["#1e40af", "#dc2626", "#064e3b"],
          radar: { fillOpacity: 0.2, strokeWidth: 2 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const companyCultureData = {
  labels: ["Innovation", "Work-Life", "Compensation", "Growth", "Diversity"],
  datasets: [
    { legend: "Startup", values: [95, 55, 65, 88, 72] },
    { legend: "Enterprise", values: [60, 80, 90, 70, 85] },
    { legend: "Agency", values: [82, 65, 72, 78, 68] },
  ],
};

export function CompanyCultureRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: companyCultureData,
        config: {
          colors: ["#8b5cf6", "#f59e0b", "#06b6d4"],
          radar: { fillOpacity: 0.3, strokeWidth: 1.5 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const nutritionProfileData = {
  labels: ["Protein", "Carbs", "Fat", "Fiber", "Vitamins"],
  datasets: [
    { legend: "Chicken Breast", values: [95, 5, 20, 0, 35] },
    { legend: "Brown Rice", values: [15, 90, 8, 65, 30] },
    { legend: "Avocado", values: [12, 20, 85, 55, 72] },
  ],
};

export function NutritionProfileRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: nutritionProfileData,
        config: {
          colors: ["#22c55e", "#f97316", "#ef4444"],
          radar: { fillOpacity: 0.25 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const frameworkComparisonData = {
  labels: ["Performance", "DX", "Ecosystem", "Learning Curve", "Community"],
  datasets: [
    { legend: "React", values: [82, 78, 95, 65, 98] },
    { legend: "Vue", values: [80, 92, 75, 88, 82] },
    { legend: "Svelte", values: [95, 90, 55, 92, 60] },
  ],
};

export function FrameworkComparisonRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: frameworkComparisonData,
        config: {
          colors: ["#61dafb", "#42b883", "#ff3e00"],
          radar: { fillOpacity: 0.15, strokeWidth: 2.5 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
