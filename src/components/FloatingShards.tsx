// x (percent), size (px), seconds per loop, start delay (negative so the shards are already mid-air), color token.
const SHARDS = [
  [8, 22, 18, -4, "--violet"],
  [22, 14, 24, -12, "--accent"],
  [41, 18, 21, -8, "--coral"],
  [63, 12, 27, -17, "--sun"],
  [78, 20, 19, -2, "--violet"],
  [91, 15, 23, -14, "--accent"],
] as const;

// Six CSS-only triangles drifting upward behind the page text, so the sub-pages move like the home scene.
export default function FloatingShards() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {SHARDS.map(([x, size, dur, delay, color], i) => (
        <span
          key={i}
          className="shard"
          style={{ left: `${x}%`, borderWidth: `0 ${size / 2}px ${size}px`, borderBottomColor: `var(${color})`, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}
