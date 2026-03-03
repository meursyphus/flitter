export default function ChartPreview({
  children,
  height = 300,
}: {
  children?: React.ReactNode;
  height?: number;
}) {
  const hasContent = children != null;

  return (
    <div
      className={
        hasContent
          ? "not-prose"
          : "not-prose flex items-center justify-center rounded-md border border-dashed border-neutral-200"
      }
      style={{ minHeight: hasContent ? undefined : height }}
    >
      {children}
    </div>
  );
}
