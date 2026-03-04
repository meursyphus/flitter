"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { NavItem, NavSection, Navigation } from "@/lib/navigation";

/** Strip trailing slash so "/chart/bar-chart/" matches "/chart/bar-chart" */
function normPath(p: string) {
  return p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "new")
    return (
      <span className="rounded bg-neutral-100 px-1 py-0.5 text-[10px] font-medium text-neutral-600">
        New
      </span>
    );
  if (status === "beta")
    return (
      <span className="rounded bg-neutral-100 px-1 py-0.5 text-[10px] font-medium text-neutral-500">
        Beta
      </span>
    );
  return null;
}

function ChildrenGroup({
  children,
  onLinkClick,
}: {
  children: NavItem[];
  onLinkClick?: () => void;
}) {
  const pathname = normPath(usePathname());

  // Split into style items and other items
  const styles = children.filter((c) => c.kind === "style");
  const others = children.filter((c) => c.kind !== "style");

  return (
    <div className="mt-0.5 ml-2.5">
      {/* Style items — grouped with left border as siblings */}
      {styles.length > 0 && (
        <div className="border-l border-neutral-200 pl-2.5 space-y-0.5">
          {styles.map((item) => {
            const isActive = pathname === item.href;
            const isComing = item.status === "coming";

            if (isComing) {
              return (
                <span
                  key={item.href}
                  className="block rounded-md px-2 py-1 text-[12px] text-neutral-300 cursor-default"
                >
                  {item.title}
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                className={clsx(
                  "block rounded-md px-2 py-1 text-[12px] transition-colors",
                  isActive
                    ? "bg-neutral-100 font-medium text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                {item.title}
                {item.status && <StatusBadge status={item.status} />}
              </Link>
            );
          })}
        </div>
      )}

      {/* Other items (e.g. Advanced) — just sitting there */}
      {others.map((item) => {
        const isActive = pathname === item.href;
        const isComing = item.status === "coming";

        if (isComing) {
          return (
            <span
              key={item.href}
              className="block rounded-md px-2 py-1 text-[12px] text-neutral-300 cursor-default mt-0.5"
            >
              {item.title}
            </span>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={clsx(
              "block rounded-md px-2 py-1 text-[12px] transition-colors mt-0.5",
              isActive
                ? "bg-neutral-100 font-medium text-neutral-900"
                : "text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}

function NavLink({
  item,
  onLinkClick,
}: {
  item: NavItem;
  onLinkClick?: () => void;
}) {
  const pathname = normPath(usePathname());
  const isActive = pathname === item.href;
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive =
    hasChildren && item.children!.some((c) => pathname === c.href);
  const isExpanded = isActive || isChildActive;
  const isComing = item.status === "coming";

  if (isComing) {
    return (
      <li>
        <span className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] text-neutral-300 cursor-default">
          {item.title}
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href}
        onClick={onLinkClick}
        className={clsx(
          "flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] transition-colors",
          isActive
            ? "bg-neutral-100 font-medium text-neutral-900"
            : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
        )}
      >
        {item.title}
        {item.status && <StatusBadge status={item.status} />}
      </Link>
      {hasChildren && isExpanded && (
        <ChildrenGroup children={item.children!} onLinkClick={onLinkClick} />
      )}
    </li>
  );
}

function HomeLink({
  item,
  onLinkClick,
}: {
  item: NavItem;
  onLinkClick?: () => void;
}) {
  const pathname = normPath(usePathname());
  const isActive = pathname === item.href;

  return (
    <div className="mb-4 border-b border-neutral-100 pb-3">
      <Link
        href={item.href}
        onClick={onLinkClick}
        className={clsx(
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-semibold tracking-tight transition-colors",
          isActive
            ? "text-neutral-900"
            : "text-neutral-600 hover:text-neutral-900"
        )}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M2 8.5l6-5.5 6 5.5" />
          <path d="M3.5 7.5V13a.5.5 0 00.5.5h3v-3h2v3h3a.5.5 0 00.5-.5V7.5" />
        </svg>
        {item.title}
      </Link>
    </div>
  );
}

export default function Sidebar({
  sections,
  home,
  onLinkClick,
}: {
  sections: NavSection[];
  home?: NavItem;
  onLinkClick?: () => void;
}) {
  return (
    <nav className="h-full overflow-y-auto py-5 pl-4 pr-3">
      {home && <HomeLink item={home} onLinkClick={onLinkClick} />}
      {sections.map((section) => (
        <div key={section.title} className="mb-5">
          <h3 className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            {section.title}
          </h3>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onLinkClick={onLinkClick}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
