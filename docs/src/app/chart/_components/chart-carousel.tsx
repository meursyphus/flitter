"use client";

import Link from "next/link";

type ChartItem = {
  title: string;
  href: string;
};

export default function ChartCarousel({ charts }: { charts: ChartItem[] }) {
  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {/* Render items 3 times for seamless infinite loop */}
        {[0, 1, 2].map((setIndex) =>
          charts.map((chart, i) => (
            <Link
              key={`${setIndex}-${i}`}
              href={chart.href}
              className="carousel-item group"
            >
              <div
                className="flex items-center justify-center rounded-md bg-neutral-50"
                style={{ height: 340 }}
              >
                <span className="text-sm text-neutral-300">
                  Chart preview
                </span>
              </div>
              <p className="mt-3 text-sm font-medium tracking-tight text-neutral-400 transition-colors group-hover:text-neutral-900">
                {chart.title}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
