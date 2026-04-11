"use client";

import Link from "next/link";

export type ChartItem = {
  title: string;
  subtitle: string;
  chart?: JSX.Element;
  command?: string;
  href?: string;
};

export default function ChartCarousel({ charts }: { charts: ChartItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {charts.map((item, i) => {
        const Wrapper = item.href ? Link : "div";
        const wrapperProps = item.href ? { href: item.href } : {};
        return (
          <Wrapper key={`${i}-${item.title}-${item.subtitle}`} {...(wrapperProps as any)}>
            <article
              className="chart-card group animate-fade-up rounded-xl border border-neutral-100 bg-white overflow-hidden"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div
                className="flex items-center justify-center bg-neutral-50/50 p-4"
                style={{ height: 340 }}
              >
                {item.chart ? (
                  item.chart
                ) : (
                  <span className="text-sm text-neutral-300">Preview</span>
                )}
              </div>
              <div className="border-t border-neutral-100 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-neutral-400">{item.subtitle}</p>
                  </div>
                  {item.href && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-500">
                      <path d="M1 7h12M8 2l5 5-5 5" />
                    </svg>
                  )}
                </div>
                {item.command && (
                  <code className="mt-2 block truncate rounded bg-neutral-50 px-2 py-1 text-[11px] text-neutral-400">
                    <span className="text-teal-500">$</span> {item.command}
                  </code>
                )}
              </div>
            </article>
          </Wrapper>
        );
      })}
    </div>
  );
}
