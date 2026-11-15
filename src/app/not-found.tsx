import Link from "next/link";
import FloatingShards from "@/components/FloatingShards";
import { SKY } from "@/lib/sky";
import { PALETTE } from "@/lib/palette";

export const metadata = { title: "Lost in the clouds" };

// A faceted crystal snapped in two, drawn as inline SVG with palette colors only.
function BrokenCrystal() {
  return (
    <svg aria-hidden viewBox="0 0 120 140" className="mb-4 h-56 w-48" style={{ filter: `drop-shadow(0 0 22px ${PALETTE.mint}66)` }}>
      <g transform="translate(-6 -2) rotate(-6 60 70)">
        <polygon points="60,8 30,52 60,66" fill={PALETTE.mint} />
        <polygon points="60,8 60,66 78,46" fill={PALETTE.ice} />
        <polygon points="30,52 60,66 44,78" fill={PALETTE.violet} />
        <polygon points="60,8 52,30 60,36" fill={PALETTE.offWhite} />
        <polygon points="60,66 44,78 56,86" fill={PALETTE.navy} />
      </g>
      <g transform="translate(6 6) rotate(5 60 90)">
        <polygon points="44,82 60,70 78,50 84,92 60,132" fill={PALETTE.violet} />
        <polygon points="44,82 60,132 40,100" fill={PALETTE.blue} />
        <polygon points="60,70 78,50 84,92" fill={PALETTE.mint} />
        <polygon points="60,132 84,92 72,112" fill={PALETTE.navy} />
        <polygon points="78,50 82,64 74,60" fill={PALETTE.offWhite} />
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <main id="main" style={{ background: SKY }} className="relative isolate flex min-h-dvh flex-col items-center justify-center gap-4 px-6 py-10 text-center">
      <FloatingShards />
      <BrokenCrystal />
      <h1 className="text-3xl font-semibold tracking-tight">This island drifted away</h1>
      <p className="text-sm opacity-70">The page you wanted is not in this world. Yet.</p>
      <Link href="/" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]">
        Back to the world
      </Link>
    </main>
  );
}
