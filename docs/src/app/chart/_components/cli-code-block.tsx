import { codeToHtml } from "shiki";

const CLI_CODE = `npx flitter-ui init
npx flitter-ui add bar-chart`;

export default async function CliCodeBlock() {
  const html = await codeToHtml(CLI_CODE, {
    lang: "bash",
    theme: "github-dark",
  });

  return (
    <div
      className="overflow-x-auto rounded-lg text-[14px] leading-relaxed [&_pre]:p-5 [&_pre]:m-0 [&_code]:text-[14px] [&_code]:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
