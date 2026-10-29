"use client";

import { usePanel } from "@/context/PanelContext";
import { useSettings } from "@/context/SettingsContext";
import WindowPanel from "./WindowPanel";

export default function SettingsButton() {
  const { quality, update } = useSettings();
  const { open, show, close } = usePanel("settings");

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        className="absolute right-4 top-4 z-30 rounded-full border border-[var(--accent)] bg-black/30 px-3 py-1.5 font-mono text-xs text-[var(--accent)] shadow-[0_0_14px_#7cf0c844] backdrop-blur transition hover:-translate-y-px hover:bg-[var(--accent)]/15 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
      >
        <span aria-hidden>◆ </span>settings
      </button>
      {open && (
        <WindowPanel path="~/settings" onClose={close}>
          <label className="flex items-center justify-between gap-4">
            <span>
              Graphics quality
              <small className="block text-xs opacity-60">Lower if the scene feels slow</small>
            </span>
            <select
              value={quality}
              onChange={(e) => update({ quality: e.target.value === "low" ? "low" : "high" })}
              className="rounded-full border border-[var(--accent)] bg-[#1a1f3a] px-3 py-1 text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>
          </label>
        </WindowPanel>
      )}
    </>
  );
}
