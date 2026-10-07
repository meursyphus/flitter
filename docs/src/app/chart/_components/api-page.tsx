"use client";

import { useState } from "react";
import Link from "next/link";
import type { ApiPageData, ConfigSection, ConfigRow } from "../_data/types";

function ConfigTable({ sections }: { sections: ConfigSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h4 className="mb-1 text-sm font-semibold text-ink">
            {section.title}
          </h4>
          {section.description && (
            <p className="mb-2 text-[13px] text-soft">
              {section.description}
            </p>
          )}
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-line bg-surface">
                  <th className="px-3 py-2 text-left font-medium text-soft">
                    Property
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-soft">
                    Type
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-soft">
                    Default
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-soft">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row: ConfigRow) => (
                  <tr
                    key={row.property}
                    className="border-b border-line/60 last:border-0"
                  >
                    <td className="px-3 py-2 font-mono text-xs text-accent">
                      {row.property}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-soft">
                      {row.type}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-faint">
                      {row.default}
                    </td>
                    <td className="px-3 py-2 text-soft">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group">
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

export default function ApiPage({ data }: { data: ApiPageData }) {
  const {
    title,
    description,
    parent,
    dataFormat,
    agConfig,
    toastConfig,
    customParts,
    context,
    overrideExample,
  } = data;

  return (
    <div className="mx-auto max-w-5xl px-5 md:px-10">
      {/* Header */}
      <section className="pt-8 pb-6 lg:pt-12">
        {parent && (
          <Link
            href="/chart/api"
            className="inline-flex items-center gap-1 text-[13px] text-faint transition-colors hover:text-ink"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M7.5 2.5L4 6l3.5 3.5" />
            </svg>
            API Reference
          </Link>
        )}
        <h1 className="display mt-3 text-[clamp(1.75rem,4vw,2.5rem)] text-ink">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-soft">
          {description}
        </p>
      </section>

      <div className="space-y-8 pb-16">
        {/* Data Format */}
        {dataFormat && (
          <section>
            <h2 className="mb-3 text-lg font-semibold text-ink">
              Data Format
            </h2>
            <p className="mb-3 text-[13px] text-soft">
              {dataFormat.description}
            </p>
            <pre className="code-surface overflow-x-auto rounded-lg p-4 text-[13px] leading-relaxed text-ink">
              <code>{dataFormat.typeDefinition}</code>
            </pre>
          </section>
        )}

        {/* AG Config */}
        {agConfig && (
          <CollapsibleSection title="AG Style Config" defaultOpen>
            <ConfigTable sections={agConfig.sections} />
          </CollapsibleSection>
        )}

        {/* Toast Config */}
        {toastConfig && (
          <CollapsibleSection title="Toast Style Config">
            <ConfigTable sections={toastConfig.sections} />
          </CollapsibleSection>
        )}

        {/* Custom Parts */}
        {customParts && customParts.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-semibold text-ink">
              Custom Parts
            </h2>
            <p className="mb-3 text-[13px] text-soft">
              Override any visual element by providing a custom builder function:{" "}
              <code className="text-xs">
                {"(args, context) => Widget"}
              </code>
            </p>
            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-line bg-surface">
                    <th className="px-3 py-2 text-left font-medium text-soft">
                      Part
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-soft">
                      Args
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-soft">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customParts.map((part) => (
                    <tr
                      key={part.element}
                      className="border-b border-line/60 last:border-0"
                    >
                      <td className="px-3 py-2 font-mono text-xs text-accent">
                        {part.element}
                      </td>
                      <td className="max-w-xs px-3 py-2 font-mono text-xs text-soft">
                        {part.args}
                      </td>
                      <td className="px-3 py-2 text-soft">
                        {part.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Context */}
        {context && (
          <section>
            <h2 className="mb-3 text-lg font-semibold text-ink">
              Context:{" "}
              <code className="text-base font-normal text-accent">
                {context.typeName}
              </code>
            </h2>
            <p className="mb-3 text-[13px] text-soft">
              Available in every custom builder via the second argument.
            </p>
            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-line bg-surface">
                    <th className="px-3 py-2 text-left font-medium text-soft">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-soft">
                      Type
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-soft">
                      Kind
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-soft">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {context.properties.map((prop) => (
                    <tr
                      key={prop.name}
                      className="border-b border-line/60 last:border-0"
                    >
                      <td className="px-3 py-2 font-mono text-xs text-accent">
                        {prop.name}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-soft">
                        {prop.type}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-medium ${
                            prop.kind === "method"
                              ? "bg-accent/15 text-accent"
                              : "bg-surface text-soft"
                          }`}
                        >
                          {prop.kind}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-soft">
                        {prop.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Override Example */}
        {overrideExample && (
          <section>
            <h2 className="mb-3 text-lg font-semibold text-ink">
              Custom Part Example
            </h2>
            <pre className="code-surface overflow-x-auto rounded-lg p-4 text-[13px] leading-relaxed text-ink">
              <code>{overrideExample}</code>
            </pre>
          </section>
        )}
      </div>
    </div>
  );
}
