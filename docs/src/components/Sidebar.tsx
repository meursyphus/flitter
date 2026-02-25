"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { NavSection } from "@/lib/navigation";

export default function Sidebar({
  sections,
  onLinkClick,
}: {
  sections: NavSection[];
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="h-full overflow-y-auto py-5 pl-4 pr-3">
      {sections.map((section) => (
        <div key={section.title} className="mb-5">
          <h3 className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            {section.title}
          </h3>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onLinkClick}
                    className={clsx(
                      "block rounded-md px-2 py-1 text-[13px] transition-colors",
                      isActive
                        ? "bg-neutral-100 font-medium text-neutral-900"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
