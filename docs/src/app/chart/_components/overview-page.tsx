import Link from "next/link";
import CodeBlock from "@/components/code-block";
import type { OverviewPageData } from "../_data";

export default async function OverviewPage({
  data,
}: {
  data: OverviewPageData;
}) {
  const {
    title,
    description,
    quickStartCode,
    slug,
    showcaseExamples,
    styles,
    hasAdvanced,
  } = data;

  const hasShowcase = showcaseExamples && showcaseExamples.length > 0;
  const featuredExample = showcaseExamples?.find((e) => e.featured);
  const gridExamples = showcaseExamples?.filter((e) => !e.featured);

  return (
    <div className="-mx-6 -mt-8 md:-mx-10">
      {/* Header */}
      <section className="px-6 pt-10 pb-2 md:px-10">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-neutral-500 max-w-2xl">
          {description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-neutral-50 border border-neutral-200 px-3 py-1.5">
            <code className="text-xs text-neutral-600">
              <span className="text-teal-500">$</span> npx flitter-ui add {slug[0]}
            </code>
          </div>

          {styles && styles.length > 0 && (
            <>
              {styles.map((style) => (
                <Link
                  key={style.slug.join("/")}
                  href={`/chart/${style.slug.join("/")}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-600 transition-all hover:border-teal-300 hover:text-teal-700 hover:shadow-sm"
                >
                  {style.title}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4.5 2.5L8 6l-3.5 3.5" />
                  </svg>
                </Link>
              ))}
            </>
          )}
          {hasAdvanced && (
            <Link
              href={`/chart/${slug[0]}/advanced`}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-600 transition-all hover:border-teal-300 hover:text-teal-700 hover:shadow-sm"
            >
              Advanced
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4.5 2.5L8 6l-3.5 3.5" />
              </svg>
            </Link>
          )}
        </div>
      </section>

      {/* ── Showcase Gallery (card grid with badges) ── */}
      {hasShowcase && (
        <section className="px-6 pt-10 pb-16 md:px-10">
          {/* Featured hero card */}
          {featuredExample && (
            <div
              className="group mb-6 overflow-hidden rounded-xl border border-neutral-100 border-l-4 border-l-teal-400 bg-white shadow-sm transition-[border-color,box-shadow] hover:border-neutral-200 hover:border-l-teal-400 hover:shadow-md animate-fade-up"
              style={{ animationDelay: "0s" }}
            >
              <div className="flex items-start justify-between px-5 pt-4 pb-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-neutral-900 truncate">
                    {featuredExample.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-400 line-clamp-2">
                    {featuredExample.subtitle}
                  </p>
                </div>
                <span
                  className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    featuredExample.style === "Toast"
                      ? "bg-teal-50 text-teal-600"
                      : "bg-sky-50 text-sky-600"
                  }`}
                >
                  {featuredExample.style}
                </span>
              </div>
              <div className="px-3 pb-3 h-[280px] md:h-[440px]">
                <div className="h-full w-full rounded-lg bg-neutral-50/50" role="img" aria-label={featuredExample.title}>
                  {featuredExample.chart}
                </div>
              </div>
            </div>
          )}

          {/* Grid cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {gridExamples?.map((example, i) => (
              <div
                key={`${i}-${example.title}`}
                className="group overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] hover:border-neutral-200 hover:shadow-md animate-fade-up"
                style={{ animationDelay: `${(i + 1) * 0.06}s` }}
              >
                {/* Card header */}
                <div className="flex items-start justify-between px-5 pt-4 pb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-neutral-900 truncate">
                      {example.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-neutral-400 line-clamp-2">
                      {example.subtitle}
                    </p>
                  </div>
                  <span
                    className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      example.style === "Toast"
                        ? "bg-teal-50 text-teal-600"
                        : "bg-sky-50 text-sky-600"
                    }`}
                  >
                    {example.style}
                  </span>
                </div>
                {/* Chart area */}
                <div
                  className="px-3 pb-3"
                  style={{ height: example.height ?? 360 }}
                >
                  <div className="h-full w-full rounded-lg bg-neutral-50/50" role="img" aria-label={example.title}>
                    {example.chart}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Legacy layout: Quick Start + Style cards (for charts without showcase) ── */}
      {!hasShowcase && (
        <>
          {/* Quick Start Code */}
          {quickStartCode && (
            <section className="px-6 pt-6 md:px-10">
              <details className="group max-w-2xl">
                <summary className="flex cursor-pointer items-center gap-2 rounded-md bg-neutral-100 px-3 py-2 text-xs font-medium uppercase tracking-widest text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 select-none">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-open:rotate-90"
                  >
                    <path d="M4.5 2.5L8 6l-3.5 3.5" />
                  </svg>
                  Quick Start
                </summary>
                <div className="mt-4">
                  <CodeBlock code={quickStartCode} lang="tsx" />
                  <p className="mt-3 text-[13px] text-neutral-400">
                    See{" "}
                    <Link
                      href="/integration"
                      className="text-neutral-600 underline underline-offset-2 hover:text-neutral-900"
                    >
                      Integration guide
                    </Link>{" "}
                    for Svelte, vanilla JS, and more options.
                  </p>
                </div>
              </details>
            </section>
          )}

          {/* Styles */}
          {styles && styles.length > 0 && (
            <section className="px-6 pt-14 md:px-10">
              <div className="space-y-12">
                {styles.map((style) => (
                  <div key={style.slug.join("/")}>
                    <div className="mb-3">
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {style.title}
                        </h3>
                        {style.inspiration && (
                          <span className="text-[11px] text-neutral-400">
                            {style.reference ? (
                              <a
                                href={style.reference}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-2 hover:text-neutral-600"
                              >
                                {style.inspiration}
                              </a>
                            ) : (
                              style.inspiration
                            )}
                          </span>
                        )}
                        <Link
                          href={`/chart/${style.slug.join("/")}`}
                          className="ml-auto text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-900"
                        >
                          Details &rarr;
                        </Link>
                      </div>
                      <p className="mt-1 text-sm text-neutral-500">
                        {style.tagline}
                      </p>
                    </div>
                    <div className="h-125">{style.chart}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Go Deeper */}
          {hasAdvanced && (
            <section className="px-6 pt-10 pb-16 md:px-10">
              <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
                Go Deeper
              </h2>
              <Link
                href={`/chart/${slug[0]}/advanced`}
                className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
              >
                Advanced &mdash; Custom renderers, headless API &rarr;
              </Link>
            </section>
          )}
        </>
      )}
    </div>
  );
}
