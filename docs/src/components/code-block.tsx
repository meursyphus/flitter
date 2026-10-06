import { highlight } from "@/lib/highlight";

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
  const html = await highlight(code, lang);

  return (
    <div className="code-surface overflow-hidden rounded-lg">
      {filename && (
        <div className="border-b border-line px-4 py-2 text-[12px] text-faint">
          {filename}
        </div>
      )}
      <div
        className="text-[13px] leading-relaxed [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
