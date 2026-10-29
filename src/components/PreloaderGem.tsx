import { PALETTE } from "@/lib/palette";

// Six-facet gem: ice crown, mint and violet pavilion. Facets draw in one by one over 1.2 s, then shimmer in turn.
const FACETS: [string, string][] = [
  ["8,38 36,38 50,6", PALETTE.ice],
  ["36,38 64,38 50,6", PALETTE.mint],
  ["64,38 92,38 50,6", PALETTE.ice],
  ["64,38 92,38 50,100", PALETTE.violet],
  ["36,38 64,38 50,100", PALETTE.mint],
  ["8,38 36,38 50,100", PALETTE.violet],
];

export default function PreloaderGem({ leaving }: { leaving: boolean }) {
  return (
    <div className={`gem ${leaving ? "gem-leave" : ""}`} aria-hidden="true">
      <div className="gem-glow" />
      <svg viewBox="0 0 100 106" className="gem-body">
        {FACETS.map(([points, fill], i) => (
          <polygon key={i} points={points} fill={fill} className="gem-facet" style={{ animationDelay: `${i * 0.16}s` }} />
        ))}
      </svg>
    </div>
  );
}
