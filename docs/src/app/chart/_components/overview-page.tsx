import Link from "next/link";
import CodeBlock from "@/components/code-block";
import type { OverviewPageData } from "../_data";
import ShowcaseGallery from "./showcase-gallery";

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
      {hasShowcase && <ShowcaseGallery examples={showcaseExamples!} />}

      {/* ── Beyond the Defaults ── */}
      {hasAdvanced && (
        <section className="px-6 pt-10 md:px-10">
          <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-5 py-5">
            <h3 className="text-sm font-bold text-neutral-900">
              Beyond the Defaults
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600">
              Every element in these charts is a widget you can replace.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  title: "Custom Tooltips",
                  desc: "Replace with any widget",
                },
                {
                  title: "Click Handlers",
                  desc: "Add interaction to any element",
                },
                {
                  title: "Animations",
                  desc: "Built-in transition system",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-md border border-neutral-200 bg-white px-3 py-2.5"
                >
                  <p className="text-xs font-semibold text-neutral-800">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href={`/chart/${slug[0]}/advanced`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-neutral-900 transition-colors hover:text-teal-700"
            >
              See all customization options &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* ── Quick Start Code (always show if available) ── */}
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
    </div>
  );
}
