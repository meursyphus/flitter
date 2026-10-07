import type { Metadata } from "next";
import { PROSE_CLASS } from "@/components/docs-layout";

export const metadata: Metadata = {
  title: "Integration",
  description:
    "Use Flitter with React, Svelte, or vanilla JavaScript. Framework-agnostic chart widgets with thin adapters.",
};

export default function IntegrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-w-0 flex-1 overflow-x-clip px-5 py-8 md:px-10 lg:py-14">
      <article className={PROSE_CLASS}>{children}</article>
    </main>
  );
}
