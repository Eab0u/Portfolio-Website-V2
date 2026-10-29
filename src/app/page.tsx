import Preloader from "@/components/Preloader";
import SettingsButton from "@/components/SettingsButton";
import SceneClient from "@/components/SceneClient";
import { profile } from "../../content/profile";

export default function Home() {
  return (
    <main id="main" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <SceneClient />
      </div>
      <Preloader />
      <SettingsButton />
      <header className="pointer-events-none absolute inset-x-0 bottom-12 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">{profile.name}</h1>
        <p className="mt-2 text-sm opacity-70">{profile.tagline}</p>
      </header>
      <footer className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs opacity-70">
        Built by Claude, one commit at a time.
      </footer>
    </main>
  );
}
