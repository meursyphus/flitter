"use client";

import type { CSSProperties } from "react";
export type ChartItem = {
  title: string;
  subtitle: string;
  chart?: JSX.Element;
};

export default function ChartCarousel({ charts }: { charts: ChartItem[] }) {
  const itemWidth = 560;
  const gap = 24;
  const setWidth = charts.length * (itemWidth + gap);
  const duration = charts.length * 8;

  const cssVars = {
    "--carousel-total-width": `${setWidth}px`,
  } as CSSProperties;

  return (
    <div className="carousel-container" style={cssVars}>
      <div
        className="carousel-track"
        style={{ ...cssVars, animationDuration: `${duration}s` }}
      >
        {[0, 1, 2].map((setIndex) =>
          charts.map((item, i) => (
            <div
              key={`${setIndex}-${i}`}
              className="carousel-item"
              style={{ width: itemWidth }}
            >
              <div
                className="flex items-center justify-center rounded-md overflow-hidden"
                style={{ height: 420 }}
              >
                {item.chart ? item.chart : (
                  <span className="text-sm text-neutral-300">
                    Chart preview
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm font-medium tracking-tight text-neutral-400">
                {item.title}
              </p>
              <p className="text-xs text-neutral-300">{item.subtitle}</p>
            </div>
          )),
        )}
      </div>
    </div>
  );
}
