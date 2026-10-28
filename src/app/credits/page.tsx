import Link from "next/link";

export const metadata = { title: "Credits" };

const STACK = ["Next.js", "Three.js", "React Three Fiber", "drei", "GSAP", "Lenis", "Tailwind"];

export default function Credits() {
  return (
    <main id="main" className="flex h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Credits</h1>
      <p className="text-sm opacity-70">Built with {STACK.join(", ")}.</p>
      <p className="text-sm opacity-70">All art in this world is original and generic. No logos or borrowed models.</p>
      <Link href="/" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)]">
        Back to the world
      </Link>
    </main>
  );
}
