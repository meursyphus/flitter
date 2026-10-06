import { highlight } from "@/lib/highlight";

const CLI_CODE = `npx flitter-ui init
npx flitter-ui add bar-chart`;

export default async function CliCodeBlock() {
  const html = await highlight(CLI_CODE, "bash");

  return (
    <div
      className="code-surface overflow-hidden rounded-lg text-[14px] leading-relaxed [&_pre]:px-5 [&_pre]:py-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
