export default function IntegrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 min-w-0 overflow-x-hidden px-6 py-8 md:px-10">
      <article className="prose prose-neutral prose-sm mx-auto max-w-3xl prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-lg prose-pre:text-sm prose-a:text-neutral-900 prose-a:no-underline hover:prose-a:underline">
        {children}
      </article>
    </main>
  );
}
