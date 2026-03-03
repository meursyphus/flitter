import Link from "next/link";
import type { ChartPageData } from "../_data";

export default function ComingSoonPage({ data }: { data: ChartPageData }) {
  return (
    <div className="-mx-6 -mt-8 md:-mx-10">
      <section className="px-6 pt-16 pb-16 md:px-10">
        <div className="mx-auto max-w-md text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-300">
            Coming Soon
          </p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">
            {data.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            {data.description}
          </p>
          <div className="mt-8">
            <Link
              href="/chart"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 transition-all hover:border-neutral-400 hover:text-neutral-900"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M7.5 9L4.5 6l3-3" />
              </svg>
              Back to Charts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
