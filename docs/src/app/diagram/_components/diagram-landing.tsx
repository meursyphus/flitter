import Link from "next/link";
import CopyCommand from "@/components/copy-command";
import CustomizationPlayground from "./customization-playground";

export default function DiagramLanding() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 md:px-10">
      <section className="pt-12 pb-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="display text-[clamp(2.5rem,5vw,4rem)] leading-[1.08] text-ink">
              Every part is
              <br />
              <span className="text-script">a widget.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-soft">
              <code className="text-ink">custom</code> replaces the UI. The
              engine handles drag, connections, and history.
            </p>
          </div>
          <Link
            href="/diagram/quick-start"
            className="inline-flex h-11 items-center rounded-lg bg-accent px-6 text-base font-semibold text-on-accent hover:opacity-90"
          >
            Get started
          </Link>
        </div>
        <CustomizationPlayground />
      </section>
      <section className="grid gap-8 border-t border-line py-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="display text-3xl text-ink">Your source code.</h2>
          <p className="mt-3 text-base leading-7 text-soft">
            The CLI copies the visual widgets into your project.
          </p>
        </div>
        <CopyCommand command="npx @flitterjs/cli@latest add flow-diagram" />
      </section>
      <Link
        href="/diagram/gallery"
        className="group flex items-center justify-between gap-5 border-y border-line py-8 text-ink hover:text-accent"
      >
        <span className="display text-[clamp(1.75rem,3vw,2.5rem)]">
          Explore the gallery
        </span>
        <span
          aria-hidden="true"
          className="text-3xl transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </div>
  );
}
