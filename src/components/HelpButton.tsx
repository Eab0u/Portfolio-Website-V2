"use client";

import { usePanel } from "@/context/PanelContext";
import WindowPanel from "./WindowPanel";

const CONTROLS = [
  ["Mouse", "Move the pointer to tilt the view."],
  ["Touch", "Tap the buttons to open windows."],
  ["Keyboard", "Tab to move between buttons, Enter to open, Esc to close a window."],
];

export default function HelpButton() {
  const { open, show, close } = usePanel("help");

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        className="absolute right-32 top-4 z-30 rounded-full border border-[var(--accent)] bg-black/30 px-3 py-1.5 font-mono text-xs text-[var(--accent)] shadow-[0_0_14px_#7cf0c844] backdrop-blur transition hover:-translate-y-px hover:bg-[var(--accent)]/15 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
      >
        <span aria-hidden>◆ </span>help
      </button>
      {open && (
        <WindowPanel path="~/controls" onClose={close}>
          <dl className="space-y-3">
            {CONTROLS.map(([name, text]) => (
              <div key={name}>
                <dt className="font-mono text-xs text-[var(--accent)]">{name}</dt>
                <dd className="opacity-80">{text}</dd>
              </div>
            ))}
          </dl>
        </WindowPanel>
      )}
    </>
  );
}
