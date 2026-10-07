import { highlight } from "@/lib/highlight";

const CUSTOM_CODE = `import { BarChart } from "@/components/charts/bar-chart"

BarChart({
  data,
  custom: {
    bar: ({ value, legend, isHovered }, ctx) => {
      const color = ctx.config.colors.fills[0]
      return Container({
        decoration: new BoxDecoration({ color }),
      })
    }
  }
})`;

const FILE_TREE = `src/components/charts/
├── bar-chart/
│   ├── index.ts
│   ├── config.ts
│   └── style/
│       └── parts/
│           ├── bar.ts        ← customize here
│           └── tooltip.ts
└── line-chart/
    ├── index.ts
    ├── config.ts
    └── style/
        └── parts/
            ├── line.ts
            └── point.ts`;

export async function CustomCodeBlock() {
  const html = await highlight(CUSTOM_CODE, "javascript");

  return (
    <div
      className="code-surface overflow-hidden rounded-lg text-[13px] leading-relaxed [&_pre]:px-5 [&_pre]:py-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function OwnCodeBlock() {
  return (
    <pre className="code-surface overflow-x-auto rounded-lg px-5 py-4 text-[13px] leading-relaxed">
      {FILE_TREE.split("\n").map((line, i) => {
        const [path, note] = line.split("←");
        return (
          <div key={i}>
            <span className={note ? "text-ink" : "text-faint"}>{path}</span>
            {note && <span className="text-accent">← {note.trim()}</span>}
          </div>
        );
      })}
    </pre>
  );
}
