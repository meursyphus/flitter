"use client";

import { ToastHistogramChart } from "@/lib/charts";

export const galleryTitle = "Response Time Distribution (ms)";

export function createWidget() {
  return ToastHistogramChart({
    data: {
      rows: [
        {
          latency: 45,
        },
        {
          latency: 58,
        },
        {
          latency: 63,
        },
        {
          latency: 71,
        },
        {
          latency: 74,
        },
        {
          latency: 79,
        },
        {
          latency: 83,
        },
        {
          latency: 86,
        },
        {
          latency: 88,
        },
        {
          latency: 92,
        },
        {
          latency: 95,
        },
        {
          latency: 98,
        },
        {
          latency: 101,
        },
        {
          latency: 103,
        },
        {
          latency: 108,
        },
        {
          latency: 110,
        },
        {
          latency: 112,
        },
        {
          latency: 117,
        },
        {
          latency: 122,
        },
        {
          latency: 128,
        },
        {
          latency: 136,
        },
        {
          latency: 145,
        },
        {
          latency: 157,
        },
        {
          latency: 168,
        },
        {
          latency: 184,
        },
        {
          latency: 201,
        },
        {
          latency: 225,
        },
        {
          latency: 252,
        },
        {
          latency: 286,
        },
        {
          latency: 320,
        },
      ],
      xKey: "latency",
    },
    transform: { binCount: 8, aggregation: "count" },
    config: { title: { text: galleryTitle, visible: true } },
  });
}
