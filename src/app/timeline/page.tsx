import Image from "next/image";
import Link from "next/link";
import FloatingShards from "@/components/FloatingShards";
import { SKY } from "@/lib/sky";
import snapshots from "../../../public/snapshots/index.json";

export const metadata = { title: "Timeline" };

// One card per weekly snapshot, newest first, read from public/snapshots/index.json.
const WEEKS = [...snapshots].sort((a, b) => b.week - a.week);

export default function Timeline() {
  return (
    <main id="main" style={{ background: SKY }} className="relative isolate flex min-h-dvh flex-col items-center gap-6 px-6 py-10 text-center">
      <FloatingShards />
      <h1 className="text-3xl font-semibold tracking-tight">Timeline</h1>
      <p className="text-sm opacity-70">The road so far, one weekly snapshot at a time.</p>
      <ul className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WEEKS.map((w) => (
          <li key={w.week} className="overflow-hidden rounded-xl border border-[var(--accent)]/40 bg-black/30 text-left backdrop-blur">
            <Image src={w.image} alt={`The world in week ${w.week}`} width={1440} height={900} sizes="(min-width: 1024px) 352px, (min-width: 640px) 45vw, 100vw" className="h-auto w-full" />
            <p className="px-3 py-2 font-mono text-xs text-[var(--accent)]">
              Week {w.week} · {w.date} · {w.commits} commits
            </p>
          </li>
        ))}
      </ul>
      <Link href="/" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)]">
        Back to the world
      </Link>
    </main>
  );
}
