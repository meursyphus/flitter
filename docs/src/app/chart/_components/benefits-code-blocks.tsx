import { codeToHtml } from "shiki";

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
  const html = await codeToHtml(CUSTOM_CODE, {
    lang: "javascript",
    theme: "github-dark",
  });

  return (
    <div
      className="mt-5 overflow-x-auto rounded-lg text-[13px] leading-relaxed [&_pre]:px-5 [&_pre]:py-4 [&_pre]:m-0 [&_code]:text-[13px] [&_code]:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function OwnCodeBlock() {
  return (
    <pre className="mt-5 overflow-x-auto rounded-lg bg-[#24292e] px-5 py-4 text-[13px] leading-relaxed text-[#e1e4e8] font-mono">
      {FILE_TREE.split("\n").map((line, i) => {
        const arrow = line.includes("←");
        return (
          <div key={i}>
            {arrow ? (
              <>
                <span>{line.split("←")[0]}</span>
                <span className="text-emerald-400">← {line.split("←")[1].trim()}</span>
              </>
            ) : (
              <span className="text-gray-400">{line}</span>
            )}
          </div>
        );
      })}
    </pre>
  );
}
