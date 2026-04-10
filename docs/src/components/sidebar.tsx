"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { NavItem, NavSection } from "@/lib/navigation";
import GalleryCategoryNav from "./gallery-category-nav";

/** Strip trailing slash so "/chart/bar-chart/" matches "/chart/bar-chart" */
function normPath(p: string) {
  return p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "new")
    return (
      <span className="ml-auto rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-600">
        New
      </span>
    );
  if (status === "beta")
    return (
      <span className="ml-auto rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
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

  const styles = children.filter((c) => c.kind === "style");
  const others = children.filter((c) => c.kind !== "style");

  return (
    <div className="mt-0.5 ml-3 border-l border-neutral-200">
      {styles.map((item) => {
        const isActive = pathname === item.href;
        const isComing = item.status === "coming";

        if (isComing) {
          return (
            <span
              key={item.href}
              className="block py-1 pl-3 text-[12.5px] text-neutral-300 cursor-default"
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
              "block py-1 pl-3 text-[13px] font-medium transition-colors",
              isActive
                ? "border-l-2 border-teal-500 -ml-px font-medium text-teal-700"
                : "text-neutral-700 hover:text-neutral-900"
            )}
          >
            {item.title}
            {item.status && <StatusBadge status={item.status} />}
          </Link>
        );
      })}

      {others.map((item) => {
        const isActive = pathname === item.href;
        const isComing = item.status === "coming";

        if (isComing) {
          return (
            <span
              key={item.href}
              className="block py-1 pl-3 text-[12.5px] text-neutral-300 cursor-default"
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
              "block py-1 pl-3 text-[13px] font-medium transition-colors",
              isActive
                ? "border-l-2 border-teal-500 -ml-px font-medium text-teal-700"
                : "text-neutral-700 hover:text-neutral-900"
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

  const isGalleryPage = item.href === "/chart/gallery" && pathname.startsWith("/chart/gallery");

  return (
    <li>
      <Link
        href={item.href}
        onClick={onLinkClick}
        className={clsx(
          "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors",
          isActive
            ? "font-bold text-teal-700 bg-teal-50"
            : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
        )}
      >
        {item.title}
        {item.status && <StatusBadge status={item.status} />}
      </Link>
      {isGalleryPage && <GalleryCategoryNav />}
      {hasChildren && isExpanded && !isGalleryPage && (
        <ChildrenGroup children={item.children!} onLinkClick={onLinkClick} />
      )}
    </li>
  );
}

/* ── Collapsible Section ── */
function SidebarSection({
  section,
  onLinkClick,
}: {
  section: NavSection;
  onLinkClick?: () => void;
}) {
  const pathname = normPath(usePathname());
  const hasActiveChild = section.items.some(
    (item) =>
      pathname === item.href ||
      item.children?.some((c) => pathname === c.href),
  );
  const [isOpen, setIsOpen] = useState(hasActiveChild);

  const isCollapsible = section.collapsible ?? false;

  return (
    <div className="mb-5">
      <h3
        className={clsx(
          "mb-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400",
          isCollapsible && "flex cursor-pointer items-center justify-between select-none hover:text-neutral-600",
        )}
        onClick={isCollapsible ? () => setIsOpen(!isOpen) : undefined}
      >
        {section.title}
        {isCollapsible && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={clsx(
              "transition-transform",
              isOpen && "rotate-90",
            )}
          >
            <path d="M3.5 1.5L7 5l-3.5 3.5" />
          </svg>
        )}
      </h3>
      {(!isCollapsible || isOpen) && (
        <ul className="space-y-0.5">
          {section.items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              onLinkClick={onLinkClick}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Search Bar (placeholder) ── */
function SearchBar() {
  return (
    <button className="flex w-full items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-neutral-400 transition-colors hover:border-neutral-300 hover:bg-white">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="shrink-0">
        <circle cx="7" cy="7" r="5" />
        <path d="M11 11l3 3" />
      </svg>
      Search...
      <kbd className="ml-auto rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-neutral-400">
        ⌘K
      </kbd>
    </button>
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
    <nav className="h-full overflow-y-auto py-4 px-3">
      {/* Search */}
      <div className="mb-4">
        <SearchBar />
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <SidebarSection
          key={section.title}
          section={section}
          onLinkClick={onLinkClick}
        />
      ))}
    </nav>
  );
}
