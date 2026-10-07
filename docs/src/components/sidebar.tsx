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
      <span className="ml-auto rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
        New
      </span>
    );
  if (status === "beta")
    return (
      <span className="ml-auto rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-soft">
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
    <div className="mt-0.5 ml-3 border-l border-line">
      {styles.map((item) => {
        const isActive = pathname === item.href;
        const isComing = item.status === "coming";

        if (isComing) {
          return (
            <span
              key={item.href}
              className="block cursor-default py-1.5 pl-3 text-[13px] text-faint/60"
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
              "block py-1.5 pl-3 text-[14px] transition-colors",
              isActive
                ? "-ml-px border-l-2 border-accent font-semibold text-ink"
                : "text-soft hover:text-ink"
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
              className="block cursor-default py-1.5 pl-3 text-[13px] text-faint/60"
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
              "block py-1.5 pl-3 text-[14px] transition-colors",
              isActive
                ? "-ml-px border-l-2 border-accent font-semibold text-ink"
                : "text-soft hover:text-ink"
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
        <span className="flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-[14px] text-faint/60">
          {item.dot && <span className={clsx("h-3 w-3 shrink-0 rounded-[3px] opacity-40", item.dot)} />}
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
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-[14px] font-medium transition-colors",
          isActive
            ? "bg-accent/12 font-semibold text-ink"
            : "text-soft hover:bg-surface hover:text-ink"
        )}
      >
        {item.dot && (
          <span className={clsx("h-3 w-3 shrink-0 rounded-[3px]", item.dot)} />
        )}
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
          "mb-1.5 px-2 text-[12px] font-semibold text-faint",
          isCollapsible && "flex cursor-pointer select-none items-center justify-between hover:text-ink",
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
    <button className="flex w-full items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-[14px] text-faint transition-colors hover:border-line-strong">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="shrink-0">
        <circle cx="7" cy="7" r="5" />
        <path d="M11 11l3 3" />
      </svg>
      Search...
      <kbd className="ml-auto rounded border border-line bg-canvas px-1.5 py-0.5 font-sans text-[10px] font-medium text-faint">
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
