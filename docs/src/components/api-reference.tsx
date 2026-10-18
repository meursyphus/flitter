/** Reference tables shared by the chart and diagram API pages. */

export type ConfigSection = {
  title: string;
  description?: string;
  rows: ConfigRow[];
};

export type ConfigRow = {
  property: string;
  type: string;
  default: string;
  description?: string;
};

export type ApiColumn<Row> = {
  label: string;
  cell: (row: Row) => React.ReactNode;
  /** `name` = accent mono, `code` = soft mono, `faint` = faint mono, `text` = prose. */
  tone?: "name" | "code" | "faint" | "text";
};

const toneClass = {
  name: "font-mono text-xs text-accent",
  code: "font-mono text-xs text-soft",
  faint: "font-mono text-xs text-faint",
  text: "text-soft",
};

/** A bordered table with one header row; columns decide their own cells. */
export function ApiTable<Row>({
  columns,
  rows,
  rowKey,
}: {
  columns: ApiColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row, index: number) => string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-line bg-surface">
            {columns.map((column) => (
              <th key={column.label} className="px-3 py-2 text-left font-medium text-soft">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={rowKey(row, index)} className="border-b border-line/60 align-top last:border-0">
              {columns.map((column) => (
                <td key={column.label} className={`px-3 py-2 ${toneClass[column.tone ?? "text"]}`}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const configColumns: ApiColumn<ConfigRow>[] = [
  { label: "Property", cell: (r) => r.property, tone: "name" },
  { label: "Type", cell: (r) => r.type, tone: "code" },
  { label: "Default", cell: (r) => r.default, tone: "faint" },
  { label: "Description", cell: (r) => r.description },
];

export function ConfigTable({ sections }: { sections: ConfigSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h4 className="mb-1 text-sm font-semibold text-ink">{section.title}</h4>
          {section.description && (
            <p className="mb-2 text-[13px] text-soft">{section.description}</p>
          )}
          <ApiTable columns={configColumns} rows={section.rows} rowKey={(r) => r.property} />
        </div>
      ))}
    </div>
  );
}

export function CollapsibleSection({
  title,
  id,
  defaultOpen = false,
  children,
}: {
  title: React.ReactNode;
  id?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details id={id} open={defaultOpen} className="group scroll-mt-24">
      <summary className="flex cursor-pointer select-none items-center gap-2 rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-line-strong">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="shrink-0 transition-transform group-open:rotate-90"
        >
          <path d="M4.5 2.5L8 6l-3.5 3.5" />
        </svg>
        {title}
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
