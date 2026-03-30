"use client";

import Widget from "@flitterjs/react";
import { RadarChart } from "shared/chart";

const skillData = {
  labels: ["JavaScript", "TypeScript", "React", "Node.js", "CSS", "GraphQL", "Testing", "DevOps"],
  datasets: [
    { legend: "Senior Dev", values: [95, 90, 85, 80, 70, 75, 80, 65] },
    { legend: "Junior Dev", values: [70, 50, 60, 40, 65, 30, 35, 20] },
    { legend: "Full Stack", values: [80, 75, 70, 85, 60, 65, 70, 80] },
  ],
};

export function BasicAgRadarChart() {
  return (
    <Widget
      widget={RadarChart({
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

export function SkillComparisonAgRadar() {
  return (
    <Widget
      widget={RadarChart({
        data: skillComparisonData,
        config: {},
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

export function ProductReviewAgRadar() {
  return (
    <Widget
      widget={RadarChart({
        data: productReviewData,
        config: {},
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

export function TeamPerformanceAgRadar() {
  return (
    <Widget
      widget={RadarChart({
        data: teamPerformanceData,
        config: {},
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

export function AthleteProfileAgRadar() {
  return (
    <Widget
      widget={RadarChart({
        data: athleteProfileData,
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}
