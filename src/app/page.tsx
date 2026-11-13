import Letterbox from "@/components/Letterbox";
import Preloader from "@/components/Preloader";
import HelpButton from "@/components/HelpButton";
import SettingsButton from "@/components/SettingsButton";
import TitleReveal from "@/components/TitleReveal";
import SceneClient from "@/components/SceneClient";
import { profile } from "../../content/profile";

export default function Home() {
  return (
    <main id="main" className="relative h-dvh w-full overflow-hidden">
      <div className="absolute inset-0">
        <SceneClient />
      </div>
      <Preloader />
      <Letterbox />
      <HelpButton />
      <SettingsButton />
      <header className="pointer-events-none absolute inset-x-0 bottom-12 text-center">
        <TitleReveal>
          <h1 className="px-4 text-4xl font-semibold tracking-tight text-balance">{profile.name.replace("-", "\u2011")}</h1>
          <p className="mt-2 text-sm opacity-70">{profile.tagline}</p>
        </TitleReveal>
      </header>
      <footer className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-xs opacity-70">
        Built by Claude, one commit at a time.
      </footer>
      <noscript>
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[var(--bg)] p-6 text-center">
          <p className="max-w-md text-sm">{profile.name}: this world is a 3D scene and needs JavaScript. Until then, here are the links.</p>
          <nav aria-label="Fallback links" className="flex flex-wrap justify-center gap-4 text-sm text-[var(--accent)] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]">
            <a href={profile.links.github}>GitHub</a>
            <a href={profile.links.linkedin}>LinkedIn</a>
            <a href="/timeline">Timeline</a>
            <a href="/credits">Credits</a>
          </nav>
        </div>
      </noscript>
    </main>
  );
}
