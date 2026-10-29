"use client";

import { useEffect, useRef } from "react";

interface Props {
  path: string; // shown in the title bar, e.g. "~/settings"
  onClose: () => void;
  children: React.ReactNode;
}

export default function WindowPanel({ path, onClose, children }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => opener?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <section
      role="dialog"
      aria-label={path}
      className="fixed left-1/2 top-1/2 z-40 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-white/15 bg-[#1a1f3a]/90 text-[var(--fg)] shadow-2xl backdrop-blur"
    >
      <header className="flex items-center justify-between border-b border-white/10 bg-black/30 px-3 py-2 font-mono text-xs">
        <span className="truncate text-[var(--accent)]">{path}</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close window"
          className="rounded px-2 py-0.5 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          x
        </button>
      </header>
      <div className="max-h-[70vh] overflow-auto p-4 text-sm">{children}</div>
    </section>
  );
}
