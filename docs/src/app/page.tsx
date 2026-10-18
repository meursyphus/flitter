import { highlight } from "@/lib/highlight";
import Home from "./_home/home";
import { FLITTER_CODE, FLUTTER_CODE, HERO_CODE } from "./_home/snippets";

export default async function Page() {
  const [hero, flutter, flitter] = await Promise.all([
    highlight(HERO_CODE, "typescript"),
    highlight(FLUTTER_CODE, "dart"),
    highlight(FLITTER_CODE, "typescript"),
  ]);
  return <Home code={{ hero, flutter, flitter }} />;
}
