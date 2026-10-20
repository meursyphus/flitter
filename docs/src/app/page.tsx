import { readFile } from "node:fs/promises";
import path from "node:path";
import { highlight } from "@/lib/highlight";
import Home from "./_home/home";
import { FLITTER_CODE, FLUTTER_CODE } from "./_home/snippets";

export default async function Page() {
  // The hero shows the exact file it renders.
  const textInput = await readFile(path.join(process.cwd(), "src/app/_home/text-input.ts"), "utf8");
  const [hero, flutter, flitter] = await Promise.all([
    highlight(textInput, "typescript"),
    highlight(FLUTTER_CODE, "dart"),
    highlight(FLITTER_CODE, "typescript"),
  ]);
  return <Home code={{ hero, flutter, flitter }} />;
}
