import { experience } from "../../content/experience";

// A compact career strip from content/experience.ts, in listed order.
export default function CareerStrip() {
  return (
    <ol aria-label="Career" tabIndex={0} className="flex w-full max-w-4xl gap-3 overflow-x-auto pb-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--violet)]">
      {experience.map((e) => (
        <li key={`${e.org}-${e.title}`} className="w-56 shrink-0 rounded-xl border border-[var(--violet)]/50 bg-black/30 px-3 py-2 backdrop-blur">
          <p className="font-mono text-[11px] text-[var(--violet)]">
            {e.start ? `${e.start} to ` : ""}
            {e.end}
          </p>
          <p className="mt-1 text-sm font-medium">{e.title}</p>
          <p className="text-xs opacity-70">{e.org}</p>
        </li>
      ))}
    </ol>
  );
}
