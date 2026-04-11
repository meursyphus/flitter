"use client";

import { useState } from "react";
import Link from "next/link";
import type { ApiPageData, ConfigSection, ConfigRow } from "../_data/types";

function ConfigTable({ sections }: { sections: ConfigSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h4 className="mb-1 text-sm font-semibold text-neutral-800">
            {section.title}
          </h4>
          {section.description && (
            <p className="mb-2 text-[13px] text-neutral-500">
              {section.description}
            </p>
          )}
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-3 py-2 text-left font-medium text-neutral-600">
                    Property
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-neutral-600">
                    Type
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-neutral-600">
                    Default
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-neutral-600">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row: ConfigRow) => (
                  <tr
                    key={row.property}
                    className="border-b border-neutral-50 last:border-0"
                  >
                    <td className="px-3 py-2 font-mono text-xs text-teal-700">
                      {row.property}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-neutral-500">
                      {row.type}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-neutral-400">
                      {row.default}
                    </td>
                    <td className="px-3 py-2 text-neutral-600">
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
      <summary className="flex cursor-pointer items-center gap-2 rounded-md bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 select-none">
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
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <section className="pt-8 pb-4">
        {parent && (
          <Link
            href="/chart/api"
            className="inline-flex items-center gap-1 text-[13px] text-neutral-400 transition-colors hover:text-neutral-600"
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
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-neutral-500 max-w-2xl">
          {description}
        </p>
      </section>

      <div className="space-y-8 pb-16">
        {/* Data Format */}
        {dataFormat && (
          <section>
            <h2 className="mb-3 text-lg font-semibold text-neutral-800">
              Data Format
            </h2>
            <p className="mb-3 text-[13px] text-neutral-600">
              {dataFormat.description}
            </p>
            <pre className="rounded-lg bg-neutral-900 p-4 text-[13px] leading-relaxed text-neutral-200 overflow-x-auto">
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
            <h2 className="mb-3 text-lg font-semibold text-neutral-800">
              Custom Parts
            </h2>
            <p className="mb-3 text-[13px] text-neutral-500">
              Override any visual element by providing a custom builder function:{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">
                {"(args, context) => Widget"}
              </code>
            </p>
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    <th className="px-3 py-2 text-left font-medium text-neutral-600">
                      Part
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-neutral-600">
                      Args
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-neutral-600">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customParts.map((part) => (
                    <tr
                      key={part.element}
                      className="border-b border-neutral-50 last:border-0"
                    >
                      <td className="px-3 py-2 font-mono text-xs text-teal-700">
                        {part.element}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-neutral-500 max-w-xs">
                        {part.args}
                      </td>
                      <td className="px-3 py-2 text-neutral-600">
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
            <h2 className="mb-3 text-lg font-semibold text-neutral-800">
              Context:{" "}
              <code className="text-base font-normal text-teal-700">
                {context.typeName}
              </code>
            </h2>
            <p className="mb-3 text-[13px] text-neutral-500">
              Available in every custom builder via the second argument.
            </p>
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    <th className="px-3 py-2 text-left font-medium text-neutral-600">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-neutral-600">
                      Type
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-neutral-600">
                      Kind
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-neutral-600">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {context.properties.map((prop) => (
                    <tr
                      key={prop.name}
                      className="border-b border-neutral-50 last:border-0"
                    >
                      <td className="px-3 py-2 font-mono text-xs text-teal-700">
                        {prop.name}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-neutral-500">
                        {prop.type}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            prop.kind === "method"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {prop.kind}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-neutral-600">
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
            <h2 className="mb-3 text-lg font-semibold text-neutral-800">
              Custom Part Example
            </h2>
            <pre className="rounded-lg bg-neutral-900 p-4 text-[13px] leading-relaxed text-neutral-200 overflow-x-auto">
              <code>{overrideExample}</code>
            </pre>
          </section>
        )}
      </div>
    </div>
  );
}
