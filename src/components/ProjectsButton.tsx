"use client";

import { usePanel } from "@/context/PanelContext";
import WindowPanel from "./WindowPanel";
import { projects } from "../../content/projects";

export default function ProjectsButton() {
  const { open, show, close } = usePanel("projects");

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="absolute right-52 top-4 z-30 rounded-full border border-[var(--accent)] bg-black/30 px-3 py-1.5 font-mono text-xs text-[var(--accent)] shadow-[0_0_14px_color-mix(in_srgb,var(--accent)_27%,transparent)] backdrop-blur transition hover:-translate-y-px hover:bg-[var(--accent)]/15 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
      >
        <span aria-hidden>◆ </span>projects
      </button>
      {open && (
        <WindowPanel path="~/projects" onClose={close}>
          <ul className="space-y-4">
            {projects.map((p) => (
              <li key={p.slug}>
                <p className="font-medium">{p.title}</p>
                <p className="font-mono text-xs text-[var(--accent)]">
                  {p.context} · {p.period}
                </p>
                <p className="mt-1 opacity-80">{p.summary}</p>
                <p className="mt-1 font-mono text-[11px] opacity-60">{p.tags.join(" · ")}</p>
                {(p.links.live || p.links.repo) && (
                  <p className="mt-1 flex gap-3 text-xs text-[var(--accent)]">
                    {p.links.live && <a href={p.links.live} aria-label={`${p.title} live site`} className="underline">Live</a>}
                    {p.links.repo && <a href={p.links.repo} aria-label={`${p.title} source code`} className="underline">Code</a>}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </WindowPanel>
      )}
    </>
  );
}
