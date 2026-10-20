"use client";

import { useEffect, useRef } from "react";

/** A modal drawer stays above sticky headers and keeps focus inside the menu. */
export default function MobileDrawer({
  id,
  open,
  onClose,
  title,
  closeLabel,
  side = "left",
  children,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  side?: "left" | "right";
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;

    const desktop = window.matchMedia("(min-width: 768px)");
    if (desktop.matches) {
      onClose();
      return;
    }

    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnDesktop = () => {
      if (desktop.matches) onClose();
    };
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      dialog.close();
    };
  }, [open, onClose]);

  return (
    <dialog
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 text-ink backdrop:bg-black/50"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        // Live demos also listen for shortcuts; the open menu owns its keys.
        event.stopPropagation();
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`absolute inset-y-0 flex w-72 max-w-[calc(100%-3rem)] flex-col bg-canvas ${
          side === "left"
            ? "left-0 border-r border-line"
            : "right-0 border-l border-line"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
          <span id={`${id}-title`} className="text-[13px] font-semibold">
            {title}
          </span>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-md text-soft hover:text-ink"
            aria-label={closeLabel}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 4l8 8M12 4L4 12" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </dialog>
  );
}
