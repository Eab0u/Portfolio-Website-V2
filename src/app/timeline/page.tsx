import Link from "next/link";

export const metadata = { title: "Timeline" };

export default function Timeline() {
  return (
    <main id="main" className="flex h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Timeline</h1>
      <p className="text-sm opacity-70">The road so far is still being built, one commit at a time.</p>
      <Link href="/" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)]">
        Back to the world
      </Link>
    </main>
  );
}
