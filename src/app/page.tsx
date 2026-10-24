import SceneClient from "@/components/SceneClient";
import { profile } from "../../content/profile";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <SceneClient />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-12 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">{profile.name}</h1>
        <p className="mt-2 text-sm opacity-70">{profile.tagline}</p>
      </div>
    </main>
  );
}
