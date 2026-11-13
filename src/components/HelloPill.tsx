"use client";

import { useState } from "react";

// Language-learning easter egg: each click greets in the next language. No sound.
const GREETINGS = ["Hello", "Hola", "Bonjour", "Bon dia"];

export default function HelloPill() {
  const [i, setI] = useState(0);
  return (
    <button
      type="button"
      onClick={() => setI((n) => (n + 1) % GREETINGS.length)}
      aria-label="Say hello in another language"
      className="absolute left-4 top-4 z-30 rounded-full border border-[var(--accent)] bg-black/30 px-3 py-1.5 font-mono text-xs text-[var(--accent)] shadow-[0_0_14px_#7cf0c844] backdrop-blur transition hover:-translate-y-px hover:bg-[var(--accent)]/15 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
    >
      <span aria-hidden>◆ </span>
      <span aria-live="polite">{GREETINGS[i]}</span>
    </button>
  );
}
