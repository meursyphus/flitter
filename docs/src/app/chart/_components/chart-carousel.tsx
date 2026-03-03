"use client";

export type ChartItem = {
  title: string;
  subtitle: string;
  chart?: JSX.Element;
};

export default function ChartCarousel({ charts }: { charts: ChartItem[] }) {
  return (
    <div className="flex flex-col gap-6">
      {charts.map((item, i) => (
        <article
          key={`${i}-${item.title}-${item.subtitle}`}
          className="animate-fade-up border border-neutral-100 p-4 sm:p-6"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div
            className="flex items-center justify-center"
            style={{ height: 420 }}
          >
            {item.chart ? (
              item.chart
            ) : (
              <span className="text-sm text-neutral-400">Chart preview</span>
            )}
          </div>
          <p className="mt-3 text-sm font-medium tracking-tight text-neutral-900">
            {item.title}
          </p>
          <p className="text-xs text-neutral-500">{item.subtitle}</p>
        </article>
      ))}
    </div>
  );
}
