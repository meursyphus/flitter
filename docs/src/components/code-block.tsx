import { codeToHtml } from "shiki";

type CodeBlockProps = {
  code: string;
  lang?: string;
  filename?: string;
};

export default async function CodeBlock({
  code,
  lang = "typescript",
  filename,
}: CodeBlockProps) {
  const html = await codeToHtml(code.trim(), {
    lang,
    theme: "github-light",
  });

  return (
    <div>
      {filename && (
        <div className="flex items-center border border-b-0 border-neutral-200 rounded-t-lg bg-neutral-100/60 px-4 py-2">
          <span className="text-[12px] font-medium text-neutral-500 tracking-wide">
            {filename}
          </span>
        </div>
      )}
      <div
        className={`code-block overflow-x-auto border border-neutral-200 bg-[#fafafa] text-[13px] leading-relaxed ${
          filename ? "rounded-b-lg" : "rounded-lg"
        } [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:m-0 [&_code]:text-[13px] [&_code]:leading-relaxed`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
