import { highlight } from "@/lib/highlight";
import { cells, type CellId } from "../_data/interactions/cells";
import InteractionGrid from "../_components/interaction-grid";

export const metadata = {
  title: "Interactions",
  description: "Every built-in diagram gesture as a live micro-demo with the prop that enables it.",
};

export default async function InteractionsPage() {
  const html = Object.fromEntries(
    await Promise.all(cells.map(async (cell) => [cell.id, await highlight(cell.snippet, "ts")] as const)),
  ) as Record<CellId, string>;

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-10 md:px-10 lg:pt-14">
      <h1 className="display text-[clamp(2.25rem,5vw,3.5rem)] text-ink">Interactions</h1>
      <p className="mt-3 text-[15px] text-soft">
        Try each gesture, then copy the prop. Default means on with zero config.
      </p>
      <nav aria-label="Interactions" className="mb-8 mt-6 flex flex-wrap gap-1.5">
        {cells.map((cell) => (
          <a
            key={cell.id}
            href={`#${cell.id}`}
            className="inline-flex h-7 items-center rounded-full border border-line px-3 text-[12px] text-soft transition-colors hover:border-accent hover:text-ink"
          >
            {cell.title}
          </a>
        ))}
      </nav>
      <InteractionGrid html={html} />
    </div>
  );
}
