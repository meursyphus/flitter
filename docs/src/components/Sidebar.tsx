"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { NavSection } from "@/lib/navigation";

export default function Sidebar({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-16 h-[calc(100vh-4rem)] w-60 shrink-0 overflow-y-auto border-r border-gray-200 py-6 pr-4 pl-4">
      {sections.map((section) => (
        <div key={section.title} className="mb-6">
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {section.title}
          </h3>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "block rounded-md px-2 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-indigo-50 font-medium text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
