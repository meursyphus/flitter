import Link from "next/link";
import { cellById, type CellId } from "../_data/interactions/cells";
import { recipeLabels, type Interaction, type RecipeId } from "../_data/gallery/catalog";

export function chipLabel(chip: Interaction) {
  return chip in cellById ? cellById[chip as CellId].title : recipeLabels[chip as RecipeId];
}

const chipClass = "inline-flex h-6 items-center rounded-full border border-line px-2.5 text-[12px] text-soft";

/** Interaction chips. Built-in gestures link to their micro-demo when `linked`. */
export default function Chips({ chips, linked = false }: { chips: Interaction[]; linked?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <li key={chip}>
          {linked && chip in cellById ? (
            <Link href={`/diagram/interactions#${chip}`} className={`${chipClass} transition-colors hover:border-accent hover:text-ink`}>
              {chipLabel(chip)}
            </Link>
          ) : (
            <span className={chipClass}>{chipLabel(chip)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
