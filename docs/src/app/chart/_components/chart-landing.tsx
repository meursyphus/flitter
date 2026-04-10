
export default function ChartLanding() {
  return (
    <div>
      {/* ═══════════════════════════════════════════
          Brand Banner — 띠지
          ═══════════════════════════════════════════ */}
      <section className="relative flex items-center justify-center overflow-hidden bg-gray-950 py-20 sm:py-28">
        {/* Background chart silhouettes */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <svg className="h-full w-full" viewBox="0 0 800 200" preserveAspectRatio="none">
            <rect x="60" y="80" width="40" height="120" fill="#2563EB" rx="4" />
            <rect x="120" y="40" width="40" height="160" fill="#2563EB" rx="4" />
            <rect x="180" y="100" width="40" height="100" fill="#2563EB" rx="4" />
            <rect x="240" y="20" width="40" height="180" fill="#2563EB" rx="4" />
            <rect x="300" y="60" width="40" height="140" fill="#2563EB" rx="4" />
            <rect x="460" y="90" width="40" height="110" fill="#2563EB" rx="4" />
            <rect x="520" y="50" width="40" height="150" fill="#2563EB" rx="4" />
            <rect x="580" y="110" width="40" height="90" fill="#2563EB" rx="4" />
            <rect x="640" y="30" width="40" height="170" fill="#2563EB" rx="4" />
            <rect x="700" y="70" width="40" height="130" fill="#2563EB" rx="4" />
          </svg>
        </div>

        <div className="relative text-center">
          <h1
            className="text-[clamp(3.5rem,8vw,7rem)] font-black leading-[1] tracking-tight text-white"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Flitter <span className="text-blue-400">Chart</span>
          </h1>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Hero — Message + CLI
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <h2
          className="text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-[1.08] tracking-tight text-gray-900"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
        >
          Every element is a <span className="text-blue-600">widget</span>.
          <br />
          Download the source. Replace anything.
        </h2>

        <div className="mt-8 inline-flex items-center gap-2 bg-gray-50 px-5 py-3">
          <code className="text-[15px] font-medium text-gray-700">
            <span className="mr-2 text-blue-500">$</span>
            npx flitter-ui add bar-chart
          </code>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/chart/gallery"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-7 text-[14px] font-semibold text-white transition-all hover:bg-blue-700"
          >
            Browse Charts
          </a>
          <a
            href="/docs"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-7 text-[14px] font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            Documentation
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Benefits — Code only, minimal text
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 pb-20 sm:pb-28">
        <div className="grid gap-16 md:grid-cols-2 md:gap-12">
          {/* Benefit 1: Customize */}
          <div>
            <h3
              className="text-[clamp(1.4rem,2.5vw,2rem)] font-black tracking-tight text-gray-900"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Replace any part
            </h3>
            <pre className="mt-5 overflow-x-auto bg-gray-50 px-5 py-4 text-[13px] leading-relaxed text-gray-600">
              <code>{`custom: {
  tooltip: (args) =>
    Container({
      child: YourWidget(args)
    })
}`}</code>
            </pre>
          </div>

          {/* Benefit 2: Own the code */}
          <div>
            <h3
              className="text-[clamp(1.4rem,2.5vw,2rem)] font-black tracking-tight text-gray-900"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Own the source
            </h3>
            <div className="mt-5 space-y-2">
              {[
                "npx flitter-ui init",
                "npx flitter-ui add bar-chart",
              ].map((cmd, i) => (
                <code key={i} className="block bg-gray-50 px-5 py-3 text-[13px] font-medium text-gray-700">
                  <span className="mr-2 text-blue-500">$</span>
                  {cmd}
                </code>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Demo Slot 1
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:pb-28">
        <h2
          className="mb-6 text-[clamp(1.8rem,3.5vw,2.8rem)] font-black leading-[1.08] tracking-tight text-gray-900"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
        >
          See what&apos;s possible
        </h2>
        <div className="flex min-h-[480px] items-center justify-center border border-dashed border-gray-300 bg-gray-50/50">
          <p className="text-[15px] font-medium text-gray-300">
            Interactive Demo — Coming Soon
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Demo Slot 2
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:pb-28">
        <h2
          className="mb-6 text-[clamp(1.8rem,3.5vw,2.8rem)] font-black leading-[1.08] tracking-tight text-gray-900"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
        >
          Go beyond defaults
        </h2>
        <div className="flex min-h-[480px] items-center justify-center border border-dashed border-gray-300 bg-gray-50/50">
          <p className="text-[15px] font-medium text-gray-300">
            Interactive Demo — Coming Soon
          </p>
        </div>
      </section>
    </div>
  );
}
