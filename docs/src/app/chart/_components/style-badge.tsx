/**
 * AG and Toast are the two visual directions every chart ships in. The dot
 * uses each library's lead series color.
 */
const STYLE_DOT = {
  AG: "#5090dc",
  Toast: "#00a9ff",
} as const;

export default function StyleBadge({ style }: { style: "AG" | "Toast" }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-[12px] font-medium text-soft">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: STYLE_DOT[style] }}
        aria-hidden="true"
      />
      {style} style
    </span>
  );
}
