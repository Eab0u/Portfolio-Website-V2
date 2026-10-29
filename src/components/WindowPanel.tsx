"use client";

import { useEffect, useRef } from "react";

interface Props {
  path: string; // shown in the title bar, e.g. "~/settings"
  onClose: () => void;
  children: React.ReactNode;
}

export default function WindowPanel({ path, onClose, children }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const panel = panelRef.current;
    return () => {
      // Skip the restore when another control already took focus (switching panels).
      const a = document.activeElement;
      if (!a || a === document.body || panel?.contains(a)) opener?.focus?.();
    };
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
      ref={panelRef}
      role="dialog"
      aria-label={path}
      className="window-pop fixed right-4 top-16 z-40 w-[min(92vw,26rem)] overflow-hidden rounded-xl border border-[#8b5cff]/40 bg-[#1a1f3a]/75 text-[var(--fg)] shadow-[0_12px_40px_#2f1f8a66,inset_0_1px_0_#f4f1ea40] backdrop-blur-xl"
    >
      <header className="flex items-center justify-between border-b border-white/10 bg-black/30 px-3 py-2 font-mono text-xs">
        <span className="flex min-w-0 items-center gap-1.5 text-[var(--accent)]">
          <i aria-hidden className="size-2 shrink-0 rounded-full bg-[#ffd23f]" />
          <i aria-hidden className="size-2 shrink-0 rounded-full bg-[#3ddc84]" />
          <span className="truncate">{path}</span>
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close window"
          className="flex size-7 items-center justify-center rounded-full bg-[#ff6b57]/20 text-[#ff6b57] hover:bg-[#ff6b57]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          x
        </button>
      </header>
      <div className="max-h-[70vh] overflow-auto p-4 text-sm">{children}</div>
    </section>
  );
}
